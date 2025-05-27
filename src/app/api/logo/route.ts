import { getImageURL } from '@/server/queries';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json({ error: 'Missing filename' }, { status: 400 });
  }

  // Simulate getting a CDN URL
  const url = await getImageURL(filename);
  if (!url) {
    console.error("no url was fetched");
    return NextResponse.json({ error: "couldn't fetch image" }, { status: 500 });
  }

  return NextResponse.json({ url });
}
