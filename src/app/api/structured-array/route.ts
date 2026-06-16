import { Output, streamText } from "ai";
import { pokemonSchema } from "@/app/api/structured-array/schema";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { type } = await req.json();

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      prompt: `Generate a list of 5 ${type} type pokemon`,
      output: Output.array({
        element: pokemonSchema,
      }),
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error generating pokemon array: ", error);
    return new Response("Failed to generate pokemon array.", { status: 500 });
  }
}
