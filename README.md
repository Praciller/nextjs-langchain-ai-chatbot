# Wellness AI Assistant

Local-first Next.js assistant demonstrating deterministic mock chat and optional external inference through a vendor-neutral server-side interface. The default review path requires no API key, hosted database, or network call for chat responses.

Public scope: this is a mock-first chat demonstration. The default path does not implement retrieval, bookings, or a deployed production inference service.

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

## Optional external inference

Copy `.env.example` to `.env.local`, then set the explicit opt-in values:

```text
AI_PROVIDER=external
MOCK_AI_MODE=false
ENABLE_EXTERNAL_AI=true
EXTERNAL_AI_API_KEY=your_server_side_key_here
EXTERNAL_AI_BASE_URL=https://your-inference-endpoint.example
EXTERNAL_AI_CHAT_PATH=/v1/chat/completions
EXTERNAL_AI_MODEL=your_chat_model
```

The endpoint must accept the documented chat request shape and return generated text at `choices[0].message.content`. External inference remains disabled unless explicitly selected and enabled. Never prefix credentials with `NEXT_PUBLIC_`.

## Scope and limitations

- Mock mode uses fixed responses; it does not perform retrieval or bookings.
- External calls send chat content to the configured inference service under that service's terms.
- Authentication and persistence are not part of the local chat evidence path.
- External model quality, safety, availability, and retention policy depend on the configured service.
- This portfolio project is not a compliance or safety guarantee.

See [local review](docs/local_review.md), [inference routing](docs/provider_routing.md), and [portfolio review](docs/portfolio_review.md).

## License

MIT
