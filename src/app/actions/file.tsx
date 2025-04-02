"use server";

import { createBase64Data, createbufferData } from "@/services/fileService";
import { prisma } from "../../utils/prisma";

//export async function createFile(formData: FormData, conversation: { question: string; answer: string }[], userId: string) {
  export async function createFile(formData: FormData) {
const file = formData.get("file-upload") as File;
  const filename = formData.get("filename") as string;

  if (!filename.trim() || !file) {
    console.error("Arquivo ou nome do arquivo não fornecido");
    return;
  }

  try {
    const bufferData = await createbufferData(file);

    const base64Data = await createBase64Data(bufferData);

    console.log("Arquivo recebido", filename, file.size);

    // Armazena os dados do arquivo no banco de dados
    // const savedFile = await prisma.file.create({
    //   data: {
    //     filename: filename,
    //     data: base64Data,
    //     size: file.size,
    //     userId: userId,
    //     chatHistory: {
    //       create: conversation.map((chat) => ({
    //         question: chat.question,
    //         answer: chat.answer,
    //         userId: userId,
    //       })),
    //     },
    //   },
    // });

    // return savedFile
    await prisma.file.create({
      data: {
        filename: filename,
        data: base64Data,
        size: file.size,
      },
    });

    return base64Data

  } catch (error) {
    console.error("Erro ao criar o arquivo:", error);
  }
}

export { createbufferData };

