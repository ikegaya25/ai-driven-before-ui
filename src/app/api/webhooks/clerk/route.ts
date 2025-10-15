import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  console.log('=== Clerk Webhook received! ===');
  
  try {
    const body = await req.json();
    console.log('Webhook body:', JSON.stringify(body, null, 2));
    
    return NextResponse.json({ 
      message: 'Webhook received successfully',
      type: body.type,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Webhook error:', error);
    
    return NextResponse.json({ 
      message: 'Webhook error',
      error: String(error)
    }, { status: 400 });
  }
}


