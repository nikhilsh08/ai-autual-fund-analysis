import { NextResponse } from 'next/server';
import { prisma } from '@/lib/dbPrisma';
import { getLayerPaymentDetails, verifyLayerHash } from '@/Utils/zwitch-utils';

const ZWITCH_ACCESS_KEY = process.env.ZWITCH_API_KEY;
const ZWITCH_SECRET_KEY = process.env.ZWITCH_API_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      layer_payment_id, 
      layer_pay_token_id, 
      tranid, 
      layer_order_amount, 
      hash 
    } = body;

    // 1. Validate required fields
    if (!layer_payment_id || !layer_pay_token_id || !tranid || !hash) {
      return NextResponse.json({ success: false, error: 'Missing payment details' }, { status: 400 });
    }

    if (!ZWITCH_ACCESS_KEY || !ZWITCH_SECRET_KEY) {
      return NextResponse.json({ success: false, error: 'Server configuration error' }, { status: 500 });
    }

    // 2. Verify integrity with Hash
    const hashData = { layer_pay_token_id, layer_order_amount, tranid };
    const isValidHash = verifyLayerHash(hashData, hash, ZWITCH_ACCESS_KEY, ZWITCH_SECRET_KEY);

    if (!isValidHash) {
      return NextResponse.json({ success: false, error: 'Security hash mismatch' }, { status: 400 });
    }

    // 3. Fetch real-time status from Zwitch API
    const paymentDetails = await getLayerPaymentDetails(layer_payment_id);

    // 4. Verification Checks
    if (paymentDetails.payment_token?.id !== layer_pay_token_id) {
      return NextResponse.json({ success: false, error: 'Token ID mismatch' }, { status: 400 });
    }

    if (parseFloat(paymentDetails.amount) !== parseFloat(layer_order_amount)) {
      return NextResponse.json({ success: false, error: 'Amount mismatch' }, { status: 400 });
    }

    // 5. Update Database (Using Prisma/MongoDB pattern from your projects)
    const isSuccess = paymentDetails.status === 'captured' || paymentDetails.payment_token?.status === 'paid';

    // Find the user/order in your database
    // const updatedUser = await prisma.user.update({
    //   where: { email: 'user@example.com' }, // Replace with actual lookup
    //   data: { 
    //     isSubscribed: isSuccess,
    //     subscriptionExpiry: isSuccess ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined
    //   }
    // });

    return NextResponse.json({
      success: true,
      status: paymentDetails.status,
      message: 'Payment verified successfully',
      // user: {
      //   email: updatedUser.email,
      //   name: updatedUser.name
      // }
    });

  } catch (error: any) {
    console.error('Verification Error:', error.message);
    return NextResponse.json({ success: false, error: 'Internal verification failed' }, { status: 500 });
  }
}