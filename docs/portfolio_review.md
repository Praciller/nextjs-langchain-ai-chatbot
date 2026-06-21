# Portfolio review

## Evidence

- `npm test`: deterministic routing and repository-safety checks.
- `npm run generate:local-report`: ignored local transcript evidence with no external calls.
- `npm run guardrails`: tracked-file, secret-marker, artifact, and claim checks.
- `npm run lint` and `npm run build`: static and production-build checks.

## Review boundary

The default `/chat` flow demonstrates the chat UI and provider boundary without requiring cloud services. Authentication, persistence, retrieval, and external model quality are outside this evidence path.

Do not use real customer conversations in fixtures or generated reports. Rotate any credential exposed in chat, logs, or version control before further provider testing.
