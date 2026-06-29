import { NextRequest, NextResponse } from 'next/server';
import { ORDER_SERVICE_URL } from '@/config/services';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const res = await fetch(`${ORDER_SERVICE_URL}/orders/${params.id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
