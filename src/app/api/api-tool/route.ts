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
    description: "Get the weather for a location",
    inputSchema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
    execute: async ({ city }) => {
      const response = await fetch(
        `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}`,
      );
      const data = await response.json();
      const weatherData = {
        location: {
          name: data.location.name,
          country: data.location.country,
          localtime: data.location.localtime,
        },
        current: {
          temp_c: data.current.temp_c,
          condition: {
            text: data.current.condition.text,
            code: data.current.condition.code,
          },
        },
      };
      return weatherData;
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
