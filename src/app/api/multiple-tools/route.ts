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
  getLocation: tool({
    description: "Get the location of a person with a name as input.",
    inputSchema: z.object({
      name: z
        .string()
        .describe("The name of the person whose location you need to get."),
    }),
    execute: async ({ name }) => {
      if (name === "Bruce Wayne") {
        return "Gotham City";
      } else if (name === "Clark Kent") {
        return "Metropolis";
      } else {
        return "Unknown";
      }
    },
  }),

  getWeather: tool({
    description: "Get the weather for a location.",
    inputSchema: z.object({
      location: z.string().describe("The location to get the weather for"),
    }),
    execute: async ({ location }) => {
      if (location === "Gotham City") {
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
      model: groq("openai/gpt-oss-120b"),
      system:
        "You are an AI assistant , Keep you responses polite and under 4 sentences always.",
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(3),
      //   Step-1 : Get the User's location
      //   Step-2 : Get the weather of that location
      //   Step-3 : Process and generate AI-response
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion: ", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
