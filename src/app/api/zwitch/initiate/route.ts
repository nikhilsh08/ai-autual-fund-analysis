import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLayerHash } from '@/Utils/zwitch-utils';
import { AuthService } from '@/server/auth/services/auth.service';
const ZWITCH_ACCESS_KEY = process.env.ZWITCH_API_KEY;
const ZWITCH_SECRET_KEY = process.env.ZWITCH_API_SECRET_KEY;
const ZWITCH_ENV = process.env.ZWITCH_ENVIRONMENT || "test";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, name, email, phone, city, Event } = body;

    const merchantOrderId = `ORDER_ZW_${uuidv4()}`;
    const baseUrl = ZWITCH_ENV === 'live' 
      ? "https://icp-api.bankopen.co/api" 
      : "https://sandbox-icp-api.bankopen.co/api";

    // 1. Create Payment Token (Server-to-Server)
    const tokenRes = await fetch(`${baseUrl}/payment_token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ZWITCH_ACCESS_KEY}:${ZWITCH_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount.toString(),
        currency: 'INR',
        name: name,
        email_id: email,
        contact_number: phone,
        mtx: merchantOrderId,
      }),
    });

    const tokenDetails = await tokenRes.json();

    // 2. Generate Hash for Frontend Security
    const hashData = {
      layer_pay_token_id: tokenDetails.id,
      layer_order_amount: tokenDetails.amount,
      tranid: merchantOrderId
    };
    const hash = createLayerHash(hashData, ZWITCH_ACCESS_KEY!, ZWITCH_SECRET_KEY!);

    // 3. (Optional) Save Pending User/Transaction to MongoDB/Prisma here
    // await prisma.user.upsert(...)
    // const user = AuthService.getUserByEmail(email);


    return NextResponse.json({
      success: true,
      paymentToken: tokenDetails.id,
      orderId: merchantOrderId,
      amount: tokenDetails.amount,
      hash,
      accessKey: ZWITCH_ACCESS_KEY,
      remoteScript: ZWITCH_ENV === 'live'
        ? 'https://payments.open.money/layer'
        : 'https://sandbox-payments.open.money/layer'
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}