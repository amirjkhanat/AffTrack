import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientInfo } from '@/lib/tracking';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string, referrer?: string } }
) {
  try {
    // Parallel fetch of tracking link and client info
    const [trackingLink, clientInfo] = await Promise.all([
      prisma.trackingLink.findUnique({
        where: { id: params.id },
        select: {  // Only select fields we need
          id: true,
          landingPage: {
            select: {
              id: true,
              baseUrl: true
            }
          },
          trafficSource: {
            select: {
              id: true,
              status: true
            }
          },
        },
      }),
      getClientInfo(request)
    ]);

    if (!trackingLink || trackingLink.trafficSource.status !== 'ACTIVE') {
      return NextResponse.redirect(new URL('/error', request.url));
    }

    // Build redirect URL first
    const redirectUrl = trackingLink.landingPage.baseUrl ? new URL(trackingLink.landingPage.baseUrl) : null;
    if (!redirectUrl) {
      return NextResponse.redirect(new URL('/error', request.url));
    }

    const incomingUrl = new URL(request.url);
    const referrer = incomingUrl.searchParams.get('referrer') || "Direct Visitor";

    // Process visit asynchronously without awaiting
    queueMicrotask(() => {
      processVisitor(trackingLink, clientInfo, referrer).catch(error => {
        console.error('Async visit processing error:', error);
      });
    });

    // Optimize query parameter handling
    const searchParams = new URLSearchParams(incomingUrl.search);
    redirectUrl.search = searchParams.toString();

    // Add UTM parameters if not already present
    const utmParams = {
      utm_source: clientInfo.utmSource,
      utm_medium: clientInfo.utmMedium,
      utm_campaign: clientInfo.utmCampaign,
      utm_content: clientInfo.utmContent,
      utm_term: clientInfo.utmTerm
    };

    Object.entries(utmParams).forEach(([key, value]) => {
      if (value && !redirectUrl.searchParams.has(key)) {
        redirectUrl.searchParams.set(key, value);
      }
    });

    // Redirect immediately
    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('Visitor tracking error:', error);
    return NextResponse.redirect(new URL('/error', request.url));
  }
}

// Optimized async function to process the visit
async function processVisitor(
  trackingLink: any, 
  clientInfo: any, 
  referrer: string
) {
  try {
    const visitorData = {
      ipAddress: clientInfo.ip,
      userAgent: clientInfo.userAgent,
      referer: referrer,
      landingPageId: trackingLink.landingPage.id,
      trafficSourceId: trackingLink.trafficSource.id,
      utmSource: clientInfo.utmSource,
      utmMedium: clientInfo.utmMedium,
      utmCampaign: clientInfo.utmCampaign,
      utmContent: clientInfo.utmContent,
      utmTerm: clientInfo.utmTerm,
      country: clientInfo.country,
      region: clientInfo.region,
      city: clientInfo.city,
      browser: clientInfo.browser,
      os: clientInfo.os,
      device: clientInfo.device,
    };

    const visitor = await prisma.visitor.create({
      data: visitorData,
      select: { id: true }  // Only select id for logging
    });
    
    console.log('VISITOR:', visitor.id);
  } catch (error) {
    console.error('Failed to process visitor:', error);
  }
}