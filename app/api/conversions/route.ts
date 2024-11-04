import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getClientInfo } from '@/lib/tracking';

async function processConversion(params: {
  click_id: string;
  visitor_id: string;
  offer_id: string;
  value?: number;
  transaction_id?: string;
  metadata?: any;
  clientInfo: any;
}) {
  const { click_id, visitor_id, offer_id, value, transaction_id, metadata, clientInfo } = params;

  // Parallel database queries with optimized selects
  const [click, lead, existingConversion] = await Promise.all([
    prisma.click.findUnique({
      where: { id: click_id },
      select: { id: true, trackingLink: { select: { placement: { select: { splitTest: { select: { id: true } } } } } } }
    }),
    prisma.lead.findFirst({
      where: { OR: [{ clickId: click_id }, { visitorId: visitor_id }] },
      select: { id: true, status: true }
    }),
    prisma.conversion.findFirst({
      where: {
        clickId: click_id,
        offerId: offer_id,
        OR: [
          { transactionId: transaction_id },
          { AND: [{ createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }] }
        ]
      },
      select: { id: true }
    })
  ]);

  if (!click) throw new Error("Invalid click ID");
  if (!lead) throw new Error("No lead found");
  if (existingConversion) throw new Error("Duplicate conversion");

  // Create conversion asynchronously
  const [conversion] = await prisma.$transaction([
    prisma.conversion.create({
      data: {
        visitorId: visitor_id,
        clickId: click_id,
        leadId: lead.id,
        offerId: offer_id,
        value: value || 0,
        transactionId: transaction_id,
        metadata: {
          ...metadata,
          ipAddress: clientInfo.ip,
          userAgent: clientInfo.userAgent,
          location: {
            country: clientInfo.country,
            region: clientInfo.region,
            city: clientInfo.city
          },
          splitTestId: click.trackingLink?.placement?.splitTest?.id,
          utmTags: {
            source: clientInfo.utmSource,
            medium: clientInfo.utmMedium,
            campaign: clientInfo.utmCampaign,
            content: clientInfo.utmContent,
            term: clientInfo.utmTerm
          }
        }
      }
    }),
    prisma.lead.update({
      where: { id: lead.id },
      data: { status: 'CONVERTED' }
    })
  ]);

  return conversion;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const clientInfo = getClientInfo(request);

    const params = {
      click_id: searchParams.get('click_id')!,
      visitor_id: searchParams.get('visitor_id')!,
      offer_id: searchParams.get('offer_id')!,
      value: searchParams.get('value') ? parseFloat(searchParams.get('value')!) : undefined,
      transaction_id: searchParams.get('transaction_id') || undefined,
      metadata: searchParams.get('metadata') ? JSON.parse(searchParams.get('metadata')!) : undefined,
      clientInfo
    };

    if (!params.click_id || !params.visitor_id || !params.offer_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conversion = await processConversion(params);
    
    return NextResponse.json({
      success: true,
      data: {
        conversionId: conversion.id,
        status: conversion.status
      }
    });

  } catch (error: any) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to record conversion" },
      { status: error.message?.includes("Duplicate") ? 409 : 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientInfo = getClientInfo(request);
    const body = await request.json();
    
    const params = {
      click_id: body.click_id,
      visitor_id: body.visitor_id,
      offer_id: body.offer_id,
      value: body.value,
      transaction_id: body.transaction_id,
      metadata: body.metadata,
      clientInfo
    };

    if (!params.click_id || !params.visitor_id || !params.offer_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const conversion = await processConversion(params);
    
    return NextResponse.json({
      success: true,
      data: {
        conversionId: conversion.id,
        status: conversion.status
      }
    });

  } catch (error: any) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: error.message || "Failed to record conversion" },
      { status: error.message?.includes("Duplicate") ? 409 : 500 }
    );
  }
}