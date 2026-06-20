import { experimental_transcribe as transcribe } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response("No audio file provided", { status: 400 });
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // The audio property can be a Uint8Array, ArrayBuffer, Buffer, string (base64 encoded audio data), or a URL.
    const transcript = await transcribe({
      model: groq.transcription("whisper-large-v3"),
      audio: uint8Array,
    });

    return Response.json(transcript);
  } catch (error) {
    console.error("Error transcribing audio file: ", error);
    return new Response("Failed transcribing audio file: ", { status: 500 });
  }
}
