import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { searchParams } = new URL(request.url);
      const type = searchParams.get('type') || 'visitors';
      const limit = parseInt(searchParams.get('limit') || '50');
  
      const now = new Date();
      const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
  
      let items;
      let metrics;
  
      switch (type) {
        case 'visitors':
          items = await prisma.visitor.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
              landingPage: true,
              trafficSource: true
            }
          });
  
          metrics = {
            lastMinute: await prisma.visitor.count({
              where: { createdAt: { gte: oneMinuteAgo } }
            }),
            lastFiveMinutes: await prisma.visitor.count({
              where: { createdAt: { gte: fiveMinutesAgo } }
            }),
            lastFifteenMinutes: await prisma.visitor.count({
              where: { createdAt: { gte: fifteenMinutesAgo } }
            })
          };
          break;
  
        default:
          return NextResponse.json(
            { error: "Invalid type parameter" },
            { status: 400 }
          );
      }
  
      return NextResponse.json({
        data: {
          metrics,
          items
        }
      });
  
    } catch (error) {
      console.error('Realtime report error:', error);
      return NextResponse.json(
        { error: "Failed to generate realtime report" },
        { status: 500 }
      );
    }
  }