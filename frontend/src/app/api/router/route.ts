import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, ...params } = body;
    
    // Determine the correct URL based on endpoint type
    let url: string;
    switch (endpoint) {
      case 'price':
        url = 'https://router.gluex.xyz/v1/price';
        break;
      case 'quote':
        url = 'https://router.gluex.xyz/v1/quote';
        break;
      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

    console.log('Proxying request to:', url);
    console.log('Request params:', params);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': '9nFsEzqeRG2oUka2uocRYHUlv6E2RTap',
        'Accept': 'application/json',
      },
      body: JSON.stringify(params)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Router API Error:', response.status, errorText);
      return NextResponse.json(
        { error: `Router API error (${response.status}): ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Router API Response:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Router API proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
