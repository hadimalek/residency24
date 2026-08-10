/**
 * Authentication for the programmatic Content API.
 *
 * This is a MACHINE-TO-MACHINE credential, deliberately separate from the
 * browser cookie session used by the admin panel (see src/proxy.ts). A caller
 * presents a bearer key that is scoped to ARTICLES ONLY — it never unlocks
 * leads, users, providers, prompts, or any /api/admin route.
 *
 * Keys live in the CONTENT_API_KEY env var (comma-separated for rotation).
 * Comparison is constant-time over a SHA-256 digest so neither the key length
 * nor a partial prefix match leaks through response timing.
 */
import type { NextRequest } from "next/server";
import { createHash, timingSafeEqual } from "node:crypto";
import { apiError } from "./http";
import type { NextResponse } from "next/server";

function sha256(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

function configuredKeys(): string[] {
  return (process.env.CONTENT_API_KEY ?? "")
    .split(",")
    .map((k) => k.trim())
    .filter((k) => k.length > 0 && k !== "GENERATE_A_STRONG_RANDOM_KEY");
}

function constantTimeMatch(candidate: string, keys: string[]): boolean {
  const candidateDigest = sha256(candidate);
  // Always compare against every key so timing does not reveal how many keys
  // exist or which one matched.
  let matched = false;
  for (const key of keys) {
    const keyDigest = sha256(key);
    if (timingSafeEqual(candidateDigest, keyDigest)) matched = true;
  }
  return matched;
}

function extractToken(request: NextRequest): string | null {
  const header = request.headers.get("authorization");
  if (header) {
    const m = header.match(/^Bearer\s+(.+)$/i);
    if (m) return m[1].trim();
  }
  // Convenience fallback for clients that cannot set Authorization.
  const xKey = request.headers.get("x-api-key");
  return xKey ? xKey.trim() : null;
}

/**
 * Returns `null` when the request is authenticated, or a ready-to-return
 * error NextResponse when it is not. Route handlers do:
 *
 *   const denied = authenticateContentRequest(request);
 *   if (denied) return denied;
 */
export function authenticateContentRequest(request: NextRequest): NextResponse | null {
  const keys = configuredKeys();
  if (keys.length === 0) {
    return apiError(
      "not_configured",
      "Content API is disabled: set CONTENT_API_KEY in the environment."
    );
  }

  const token = extractToken(request);
  if (!token) {
    return apiError(
      "unauthorized",
      "Missing credentials. Send 'Authorization: Bearer <CONTENT_API_KEY>'."
    );
  }

  if (!constantTimeMatch(token, keys)) {
    return apiError("unauthorized", "Invalid API key.");
  }

  return null;
}
