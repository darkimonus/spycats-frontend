import type { SpyCat, SpyCatCreateInput } from "../types";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || ""; // empty = same origin

type ApiError = Error & { status?: number; data?: unknown };

async function handle<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const body = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const err: ApiError = new Error(
      (isJson && (body?.detail || body?.error)) || res.statusText || "Request failed"
    );
    err.status = res.status;
    err.data = body;
    throw err;
  }
  return body as T;
}

export async function getSpyCats(): Promise<SpyCat[]> {
  const res = await fetch(`${BASE}/cats/spycats/`, { cache: 'no-store' });
  return handle<SpyCat[]>(res);
}

export async function createSpyCat(input: SpyCatCreateInput): Promise<SpyCat> {
  const res = await fetch(`${BASE}/cats/spycats/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  return handle<SpyCat>(res);
}

export async function updateSpyCatSalary(id: number, salary: number): Promise<SpyCat> {
  const res = await fetch(`${BASE}/cats/spycats/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ salary }),
  });
  return handle<SpyCat>(res);
}

export async function deleteSpyCat(id: number): Promise<void> {
  const res = await fetch(`${BASE}/cats/spycats/${id}/`, { method: 'DELETE' });
  await handle(res);
}

