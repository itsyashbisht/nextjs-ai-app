"use client";
import React, { useState } from "react";
import { z } from "zod";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { pokemonUISchema } from "@/app/api/structured-array/schema";

export default function StructuredArrayPage() {
  const [type, setType] = useState("");
  const { error, isLoading, stop, object, submit } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ type });
    setType("");
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4 px-4">{error.message}</div>}
      {/*   */}
      <div className="space-y-8">
        {object?.elements?.map((pokemon, index) => (
          <div
            key={index}
            className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">{pokemon?.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              {pokemon?.abilities?.map((ability) => (
                <div
                  key={ability}
                  className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-md"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-5 rounded w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-900 rounded-md"
      >
        <div className="flex gap-2 ">
          <input
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            type="text"
            placeholder="Enter a pokemon type..."
          />
          {isLoading ? (
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
              onClick={stop}
            >
              Stop
            </button>
          ) : (
            <button
              disabled={isLoading || !type}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition:all"
              type="submit"
            >
              {isLoading ? "Generating..." : "Generate"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
