/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Pencil, Plus } from "lucide-react";

// Autenticação
import { SignInButton, SignedIn, SignedOut, UserButton, useUser} from "@clerk/nextjs";

// Tipos
import { Chat, ChatHistory } from "@prisma/client";

// Serviços
import { useOcrWorker } from "@/services/ocrService";
import { createbufferData } from "@/services/fileService";
import { handleChatInteraction } from "@/services/chatService";

// Ações
import { createFile } from "@/app/actions/file";
import { createChat } from "@/app/actions/chat";

// Componentes
import Button from "@/components/Button";
import FileUpload from "@/components/FileUpload";
import PromptForm from "@/components/PromptForm";
import DrawerMenu from "@/components/DrawerList";


export default function Home() {
  const { initializeWorker, recognizeText, terminateWorker } = useOcrWorker();
  const { handleSubmit } = useForm();
  const { user } = useUser();

  const [file, setFile] = useState<File | null>(null);
  const [orcResult, setOcrResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<{ question: string; answer: string; chatId?: string }[]>([]);
  const [chatList, setChatList] = useState<Record<string, Chat & { ChatHistory: ChatHistory[] }>>({});

  // Cria um novo chat para o usuário autenticado e salva seu chatId
  const getUserId = async (): Promise<string | undefined> => {
    if (user) {
      console.log("Usuário autenticado:", user.id);
      const newChat = await createChat(user.id);
  
      if (!newChat) {
        alert("Erro ao criar o chat. Tente novamente.");
        return;
      }
  
      setChatId(newChat.chatId); 
      return newChat.chatId;     
    }  
  };

  // Envia uma interação para o chat
  const onSubmitChatInteraction = async (
    prompt: string,
    chatId: string | null,
    orcResult: string,
    setChatHistory: { (value: React.SetStateAction<{ question: string; answer: string; chatId?: string | undefined; }[]>): void; (value: React.SetStateAction<{ question: string; answer: string; }[]>): void; }
  ) => {
    try {
      const {data} = await axios.post("/api/chatResponse", {
        prompt,
        orcResult,
      });

      handleChatInteraction(prompt, chatId ?? undefined, data,setChatHistory)
    } catch (error) {
      console.error("Erro ao enviar a pergunta:", error);
    }
  };
  
  // Processa o envio do arquivo
  const onSubmitFile = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo antes de enviar.");
      return;
    }
    await initializeWorker();

    const formData = new FormData();
    formData.append("filename", file.name);
    formData.append("file-upload", file);

    const bufferData = await createbufferData(file);
    const text = await recognizeText(bufferData);
    setOcrResult(text);

    const newChatId = await getUserId();

    if (newChatId) {
      await createFile(formData, newChatId, text); 
    }
    
    alert("Arquivo enviado!");
    terminateWorker();
  };

  // Atualiza o arquivo selecionado
  const handleFileSelect = (file: File) => {
    setFile(file);

    setOcrResult("");
    setChatHistory([]);
    setChatId(null);
  };

  // Busca a lista de chats do usuário
  const getChatList = async (userId: string) =>{
    if (!userId) {
      console.error("UserId não definido.");
      return;
    }

      try {
        const { data } = await axios.get(`/api/chatResponse?userId=${userId}`);
        console.log("Chats recebidos:", data);
        setChatList(data); 

      } catch (error) {
        console.error("Erro ao buscar os chats:", error);
      }
  }

   // Carrega a lista de chats quando o usuário muda
   useEffect(() => {
    if (user) {getChatList(user.id);}
    }, [user]);

    // Atualiza o histórico de chat quando o chatId muda
    useEffect(() => {
      if (chatId && chatList && chatList[chatId]?.ChatHistory) {
        setChatHistory(chatList[chatId].ChatHistory);
      } else {
        setChatHistory([]);
      }
    }, [chatId, chatList]);
  

  return (
    <>
      {/* Menu Superior */}
      <div className="flex justify-between items-center p-2">
      <DrawerMenu 
        chatList={chatList} 
        setChatId={setChatId} 
        setOcrResult={setOcrResult} 
        setChatHistory={setChatHistory} 
        setFile={setFile} 
      />
        <SignedOut>
          <SignInButton>
            <Button type="submit" className="m-3 bg-gray-500 hover:bg-gray-600">
              Entrar
            </Button>
          </SignInButton>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Container Principal */}
      <div className="w-full max-w-3xl p-8 my-16 bg-white border border-gray-200 rounded-lg shadow mx-auto">
        <h2 className="text-4xl text-center font-semibold py-8">
          Chat w/ File Upload
        </h2>

        {/* Formulário de Upload */}
        <form onSubmit={handleSubmit(onSubmitFile)}>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div className="col-span-full">
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  {user && <p> Olá {user?.fullName}</p>}
                  <p>Clique para fazer o upload do arquivo</p>
                </label>
                {file && (
                  <Button
                    onClick={() => setFile(null)}
                    type="submit"
                    className="flex space-x-2 bg-slate-900 rounded-md shadow text-slate-50 py-2 px-4"
                  >
                    <Pencil className="w-5 h-5" />
                    <span>Mudar Arquivo</span>
                  </Button>
                )}
              </div>

              {/* Área de Upload */}
              <div className="flex justify-center items-center">
                <label
                  htmlFor="file-upload"
                  className="w-full flex justify-center items-center p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 focus:ring-2 focus:ring-purple-600"
                >
                  <Plus className="w-6 h-6 text-gray-500" />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {file ? file.name : "Upload do Arquivo"}
                  </span>
                </label>
                <FileUpload onFileSelect={handleFileSelect} />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={!file} className="mt-4 sm:mt-6">
            <Plus className="w-5 h-5 mr-2" />
            <span>Enviar Arquivo</span>
          </Button>
        </form>

        {/* Exibição do Resultado OCR */}
        {orcResult && (
          <div className="mt-8">
            <label className="block font-medium leading-6 text-purple-900 mb-2">
              Texto convertido com OCR:
            </label>
            <div className="p-3 bg-gray-100 rounded-md text-sm f">
              {orcResult}
            </div>
          </div>
          )}
            <div className="mt-8">
              <div className="mt-4 space-y-2 mb-8 text-sm">
                {chatHistory.map((chat, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-md">
                    <p className="text-blue-600 font-medium">
                      Você: {chat.question}
                    </p>
                    <p className="text-gray-900">Chat: {chat.answer}</p>
                  </div>
                ))}
              </div>
              <label className="block font-medium leading-6 text-purple-900 mb-2">
                Converse com o chat
              </label>

              {/* Chat */}
              <PromptForm
                isLoading={isLoading}
                onSubmit={(prompt: string) =>
                  onSubmitChatInteraction(
                    prompt,
                    chatId,
                    orcResult,
                    setChatHistory
                  )
                }
              />
            </div>
          </div>
    </>
  );
}

