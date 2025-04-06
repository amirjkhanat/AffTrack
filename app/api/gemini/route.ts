import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PROMPT = `As a UI developer, create or modify content in structured blocks. You create futurisic innovative designs. If you recieve an image, consider it belongs officially licensed to the prompter.

Available Resources:
1. Tailwind CSS: <link href="https://cdn.tailwindcss.com" rel="stylesheet">
2. Font Awesome: <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet">
3. Google Fonts: <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

IMPORTANT: Your response must be a JSON object with an array of blocks:
{
  "blocks": [
    {
      "id": "header-section",
      "type": "section",
      "content": "<div class=\\"container mx-auto\\">...</div>"
    },
    {
      "id": "form-section",
      "type": "form",
      "content": "<form class=\\"space-y-4\\">...</form>"
    }
  ],
  "continue": true|false
}

Each block should:
1. Have a unique ID
2. Specify its type (section, form, hero, etc)
3. Contain properly escaped HTML content
4. Be a complete, self-contained unit

Example block types:
- hero: Main banner/hero sections
- form: Input forms and controls
- section: General content sections
- grid: Grid-based layouts
- card: Card-based components
- footer: Footer sections

DO NOT copy existing code unless editing. CREATE NEW content if necessary.`;

function cleanResponse(text: string): string {
  return text
    .replace(/```json\s*/, '')  // Remove opening ```json
    .replace(/```\s*$/, '')     // Remove closing ```
    .trim();
}

function parseBlocks(text: string): any[] {
  const cleaned = cleanResponse(text);
  
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed.blocks && Array.isArray(parsed.blocks)) {
      return parsed.blocks;
    }
  } catch (e) {
    console.error('JSON parse failed:', e);
  }

  // Remove body tag if present
  text = text.replace(/<body[^>]*>|<\/body>/g, '');

  // Split into major sections (any top-level elements)
  const sections = text.match(/<(section|div|form)[^>]*>[\s\S]*?<\/\1>/g) || [];
  
  return sections.map((content, index) => ({
    id: `block-${index}`,
    type: 'section',
    content: content.trim()
  }));
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    let allBlocks: any[] = [];
    let needsContinuation = true;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    while (needsContinuation && attempts < MAX_ATTEMPTS) {
      attempts++;
      console.log(`🔄 Generation attempt ${attempts}`);

      const result = await model.generateContent({
        contents: [{ 
          role: "user", 
          parts: [
            { text: SYSTEM_PROMPT },
            ...prompt.images.map(img => ({
              inlineData: {
                data: img.includes('base64,') ? img.split('base64,')[1] : img,
                mimeType: "image/jpeg"
              }
            })),
            { text: prompt.text }
          ]
        }]
      });

      const response = await result.response;
      const text = response.text();
      
      // Parse blocks from response
      const newBlocks = parseBlocks(text);
      console.log(`📦 New blocks found:`, newBlocks.length);
      
      allBlocks = [...allBlocks, ...newBlocks];
      console.log(`📝 Total blocks:`, allBlocks.length);

      // Check if we need to continue
      try {
        const parsed = JSON.parse(text);
        needsContinuation = parsed.continue && attempts < MAX_ATTEMPTS;
      } catch (e) {
        needsContinuation = false;
      }

      console.log(`🔄 Continue:`, needsContinuation);
    }

    // Log final blocks before sending
    console.log(`🏁 Final blocks being sent:`, allBlocks.length);
    return NextResponse.json({ 
      blocks: allBlocks,
      _debug: { totalBlocks: allBlocks.length }
    });

  } catch (error) {
    console.error('💥 Request failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 