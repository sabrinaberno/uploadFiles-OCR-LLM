"use client";

//import { useState } from "react";

interface Props {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: Props) {
  //const [setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      if (selectedFile.size > 1_048_576) {
        alert("O arquivo deve ter no máximo 1MB.");
      } else {
        //setFile(selectedFile);
        onFileSelect(selectedFile);
      }
    }
  };

  return (
      <input 
        id="file-upload"
        type="file"
        className="hidden"
        multiple={false} 
        onChange={handleFileChange} 
      />
  );
}
