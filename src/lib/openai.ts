import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import OpenAI from "openai";

function readEnvLocalValue(name: string): string | undefined {
  try {
    const path = join(process.cwd(), ".env.local");
    if (!existsSync(path)) return undefined;

    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      if (!trimmed.startsWith(`${name}=`)) continue;

      return trimmed
        .slice(name.length + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
    }
  } catch {
    return undefined;
  }

  return undefined;
}

function resolveOpenAIApiKey(): string | undefined {
  // Prefer project-specific name so Cursor's injected OPENAI_API_KEY cannot win.
  const projectKey =
    process.env.NGARIS_OPENAI_API_KEY?.trim() ||
    readEnvLocalValue("NGARIS_OPENAI_API_KEY");
  if (projectKey) return projectKey;

  // Next.js lets shell env override .env.local. Cursor sets OPENAI_API_KEY in the
  // IDE terminal, so read the file value before falling back to process.env.
  return (
    readEnvLocalValue("OPENAI_API_KEY") || process.env.OPENAI_API_KEY?.trim()
  );
}

export function getOpenAIClient() {
  const apiKey = resolveOpenAIApiKey();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  return new OpenAI({ apiKey });
}

export const CHAT_MODEL =
  process.env.OPENAI_CHAT_MODEL?.trim() ||
  readEnvLocalValue("OPENAI_CHAT_MODEL") ||
  "gpt-4o-mini";
