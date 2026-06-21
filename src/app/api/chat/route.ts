import { createProvider, sanitizeProviderError } from "@/lib/ai-provider.mjs"

export const runtime = "nodejs"
export const maxDuration = 30

type ChatMessage = {
  role: "user" | "assistant" | "system"
  parts?: Array<{ type: string; text?: string }>
  content?: string
}

function toProviderMessages(messages: ChatMessage[]) {
  return messages.map(({ role, parts, content }) => ({
    role,
    content: content ?? parts?.filter(({ type }) => type === "text").map(({ text }) => text ?? "").join(" ") ?? "",
  }))
}

export async function POST(request: Request) {
  let provider
  try {
    provider = createProvider(process.env)
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Invalid AI provider configuration." },
      { status: 400 },
    )
  }

  const body = await request.json().catch(() => null)
  if (!body || !Array.isArray(body.messages)) {
    return Response.json({ error: "A messages array is required." }, { status: 400 })
  }

  try {
    const text = await provider.complete(toProviderMessages(body.messages))
    return Response.json({ text, provider: provider.label })
  } catch {
    return Response.json({ error: sanitizeProviderError() }, { status: 502 })
  }
}
