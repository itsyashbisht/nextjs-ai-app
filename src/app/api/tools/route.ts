import {
  convertToModelMessages,
  streamText,
  UIMessage,
  tool,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";

const tools = {
  getWeather: tool({
    description: "Get the weather for a location.",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => {
      if (location === "Gotham city") {
        return "70F and cloudy";
      } else if (location === "Metropolis") {
        return "80F and sunny";
      } else {
        return "Unknown";
      }
    },
  }),
};

export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: ChatMessage[] } = await req.json();

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system:
        "You are an AI assistant , Keep you responses polite and under 4 sentences always.",
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion: ", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
