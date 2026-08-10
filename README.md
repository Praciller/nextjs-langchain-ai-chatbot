# Wellness AI Assistant

Local-first Next.js chatbot demonstrating deterministic mock chat and optional multi-provider routing. The default review path requires no API key, Supabase project, database, or network call.

Public scope: this is a mock-first chat demonstration. The default path does not implement retrieval, bookings, or a deployed provider-backed production service.

## Local review

```powershell
npm ci
$env:AI_PROVIDER="mock"
$env:MOCK_AI_MODE="true"
$env:ENABLE_EXTERNAL_AI="false"
npm test
npm run dev
```

Open `http://localhost:3000/chat`. Mock responses are deterministic and remain on the local machine.

## Verification

```powershell
npm test
npm run lint
npm run build
npm run guardrails
npm run generate:local-report
```

The generated evidence file is `reports/local_chat_report.md` and is intentionally ignored by Git.

## Optional providers

Copy `.env.example` to `.env.local`, set `MOCK_AI_MODE=false`, set `ENABLE_EXTERNAL_AI=true`, select one `AI_PROVIDER`, and add only that provider's server-side key. Supported values are `gemini`, `groq`, `cerebras`, and `qwen36` (shown in the UI as **Qwen 3.6**).

External providers are disabled unless explicitly selected and enabled. Never prefix provider keys with `NEXT_PUBLIC_`.

## Scope and limitations

- Mock mode uses fixed responses; it does not perform retrieval or bookings.
- External calls send chat content to the selected provider under that provider's terms.
- Authentication and persistence are not part of the local chat evidence path.
- This portfolio project is not a compliance or safety guarantee.

See [local review](docs/local_review.md), [provider routing](docs/provider_routing.md), and [portfolio review](docs/portfolio_review.md).

## License

MIT
