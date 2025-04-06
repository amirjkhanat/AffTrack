import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const landingPages = await prisma.landingPage.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(landingPages);
  } catch (error) {
    console.error('Error fetching landing pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch landing pages' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, html, css } = await req.json();
    
    // Create unique ID for landing page
    const landingPageId = crypto.randomUUID();
    
    // Create directory for landing page
    const landingPageDir = path.join(process.cwd(), 'public', 'landing-pages', landingPageId);
    await mkdir(landingPageDir, { recursive: true });
    
    // Save HTML file
    await writeFile(
      path.join(landingPageDir, 'index.html'),
      html
    );
    
    // Save CSS file
    await writeFile(
      path.join(landingPageDir, 'styles.css'),
      css
    );
    
    // Save to database
    const landingPage = await prisma.landingPage.create({
      data: {
        id: landingPageId,
        name,
        htmlPath: `/landing-pages/${landingPageId}/index.html`,
        cssPath: `/landing-pages/${landingPageId}/styles.css`,
        status: 'ACTIVE',
        userId: session.user.id,
        baseUrl: `http://localhost:3001/landing-pages/${landingPageId}`,
        parameters: {}
      },
    });

    return NextResponse.json(landingPage);
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: 'Failed to save landing page' },
      { status: 500 }
    );
  }
} 