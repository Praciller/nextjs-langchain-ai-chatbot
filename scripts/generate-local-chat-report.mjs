import { mkdir, writeFile } from "node:fs/promises"

import { getMockResponse } from "../src/lib/ai-provider.mjs"

const prompts = ["What are your opening hours?", "Can I book an appointment?", "What services are available?"]
const rows = prompts.map((prompt) => `| ${prompt} | ${getMockResponse(prompt)} |`).join("\n")
const report = `# Local Chat Report

- Mode: mock
- Network access: disabled
- API key required: no
- Result: deterministic responses generated locally

| User prompt | Assistant response |
| --- | --- |
${rows}

## Provider routing

Mock is the default. Gemini, Groq, Cerebras, and Qwen 3.6 require explicit selection, \`ENABLE_EXTERNAL_AI=true\`, and their server-side credentials. \`MOCK_AI_MODE=true\` overrides external selection.

## Limitations

Mock responses cover a small fixed set of portfolio-review scenarios. They do not perform retrieval, create bookings, or call an external model.
`

await mkdir("reports", { recursive: true })
await writeFile("reports/local_chat_report.md", report, "utf8")
console.log("Generated reports/local_chat_report.md")
