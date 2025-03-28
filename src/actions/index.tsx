"use server";

import { prisma } from "../utils/prisma";
import { revalidatePath } from "next/cache";

  export async function createFile(formData: FormData) {
    
    const file = formData.get("file-upload") as File;
    const filename = formData.get("filename") as string;
  
    if (!filename.trim() || !file) {
      console.error("Arquivo ou nome do arquivo não fornecido");
      return;
    }
  
    // Convertendo o conteúdo do arquivo para Buffer
    const fileData = await file.arrayBuffer();
    const bufferData = Buffer.from(fileData);
  
    console.log("Arquivo recebido", filename, file.size);
  
    const base64Data = bufferData.toString('base64');

    const result=await prisma.file.create({
      data: {
        filename: filename,
        data: base64Data,
        size: file.size,
      },
    });
  console.log({result})
    revalidatePath("/");
  }
  