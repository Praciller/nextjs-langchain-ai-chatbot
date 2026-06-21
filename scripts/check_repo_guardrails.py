from __future__ import annotations

import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BANNED_NAMES = {".env", ".env.local"}
BANNED_SUFFIXES = {".db", ".sqlite", ".sqlite3"}
BANNED_PARTS = {"node_modules", ".next", "out", "build", "uploads", "playwright-report", "test-results", "reports"}
SECRET_PATTERNS = {
    "OpenAI-style key": re.compile(r"\bsk-[A-Za-z0-9_-]{16,}"),
    "Groq-style key": re.compile(r"\bgsk_[A-Za-z0-9_-]{16,}"),
    "Cerebras-style key": re.compile(r"\bcsk-[A-Za-z0-9_-]{16,}"),
    "Google-style key": re.compile(r"\bAIza[A-Za-z0-9_-]{20,}"),
    "bearer token": re.compile(r"Bearer\s+[A-Za-z0-9._~-]{20,}", re.IGNORECASE),
}
UNSAFE_CLAIMS = re.compile(r"\b(production-ready|fully secure|guaranteed safe)\b", re.IGNORECASE)
TEXT_SUFFIXES = {".js", ".mjs", ".ts", ".tsx", ".json", ".md", ".py", ".yml", ".yaml", ".txt", ".csv", ""}


def tracked_files() -> list[Path]:
    output = subprocess.check_output(
        ["git", "ls-files", "--cached", "--others", "--exclude-standard"], cwd=ROOT, text=True
    )
    return [Path(line) for line in output.splitlines() if line]


def main() -> int:
    failures: list[str] = []
    for relative in tracked_files():
        if not (ROOT / relative).exists():
            continue
        if relative.as_posix() == "scripts/check_repo_guardrails.py":
            continue
        lowered_parts = {part.lower() for part in relative.parts}
        if relative.name.lower() in BANNED_NAMES or relative.suffix.lower() in BANNED_SUFFIXES:
            failures.append(f"blocked file: {relative}")
        if lowered_parts & BANNED_PARTS:
            failures.append(f"blocked artifact path: {relative}")
        if relative.suffix.lower() not in TEXT_SUFFIXES:
            continue

        text = (ROOT / relative).read_text(encoding="utf-8", errors="ignore")
        if "tests" not in lowered_parts and relative.name != ".env.example":
            for label, pattern in SECRET_PATTERNS.items():
                if pattern.search(text):
                    failures.append(f"possible {label}: {relative}")
        if relative.suffix.lower() == ".md" and UNSAFE_CLAIMS.search(text):
            failures.append(f"unsafe readiness claim: {relative}")

    if failures:
        print("Guardrails failed:")
        for failure in sorted(set(failures)):
            print(f"- {failure}")
        return 1

    print("Guardrails passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
