
import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';

export function GET(req: NextApiRequest) {
  return NextResponse.json({ version: process.env.NEXT_PUBLIC_GIT_COMMIT || 'dev' });
}
