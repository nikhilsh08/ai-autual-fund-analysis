'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { verifyCashfreePayment } from '@/server/actions/payment.action';

const CallbackContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('order_id');

    const [status, setStatus] = useState<'VERIFYING' | 'SUCCESS' | 'FAILED'>('VERIFYING');
    const [message, setMessage] = useState('Verifying your payment...');

    useEffect(() => {
        if (!orderId) {
            setStatus('FAILED');
            setMessage('Order ID not found');
            return;
        }

        const verify = async () => {
            try {
                const result = await verifyCashfreePayment(orderId);

                if (result.success && result.status === 'PAID') {
                    setStatus('SUCCESS');
                    setMessage('Payment Successful!');
                    // Optional: Redirect after a delay
                    setTimeout(() => router.push('/dashboard'), 3000);
                } else {
                    setStatus('FAILED');
                    setMessage(result.error || 'Payment failed or pending.');
                }
            } catch (error) {
                console.error(error);
                setStatus('FAILED');
                setMessage('An error occurred while verifying payment.');
            }
        };

        verify();
    }, [orderId, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4">
            <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full text-center">
                {status === 'VERIFYING' && (
                    <>
                        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Verifying Payment</h2>
                        <p className="text-zinc-500">Please wait while we confirm your transaction...</p>
                    </>
                )}

                {status === 'SUCCESS' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Payment Successful!</h2>
                        <p className="text-zinc-500 mb-8">Your order has been confirmed. Redirecting you to dashboard...</p>
                        <Button onClick={() => router.push('/dashboard')} className="w-full">
                            Go to Dashboard
                        </Button>
                    </>
                )}

                {status === 'FAILED' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Payment Failed</h2>
                        <p className="text-zinc-500 mb-8">{message}</p>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={() => router.push('/checkout')} className="w-full">
                                Try Again
                            </Button>
                            <Button variant="ghost" onClick={() => router.push('/support')} className="w-full">
                                Contact Support
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default function PaymentCallbackPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
            </div>
        }>
            <CallbackContent />
        </Suspense>
    );
}
