import { convertToModelMessages, streamText, UIMessage } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: groq("openai/gpt-oss-20b"),
      system:
        "You are a helpful coding assistant. " +
        "Keep responses under 5 sentences and focus on practical examples.",
      messages: await convertToModelMessages(messages),
      providerOptions: {
        groq: {
          reasoningSummary: "auto",
          reasoningEffort: "low",
        },
      },
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
    });
  } catch (error) {
    console.error("Error streaming chat completion: ", error);
    return new Response("Failed to stream chat completion", { status: 500 });
  }
}
