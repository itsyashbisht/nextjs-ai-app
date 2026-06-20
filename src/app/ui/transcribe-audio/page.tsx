"use client";

import React, { useRef, useState } from "react";

interface TranscriptResult {
  text: string;
  segments?: Array<{ start: number; end: number; text: string }>;
  language?: string;
  durationInSeconds: number;
}

export default function TranscribeAudioPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptResult | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please Select an audio file");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", selectedFile);

      const response = await fetch("/api/transcribe-audio", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to transcribe audio file");
      }
      const data = await response.json();
      setTranscript(data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error transcribing audio: ", error);
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTranscript(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setTranscript(null);
      setError(null);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading && (
        <div className="text-center mb-4">Transcribing audio...</div>
      )}

      {/* Transcript will display here*/}
      {transcript && !isLoading && (
        <div className="mb-8 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <h3 className="font-semibold mb-2">Transcript:</h3>
          <p className="whitespace-pre-wrap">{transcript.text}</p>

          {transcript.language && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Language: {transcript.language}
            </p>
          )}

          {transcript.durationInSeconds && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Duration: {transcript.durationInSeconds.toFixed(2)} seconds
            </p>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-500 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 shadow-lg"
      >
        <div className="flex flex-col gap-2">
          {/* File upload controls will go here */}
          {selectedFile && (
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Selected: {selectedFile.name} </span>
              <button
                type="button"
                onClick={resetForm}
                className="text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          )}
          <div className="flex gap-2">
            <input
              className="hidden"
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              id="audio-upload"
              onChange={handleFileChange}
            />
            <label
              htmlFor="audio-upload"
              className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-700 text-center"
            >
              {selectedFile ? "Change file" : "Select audio file"}
            </label>
            <button
              type="submit"
              disabled={isLoading || !selectedFile}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Transcribe
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
