import { useState } from "react";

export default function PromptForm({ onSubmit, isLoading }: { onSubmit: (prompt: string) => void; isLoading: boolean }) {
    const [prompt, setPrompt] = useState("");

    const isDisabled = isLoading || prompt.trim() === "";

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                if (isDisabled) return;
                onSubmit(prompt);
                setPrompt("");
            }}
        >
            <label className="block text-sm font-medium text-gray-900">Pergunta</label>
            <input
                className="block w-full rounded-md border border-gray-300 p-2 mt-2 text-sm"
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <button
                type="submit"
                className={`inline-flex items-center px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium text-center rounded-lg focus:ring-4 
                ${isDisabled ? "text-gray-400 bg-gray-300 cursor-not-allowed" : "text-white bg-black hover:bg-gray-800"}`}
                disabled={isDisabled}
            >
                Enviar
            </button>
        </form>
    );
}
