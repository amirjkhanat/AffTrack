import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Initialize conversation history map
const conversationHistory = new Map<
  string, 
  Array<{ role: 'system' | 'user' | 'assistant', content: string }>
>();

// Constants
const MAX_HISTORY = 10;
const MAX_ATTEMPTS = 5;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function cleanJSONResponse(response: string): string {
  return response.replace(/```json|```/g, '').trim();
}

async function fetchOpenAI(prompt: { text: string, images?: string[] }, sessionId: string, isContinuation: boolean = false) {
  try {
    if (!conversationHistory.has(sessionId)) {
      conversationHistory.set(sessionId, [
        {
          role: 'system',
          content: `You create elegant, mobile-friendly HTML sections using TailwindCSS classes inline.
            Each block should represent a complete section (like header, hero, features, etc.).
            Use semantic HTML with Tailwind classes directly in the elements.
            
            For large responses use "CONTINUE:" followed by remaining sections.
            
            Response format:
            [
                {
                    "id": "section-name",
                    "content": "<section class='container mx-auto px-4 py-12'>
                               <div class='flex flex-col md:flex-row...'>
                               ... complete section HTML with inline Tailwind ...
                               </section>"
                }
            ]`
        }
      ]);
    }

    const history = conversationHistory.get(sessionId)!;
    let contentWithImages = prompt.text;
    
    if (!isContinuation && prompt.images && prompt.images.length > 0) {
      contentWithImages += '\n\n' + prompt.images.map((img, i) => `Image ${i + 1}: ${img}`).join('\n');
    }

    history.push({ role: 'user', content: contentWithImages });

    if (history.length > MAX_HISTORY) {
      const systemMessage = history[0];
      history.splice(1, history.length - MAX_HISTORY);
      history.unshift(systemMessage);
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: history,
      max_tokens: 4000, // Reduced max tokens to avoid hitting limits
    });

    history.push(completion.choices[0].message);
    conversationHistory.set(sessionId, history);

    return completion;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, sessionId = 'default' } = await req.json();

    if (!prompt || !prompt.text) {
      return NextResponse.json(
        { error: 'Prompt text is required' }, 
        { status: 400, headers: corsHeaders }
      );
    }

    let allBlocks: any[] = [];
    let continuationPrompt = prompt.text;
    let isContinuation = false;
    let attempts = 0;

    while (attempts < MAX_ATTEMPTS) {
      let completion = await fetchOpenAI({ text: continuationPrompt }, sessionId, isContinuation);
      let cleanedResponse = cleanJSONResponse(completion.choices[0].message.content);

      try {
        // Check if the response contains a continuation marker
        const [jsonPart, continuePart] = cleanedResponse.split('CONTINUE:').map(part => part.trim());
        
        const blocks = JSON.parse(jsonPart);
        allBlocks = [...allBlocks, ...blocks];

        // If there's a continuation part, prepare for next iteration
        if (continuePart) {
          continuationPrompt = continuePart;
          isContinuation = true;
          attempts++;
        } else {
          // No more continuations needed
          break;
        }
      } catch (parseError) {
        console.warn('Response parsing failed:', parseError);
        
        // Try recovery with explicit formatting request
        completion = await fetchOpenAI(
          { 
            text: `${continuationPrompt}\nPrevious response was invalid JSON. Please provide a valid JSON array of blocks exactly as specified in the format.`,
            images: isContinuation ? undefined : prompt.images 
          },
          sessionId,
          isContinuation
        );
        
        cleanedResponse = cleanJSONResponse(completion.choices[0].message.content);
        const blocks = JSON.parse(cleanedResponse);
        allBlocks = [...allBlocks, ...blocks];
        break;
      }
    }

    return NextResponse.json({ 
      blocks: allBlocks,
      history: conversationHistory.get(sessionId)?.slice(-MAX_HISTORY)
    });

  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error.message },
      { status: 500 }
    );
  }
} 