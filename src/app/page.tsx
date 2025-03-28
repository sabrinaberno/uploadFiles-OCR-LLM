"use client";

import { Pencil, Plus } from "lucide-react";
import React, { useState,useRef,useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import * as actions from "../actions";
import {createWorker} from "tesseract.js";

interface FormData {
  filename: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const { handleSubmit } = useForm<FormData>();
  const [ orcResult, setOcrResult ] = useState(''); 
  //const [progress,setProgress]=useState('')
  //const [progressLabel,setProgressLabel]=useState('')

  const workerRef=useRef<Tesseract.worker|null>(null)

  useEffect(()=>{
    workerRef.current=createWorker('por+eng')
    return ()=>{
      workerRef.current?.terminate()
      workerRef.current=null
    }
  },[])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {

      if (selectedFile.size > 1_048_576) { // 1MB em bytes
        alert("O arquivo deve ter no máximo 1MB.");
      } else {
        setFile(selectedFile);
      }
    }
  };

  const onSubmit: SubmitHandler<FormData> = async () => {
    if (!file) {
      alert("Por favor, selecione um arquivo antes de enviar.");
      return;
    }
  
    console.log({ file });

    const formData = new FormData();
    formData.append("filename", file.name);
    formData.append("file-upload", file); // Usando o estado correto

    // Chama a função de criação do arquivo no actions
    const bufferData = await actions.createFile(formData);
    alert("Arquivo enviado!");
    handleExtract(bufferData)
  };


  const handleExtract = async (base64Data) => {
    const worker=await workerRef.current;
    console.log({worker:worker})

    const response = await worker.recognize(base64Data)
    console.log({'Ocr':response.data})
    setOcrResult(response.data.text)
  }

  return (
    <div className="w-full max-w-3xl p-8 my-16 bg-white border border-gray-200 rounded-lg shadow mx-auto">
      <h2 className="text-4xl text-center font-semibold py-8">
        Chat w/ File Upload
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">  
          <div className="col-span-full">
            <div className="flex justify-between items-center mb-4">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Clique para fazer o upload do arquivo
              </label>
              {file && (
                <button
                  onClick={() => setFile(null)}
                  type="button"
                  className="flex space-x-2 bg-slate-900 rounded-md shadow text-slate-50 py-2 px-4"
                >
                  <Pencil className="w-5 h-5" />
                  <span>Mudar Arquivo</span>
                </button>
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
              <input
                id="file-upload"
                type="file"
                className="hidden"
                multiple={false}
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>
        <button
           type="submit"
           className={`inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 
             ${file ? "text-white bg-purple-700 hover:bg-purple-800" : "text-gray-400 bg-gray-300 cursor-not-allowed"}`}
           disabled={!file}
        >
          <Plus className="w-5 h-5 mr-2" />
          <span>Salvar Arquivo</span>
        </button>
      </form>
      {orcResult && <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mt-8">

        <div className="sm:col-span-2 text-sm font-medium leading-6 text-gray-900 ">
          <label
            htmlFor="chat"
            className="block mb-2 "
          >
            Texto convertido com OCR:
          </label>
          <div className="mt-2" >
            {orcResult}
          </div>
        </div>

      </div> }

      {orcResult && <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 mt-8">
        <div className="sm:col-span-2">
          <label
            htmlFor="chat"
            className="block text-sm font-medium leading-6 text-gray-900 mb-2"
          >
            Converse com o chat para tirar dúvidas sobre o seu documento
          </label>
          <div className="mt-2">
            <input
              type="text"
              id="chat"
              className="block w-full rounded-md border-0 py-2 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
              placeholder="Escreva aqui"
            />
          </div>
        </div>
      </div> }
    </div>
  );
}
