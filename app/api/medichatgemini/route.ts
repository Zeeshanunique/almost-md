import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText, Message, StreamData, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
export const runtime = 'edge';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
});

const google = createGoogleGenerativeAI({
    baseURL: 'https://generativelanguage.googleapis.com/v1beta',
    apiKey: process.env.GEMINI_API_KEY
});

// gemini-1.5-pro-latest
// gemini-1.5-pro-exp-0801
const model = google('models/gemini-1.5-flash', {
    safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
    ],
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
  const { messages } = await req.json();

  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  // Convert messages to Gemini format
  const formattedMessages = messages.map((message: any) => ({
    role: message.role === 'user' ? 'user' : 'model',
    parts: [{ text: message.content }],
  }));

  try {
    const chat = model.startChat({
      history: formattedMessages,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessageStream(messages[messages.length - 1].content);

    // Convert the response to a friendly text-stream
    const stream = GoogleGenerativeAIStream(result);

    // Return the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error in Gemini chat:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to process your request',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

