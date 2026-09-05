import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const decodedUrl = decodeURIComponent(targetUrl);
    
    // Fetch the HTML from the target URL
    const response = await fetch(decodedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache results for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the target URL' }, { status: response.status });
    }

    const html = await response.text();
    
    // Extract property="og:image" content="..." metadata tag
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i) 
      || html.match(/<meta\s+content=["']([^"']+)["']\s+property=["']og:image["']/i);

    if (ogImageMatch && ogImageMatch[1]) {
      const ogImageUrl = ogImageMatch[1];
      // Redirect to the direct CDN image hotlink
      return NextResponse.redirect(ogImageUrl);
    }

    return NextResponse.json({ error: 'og:image metadata tag not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error proxying Unsplash URL:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
