export type ApiResponse<T> = {
  ok: boolean;
  data: T | null;
  message?: string;
};

export async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<ApiResponse<T>> {
  const res = await fetch(input, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const payload = (await res.json().catch(() => ({}))) as Partial<ApiResponse<T>>;

  if (!res.ok) {
    return {
      ok: false,
      data: null,
      message: payload.message ?? "Request failed",
    };
  }

  return {
    ok: true,
    data: (payload.data ?? null) as T | null,
    message: payload.message,
  };
}
