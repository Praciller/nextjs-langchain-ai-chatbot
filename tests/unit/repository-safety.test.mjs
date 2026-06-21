import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

test(".env.example contains local defaults and empty key placeholders", async () => {
  const env = await readFile(".env.example", "utf8")
  assert.match(env, /^AI_PROVIDER=mock$/m)
  assert.match(env, /^MOCK_AI_MODE=true$/m)
  assert.match(env, /^ENABLE_EXTERNAL_AI=false$/m)
  for (const name of ["GEMINI_API_KEY", "GROQ_API_KEY", "CEREBRAS_API_KEY", "QWEN36_API_KEY"]) {
    assert.match(env, new RegExp(`^${name}=$`, "m"))
  }
})

test("provider secrets have no NEXT_PUBLIC client exposure", async () => {
  const clientSource = await readFile("src/components/new-chat.tsx", "utf8")
  assert.doesNotMatch(clientSource, /(GEMINI|GROQ|CEREBRAS|QWEN36|OPENAI)_API_KEY/)
})

test("active chat has no legacy AI SDK or LangChain dependency", async () => {
  const packageJson = JSON.parse(await readFile("package.json", "utf8"))
  for (const name of ["ai", "@ai-sdk/react", "@ai-sdk/langchain", "langchain", "@langchain/core", "@langchain/community", "@langchain/openai"]) {
    assert.equal(packageJson.dependencies?.[name], undefined)
  }
  const clientSource = await readFile("src/components/new-chat.tsx", "utf8")
  assert.doesNotMatch(clientSource, /@ai-sdk|langchain/i)
})

test("user-facing chat source contains no gateway or vendor branding", async () => {
  const clientSource = await readFile("src/components/new-chat.tsx", "utf8")
  const providers = await readFile("src/lib/ai-provider.mjs", "utf8")
  assert.doesNotMatch(clientSource, /gateway|openrouter/i)
  assert.match(providers, /label: "Qwen 3\.6"/)
})
