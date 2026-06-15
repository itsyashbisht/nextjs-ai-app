import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      prompt,
    });

    result.usage.then((usage) => {
      console.log("Input-tokens", usage.inputTokens);
      console.log("Output-tokens", usage.outputTokens);
      console.log("Total-tokens", usage.totalTokens);
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming response: ", error);
    return new Response("Failed to stream text", { status: 500 });
  }
}
