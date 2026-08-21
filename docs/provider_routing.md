# Inference routing

| `AI_PROVIDER` | Required configuration | UI label |
| --- | --- | --- |
| `mock` | None | Mock (local) |
| `external` | `EXTERNAL_AI_API_KEY`, `EXTERNAL_AI_BASE_URL`, `EXTERNAL_AI_MODEL` | External inference |

Mock is the default. `MOCK_AI_MODE=true` overrides external selection. External requests require `ENABLE_EXTERNAL_AI=true`, `AI_PROVIDER=external`, and complete server-side endpoint configuration.

The external adapter sends a generic chat request to `EXTERNAL_AI_BASE_URL` plus `EXTERNAL_AI_CHAT_PATH`, which defaults to `/v1/chat/completions`. The configured service must return generated text at `choices[0].message.content`.

Keys are read only by server code. Do not use `NEXT_PUBLIC_` for credentials. External failures return a generic message without upstream response bodies, credentials, or authorization headers.
