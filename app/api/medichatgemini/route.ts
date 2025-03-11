import { queryPineconeVectorStore } from "@/utils";
import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { Message, StreamData } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 60;
export const runtime = 'edge';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY ?? "",
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
    const reqBody = await req.json();
    const messages: Message[] = reqBody.messages;
    const userQuestion = messages[messages.length - 1].content;
    const reportData: string = reqBody.data?.reportData || '';

    // If there's no report data, proceed with normal chat
    if (!reportData) {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
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

            const result = await chat.sendMessageStream(userQuestion);
            return new StreamingTextResponse(GoogleGenerativeAIStream(result));
        } catch (error) {
            console.error('Error in chat:', error);
            return new Response(
                JSON.stringify({
                    error: 'Failed to process chat request',
                    details: error instanceof Error ? error.message : 'Unknown error',
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    try {
        const query = `Analyze this legal document and provide a clear, concise summary: ${reportData}`;
        const retrievals = await queryPineconeVectorStore(pinecone, 'index-two', "legalspace", query);

        const model = genAI.getGenerativeModel({ 
            model: 'gemini-pro',
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.5,
            }
        });

        const prompt = `
Task: Create a clear, professional summary of the following legal document and answer the user's question.

Legal Document:
${reportData}

User Question:
${userQuestion}

Relevant Legal Context:
${retrievals}

Instructions:
1. First, provide a BRIEF SUMMARY (maximum 100 words) of the legal document in clear, professional English.
2. Then, answer the user's specific question using both the document and relevant legal context.
3. Format the response as follows:

DOCUMENT SUMMARY:
[Your 100-word summary here]

ANSWER TO YOUR QUESTION:
[Your detailed answer here]

Remember:
- Use clear, professional language
- Be concise but thorough
- Cite specific parts of the document when relevant
- Make clear when you're referencing general legal principles vs. the specific document
`;

        const result = await model.generateContentStream(prompt);
        return new StreamingTextResponse(GoogleGenerativeAIStream(result));

    } catch (error) {
        console.error('Error processing document:', error);
        return new Response(
            JSON.stringify({
                error: 'Failed to process document',
                details: error instanceof Error ? error.message : 'Unknown error',
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}

