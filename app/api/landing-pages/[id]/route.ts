import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile, unlink } from 'fs/promises';
import path from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const landingPage = await prisma.landingPage.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id
      },
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    // Read HTML file
    const htmlPath = path.join(process.cwd(), 'public', landingPage.htmlPath);
    const html = await readFile(htmlPath, 'utf-8');

    // Read CSS file if exists
    let css = '';
    if (landingPage.cssPath) {
      const cssPath = path.join(process.cwd(), 'public', landingPage.cssPath);
      css = await readFile(cssPath, 'utf-8');
    }

    return NextResponse.json({
      html,
      css,
      name: landingPage.name,
      parameters: landingPage.parameters,
      baseUrl: landingPage.baseUrl
    });
  } catch (error) {
    console.error('Error reading landing page:', error);
    return NextResponse.json(
      { error: 'Failed to read landing page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const landingPage = await prisma.landingPage.findUnique({
      where: { 
        id: params.id,
        userId: session.user.id
      },
    });

    if (!landingPage) {
      return NextResponse.json(
        { error: 'Landing page not found' },
        { status: 404 }
      );
    }

    // Delete HTML file
    const htmlPath = path.join(process.cwd(), 'public', landingPage.htmlPath);
    await unlink(htmlPath);

    // Delete CSS file if exists
    if (landingPage.cssPath) {
      const cssPath = path.join(process.cwd(), 'public', landingPage.cssPath);
      await unlink(cssPath);
    }

    // Delete from database
    await prisma.landingPage.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting landing page:', error);
    return NextResponse.json(
      { error: 'Failed to delete landing page' },
      { status: 500 }
    );
  }
} 