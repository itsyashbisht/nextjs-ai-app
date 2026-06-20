"use client";

import { useState } from "react";
import Image from "next/image";

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState("");
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setImageSrc(null);
    setPrompt("");
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "something went wrong");
      }

      setImageSrc(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.error("Error generating image: ", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {/*Image will go here*/}

      <div className="relative w-full aspect-square mb-20">
        {isLoading ? (
          <div className="w-full h-full animate-pulse bg-gray-300 rounded-full" />
        ) : (
          imageSrc && (
            <Image
              alt="Generated image"
              className="w-full h-full object-cover rounded-lg shadow-lg"
              src={imageSrc}
              height={1024}
              width={1024}
            />
          )
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-5 rounded w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition:all disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
            disabled={isLoading}
          >
            Generate
          </button>
        </div>
      </form>
    </div>
  );
}
