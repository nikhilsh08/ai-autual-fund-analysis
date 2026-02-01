// checkout with zwitch payment gateway 
// Zwitch payment gateway configuration interface
interface ZwitchConfig {
  apiKey: string;
  merchantId: string;
  environment: 'sandbox' | 'production';
}

// create function to checkout 
export const checkout = async (config: ZwitchConfig, amount: number, currency: string) => {
  // create checkout session
  const session = await fetch('https://api.zwitch.com/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      merchantId: config.merchantId,
      amount,
      currency,
      environment: config.environment,
    }),
  });

  // return checkout session
  return session.json();
};



