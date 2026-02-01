import { useState } from 'react';


export const useZwitchPayment = () => {
  const [isLoading, setIsLoading] = useState(false);

  const initiateZwitch = async (formData: any) => {
    setIsLoading(true);
    try {
      // 1. Get Token & Hash from Next.js API
      const res = await fetch('/api/zwitch/initiate', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);

      // 2. Load Script Dynamically
      if (!window.Layer) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = data.remoteScript;
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }

      // 3. Open Modal
      window.Layer.checkout({
        token: data.paymentToken,
        accesskey: data.accessKey,
      }, async (response: any) => {
        if (response.payment_id) {
          // Verify on server
          const verifyRes = await fetch('/api/zwitch/verify', {
            method: 'POST',
            body: JSON.stringify({ ...data, layer_payment_id: response.payment_id }),
          });
          window.location.href = `/payment/status/${data.orderId}?status=success`;
        }
      }, (err: any) => {
        // toast.error(err.message || "Payment Failed");
        setIsLoading(false);
      });

    } catch (error: any) {
    //   toast.error(error.message);
      setIsLoading(false);
    }
  };

  return { initiateZwitch, isLoading };
};