import { createWorker } from "tesseract.js";
import { useRef } from "react";

export function useOcrWorker() {

  const worker = useRef<Tesseract.Worker | null>(null);

  // Inicializa o worker de OCR
  const initializeWorker = async () => {
    try {
        if (!worker.current) {
            console.log("Inicializando o worker...");
            worker.current = await createWorker("por+eng");
            await worker.current.load();
        }
    }catch (error) {
        console.error("Erro ao inicializar o worker:", error);
      }
  };

  const recognizeText = async (base64Data: Buffer) => {
    if (!worker.current) {
      console.error("O worker ainda não foi inicializado.");
      return "";
    }

    try {
        const response = await worker.current.recognize(base64Data);
        console.log('OCR Resultado:', response.data);
        return response.data.text;
    } catch (error) {
        console.error("Erro ao reconhecer texto:", error);
        return "";
    }
  };

  // Finaliza o worker
  const terminateWorker = async () => {
    try {
        if (worker.current) {
          await worker.current.terminate();
          worker.current = null;
          console.log("Worker terminado.");
        }
      } catch (error) {
        console.error("Erro ao terminar o worker:", error);
      }
  };

  return {
    initializeWorker,
    recognizeText,
    terminateWorker,
  };
}

