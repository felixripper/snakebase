import { NextRequest, NextResponse } from 'next/server';
import { kvSet } from '@/lib/redis';
import { buildSignMessage, generateNonce } from '@/lib/wallet-auth';

// Stores: auth:nonce:<address> -> JSON { nonce, issuedAt }

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    if (!address || typeof address !== 'string') {
      return NextResponse.json({ success: false, message: 'address required' }, { status: 400 });
    }
    const addr = address.toLowerCase();
    const nonce = generateNonce();
    const issuedAt = Date.now();
    await kvSet(`auth:nonce:${addr}`, JSON.stringify({ nonce, issuedAt }));

    const message = buildSignMessage(addr, nonce, issuedAt);
    return NextResponse.json({ success: true, address: addr, nonce, issuedAt, message });
  } catch {
    return NextResponse.json({ success: false, message: 'failed to create nonce' }, { status: 500 });
  }
}
