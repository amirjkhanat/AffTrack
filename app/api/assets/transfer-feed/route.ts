import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const feeds = await prisma.transferFeed.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        partner: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Fetched transfer feeds:', feeds);

    return NextResponse.json(feeds);
  } catch (error) {
    console.error("[TRANSFER_FEED_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const feed = await prisma.$transaction(async (tx) => {
      const feed = await tx.transferFeed.create({
        data: {
          name: body.name,
          partnerId: body.partnerId,
          method: body.method,
          endpoint: body.webhookUrl,
          headers: body.headers,
          bodyType: body.bodyType,
          bodyTemplate: body.bodyType,
          successPattern: body.successSearch,
          prePingEnabled: body.prePingEnabled ?? false,
          prePingConfig: body.prePingEnabled ? {
            method: body.prePing?.method,
            url: body.prePing?.url,
            headers: body.prePing?.headers,
            bodyTemplate: body.prePing?.bodyType === 'json' 
              ? body.prePing?.jsonBody 
              : JSON.stringify(body.prePing?.formDataPairs),
            successPattern: body.prePing?.successSearch,
            responseMapping: body.prePing?.responseMapping
          } : null,
          payoutType: (body.payoutType || 'STATIC').toUpperCase(),
          payoutValue: body.payoutType === 'static' ? parseFloat(body.payoutAmount) : null,
          payoutPath: body.payoutType === 'dynamic' ? body.payoutPath : null,
          transferTiming: body.transferTiming ? {
            enabled: body.transferTiming.enabled ?? false,
            type: (body.transferTiming.type || 'REALTIME').toUpperCase()
          } : null,
          scheduleConfig: body.scheduleConfig?.enabled ? {
            enabled: true,
            days: body.scheduleConfig.days || [],
            timeStart: body.scheduleConfig.timeStart || '09:00',
            timeEnd: body.scheduleConfig.timeEnd || '17:00',
            startDate: body.scheduleConfig.startDate || null,
            endDate: body.scheduleConfig.endDate || null
          } : null,
          capConfig: body.capConfig?.enabled ? {
            enabled: true,
            type: (body.capConfig.type || 'DAILY').toUpperCase(),
            value: parseInt(body.capConfig.value) || 100
          } : null,
          conditions: body.conditions || { rules: [] },
          status: body.status || 'ACTIVE',
          userId: session.user.id
        }
      });

      await tx.activity.create({
        data: {
          type: "TRANSFER_FEED",
          action: "CREATE",
          userId: session.user.id,
          targetType: "TRANSFER_FEED",
          targetId: feed.id,
          details: `Created transfer feed: ${feed.name}`
        }
      });

      return feed;
    });

    return NextResponse.json(feed);
  } catch (error) {
    console.error("[TRANSFER_FEED_POST]", error);
    return new NextResponse(`Failed to create transfer feed: ${error.message}`, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    console.log('Received body:', body);

    const feed = await prisma.$transaction(async (tx) => {
      const feed = await tx.transferFeed.update({
        where: {
          id: body.id,
        },
        data: {
          name: body.name,
          description: body.description,
          partnerId: body.partnerId,
          method: body.method,
          endpoint: body.endpoint,
          headers: body.headers,
          bodyType: body.bodyType,
          bodyTemplate: body.bodyTemplate,
          successPattern: body.successPattern,
          prePingEnabled: body.prePingEnabled,
          prePingConfig: body.prePingConfig,
          payoutType: body.payoutType,
          payoutValue: body.payoutValue,
          payoutPath: body.payoutPath,
          transferTiming: body.transferTiming,
          scheduleConfig: body.scheduleConfig?.enabled || body.scheduleConfig?.startDate || body.scheduleConfig?.endDate ? {
            days: body.scheduleConfig.days || [],
            timeStart: body.scheduleConfig.timeStart,
            timeEnd: body.scheduleConfig.timeEnd,
            startDate: body.scheduleConfig.startDate || null,
            endDate: body.scheduleConfig.endDate || null,
            enabled: body.scheduleConfig.enabled
          } : null,
          capConfig: body.capConfig,
          conditions: body.conditions,
          status: body.status || 'ACTIVE',
        },
      });

      console.log('Updated feed:', feed);

      await tx.activity.create({
        data: {
          type: 'TRANSFER_FEED',
          action: 'UPDATE',
          userId: session.user.id,
          targetType: 'TRANSFER_FEED',
          targetId: feed.id,
          details: `Updated transfer feed: ${feed.name}`,
        },
      });

      return feed;
    });

    return NextResponse.json(feed);
  } catch (error: any) {
    console.error('[TRANSFER_FEED_PUT]', error);
    return new NextResponse(`Failed to update transfer feed: ${error.message}`, {
      status: 500,
    });
  }
} 