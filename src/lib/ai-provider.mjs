export const PROVIDERS = Object.freeze({
  mock: { label: "Mock (local)" },
  external: { label: "External inference" },
})

const MOCK_RESPONSES = {
  hours: "Mock response: This demo can answer example opening-hours questions; confirm any real hours with the venue.",
  booking: "Mock response: This demo can simulate planning questions, but it cannot create or confirm real bookings.",
  services: "Mock response: This demo can discuss example spa, wellness membership, and promotion topics.",
  default: "Mock response: I am the deterministic local assistant. External inference and network access are disabled in this review mode.",
}

export function getMockResponse(prompt = "") {
  const normalized = prompt.toLowerCase()
  if (/hour|open|close|time/.test(normalized)) return MOCK_RESPONSES.hours
  if (/book|appointment|available/.test(normalized)) return MOCK_RESPONSES.booking
  if (/service|massage|spa|promotion|membership/.test(normalized)) return MOCK_RESPONSES.services
  return MOCK_RESPONSES.default
}

export function sanitizeProviderError() {
  return "The selected inference service could not complete the request."
}

function lastUserText(messages) {
  const message = [...messages].reverse().find(({ role }) => role === "user")
  if (!message) return ""
  if (typeof message.content === "string") return message.content
  return (message.parts ?? [])
    .filter(({ type }) => type === "text")
    .map(({ text }) => text)
    .join(" ")
}

async function requireOk(response) {
  if (!response.ok) throw new Error(`Inference request failed with status ${response.status}`)
  return response.json()
}

function joinUrl(base, path) {
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function createExternalProvider({ key, baseUrl, model, path }) {
  return {
    id: "external",
    label: PROVIDERS.external.label,
    async complete(messages, fetchImpl = fetch) {
      const response = await fetchImpl(joinUrl(baseUrl, path), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: messages.map(({ role, content }) => ({ role, content })),
        }),
      })
      const data = await requireOk(response)
      const text = data?.choices?.[0]?.message?.content
      if (typeof text !== "string") throw new Error("Inference service returned an invalid response")
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

  if (selected !== "external") throw new Error(`Unsupported AI_PROVIDER: ${selected}`)
  if (env.ENABLE_EXTERNAL_AI !== "true") {
    throw new Error("External inference is disabled. Set ENABLE_EXTERNAL_AI=true to opt in.")
  }

  const key = env.EXTERNAL_AI_API_KEY
  const baseUrl = env.EXTERNAL_AI_BASE_URL
  const model = env.EXTERNAL_AI_MODEL
  const path = env.EXTERNAL_AI_CHAT_PATH || "/v1/chat/completions"

  const missing = [
    ["EXTERNAL_AI_API_KEY", key],
    ["EXTERNAL_AI_BASE_URL", baseUrl],
    ["EXTERNAL_AI_MODEL", model],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name)

  if (missing.length > 0) {
    throw new Error(`Missing external inference configuration: ${missing.join(", ")}`)
  }

  return createExternalProvider({ key, baseUrl, model, path })
}
