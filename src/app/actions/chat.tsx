import { prisma } from "../../utils/prisma";

interface Choice {
    message: {
      content: string;
    };
  }
  
  interface ChatResponse {
    choices: Choice[];
  }
  
  export const handleChatSubmit = async (
    // prompt: string,  
    // orcResult: string, 
    // setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, 
    // setChoices: React.Dispatch<React.SetStateAction<string[]>>,
    // userId: string,
    // fileId: string
    prompt: string,  orcResult: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setChoices: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setIsLoading(true);

    try {
      const response = await fetch("../api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, orcResult }),
      });
  
      const result: ChatResponse = await response.json();
      setChoices(result.choices.map((choice) => choice.message.content));

      // if (result.choices.length > 0) {
      //   await saveChatHistory(prompt, result.choices[0].message.content, fileId, userId);
      // }
  
    } catch (error) {
      console.error("Erro ao enviar a pergunta:", error);

    } finally {

      setIsLoading(false);

    }
  };
  
  export async function saveChatHistory(prompt: string, answer: string, fileId: string, userId: string) {
    try {
      // Cria o histórico de chat no banco
      const chat = await prisma.chatHistory.create({
        data: {
          question: prompt,
          answer: answer,
          fileId: fileId, // Associar ao arquivo
          userId: userId, // Associar ao usuário
        },
      });
  
      console.log("Histórico de chat salvo:", chat);
      return chat;
    } catch (error) {
      console.error("Erro ao salvar o histórico de chat:", error);
    }
  }