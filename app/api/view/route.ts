import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { url, title, referrer, visitorId } = await request.json();

    // Create the view
    await prisma.view.create({
      data: {
        visitorId,
        url,
        title,
        referrer,
      },
    });

    // Update visit stats
    await prisma.visitor.update({
      where: { id: visitorId },
      data: {
        pageViews: { increment: 1 },
        bounced: false,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('View tracking error:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
} 