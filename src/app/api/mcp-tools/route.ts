import {
  convertToModelMessages,
  InferUITools,
  stepCountIs,
  streamText,
  tool,
  UIDataTypes,
  UIMessage,
} from "ai";
import { z } from "zod";
import { groq } from "@ai-sdk/groq";
import { createMCPClient } from "@ai-sdk/mcp";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const tools = {
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

    // Creating http-transport for mcp-Client
    const httpTransport = new StreamableHTTPClientTransport(
      new URL("https://app.mockmcp.com/servers/Q2540Hd0XlxP/mcp"),
      {
        requestInit: {
          headers: {
            Authorization:
              "Bearer mcp_m2m_SNjti5RazZ7EJPgaGlruf2f8VnvrzM_g9j2LggaLKzs_a636d0ada5288506",
          },
        },
      },
    );

    const mcpClient = await createMCPClient({
      transport: httpTransport,
    });

    const mcpTools = await mcpClient.tools();
    console.log(mcpTools);

    const result = streamText({
      model: groq("openai/gpt-oss-120b"),
      system:
        "You are an AI assistant , Keep you responses polite and under 4 sentences always.",
      messages: await convertToModelMessages(messages),
      tools: {
        ...mcpTools,
        ...tools,
      },
      stopWhen: stepCountIs(2),
      onFinish: async () => {
        await mcpClient.close();
      },
      onError: async (err) => {
        await mcpClient.close();
        console.error("Error during streaming", err);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Error streaming chat completion: ", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
