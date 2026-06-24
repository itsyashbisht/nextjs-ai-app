"use client";

import React, { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { ChatMessage } from "@/app/api/multiple-tools/route";

export default function ToolsPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat<ChatMessage>({
    transport: new DefaultChatTransport({
      api: "/api/multiple-tools",
    }),
  });

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
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

              case "tool-getLocation":
                switch (part?.state) {
                  case "input-streaming":
                    return (
                      <div
                        key={`${message.id}-${index}`}
                        className="bg-zinc-800/50 border border-zinc-700 p-2 rounded "
                      >
                        <div className="text-sm text-zinc-500">
                          Receiving location request...
                        </div>
                        <pre className="text-xs text-zinc-600 mt-1">
                          {JSON.stringify(part.input, null, 2)}
                        </pre>
                      </div>
                    );

                  case "input-available":
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                      >
                        <div className="text-sm text-zinc-400">
                          Getting location for {part.input.name}...
                        </div>
                      </div>
                    );

                  case "output-available":
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                      >
                        <div className="text-sm text-zinc-400">
                          📍 Location Found
                        </div>
                        <div className="text-sm text-zinc-300">
                          <div>{part.output}</div>
                        </div>
                      </div>
                    );

                  case "output-error":
                    return (
                      <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1">
                        <div className="text-sm text-zinc-400">
                          Error: {part.errorText}
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }

              case "tool-getWeather":
                switch (part?.state) {
                  case "input-streaming":
                    console.log(part);
                    return (
                      <div
                        className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                        key={`${message.id}-getWeather-${index}`}
                      >
                        <div className="text-sm text-zinc-500">
                          🌤️ Receiving weather request...
                        </div>
                        <pre className="text-xs text-zinc-600 mt-1">
                          {JSON.stringify(part.input, null, 2)}
                        </pre>
                      </div>
                    );

                  case "input-available":
                    console.log(part);
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                      >
                        <div className="text-sm text-zinc-400">
                          Getting weather for {part.input.location}...
                        </div>
                      </div>
                    );

                  case "output-available":
                    console.log(part);
                    return (
                      <div
                        key={`${message.id}-getWeather-${index}`}
                        className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1"
                      >
                        <div className="text-sm text-zinc-400">Weather</div>
                        <div className="text-sm text-zinc-300">
                          <div>{part.output}</div>
                        </div>
                      </div>
                    );

                  case "output-error":
                    return (
                      <div className="bg-zinc-800/50 border border-zinc-700 p-2 rounded mt-1">
                        <div className="text-sm text-zinc-400">
                          Error: {part.errorText}
                        </div>
                      </div>
                    );
                  default:
                    return null;
                }

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
        className="fixed bottom-5 rounded w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-500"
      >
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
      </form>
    </div>
  );
}
