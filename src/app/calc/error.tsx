"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Calculator Error Boundary Caught:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-300 p-6">
      <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl max-w-xl w-full">
        <h2 className="text-xl font-bold text-red-400 mb-4">Произошла непредвиденная ошибка</h2>
        <p className="mb-4">Пожалуйста, сделайте скриншот этого экрана и отправьте разработчику.</p>
        <div className="bg-black/50 p-4 rounded-lg overflow-auto font-mono text-xs text-red-300 whitespace-pre-wrap mb-6 max-h-64">
          {error.message}
          {"\n\n"}
          {error.stack}
        </div>
        <button
          onClick={() => reset()}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
