import { NextRequest, NextResponse } from 'next/server';
import { ORDER_SERVICE_URL } from '@/config/services';

const ORDER_URL = `${ORDER_SERVICE_URL}/orders`;

export async function GET(req: NextRequest) {
  try {
    const qs = new URL(req.url).searchParams.toString();
    const res = await fetch(qs ? `${ORDER_URL}?${qs}` : ORDER_URL, { cache: 'no-store' });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Order service unavailable' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(ORDER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Order service unavailable' }, { status: 503 });
  }
}
