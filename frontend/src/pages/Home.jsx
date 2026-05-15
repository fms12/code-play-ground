import React, { useState } from "react";
// import { useNavigate } from 'react-router-dom';
import { Wand2, Sparkles } from "lucide-react";
import { Result } from "./Result";
/**
 * @typedef {'gpt-3.5-turbo' | 'gpt-4'} ModelType
 */

/**
 * Defines the structure for the application state.
 * @typedef {object} AppState
 * @property {ModelType} model - The model being used.
 * @property {boolean} isLoading - Whether the app is currently processing.
 * @property {string} code - The generated code.
 * @property {string | null} error - Any error message from the process.
 * @property {'idle' | 'generating' | 'complete' | 'error'} status - The current status of the generation process.
 * @property {number} [completionTokens] - (Optional) The number of tokens used.
 * @property {number} [totalTime] - (Optional) The total time taken for the operation in milliseconds.
 */

/**
 * The initial state for our application.
 * @type {AppState}
 */
const initialAppState = {
  isLoading: false,
  code: "",
  error: null,
  status: "idle",
};

export function Home() {
  const [prompt, setPrompt] = useState("");
  const [appState, setAppState] = useState(initialAppState);
  //   const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || appState.isLoading) {
      return;
    }
    console.log("Submitting prompt:", prompt);

    setAppState((prev) => ({
      ...prev,
      isLoading: true,
      status: "generating",
      code: "",
      error: null,
    }));

    try {
      const response = await fetch("http://127.0.0.1:8000/api/generate-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setAppState((prev) => ({
            ...prev,
            status: "complete",
            isLoading: false,
          }));
          setPrompt("");
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        setAppState((prev) => ({
          ...prev,
          code: prev.code + chunk,
        }));
      }
    } catch (err) {
      setAppState((prev) => ({
        ...prev,
        isLoading: false,
        status: "error",
        error: err.message || "Something went wrong.",
      }));
    }
  };


  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
      </div>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-white/10 p-4 border border-white/20 shadow-lg">
              <Wand2 className="w-12 h-12 text-cyan-300" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-100 mb-4 bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
            Website Builder AI
          </h1>
          <p className="text-lg text-gray-400">
            Describe your dream website, and we'll help you build it step by
            step
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-gray-700">
            <label htmlFor="prompt-textarea" className="sr-only">
              Website Description
            </label>
            <div className="p-0.5 rounded-lg bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 focus-within:from-fuchsia-600 focus-within:to-cyan-600 transition-all duration-300">
              <textarea
                id="prompt-textarea"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A sleek, modern portfolio for a graphic designer..."
                className="w-full h-32 p-4 bg-gray-900 text-gray-100 border-0 rounded-md focus:ring-0 focus:outline-none resize-none placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={!prompt.trim() || appState.isLoading}
              className="w-full mt-4 bg-gradient-to-r from-fuchsia-600 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-cyan-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {appState.isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Generate Website Plan
                </>
              )}

             
            </button>
          </div>
        </form>

        {appState.status === "complete" && appState.code && (
          <Result app={appState} />
        )}

        {appState.status === "error" && (
          <div className="mt-8 text-center p-4 bg-red-900/50 border border-red-700 rounded-lg">
            <p className="text-red-300 font-semibold">
              Error: {appState.error}
            </p>
          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-4">
          Powered by Generative AI
        </p>
      </div>
    </div>
  );
}
