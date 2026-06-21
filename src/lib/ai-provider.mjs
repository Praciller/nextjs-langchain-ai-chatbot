export const PROVIDERS = Object.freeze({
  mock: { label: "Mock (local)" },
  gemini: { label: "Gemini" },
  groq: { label: "Groq" },
  cerebras: { label: "Cerebras" },
  qwen36: { label: "Qwen 3.6" },
})

const EXTERNAL_CONFIG = {
  gemini: { key: "GEMINI_API_KEY" },
  groq: { key: "GROQ_API_KEY" },
  cerebras: { key: "CEREBRAS_API_KEY" },
  qwen36: { key: "QWEN36_API_KEY" },
}

const MOCK_RESPONSES = {
  hours: "Mock response: The wellness studio is open daily from 9:00 AM to 9:00 PM.",
  booking: "Mock response: This local demo cannot create bookings. Please contact the studio to confirm availability.",
  services: "Mock response: The sample knowledge base includes massage, spa, wellness membership, and promotion information.",
  default: "Mock response: I am the deterministic local assistant. External AI and network access are disabled in this review mode.",
}

export function getMockResponse(prompt = "") {
  const normalized = prompt.toLowerCase()
  if (/hour|open|close|time/.test(normalized)) return MOCK_RESPONSES.hours
  if (/book|appointment|available/.test(normalized)) return MOCK_RESPONSES.booking
  if (/service|massage|spa|promotion|membership/.test(normalized)) return MOCK_RESPONSES.services
  return MOCK_RESPONSES.default
}

export function sanitizeProviderError() {
  return "The selected AI provider could not complete the request."
}

function lastUserText(messages) {
  const message = [...messages].reverse().find(({ role }) => role === "user")
  if (!message) return ""
  if (typeof message.content === "string") return message.content
  return (message.parts ?? []).filter(({ type }) => type === "text").map(({ text }) => text).join(" ")
}

function requireOk(response) {
  if (!response.ok) throw new Error(`Provider request failed with status ${response.status}`)
  return response.json()
}

function joinUrl(base, path) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function openAICompatibleProvider({ id, label, key, baseUrl, model, path = "/v1/chat/completions" }) {
  return {
    id,
    label,
    async complete(messages, fetchImpl = fetch) {
      const response = await fetchImpl(joinUrl(baseUrl, path), {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model, messages: messages.map(({ role, content }) => ({ role, content })) }),
      })
      const data = await requireOk(response)
      const text = data?.choices?.[0]?.message?.content
      if (typeof text !== "string") throw new Error("Provider returned an invalid response")
      return text
    },
  }
}

export function createProvider(env = process.env) {
  const selected = (env.AI_PROVIDER || "mock").toLowerCase()
  const mockMode = env.MOCK_AI_MODE === "true"
  if (mockMode || selected === "mock") {
    return {
      id: "mock",
      label: PROVIDERS.mock.label,
      noNetwork: true,
      complete: async (messages) => getMockResponse(lastUserText(messages)),
    }
  }

  if (!EXTERNAL_CONFIG[selected]) throw new Error(`Unsupported AI_PROVIDER: ${selected}`)
  if (env.ENABLE_EXTERNAL_AI !== "true") throw new Error("External AI is disabled. Set ENABLE_EXTERNAL_AI=true to opt in.")

  const keyName = EXTERNAL_CONFIG[selected].key
  const key = env[keyName]
  if (!key) throw new Error(`${keyName} is required when AI_PROVIDER=${selected}`)

  if (selected === "gemini") {
    const model = env.GEMINI_MODEL || "gemini-2.5-flash"
    return {
      id: selected,
      label: PROVIDERS.gemini.label,
      async complete(messages, fetchImpl = fetch) {
        const response = await fetchImpl(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: lastUserText(messages) }] }] }),
          },
        )
        const data = await requireOk(response)
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
        if (typeof text !== "string") throw new Error("Provider returned an invalid response")
        return text
      },
    }
  }

  const config = {
    groq: {
      baseUrl: "https://api.groq.com/openai",
      model: env.GROQ_MODEL || "llama-3.3-70b-versatile",
    },
    cerebras: {
      baseUrl: "https://api.cerebras.ai",
      model: env.CEREBRAS_MODEL || "llama3.1-8b",
    },
    qwen36: {
      baseUrl: env.QWEN36_BASE_URL,
      model: env.QWEN36_MODEL || "qwen3.6-35b-a3b",
      path: env.QWEN36_CHAT_COMPLETIONS_PATH || "/v1/chat/completions",
    },
  }[selected]

  if (!config.baseUrl) throw new Error(`${selected === "qwen36" ? "QWEN36_BASE_URL" : "Provider base URL"} is required`)
  return openAICompatibleProvider({ id: selected, label: PROVIDERS[selected].label, key, ...config })
}
