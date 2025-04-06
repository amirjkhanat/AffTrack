import { prisma } from "@/lib/prisma";
import { ActivityType, ActivityAction } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { search, types, actions, page = 1, limit = 10 } = body;
    
    console.log('API Request body:', body);

    const where: any = {
      AND: []
    };

    if (search) {
      where.AND.push({
        OR: [
          { user: { name: { contains: search, mode: 'insensitive' } } },
          { targetType: { contains: search, mode: 'insensitive' } },
          { details: { contains: search, mode: 'insensitive' } }
        ]
      });
    }

    if (types && types.length > 0) {
      where.AND.push({ type: { in: types } });
    }

    if (actions && actions.length > 0) {
      where.AND.push({ action: { in: actions } });
    }

    if (where.AND.length === 0) {
      delete where.AND;
    }

    const [activities, totalCount] = await Promise.all([
      prisma.activity.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.activity.count({ where })
    ]);

    const hasMore = totalCount > page * limit;

    console.log(`Found ${activities.length} activities, total: ${totalCount}, hasMore: ${hasMore}`);

    return Response.json({
      items: activities,
      total: totalCount,
      hasMore,
      page,
    });
  } catch (error) {
    console.error('Activity API Error:', error);
    return Response.json(
      { error: 'Failed to fetch activities', details: error.message },
      { status: 500 }
    );
  }
} 