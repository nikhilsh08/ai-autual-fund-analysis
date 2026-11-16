"use client";
import { load } from '@cashfreepayments/cashfree-js';

let cashfreeInstance: any = null;

export const initializeCashfree = async () => {
  try {
    if (!cashfreeInstance) {
      cashfreeInstance = await load({
        // Must be the same setting the server creates the order with
        // (payment.action.ts), or the payment window rejects the session.
        mode: process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT === 'PRODUCTION' ? 'production' : 'sandbox',
      });
    }
    return cashfreeInstance;
  } catch (error) {
    console.error('Cashfree SDK initialization failed:', error);
    throw new Error('Failed to initialize payment gateway');
  }
};

export const getCashfreeInstance = async () => {
  if (!cashfreeInstance) {
    await initializeCashfree();
  }

  if (!cashfreeInstance) {
    throw new Error('Cashfree SDK failed to initialize');
  }

  return cashfreeInstance;
};
