import { useState } from "react";

export default function PromptForm({ onSubmit, isLoading }: { onSubmit: (prompt: string) => void; isLoading: boolean }) {
    const [prompt, setPrompt] = useState("");
  
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (prompt.trim() === "") return;
          onSubmit(prompt);
          setPrompt("");
        }}
      >
        <label className="block text-sm font-medium text-gray-900">Pergunta</label>
        <input
          className="block w-full rounded-md border border-gray-300 p-2 mt-2"
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button
          type="submit"
          className={`inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center rounded-lg focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 
            ${isLoading ? "text-white bg-slate-900 hover:" : "text-gray-400 bg-gray-300 cursor-not-allowed"}`}
          disabled={isLoading}
        >
          Enviar
        </button>
      </form>
    );
  }
  