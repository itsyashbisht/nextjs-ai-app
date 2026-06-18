"use client";

import React, { useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Image from "next/image";

export default function MultiModalChatPage() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>(undefined);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/multi-modal-chat",
    }),
  });

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input, files });
    setInput("");
    setFiles(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md pt-12 pb-36 mx-auto stretch">
      {/*  Message will go here */}
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {messages.map((message) => (
        <div className="mb-4" key={message.id}>
          <div className="font-semibold">
            {message.role === "user" ? "You: " : "AI: "}
          </div>
          {message?.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    className="whitespace-pre-wrap"
                    key={`${message.id}-${index}`}
                  >
                    {part.text}
                  </div>
                );

              case "file":
                if (part.mediaType?.startsWith("image/")) {
                  return (
                    <Image
                      key={`${message.id}-${index}`}
                      src={part.url}
                      width={500}
                      height={500}
                      alt={part.filename ?? `Attachment-${index}`}
                    />
                  );
                }

                // for PDFs
                if (part.mediaType?.startsWith("application/pdf")) {
                  return (
                    <iframe
                      key={`${message.id}-${index}`}
                      src={part.url}
                      width={350}
                      height={500}
                      title={part.filename ?? `Attachment-${index}`}
                    />
                  );
                }

                return null;

              default:
                return null;
            }
          })}
        </div>
      ))}

      {(status === "submitted" || status === "streaming") && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 blorder-blue-400"></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleOnSubmit}
        className="fixed bottom-5 rounded w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-50"
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <label
              className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-900"
              htmlFor="file-upload"
            >
              {/* Icon and text will go here */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
              </svg>
              {files?.length
                ? `${files.length} file(s) attached`
                : `Attach files`}
            </label>

            <input
              type="file"
              id="file-upload"
              accept="image/*,application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(e.target.files);
                }
              }}
              multiple
            />
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
              placeholder="How can I help you?"
            />
            {status === "streaming" || status === "submitted" ? (
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                onClick={stop}
              >
                Stop
              </button>
            ) : (
              <button
                disabled={status !== "ready"}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition:all disabled:opacity-50 disbaled:cursor-not-allowed"
                type="submit"
              >
                Send
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
