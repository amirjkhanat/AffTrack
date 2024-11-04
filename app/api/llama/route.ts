import { NextResponse } from 'next/server';

// Initialize conversation history map like in OpenAI route
const conversationHistory = new Map<
  string, 
  Array<{ role: 'system' | 'user' | 'assistant', content: string }>
>();

const MAX_HISTORY = 10;

function cleanCodeBlock(content: string): string {
  console.log('🧹 Cleaning code block, original:', {
    length: content.length,
    preview: content.substring(0, 100)
  });

  // Find the first ``` and last ```
  const startIndex = content.indexOf('```');
  const endIndex = content.lastIndexOf('```');
  
  if (startIndex === -1 || endIndex === -1) {
    console.log('⚠️ No code block markers found, returning original');
    return content;
  }

  // Extract everything between the markers
  let cleaned = content.substring(startIndex + 3, endIndex);
  
  // Remove language identifier (e.g., 'json\n')
  cleaned = cleaned.replace(/^[a-z]+\n/i, '');
  
  // Trim whitespace
  cleaned = cleaned.trim();

  console.log('✨ Cleaned result:', {
    length: cleaned.length,
    preview: cleaned.substring(0, 100)
  });

  return cleaned;
}

export async function POST(req: Request) {
  console.log('🚀 Starting new request...');
  
  try {
    const { prompt, sessionId = 'default' } = await req.json();
    console.log('📥 Received request:', {
      sessionId,
      promptText: prompt.text.substring(0, 100) + '...',
      hasImages: !!prompt.images?.length,
      imageCount: prompt.images?.length,
      imagesSizes: prompt.images?.map(img => Math.round(img.length / 1024) + 'KB')
    });
    
    // Initialize conversation if needed
    if (!conversationHistory.has(sessionId)) {
      console.log('🆕 Creating new conversation history for session:', sessionId);
      conversationHistory.set(sessionId, [
        {
          role: 'system',
          content: `You are a code generator that creates HTML/Tailwind components. Important rules:

1. When given current component content:
   - Analyze the existing HTML structure
   - Generate new HTML that matches the user's request
   - Maintain any existing IDs or crucial attributes
   - Return complete, valid HTML that can replace the original component

2. ALWAYS respond with a JSON array containing a single block:
[
    {
        "id": "generated-section",
        "content": "complete-html-content"
    }
]

3. The content should be valid HTML that can be directly inserted into the page
4. DO NOT include explanations - only output valid JSON
5. Ensure all HTML is properly nested and closed
6. Use Tailwind CSS classes for styling`
        }
      ]);
    }

    const history = conversationHistory.get(sessionId)!;
    console.log('📚 Current history length:', history.length);
    
    // Prepare messages array with images
    console.log('🖼️ Processing images...');
    const userPrompt = `Current component content:
${prompt.text}

Instructions:
1. Generate new HTML content to replace the current component
2. Maintain the same basic structure but update the content and styling
3. Use Tailwind CSS for all styling
4. Return complete, valid HTML

REMEMBER: 
- Respond ONLY with a JSON array containing the HTML
- The HTML should be complete and valid
- No explanations or markdown
Format: [{"id": "generated-section", "content": "new-html-content"}]`;

    console.log('📝 Preparing request:', {
      hasImage: !!prompt.images?.length,
      promptLength: userPrompt.length,
      currentContent: prompt.text.substring(0, 100) + '...'
    });

    const messages = [
      ...history,
      {
        role: 'user',
        content: userPrompt,
        ...(prompt.images?.length && {
          images: prompt.images.map((img, index) => {
            const isBase64 = img.startsWith('data:image');
            console.log(`Image ${index + 1}:`, {
              isBase64,
              originalSize: Math.round(img.length / 1024) + 'KB'
            });
            return isBase64 ? img.split(',')[1] : img;
          })
        })
      }
    ];

    // Trim history if needed
    if (messages.length > MAX_HISTORY) {
      console.log('✂️ Trimming history to max length:', MAX_HISTORY);
      const systemMessage = messages[0];
      messages.splice(1, messages.length - MAX_HISTORY);
      messages.unshift(systemMessage);
    }

    console.log('🚀 Sending request to Ollama...', {
      model: 'llava',
      messageCount: messages.length,
      lastMessageLength: messages[messages.length - 1].content.length
    });

    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llava',
        messages,
        stream: false,
        options: {
          temperature: 0.7,
          num_predict: 4000,
        }
      })
    });

    if (!response.ok) {
      console.error('❌ Ollama error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Ollama error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    console.log('📦 Raw response:', {
      messageRole: data.message?.role,
      contentLength: data.message?.content?.length,
      contentPreview: data.message?.content?.substring(0, 100) + '...',
      totalDuration: data.total_duration,
      evalCount: data.eval_count
    });

    // Store the assistant's response in history
    history.push({
      role: 'assistant',
      content: data.message?.content || ''
    });
    conversationHistory.set(sessionId, history);
    console.log('💾 Updated conversation history length:', history.length);

    // Try to parse content as JSON blocks
    try {
      console.log('🔍 Attempting to parse response as JSON...');
      const cleanedContent = cleanCodeBlock(data.message?.content || '[]');
      const blocks = JSON.parse(cleanedContent);
      console.log('✅ Successfully parsed JSON blocks:', {
        blockCount: blocks.length,
        blockIds: blocks.map(b => b.id)
      });
      
      return NextResponse.json({ 
        blocks,
        history: conversationHistory.get(sessionId)?.slice(-MAX_HISTORY)
      });
    } catch (parseError) {
      console.warn('⚠️ JSON parsing failed:', {
        error: parseError.message,
        content: data.message?.content
      });
      // If not JSON, create a structured block
      const blocks = [{
        id: 'response-1',
        content: data.message?.content || 'No content returned'
      }];
      
      return NextResponse.json({ 
        blocks,
        history: conversationHistory.get(sessionId)?.slice(-MAX_HISTORY)
      });
    }

  } catch (error) {
    console.error('💥 Request failed:', {
      error: error.message,
      stack: error.stack
    });
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate response',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 