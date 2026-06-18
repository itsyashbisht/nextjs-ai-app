# Next.js AI App

A Next.js 16 application that demonstrates practical AI workflows with the Vercel AI SDK, including chat, streaming responses, structured output, and multimodal file analysis.

## Features

- Chat completion API route and UI
- Streaming text responses
- Structured object and array generation with Zod schemas
- Multimodal chat with image and PDF attachments
- Provider examples for Groq, OpenAI, and Google Gemini
- App Router API routes built with native `Request` and `Response`

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Vercel AI SDK
- Groq, OpenAI, and Google AI SDK providers
- Zod

## Project Structure

```text
src/app
├── api
│   ├── chat
│   ├── completion
│   ├── multi-modal-chat
│   ├── stream
│   ├── structured-array
│   └── structured-data
└── ui
    ├── chat
    ├── completion
    ├── multi-modal-chat
    ├── stream
    ├── structured-array
    └── structured-data
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

If `.env.example` is not present, create `.env.local` manually and add the keys for the providers you plan to use:

```env
GROQ_API_KEY=your_groq_api_key
OPENAI_API_KEY=your_openai_api_key
GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_studio_api_key
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Multimodal Chat

The multimodal chat example is available at:

```text
/ui/multi-modal-chat
```

It sends messages to:

```text
/api/multi-modal-chat
```

The current route uses Google Gemini through `@ai-sdk/google`:

```ts
google("gemini-3.5-flash")
```

This model supports image and PDF inputs. A Google AI Studio API key is required in `GOOGLE_GENERATIVE_AI_API_KEY`.

## Notes

- Keep API keys in `.env.local`; environment files are ignored by Git.
- Free provider tiers can change. Check provider pricing and rate limits before production use.
- Review the installed Next.js documentation in `node_modules/next/dist/docs/` before changing route handler conventions.
