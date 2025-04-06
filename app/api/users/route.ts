import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { search, page = 1, limit = 10 } = await request.json();
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ],
    } : {};

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          lastLoginAt: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.user.count({ where })
    ]);

    const hasMore = totalCount > page * limit;

    return Response.json({
      items: users,
      total: totalCount,
      hasMore,
      page,
    });
  } catch (error) {
    console.error('Users API Error:', error);
    return Response.json(
      { error: 'Failed to fetch users', details: error.message },
      { status: 500 }
    );
  }
} 