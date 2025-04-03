"use server"

import { createChatInDB, saveChatHistoryInDB } from "../../services/chatService";

export interface Choice {
  message: {
    content: string;
  };
}

export interface ChatResponse {
  choices: Choice[];
}

export async function createChat(userId: string) {
  console.log('Iniciando criação de chat para userId:', userId);

  if (!userId) {
    console.error("Usuário não encontrado");
    return;
  }

  return await createChatInDB(userId);
}

export async function handleChatSubmit(
  prompt: string,
  chatId: string,
  chatResponse:ChatResponse
): Promise<string[]> {
  console.log("Conversa com o chat iniciada");
  
  try {
    const choices = chatResponse.choices.map((choice) => choice.message.content);

    await saveChatHistoryInDB(chatId, prompt, choices[0] || "Nenhuma resposta disponível");
    return choices;

  } catch (error) {
    console.error("Erro ao processar resposta do chat:", error);
    return ["Ocorreu um erro ao obter a resposta do chat."];

  } 
}

