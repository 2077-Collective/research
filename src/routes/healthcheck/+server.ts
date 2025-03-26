import { json } from '@sveltejs/kit';

export function GET() {
  return json({ status: 'ok' }, { status: 200 });
}

export function HEAD() {
  return new Response(null, { status: 200 });
}