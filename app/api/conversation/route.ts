import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Renaming 'handleRequest' to 'post' to align with Next.js API routes convention
export async function POST(req: Request) {
  try {
    const { userId } = await auth(); // Ensure you pass 'req' to 'auth'
    const body = await req.json();
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    // Use the correct method and endpoint for chat models
    const response = await openai.chat.completions.create({ // Adjust this method based on the actual API
      model: "gpt-3.5-turbo",
      messages: messages, // Adjust the structure if needed
      max_tokens: 150 // Adjust max_tokens as needed
    });

    return new NextResponse(JSON.stringify(response.choices[0].message), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('[CONVERSATION_ERROR]', error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

