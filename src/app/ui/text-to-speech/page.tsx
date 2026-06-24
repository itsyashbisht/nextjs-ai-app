"use client";
import React, { useEffect, useRef, useState } from "react";

export default function GenerateSpeechPage() {
  const [text, setText] = useState(""); // For Input
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [hasAudio, setHasAudio] = useState<boolean>(false); // For replay check

  const audioUrlRef = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    setText("");

    // Cleanup before calling api.
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioRef.current = null;
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate audio");
      }

      const blob = await response.blob();
      audioUrlRef.current = URL.createObjectURL(blob);
      audioRef.current = new Audio(audioUrlRef.current);

      setHasAudio(true);
      await audioRef.current.play();

      // audioRef.current.addEventListener("ended", () =>
      //   URL.revokeObjectURL(audioUrl),
      // );
    } catch (error) {
      console.error("Error generating audio", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again",
      );
      setHasAudio(false);
    } finally {
      setIsLoading(false);
    }
  };

  const replayAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Clean up audio when the component unmounts.
  useEffect(() => {
    return () => {
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioRef.current = null;
      }

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {/* Error handling */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading && <div className="text-center mb-4">Generating audio...</div>}

      {hasAudio && !isLoading && (
        <button
          onClick={replayAudio}
          className="mb-4 bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded hover:bg-gray-300"
        >
          Replay Audio
        </button>
      )}

      {/*  Audio UI will appear here */}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-5 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-500 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            placeholder="Enter text to convert to speech"
            type="text"
            value={text}
            disabled={isLoading}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition:all"
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
