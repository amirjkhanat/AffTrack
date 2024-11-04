import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientInfo } from '@/lib/tracking';

export async function POST(request: NextRequest) {
  try {
    const { url, referrer } = await request.json();
    const clientInfo = await getClientInfo(request);
    const urlParams = new URL(url).searchParams;

    const visitor = await prisma.visitor.create({
      data: {
        ipAddress: clientInfo.ip,
        userAgent: clientInfo.userAgent,
        referer: referrer,
        landingPageId: '',
        trafficSourceId: '',
        utmSource: urlParams.get('utm_source') || null,
        utmMedium: urlParams.get('utm_medium') || null,
        utmCampaign: urlParams.get('utm_campaign') || null,
        utmContent: urlParams.get('utm_content') || null,
        utmTerm: urlParams.get('utm_term') || null,
        country: clientInfo.country,
        region: clientInfo.region,
        city: clientInfo.city,
        browser: clientInfo.browser,
        os: clientInfo.os,
        device: clientInfo.device,
        pageViews: 1,
        bounced: true,
        convertedToLead: false,
      },
    });

    return NextResponse.json({ visitorId: visitor.id });
  } catch (error) {
    console.error('Visitor creation error:', error);
    return NextResponse.json({ error: 'Failed to create visitor' }, { status: 500 });
  }
}
