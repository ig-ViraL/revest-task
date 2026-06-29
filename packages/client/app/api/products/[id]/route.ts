import { NextRequest, NextResponse } from 'next/server';
import { PRODUCT_SERVICE_URL } from '@/config/services';

const base = (id: string) => `${PRODUCT_SERVICE_URL}/products/${id}`;

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(base(params.id), { cache: 'no-store' });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Product service unavailable' }, { status: 503 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const res = await fetch(base(params.id), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({ message: res.statusText }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Product service unavailable' }, { status: 503 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const res = await fetch(base(params.id), { method: 'DELETE' });
    return new NextResponse(null, { status: res.status });
  } catch {
    return NextResponse.json({ message: 'Product service unavailable' }, { status: 503 });
  }
}
