import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('=== Test endpoint received a request! ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', Object.fromEntries(req.headers.entries()));
  
  try {
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({ 
      message: 'Test endpoint works!',
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing request:', error);
    
    return NextResponse.json({ 
      message: 'Test endpoint works but failed to parse body',
      error: String(error),
      timestamp: new Date().toISOString()
    }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Test endpoint GET works!' });
}
