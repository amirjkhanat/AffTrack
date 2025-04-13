import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Find the landing page by ID
    const landingPage = await prisma.landingPage.findUnique({
      where: { 
        id: params.id 
      },
    });

    if (!landingPage) {
      return new NextResponse('Landing page not found', { status: 404 });
    }

    // Read HTML file
    let html = '';
    try {
      const htmlPath = path.join(process.cwd(), 'public', landingPage.htmlPath);
      html = await readFile(htmlPath, 'utf-8');
    } catch (error) {
      console.error('Error reading HTML file:', error);
      return new NextResponse('Error loading landing page content', { status: 500 });
    }

    // Read CSS file if exists
    let css = '';
    if (landingPage.cssPath) {
      try {
        const cssPath = path.join(process.cwd(), 'public', landingPage.cssPath);
        css = await readFile(cssPath, 'utf-8');
      } catch (error) {
        console.error('Error reading CSS file:', error);
      }
    }

    // Construct complete HTML document with Tailwind CSS from CDN
    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${landingPage.name || 'Landing Page'}</title>
        <!-- Include Tailwind CSS from CDN -->
        <script src="https://cdn.tailwindcss.com"></script>
        <style>${css}</style>
      </head>
      <body style="margin: 0; padding: 0;">
        ${html}
      </body>
      </html>
    `;

    // Create a visitor record
    const visitor = await prisma.visitor.create({
      data: {
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        landingPageId: params.id,
        createdAt: new Date(),
      },
    });

    // Return the HTML as a response
    return new NextResponse(fullHtml, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error serving landing page:', error);
    return new NextResponse('Server error', { status: 500 });
  }
}
