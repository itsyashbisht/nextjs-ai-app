"use client";

import React, { useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { recipeSchema } from "@/app/api/structured-data/schema";

export default function StructuredDataPage() {
  const [dishName, setDishName] = useState("");
  const { submit, object, isLoading, error, stop } = useObject({
    api: "/api/structured-data",
    schema: recipeSchema,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit({ dish: dishName });
    setDishName("");
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {error && <div className="text-red-500 mb-4 px-4">{error.message}</div>}
      {/*  Structured response goes here */}
      {object?.recipe && (
        <div className="spcae-y-6 px-4">
          <h2 className="text-2xl font-bold">{object.recipe.name}</h2>
          {object?.recipe?.ingredients && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
              <div className="grid grid-cols-2 gap-4">
                {object?.recipe?.ingredients.map((ingredient, index) => (
                  <div
                    className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg"
                    key={index}
                  >
                    <p className="font-medium">{ingredient?.name}</p>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {ingredient?.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {object?.recipe?.steps && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Steps</h3>
              <ol className="space-y-4">
                {object.recipe.steps.map((step, index) => (
                  <li
                    className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg"
                    key={index}
                  >
                    <span className="font-medium mr-2">{index + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-5 rounded w-full max-w-md mx-auto left-0 right-0 p-4 bg-zinc-900 rounded-md"
      >
        <div className="flex gap-2 ">
          <input
            value={dishName}
            onChange={(e) => setDishName(e.target.value)}
            className="flex-1 dark:bg-zinc-800 p-2 border border-zinc-300 dark:border-zinc-700 rounded shadow-xl"
            type="text"
            placeholder="Enter a dish name..."
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
              disabled={isLoading || !dishName}
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
