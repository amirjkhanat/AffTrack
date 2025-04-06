import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : new Date();

    // Get revenue by source
    const sourceRevenue = await prisma.conversion.groupBy({
      by: ['visitId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      _sum: {
        value: true
      },
      having: {
        visitId: {
          _count: {
            gt: 0
          }
        }
      }
    });

    // Get revenue by network
    const networkRevenue = await prisma.conversion.groupBy({
      by: ['offerId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      _sum: {
        value: true
      },
      _count: {
        _all: true
      }
    });

    // Get revenue by offer
    const offerRevenue = await prisma.conversion.groupBy({
      by: ['offerId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      _sum: {
        value: true
      },
      _count: {
        _all: true
      }
    });

    // Get revenue trend
    const revenueTrend = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', "createdAt") as date,
        COALESCE(SUM("value"), 0) as revenue,
        COUNT(*) as conversions
      FROM "Conversion"
      WHERE 
        "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
        AND "status" = 'COMPLETED'
      GROUP BY DATE_TRUNC('day', "createdAt")
      ORDER BY date ASC
    `;

    // Get UTM analysis
    const utmRevenue = await prisma.conversion.groupBy({
      by: ['utmSource', 'utmMedium', 'utmCampaign'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        },
        status: 'COMPLETED'
      },
      _sum: {
        value: true
      },
      _count: {
        _all: true
      }
    });

    return NextResponse.json({
      data: {
        sources: sourceRevenue,
        networks: networkRevenue,
        offers: offerRevenue,
        trend: revenueTrend,
        utm: utmRevenue
      }
    });

  } catch (error) {
    console.error('Revenue report error:', error);
    return NextResponse.json(
      { error: "Failed to generate revenue report" },
      { status: 500 }
    );
  }
}