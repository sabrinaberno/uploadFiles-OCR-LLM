"use server";

import { associateFileWithChat, createBase64Data, createbufferData, saveFile } from "../../services/fileService";

export async function createFile(
  formData: FormData, 
  chatId: string, 
  ocrResult: string
){

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

    const savedFile = await saveFile(filename, base64Data, file.size, ocrResult);

     // Associar o arquivo ao Chat
     await associateFileWithChat(chatId, savedFile.fileId);
    return savedFile

  } catch (error) {
    console.error("Erro ao criar o arquivo:", error);
  }
}


