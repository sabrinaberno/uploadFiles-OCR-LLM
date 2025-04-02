import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../utils/prisma";

export async function POST(req: NextRequest) {
  try {
    const { chatId, question, answer } = await req.json();

    const savedHistory = await prisma.chatHistory.create({
      data: { chatId, question, answer },
    });

    return NextResponse.json(savedHistory);
  } catch (error) {
    console.error("Erro ao salvar histórico do chat:", error);
    return NextResponse.json({ error: "Erro ao salvar histórico" }, { status: 500 });
  }
}
