import { NextRequest } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter(t => now - t < 60000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 60000);
}

export function rateLimit(req: NextRequest, limit: number = 10): boolean {
  const ip = req.headers.get('x-forwarded-for') || 'local-ip';
  const now = Date.now();

  let record = rateLimitMap.get(ip);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }

  record.timestamps = record.timestamps.filter(t => now - t < 60000);

  if (record.timestamps.length >= limit) {
    return false;
  }

  record.timestamps.push(now);
  return true;
}
