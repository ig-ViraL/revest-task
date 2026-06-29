import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_SERVICE_URL } from '@/config/services';

const PRODUCT_URL = `${PRODUCT_SERVICE_URL}/products`;

export async function GET() {
  const res = await fetch(PRODUCT_URL, { cache: 'no-store' });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(PRODUCT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
