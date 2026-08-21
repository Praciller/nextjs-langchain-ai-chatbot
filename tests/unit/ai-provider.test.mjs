import assert from "node:assert/strict"
import test from "node:test"

import {
  createProvider,
  getMockResponse,
  PROVIDERS,
  sanitizeProviderError,
} from "../../src/lib/ai-provider.mjs"

const mockEnv = {
  AI_PROVIDER: "mock",
  MOCK_AI_MODE: "true",
  ENABLE_EXTERNAL_AI: "false",
}

test("mock responses are deterministic and need no key", () => {
  const first = getMockResponse("What are your opening hours?")
  assert.equal(first, getMockResponse("What are your opening hours?"))
  assert.match(first, /mock/i)
  assert.equal(createProvider(mockEnv).id, "mock")
})

test("mock responses keep booking and retrieval boundaries explicit", () => {
  const booking = getMockResponse("Can I book an appointment?")
  const services = getMockResponse("Tell me about spa services")

  assert.match(booking, /cannot create or confirm real bookings/i)
  assert.doesNotMatch(services, /knowledge base|retrieval|RAG|vector/i)
})

test("mock mode overrides external selection", () => {
  const provider = createProvider({ ...mockEnv, AI_PROVIDER: "external" })
  assert.equal(provider.id, "mock")
})

test("external mode requires explicit opt-in", () => {
  assert.throws(
    () =>
      createProvider({
        AI_PROVIDER: "external",
        MOCK_AI_MODE: "false",
        ENABLE_EXTERNAL_AI: "false",
        EXTERNAL_AI_API_KEY: "test-key",
        EXTERNAL_AI_BASE_URL: "https://inference.example.test",
        EXTERNAL_AI_MODEL: "chat-model",
      }),
    /External inference is disabled/,
  )
})

test("external mode requires complete configuration", () => {
  assert.throws(
    () =>
      createProvider({
        AI_PROVIDER: "external",
        MOCK_AI_MODE: "false",
        ENABLE_EXTERNAL_AI: "true",
      }),
    /Missing external inference configuration/,
  )
})

test("external mode uses the configured chat endpoint without exposing its key", async () => {
  const requests = []
  const provider = createProvider({
    AI_PROVIDER: "external",
    MOCK_AI_MODE: "false",
    ENABLE_EXTERNAL_AI: "true",
    EXTERNAL_AI_API_KEY: "test-only-key",
    EXTERNAL_AI_BASE_URL: "https://inference.example.test/api",
    EXTERNAL_AI_MODEL: "chat-model",
  })
  const response = await provider.complete(
    [{ role: "user", content: "hello" }],
    async (url, init) => {
      requests.push({ url, init })
      return new Response(JSON.stringify({ choices: [{ message: { content: "safe answer" } }] }))
    },
  )

  assert.equal(response, "safe answer")
  assert.equal(requests[0].url, "https://inference.example.test/api/v1/chat/completions")
  assert.equal(JSON.parse(requests[0].init.body).model, "chat-model")
  assert.doesNotMatch(response, /test-only-key/)
})

test("external mode accepts a custom chat path", async () => {
  let requestedUrl
  const provider = createProvider({
    AI_PROVIDER: "external",
    MOCK_AI_MODE: "false",
    ENABLE_EXTERNAL_AI: "true",
    EXTERNAL_AI_API_KEY: "test-only-key",
    EXTERNAL_AI_BASE_URL: "https://inference.example.test/api",
    EXTERNAL_AI_MODEL: "chat-model",
    EXTERNAL_AI_CHAT_PATH: "/messages",
  })
  await provider.complete([{ role: "user", content: "hello" }], async (url) => {
    requestedUrl = url
    return new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }))
  })
  assert.equal(requestedUrl, "https://inference.example.test/api/messages")
})

test("public labels remain generic", () => {
  assert.equal(PROVIDERS.mock.label, "Mock (local)")
  assert.equal(PROVIDERS.external.label, "External inference")
})

test("provider errors are sanitized", () => {
  const error = sanitizeProviderError(new Error("Bearer secret-value failed"))
  assert.equal(error, "The selected inference service could not complete the request.")
  assert.doesNotMatch(error, /secret-value/)
})
