# Next.js AI App

A hands-on learning project that demonstrates common AI patterns with the [Vercel AI SDK](https://sdk.vercel.ai/) on **Next.js 16** and the App Router. Each example pairs a UI page under `/ui/*` with a matching API route under `/api/*`, so you can explore chat, streaming, structured output, tools, multimodal input, speech, and image generation in isolation.

## Highlights

- **14 interactive examples** covering core AI SDK workflows
- **Multiple providers**: Groq, Google Gemini, and ElevenLabs
- **Streaming-first UX** with `useChat`, `DefaultChatTransport`, and UI message parts
- **Tool calling** from simple mocks to multi-step orchestration, live HTTP APIs, and MCP servers
- **Type-safe structured output** with Zod schemas
- **Multimodal chat** with image and PDF attachments via Gemini

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS 4 |
| Language | TypeScript |
| AI | Vercel AI SDK (`ai`, `@ai-sdk/react`) |
| Providers | `@ai-sdk/groq`, `@ai-sdk/google`, `@ai-sdk/elevenlabs`, `@ai-sdk/mcp` |
| Validation | Zod |
| Protocol | Model Context Protocol (`@modelcontextprotocol/sdk`) |

## Examples

| Example | UI Route | API Route | Provider | Description |
| --- | --- | --- | --- | --- |
| Chat | `/ui/chat` | `/api/chat` | Groq | Multi-turn streaming chat |
| Completion | `/ui/completion` | `/api/completion` | Groq | Single-prompt text generation |
| Stream | `/ui/stream` | `/api/stream` | Groq | Token streaming with usage logging |
| Structured Data | `/ui/structured-data` | `/api/structured-data` | Groq | Stream a typed recipe object (Zod) |
| Structured Array | `/ui/structured-array` | `/api/structured-array` | Groq | Stream a typed array of Pokémon |
| Multimodal Chat | `/ui/multi-modal-chat` | `/api/multi-modal-chat` | Google Gemini | Chat with image and PDF attachments |
| Generate Image | `/ui/generate-image` | `/api/generate-image` | Google Gemini | Text-to-image generation |
| Text to Speech | `/ui/text-to-speech` | `/api/text-to-speech` | ElevenLabs | Convert text to audio |
| Transcribe Audio | `/ui/transcribe-audio` | `/api/transcribe-audio` | Groq (Whisper) | Upload audio and get a transcript |
| Tools | `/ui/tools` | `/api/tools` | Groq | Single mock weather tool |
| Multiple Tools | `/ui/multiple-tools` | `/api/multiple-tools` | Groq | Chain location + weather tools |
| API Tool | `/ui/api-tool` | `/api/api-tool` | Groq | Tool that calls WeatherAPI.com |
| MCP Tools | `/ui/mcp-tools` | `/api/mcp-tools` | Groq + MCP | Combine local tools with remote MCP tools |
| Reasoning | `/ui/reasoning` | `/api/reasoning` | Groq | Stream model reasoning summaries alongside replies |

## Project Structure

```text
src/app
├── api/                    # Route handlers (POST endpoints)
│   ├── chat/
│   ├── completion/
│   ├── stream/
│   ├── structured-data/
│   ├── structured-array/
│   ├── multi-modal-chat/
│   ├── generate-image/
│   ├── text-to-speech/
│   ├── transcribe-audio/
│   ├── tools/
│   ├── multiple-tools/
│   ├── api-tool/
│   ├── mcp-tools/
│   └── reasoning/
└── ui/                     # Client pages (one folder per example)
    ├── chat/
    ├── completion/
    ├── stream/
    ├── structured-data/
    ├── structured-array/
    ├── multi-modal-chat/
    ├── generate-image/
    ├── text-to-speech/
    ├── transcribe-audio/
    ├── tools/
    ├── multiple-tools/
    ├── api-tool/
    ├── mcp-tools/
    └── reasoning/
```

## Getting Started

### Prerequisites

- Node.js 20+
- API keys for the providers you plan to use (see below)

### Installation

```bash
git clone https://github.com/itsyashbisht/nextjs-ai-app.git
cd nextjs-ai-app
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```env
# Required for most Groq-powered routes (chat, tools, reasoning, transcription, etc.)
GROQ_API_KEY=your_groq_api_key

# Required for Gemini multimodal chat and image generation
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_studio_api_key

# Required for text-to-speech
ELEVENLABS_API_KEY=your_elevenlabs_api_key

# Required only for the live weather API tool example
WEATHER_API_KEY=your_weatherapi_key
```

> **Note:** The MCP tools example uses a remote MCP server configured in `src/app/api/mcp-tools/route.ts`. Update the server URL and authorization header before running that example in production.

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and navigate to any example under `/ui/<example-name>`.

### Production Build

```bash
npm run build
npm run start
```

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm run start` | Run the production server |
| `npm run lint` | Run ESLint |

## Key Concepts

### Chat and streaming

Client pages use `useChat` from `@ai-sdk/react` with `DefaultChatTransport` pointing at the matching API route. Server routes call `streamText` (or `generateText`) and return `toUIMessageStreamResponse()` for incremental UI updates.

### Structured output

`structured-data` and `structured-array` use `Output.object` and `Output.array` with Zod schemas to stream validated JSON as it is generated.

### Tool calling

Tool examples define tools with the `tool()` helper and Zod `inputSchema`. Multi-step flows use `stopWhen: stepCountIs(n)` to cap agentic loops. The API tool example fetches live weather data; the MCP example merges locally defined tools with tools discovered from an MCP server.

### Reasoning

The reasoning route enables Groq provider options (`reasoningSummary`, `reasoningEffort`) and streams reasoning parts to the client with `sendReasoning: true`.

## Notes

- Keep API keys in `.env.local`. Environment files are gitignored.
- Provider models, quotas, and pricing change over time—verify limits before production use.
- This project targets **Next.js 16**, which may differ from older Next.js documentation. See `node_modules/next/dist/docs/` for the installed version's guides.
- Do not commit secrets. Replace hardcoded MCP credentials with environment variables for deployed environments.

## License

Private project (`"private": true` in `package.json`).
