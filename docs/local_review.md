# Local review

## Quickstart

```powershell
npm ci
$env:AI_PROVIDER="mock"
$env:MOCK_AI_MODE="true"
$env:ENABLE_EXTERNAL_AI="false"
npm test
npm run dev
```

Visit `http://localhost:3000/chat`. No API key, Supabase account, database, or network access is required for chat responses.

Generate deterministic evidence with `npm run generate:local-report`. The ignored report records sample prompts, fixed responses, routing state, and limitations.

Mock mode does not retrieve documents, persist conversations, or create bookings.
