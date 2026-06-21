# Provider routing

| `AI_PROVIDER` | Required configuration | UI label |
| --- | --- | --- |
| `mock` | None | Mock (local) |
| `gemini` | `GEMINI_API_KEY` | Gemini |
| `groq` | `GROQ_API_KEY` | Groq |
| `cerebras` | `CEREBRAS_API_KEY` | Cerebras |
| `qwen36` | `QWEN36_API_KEY`, `QWEN36_BASE_URL` | Qwen 3.6 |

Mock is the default. `MOCK_AI_MODE=true` overrides every external selection. External requests require `ENABLE_EXTERNAL_AI=true`, an explicit non-mock `AI_PROVIDER`, and that provider's key.

Qwen 3.6 uses an OpenAI-compatible chat-completions request. `QWEN36_MODEL` defaults to `qwen3.6-35b-a3b`; `QWEN36_CHAT_COMPLETIONS_PATH` defaults to `/v1/chat/completions`.

Keys are read only by server code. Do not use `NEXT_PUBLIC_` for credentials. Provider failures return a generic message without upstream response bodies, credentials, or authorization headers.
