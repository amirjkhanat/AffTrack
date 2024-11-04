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

    // Landing page performance
    const landingPages = await prisma.visit.groupBy({
      by: ['landingPageId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        _all: true,
        leads: true
      }
    });

    // Path analysis
    const paths = await prisma.$queryRaw`
      WITH PathSequence AS (
        SELECT 
          "visitId",
          array_agg("currentPage" ORDER BY "timestamp") as path_sequence,
          COUNT(*) as page_views,
          MAX("timeOnSite") as time_on_site
        FROM "PageView"
        WHERE 
          "createdAt" >= ${startDate}
          AND "createdAt" <= ${endDate}
        GROUP BY "visitId"
      )
      SELECT 
        path_sequence[1] as entry_page,
        COUNT(DISTINCT "visitId") as visitors,
        AVG(page_views) as avg_page_views,
        AVG(time_on_site) as avg_time_on_site,
        COUNT(DISTINCT CASE WHEN array_length(path_sequence, 1) = 1 THEN "visitId" END)::float / 
          COUNT(DISTINCT "visitId") as bounce_rate
      FROM PathSequence
      GROUP BY entry_page
      ORDER BY visitors DESC
    `;

    // Placement performance
    const placements = await prisma.click.groupBy({
      by: ['placementId'],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      },
      _count: {
        _all: true
      }
    });

    // Split test analysis
    const splitTests = await prisma.splitTestVariant.findMany({
      where: {
        splitTest: {
          status: 'ACTIVE',
          startDate: {
            lte: new Date()
          },
          endDate: {
            gte: new Date()
          }
        }
      },
      include: {
        splitTest: true,
        offer: true,
        _count: {
          select: {
            clicks: true,
            conversions: {
              where: {
                status: 'COMPLETED'
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      data: {
        landingPages,
        paths,
        placements,
        splitTests
      }
    });

  } catch (error) {
    console.error('Optimization report error:', error);
    return NextResponse.json(
      { error: "Failed to generate optimization report" },
      { status: 500 }
    );
  }
}