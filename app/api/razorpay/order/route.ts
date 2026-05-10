import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { ratelimit } from '@/lib/redis';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    // Rate Limiting
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1';
    const { success } = await ratelimit.limit(`razorpay_${ip}`);
    
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { amount, currency = 'INR', receipt } = await req.json();

    const order = await razorpay.orders.create({
      amount: amount * 100, // Amount in paise
      currency,
      receipt,
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
