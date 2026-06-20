import { google } from "@ai-sdk/google";
import { generateImage } from "ai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { image } = await generateImage({
      model: google.image("gemini-2.5-flash-image"),
      prompt,
      aspectRatio: "1:1",
    });

    return Response.json({ image: image.base64 });
  } catch (error) {
    console.error("Error generating image", error);
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to generate image",
      },
      { status: 500 },
    );
  }
}
