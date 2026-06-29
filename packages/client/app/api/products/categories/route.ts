import { NextResponse } from 'next/server';
import { PRODUCT_SERVICE_URL } from '@/config/services';

export async function GET() {
  try {
    const res = await fetch(`${PRODUCT_SERVICE_URL}/products/categories`, { cache: 'no-store' });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Product service unavailable' }, { status: 503 });
  }
}
