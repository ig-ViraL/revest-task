import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_SERVICE_URL } from '@/config/services';

const PRODUCT_URL = `${PRODUCT_SERVICE_URL}/products`;

export async function GET(req: NextRequest) {
  try {
    const qs = new URL(req.url).searchParams.toString();
    const res = await fetch(qs ? `${PRODUCT_URL}?${qs}` : PRODUCT_URL, { cache: 'no-store' });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Product service unavailable' }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(PRODUCT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Product service unavailable' }, { status: 503 });
  }
}
