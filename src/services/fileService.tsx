import { prisma } from "../utils/prisma";

export async function createbufferData(file: File): Promise<Buffer> {
    const fileData = await file.arrayBuffer();
    const bufferData = Buffer.from(fileData);
  
    return bufferData;
  }
  
  export async function createBase64Data (file: Buffer): Promise<string> {
    
    const base64Data = file.toString("base64");
  
    return base64Data;
  }
  

export async function saveFile(filename: string, base64Data: string, size: number, ocrResult: string) {
  return await prisma.file.create({
    data: { filename, data: base64Data, size, ocr: ocrResult },
  });
}

export async function associateFileWithChat(chatId: string, fileId: string) {
  return await prisma.chat.update({
    where: { chatId: chatId },
    data: { fileId: fileId },
  });
}