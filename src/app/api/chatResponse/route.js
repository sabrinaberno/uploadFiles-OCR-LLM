import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "../../../utils/prisma";

export async function POST(request) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    
    const params = await request.json();

    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:"Você é formal. Por favor, responda minhas perguntas de forma polida",
          },
          {
            role: "user",
            content: "Leia o meu texto e irei perguntar sobre ele." + params.orcResult + " " + params.prompt, 
          },
        ],
        temperature: 0,
        max_tokens: 1024,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
    
    return NextResponse.json(response)
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "O parâmetro 'userId' é obrigatório." },
        { status: 400 }
      );
    }

    // Busca os chats do usuário com o histórico associado
    const chats = await prisma.chat.findMany({
      where: { userId },
      select: {
        userId: true,
        chatId: true,
        fileId: true,
        ChatHistory: {  
          select: {
            chatHistoryId: true,
            question: true,
            answer: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json(chats);
  } catch (error) {
    console.error("Erro ao buscar os chats:", error);

    return NextResponse.json(
      { error: "Erro ao buscar os chats." },
      { status: 500 }
    );
  }
}
