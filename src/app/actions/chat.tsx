interface Choice {
    message: {
      content: string;
    };
  }
  
  interface ChatResponse {
    choices: Choice[];
  }
  
  export const handleChatSubmit = async (prompt: string,  orcResult: string, setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, setChoices: React.Dispatch<React.SetStateAction<string[]>>) => {
    setIsLoading(true);

    try {
      const response = await fetch("../api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, orcResult }),
      });
  
      const result: ChatResponse = await response.json();
      setChoices(result.choices.map((choice) => choice.message.content));
  
    } catch (error) {
      console.error("Erro ao enviar a pergunta:", error);

    } finally {

      setIsLoading(false);

    }
  };
  