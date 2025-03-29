"use server";

import { prisma } from "../utils/prisma";

export async function createBase64Data(file: File): Promise<string> {

  // Convertendo o conteúdo do arquivo para Buffer
  const fileData = await file.arrayBuffer();
  const bufferData = Buffer.from(fileData,'base64');

  // Convertendo o buffer para base64
  //const base64Data = bufferData.toString('base64');

  return bufferData;
}

export async function createFile(formData: FormData) {
  const file = formData.get("file-upload") as File;
  const filename = formData.get("filename") as string;

  if (!filename.trim() || !file) {
    console.error("Arquivo ou nome do arquivo não fornecido");
    return;
  }

  try {
    // Chama a função createBase64Data para gerar a base64 do arquivo
    const bufferData = await createBase64Data(file);
    const base64Data=bufferData.toString('base64') 
    // console.log(base64Data)
    console.log("Arquivo recebido", filename, file.size);

    // Armazena os dados do arquivo no banco de dados
    await prisma.file.create({
      data: {
        filename: filename,
        data: base64Data,
        size: file.size,
      },
    });

    return bufferData

  } catch (error) {
    console.error("Erro ao criar o arquivo:", error);
  }
}
