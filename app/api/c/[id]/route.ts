import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientInfo } from '@/lib/tracking';
import { getWeightedSplitTestOffer } from '@/lib/split-testing';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const visitorId = request.nextUrl.searchParams.get('visitor_id');
    
    if (!visitorId) {
      return NextResponse.redirect(new URL('/400', request.url));
    }

    // Optimize database queries by selecting only needed fields
    const [trackingLink, visitor, lead, clientInfo] = await Promise.all([
      prisma.trackingLink.findUnique({
        where: { id: params.id },
        select: {
          id: true,
          landingPage: {
            select: {
              url: true
            }
          },
          placement: {
            select: {
              id: true,
              targetType: true,
              offer: {
                select: {
                  id: true,
                  url: true,
                  type: true,
                  value: true
                }
              },
              splitTest: {
                select: {
                  id: true,
                  variants: {
                    select: {
                      id: true,
                      weight: true,
                      offer: {
                        select: {
                          id: true,
                          url: true,
                          type: true,
                          value: true
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.visitor.findUnique({
        where: { id: visitorId },
        select: {
          utmSource: true,
          utmMedium: true,
          utmCampaign: true,
          utmContent: true,
          utmTerm: true,
        }
      }),
      prisma.lead.findFirst({
        where: { visitorId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          address: true,
          address2: true,
          city: true,
          state: true,
          zipcode: true,
          dob_dd: true,
          dob_mm: true,
          dob_yyyy: true,
          metaData: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      getClientInfo(request)
    ]);

    if (!trackingLink) {
      return NextResponse.redirect(new URL('/404', request.url));
    }

    // Create click synchronously to get ID for CPC conversion
    const click = await prisma.click.create({
      data: {
        visitorId,
        trackingLinkId: trackingLink.id,
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        referer: clientInfo.referer,
        utmSource: clientInfo.utmSource,
        utmMedium: clientInfo.utmMedium,
        utmCampaign: clientInfo.utmCampaign,
        utmContent: clientInfo.utmContent,
        utmTerm: clientInfo.utmTerm,
      },
      select: { id: true }
    });

    // Determine the offer URL quickly
    const baseUrl = trackingLink.placement?.targetType === 'SPLIT_TEST' 
      ? await getWeightedSplitTestOffer(trackingLink.placement.splitTest).then(offer => offer.url)
      : trackingLink.placement?.offer?.url || trackingLink.landingPage.url;

    // Fast template replacement
    let urlString = baseUrl;
    const templateMatches = urlString.match(/\{([^}]+)\}/g);
    
    if (templateMatches) {
      const replacements = new Map();
      
      // Build replacement map once, only adding valid values
      if (lead) {
        Object.entries(lead).forEach(([key, value]) => {
          if (value != null) {
            replacements.set(key, String(value));
          }
        });
        if (lead.metaData && typeof lead.metaData === 'object') {
          Object.entries(lead.metaData).forEach(([key, value]) => {
            if (value != null) {
              replacements.set(key, String(value));
            }
          });
        }
      }

      if (visitor) {
        if (visitor.utmSource) replacements.set('utm_source', visitor.utmSource);
        if (visitor.utmMedium) replacements.set('utm_medium', visitor.utmMedium);
        if (visitor.utmCampaign) replacements.set('utm_campaign', visitor.utmCampaign);
        if (visitor.utmContent) replacements.set('utm_content', visitor.utmContent);
        if (visitor.utmTerm) replacements.set('utm_term', visitor.utmTerm);
      }
      
      // Single pass replacement - replace or remove
      templateMatches.forEach(match => {
        const key = match.slice(1, -1);
        const value = replacements.get(key);
        urlString = urlString.replace(match, value ? encodeURIComponent(value) : '');
      });

      // Clean up any empty parameters
      urlString = urlString
        .replace(/&+/g, '&')         // Replace multiple & with single &
        .replace(/\?&/g, '?')        // Replace ?& with just ?
        .replace(/&$/g, '')          // Remove trailing &
        .replace(/\?$/g, '')         // Remove trailing ?
        .replace(/=&/g, '&')         // Remove empty params
        .replace(/=$/g, '');         // Remove trailing =
    }

    // Handle CPC conversion if applicable
    const selectedOffer = trackingLink.placement?.targetType === 'SPLIT_TEST'
      ? await getWeightedSplitTestOffer(trackingLink.placement.splitTest)
      : trackingLink.placement?.offer;

    if (selectedOffer?.type === 'CPC') {
      if (!visitorId || !lead?.id) {
        console.error('Missing required data for CPC conversion');
        return NextResponse.redirect(new URL('/400', request.url));
      }

      // Create conversion asynchronously
      queueMicrotask(() => {
        prisma.conversion.create({
          data: {
            visitorId,
            clickId: click.id,
            leadId: lead.id,
            offerId: selectedOffer.id,
            value: selectedOffer.value || 0,
            status: 'COMPLETED',
            metadata: {
              conversionType: 'CPC',
              automated: true,
              createdAt: new Date().toISOString(),
              ipAddress: clientInfo.ip,
              userAgent: clientInfo.userAgent
            }
          }
        }).catch(error => {
          console.error('CPC conversion creation error:', error);
        });
      });
    }

    return NextResponse.redirect(new URL(urlString));
    
  } catch (error) {
    console.error('Click tracking error:', error);
    return NextResponse.redirect(new URL('/500', request.url));
  }
}