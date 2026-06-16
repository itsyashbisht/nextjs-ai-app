import { Output, streamText } from "ai";
import { groq } from "@ai-sdk/groq";
import { recipeSchema } from "@/app/api/structured-data/schema";

export async function POST(req: Request) {
  try {
    const { dish } = await req.json();

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      output: Output.object({
        schema: recipeSchema,
      }),
      prompt: `Generate a recipe for a dish named as ${dish}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating recipe: ", error);
    return new Response("Failed to generate recipe.", { status: 500 });
  }
}
