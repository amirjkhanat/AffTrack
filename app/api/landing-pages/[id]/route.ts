import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { readFile, unlink, writeFile } from 'fs/promises';
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
    let html = await readFile(htmlPath, 'utf-8');

    // Ensure HTML is a full document
    if (!/<!DOCTYPE html>/i.test(html)) {
      // Оборачиваем фрагмент в полноценный HTML-документ
      html = `<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n</head>\n<body>\n${html}\n</body>\n</html>`;
    }

    // Ensure Tailwind CDN is included
    html = ensureTailwindInHead(html);

    // Read CSS file if exists and inject link into <head>
    let css = '';
    if (landingPage.cssPath) {
      const cssPath = path.join(process.cwd(), 'public', landingPage.cssPath);
      css = await readFile(cssPath, 'utf-8');
      // Inject custom CSS link if not present
      const cssLink = `<link rel="stylesheet" href="/${landingPage.cssPath}" />`;
      if (!html.includes(cssLink)) {
        html = html.replace(/<head>/i, `<head>${cssLink}`);
      }
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

function ensureTailwindInHead(html: string) {
  if (!html.includes('tailwind.min.css')) {
    return html.replace(
      /<head>/i,
      `<head><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />`
    );
  }
  return html;
}

function extractHtmlFragment(html: string) {
  // Если html содержит <body>, извлекаем только содержимое body
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];
  // Если html содержит <html> или <head>, удаляем их
  return html.replace(/<\/?(html|head|body)[^>]*>/gi, '');
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();
    let { name, html, css } = body;

    // Получаем текущие пути к файлам из базы
    const landingPage = await prisma.landingPage.findUnique({ where: { id } });
    if (!landingPage) {
      return NextResponse.json({ error: 'Landing page not found' }, { status: 404 });
    }

    // Оставляем только фрагмент HTML (без <html>, <head>, <body>)
    html = extractHtmlFragment(html);

    // Перезаписываем HTML и CSS файлы
    const htmlPath = path.join(process.cwd(), 'public', landingPage.htmlPath);
    await writeFile(htmlPath, html, 'utf-8');
    if (landingPage.cssPath) {
      const cssPath = path.join(process.cwd(), 'public', landingPage.cssPath);
      await writeFile(cssPath, css, 'utf-8');
    }

    // Обновляем только name (и updatedAt)
    const updated = await prisma.landingPage.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return new NextResponse(error.message || 'Failed to update landing page', { status: 500 });
  }
}