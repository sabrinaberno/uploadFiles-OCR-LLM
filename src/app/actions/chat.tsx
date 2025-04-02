"use server";

import { createChatInDB, fetchChatResponse } from "@/services/chatService";

interface Choice {
  message: {
    content: string;
  };
}

interface ChatResponse {
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
  orcResult: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setChoices: React.Dispatch<React.SetStateAction<string[]>>
) {
  setIsLoading(true);
  console.log("Conversa com o chat iniciada");

  try {
    const result: ChatResponse = await fetchChatResponse(prompt, orcResult);
    
    setChoices(result.choices.map((choice: Choice) => choice.message.content));

  } catch (error) {
    console.error("Erro ao processar resposta do chat:", error);
  } finally {
    setIsLoading(false);
  }
}


// // // npx prisma studio



// export async function saveChatHistory(chatId: string, question: string, answer: string) {
//   try {
//     const savedHistory = await prisma.chatHistory.create({
//       data: {
//         chatId,
//         question,
//         answer,
//       },
//     });

//     console.log("Histórico salvo com sucesso:", savedHistory);
//     return savedHistory;

//   } catch (error) {
//     console.error("Erro ao salvar histórico do chat:", error);
//   }
// }
