import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test(".env.example contains local defaults and empty external placeholders", async () => {
  const env = await readFile(".env.example", "utf8")
  assert.match(env, /^AI_PROVIDER=mock$/m)
  assert.match(env, /^MOCK_AI_MODE=true$/m)
  assert.match(env, /^ENABLE_EXTERNAL_AI=false$/m)
  assert.match(env, /^EXTERNAL_AI_API_KEY=$/m)
  assert.match(env, /^EXTERNAL_AI_BASE_URL=$/m)
  assert.match(env, /^EXTERNAL_AI_MODEL=$/m)
  assert.match(env, /^EXTERNAL_AI_CHAT_PATH=\/v1\/chat\/completions$/m)
})

test("external secrets have no NEXT_PUBLIC client exposure", async () => {
  const clientSource = await readFile("src/components/new-chat.tsx", "utf8")
  assert.doesNotMatch(clientSource, /NEXT_PUBLIC_.*(?:API_KEY|TOKEN|SECRET)/i)
  assert.doesNotMatch(clientSource, /EXTERNAL_AI_API_KEY/)
})

test("active chat has no legacy AI SDK or LangChain dependency", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"))
  for (const name of ["ai", "@ai-sdk/react", "@ai-sdk/langchain", "langchain", "@langchain/core", "@langchain/community", "@langchain/openai"]) {
    assert.equal(packageJson.dependencies?.[name], undefined)
  }
  const clientSource = await readFile("src/components/new-chat.tsx", "utf8")
  assert.doesNotMatch(clientSource, /@ai-sdk|langchain/i)
})

test("user-facing chat and active routing use generic branding", async () => {
  const clientSource = await readFile("src/components/new-chat.tsx", "utf8")
  const routingSource = await readFile("src/lib/ai-provider.mjs", "utf8")
  assert.doesNotMatch(clientSource, /gateway/i)
  assert.match(routingSource, /label: "External inference"/)
  assert.doesNotMatch(routingSource, /vendor-specific/i)
})
