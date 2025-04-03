import { prisma } from "@/utils/prisma";
import { ChatResponse, handleChatSubmit } from "../app/actions/chat"; 
import axios from 'axios'

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
    const response = await axios.post('/api/chatResponse',{prompt, orcResult })
    console.log({axiosResponse:response})
    return await response;
  } catch (error) {
    console.error("Erro ao enviar a pergunta:", error);
    throw error;
  }
}

export async function saveChatHistoryInDB(chatId: string, question: string, answer: string) {
  try {
    await prisma.chatHistory.create({
      data: {
        chatId,
        question,
        answer,
      },
    });
    console.log("Histórico salvo no banco.");
  } catch (error) {
    console.error("Erro ao salvar histórico do chat:", error);
  }
}

export async function handleChatInteraction(
  prompt: string,
  chatId: string,
  chatResponse: ChatResponse,
  setChatHistory: React.Dispatch<React.SetStateAction<{ question: string; answer: string; }[]>>
) {

  try {
    const choices = await handleChatSubmit(prompt,chatId,chatResponse);
    const answer = choices[0] || "Nenhuma resposta disponível"; 

    setChatHistory((prev) => [...prev, { question: prompt, answer }]);

  } catch (error) {
    console.error("Erro ao processar resposta do chat:", error);

  } 
}