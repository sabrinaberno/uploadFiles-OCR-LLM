export async function createbufferData(file: File): Promise<Buffer> {
    const fileData = await file.arrayBuffer();
    const bufferData = Buffer.from(fileData);
  
    return bufferData;
  }
  
  export async function createBase64Data (file: Buffer): Promise<string> {
    
    const base64Data = file.toString("base64");
  
    return base64Data;
  }
  