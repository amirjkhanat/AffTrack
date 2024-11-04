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

    // Get basic metrics
    const [visitorsCount, clicksCount, leadsCount, transfersCount, conversionsData] = 
      await Promise.all([
        prisma.visitor.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        }),
        prisma.click.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        }),
        prisma.lead.count({
          where: { createdAt: { gte: startDate, lte: endDate } }
        }),
        prisma.transfer.count({
          where: {
            createdAt: { gte: startDate, lte: endDate },
            status: 'ACCEPTED'
          }
        }),
        prisma.conversion.aggregate({
          where: {
            createdAt: { gte: startDate, lte: endDate },
            status: 'COMPLETED'
          },
          _count: true,
          _sum: { value: true }
        })
      ]);

    // Get trend data in separate queries
    const dates = getDatesArray(startDate, endDate);
    
    const trendPromises = dates.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const [visitors, clicks, leads, transfers, conversions] = await Promise.all([
        prisma.visitor.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.click.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.lead.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            }
          }
        }),
        prisma.transfer.count({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            },
            status: 'ACCEPTED'
          }
        }),
        prisma.conversion.aggregate({
          where: {
            createdAt: {
              gte: date,
              lt: nextDate
            },
            status: 'COMPLETED'
          },
          _count: true,
          _sum: { value: true }
        })
      ]);

      return {
        date: date.toISOString().split('T')[0],
        visitors,
        clicks,
        leads,
        transfers,
        conversions: conversions._count,
        revenue: conversions._sum.value || 0
      };
    });

    const trendData = await Promise.all(trendPromises);

    return NextResponse.json({
      data: {
        metrics: {
          visitors: visitorsCount || 0,
          clicks: clicksCount || 0,
          leads: leadsCount || 0,
          transfers: transfersCount || 0,
          conversions: conversionsData._count || 0,
          revenue: conversionsData._sum.value || 0
        },
        trend: trendData
      }
    });

  } catch (error) {
    console.error('Dashboard report error:', error);
    return NextResponse.json(
      { 
        error: "Failed to generate dashboard report", 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to generate array of dates
function getDatesArray(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}