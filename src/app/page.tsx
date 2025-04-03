/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { Pencil, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

import axios from "axios";
import Button from "../components/Button";
import { useOcrWorker } from "../services/ocrService";
import { createbufferData } from "../services/fileService";
import { createFile } from "./actions/file";
import { createChat } from "./actions/chat";
import FileUpload from "../components/FileUpload";
import PromptForm from "../components/PromptForm";
import { handleChatInteraction } from "@/services/chatService";

export default function Home() {
  const { initializeWorker, recognizeText, terminateWorker } = useOcrWorker();

  const [file, setFile] = useState<File | null>(null);
  const { handleSubmit } = useForm();

  const [orcResult, setOcrResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState<
    { question: string; answer: string; chatId?: string }[]
  >([]);
  const [chatId, setChatId] = useState<string | null>(null);

  const { user } = useUser();

  const onSubmitChatInteraction = async (
    prompt: string,
    chatId: string | null,
    orcResult: string,
    setChatHistory: { (value: React.SetStateAction<{ question: string; answer: string; chatId?: string | undefined; }[]>): void; (value: React.SetStateAction<{ question: string; answer: string; }[]>): void; }
  ) => {
    if (!chatId) {
      console.error("ChatId não definido.");
      return;
    }
    try {
      const {data} = await axios.post("/api/chatResponse", {
        prompt,
        orcResult,
      });
      handleChatInteraction(prompt,chatId,data,setChatHistory)
    } catch (error) {
      console.error("Erro ao enviar a pergunta:", error);
    }
  };

  const onSubmit = async () => {
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

    if (user) {
      console.log("Usuário autenticado:", user.id);
      const newChat = await createChat(user.id);

      if (!newChat) {
        alert("Erro ao criar o chat. Tente novamente.");
        return;
      }

      setChatId(newChat.chatId);

      await createFile(formData, newChat.chatId, text);
      alert("Arquivo enviado!");
    }

    terminateWorker();
  };


  // const requestApi = async () => {
  //   try {
  //     const result = await axios.post("/api/chatResponse", { oi: "oi" });
  //     console.log({ thisaxiosresult: result });
  //   } catch (error) {
  //     console.log({ ERRO: error });
  //   }
  // };

  const handleFileSelect = (file: File) => {
    setFile(file);

    setOcrResult("");
    setChatHistory([]);
    setChatId(null);
  };

  const startNewChat = () => {
    setChatId(null);
    setOcrResult("");
    setChatHistory([]);
    setFile(null);
  };

  return (
    <>
      <div className="flex justify-between items-center p-1">
        <Button type="submit" className="m-3" onClick={startNewChat}>
          Novo Chat
        </Button>
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
      <div className="w-full max-w-3xl p-8 my-16 bg-white border border-gray-200 rounded-lg shadow mx-auto">
        <h2 className="text-4xl text-center font-semibold py-8">
          Chat w/ File Upload
        </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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

        {orcResult && (
          <div className="mt-8">
            <label className="block font-medium leading-6 text-purple-900 mb-2">
              Texto convertido com OCR:
            </label>
            <div className="p-3 bg-gray-100 rounded-md text-sm f">
              {orcResult}
            </div>

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
                Converse com o chat sobre o documento
              </label>
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
        )}
      </div>
    </>
  );
}
