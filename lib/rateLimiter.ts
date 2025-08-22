type WindowRecord = { timestamps: number[] };

const windowStore = new Map<string, WindowRecord>();

export function isRateLimited(
  key: string,
  windowMs: number,
  maxRequests: number
): { limited: boolean; remaining: number } {
  const now = Date.now();
  const windowStart = now - windowMs;
  const record = windowStore.get(key) ?? { timestamps: [] };
  // purge old
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
  if (record.timestamps.length >= maxRequests) {
    windowStore.set(key, record);
    return { limited: true, remaining: 0 };
  }
  record.timestamps.push(now);
  windowStore.set(key, record);
  return { limited: false, remaining: Math.max(0, maxRequests - record.timestamps.length) };
}

export function getClientKeyFromRequestHeaders(headers: Partial<Record<string, string | string[] | undefined>>): string {
  const forwardedFor = headers["x-forwarded-for"];
  const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
  const remote = (headers["x-real-ip"] as string | undefined) ?? ip ?? "unknown";
  return `ip:${remote}`;
}




