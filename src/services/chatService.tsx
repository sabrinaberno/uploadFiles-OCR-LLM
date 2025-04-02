import { prisma } from "@/utils/prisma";

export async function createChatInDB(userId: string) {
  try {
    return await prisma.chat.create({ data: { userId } });
  } catch (error) {
    console.error("Erro ao criar novo chat:", error);
    throw error;
  }
}

export async function fetchChatResponse(prompt: string, orcResult: string) {
  try {
    const response = await fetch("../api/chatResponse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, orcResult }),
    });

    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar a pergunta:", error);
    throw error;
  }
}
