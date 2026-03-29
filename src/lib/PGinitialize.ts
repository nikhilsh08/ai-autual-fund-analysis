"use client";
import { load } from '@cashfreepayments/cashfree-js';

let cashfreeInstance: any = null;

export const initializeCashfree = async () => {
  try {
    if (!cashfreeInstance) {
      cashfreeInstance = await load({
        mode: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
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
