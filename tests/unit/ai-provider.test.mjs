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

test("mock mode overrides external provider selection", () => {
  const provider = createProvider({ ...mockEnv, AI_PROVIDER: "qwen36" })
  assert.equal(provider.id, "mock")
})

for (const [id, key] of [
  ["gemini", "GEMINI_API_KEY"],
  ["groq", "GROQ_API_KEY"],
  ["cerebras", "CEREBRAS_API_KEY"],
  ["qwen36", "QWEN36_API_KEY"],
]) {
  test(`${id} requires explicit external opt-in and ${key}`, () => {
    assert.throws(
      () => createProvider({ AI_PROVIDER: id, ENABLE_EXTERNAL_AI: "false", [key]: "test-key" }),
      /External AI is disabled/,
    )
    assert.throws(
      () => createProvider({ AI_PROVIDER: id, ENABLE_EXTERNAL_AI: "true" }),
      new RegExp(key),
    )
  })
}

test("Qwen uses its public label without gateway branding", () => {
  assert.equal(PROVIDERS.qwen36.label, "Qwen 3.6")
  assert.doesNotMatch(PROVIDERS.qwen36.label, /gateway|vendor/i)
})

test("Qwen uses the configured OpenAI-compatible endpoint without exposing its key in output", async () => {
  const requests = []
  const provider = createProvider({
    AI_PROVIDER: "qwen36",
    MOCK_AI_MODE: "false",
    ENABLE_EXTERNAL_AI: "true",
    QWEN36_API_KEY: "test-only-key",
    QWEN36_BASE_URL: "https://qwen.example",
    QWEN36_MODEL: "qwen3.6-35b-a3b",
  })
  const response = await provider.complete(
    [{ role: "user", content: "hello" }],
    async (url, init) => {
      requests.push({ url, init })
      return new Response(JSON.stringify({ choices: [{ message: { content: "safe answer" } }] }))
    },
  )

  assert.equal(response, "safe answer")
  assert.equal(requests[0].url, "https://qwen.example/v1/chat/completions")
  assert.equal(JSON.parse(requests[0].init.body).model, "qwen3.6-35b-a3b")
  assert.doesNotMatch(response, /test-only-key/)
})

test("Qwen accepts a custom chat-completions path", async () => {
  let requestedUrl
  const provider = createProvider({
    AI_PROVIDER: "qwen36",
    ENABLE_EXTERNAL_AI: "true",
    QWEN36_API_KEY: "test-only-key",
    QWEN36_BASE_URL: "https://qwen.example/api",
    QWEN36_CHAT_COMPLETIONS_PATH: "/chat",
  })
  await provider.complete([{ role: "user", content: "hello" }], async (url) => {
    requestedUrl = url
    return new Response(JSON.stringify({ choices: [{ message: { content: "ok" } }] }))
  })
  assert.equal(requestedUrl, "https://qwen.example/api/chat")
})

test("provider errors are sanitized", () => {
  const error = sanitizeProviderError(new Error("Bearer secret-value failed"))
  assert.equal(error, "The selected AI provider could not complete the request.")
  assert.doesNotMatch(error, /secret-value/)
})
