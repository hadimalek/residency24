/**
 * Consistent JSON envelope for the programmatic Content API (/api/content/*).
 *
 * Success:  { "data": <payload>, "meta"?: <pagination/etc> }
 * Error:    { "error": { "code": "string", "message": "string", "details"?: any } }
 *
 * Keeping one shape across every endpoint makes the API predictable for an
 * automated caller (an AI agent / MCP server) that parses responses generically.
 */
import { NextResponse } from "next/server";

export type ApiErrorCode =
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "validation_error"
  | "conflict"
  | "unsupported_media_type"
  | "payload_too_large"
  | "bad_request"
  | "server_error"
  | "not_configured";

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  validation_error: 422,
  conflict: 409,
  unsupported_media_type: 415,
  payload_too_large: 413,
  bad_request: 400,
  server_error: 500,
  not_configured: 503,
};

export function ok<T>(data: T, meta?: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(meta === undefined ? { data } : { data, meta }, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init?.headers ?? {}) },
  });
}

export function created<T>(data: T): NextResponse {
  return ok(data, undefined, { status: 201 });
}

/**
 * A typed, client-safe error the domain layer can throw. `guard` translates it
 * into the standard error envelope, so services signal 4xx conditions without
 * importing NextResponse or returning ad-hoc result objects.
 */
export class ContentApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly details?: unknown
  ) {
    super(message);
    this.name = "ContentApiError";
  }
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  details?: unknown
): NextResponse {
  return NextResponse.json(
    { error: { code, message, ...(details === undefined ? {} : { details }) } },
    { status: STATUS_BY_CODE[code], headers: { "Cache-Control": "no-store" } }
  );
}

/** Turn a ZodError-like `issues` array into a compact validation payload. */
export function validationError(
  issues: ReadonlyArray<{ path: ReadonlyArray<PropertyKey>; message: string }>
): NextResponse {
  return apiError(
    "validation_error",
    "Request body failed validation.",
    issues.map((i) => ({
      field: i.path.map((p) => String(p)).join(".") || "(root)",
      message: i.message,
    }))
  );
}

/** Wrap a route handler so any thrown error becomes a clean 500 envelope. */
export async function guard(
  handler: () => Promise<NextResponse>,
  context: string
): Promise<NextResponse> {
  try {
    return await handler();
  } catch (err) {
    if (err instanceof ContentApiError) {
      return apiError(err.code, err.message, err.details);
    }
    console.error(`[content-api] ${context} error:`, err);
    const message = err instanceof Error ? err.message : "Unexpected server error";
    return apiError("server_error", message);
  }
}
