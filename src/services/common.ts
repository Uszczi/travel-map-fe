export interface HttpOpts {
  signal?: AbortSignal;
  credentials?: RequestCredentials;
  headers?: HeadersInit;
}

interface HttpErrorBody {
  detail: string;
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public body: HttpErrorBody,
  ) {
    super(`HTTP ${status}`);
  }
}

export async function postForm<T>(url: string, form: Record<string, string>, opts: HttpOpts = {}): Promise<T> {
  const body = new URLSearchParams(form).toString();

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Accept: 'application/json',
      ...opts.headers,
    },
    credentials: opts.credentials ?? 'include',
    body,
    signal: opts.signal,
  });

  const payload = await res.json();

  if (!res.ok) throw new HttpError(res.status, payload);
  return payload as T;
}

export async function postJson<T>(url: string, body: Record<string, string>, opts: HttpOpts = {}): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
      Accept: 'application/json',
      ...opts.headers,
    },
    credentials: opts.credentials ?? 'include',
    body: JSON.stringify(body),
    signal: opts.signal,
  });

  const payload = await res.json();

  if (!res.ok) throw new HttpError(res.status, payload);
  return payload as T;
}
