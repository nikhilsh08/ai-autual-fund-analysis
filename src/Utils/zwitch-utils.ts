import crypto from 'crypto';
import axios from 'axios';

const ZWITCH_ACCESS_KEY = process.env.ZWITCH_API_KEY 
const ZWITCH_SECRET_KEY = process.env.ZWITCH_API_SECRET_KEY 
const ZWITCH_ENVIRONMENT = process.env.ZWITCH_ENVIRONMENT || "test";
const BASE_URL_SANDBOX = "https://sandbox-icp-api.bankopen.co/api";
const BASE_URL_LIVE = "https://icp-api.bankopen.co/api";

export function ksort(obj: any) {
  const keys = Object.keys(obj).sort();
  const sortedObj: any = {};
  for (const key of keys) {
    sortedObj[key] = obj[key];
  }
  return sortedObj;
}

export function createLayerHash(data: any, accesskey: string, secretkey: string): string {
  const sortedData = ksort(data);
  let hashString = accesskey;
  
  Object.keys(sortedData).forEach((key) => {
    hashString += '|' + sortedData[key];
  });
  
  const hash = crypto.createHash('sha256').update(hashString).digest('hex');
  return hash;
}

export function verifyLayerHash(data: any, recHash: string, accesskey: string, secretkey: string): boolean {
  const genHash = createLayerHash(data, accesskey, secretkey);
  return genHash === recHash;
}

// Create payment token - FIXED
export async function createLayerPaymentToken(data: any): Promise<any> {
  try {
    // Validate environment variables
    if (!ZWITCH_ACCESS_KEY || !ZWITCH_SECRET_KEY) {
      throw new Error('Zwitch API keys are not configured. Check ZWITCH_API_KEY and ZWITCH_API_SECRET_KEY in .env');
    }

    const url = ZWITCH_ENVIRONMENT === 'live' 
      ? `${BASE_URL_LIVE}/payment_token`
      : `${BASE_URL_SANDBOX}/payment_token`;

    console.log('Creating payment token with URL:', url);
    console.log('Payload:', JSON.stringify(data, null, 2));

    const payload = {
      amount: data.amount,
      currency: data.currency,
      name: data.name,
      email_id: data.email_id,
      contact_number: data.contact_number,
      mtx: data.mtx,
      udf: data.udf || {}
    };

    // Try different authorization formats
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ZWITCH_ACCESS_KEY}:${ZWITCH_SECRET_KEY}` // Try just access key first
    };

    console.log('Headers:', { ...headers, 'Authorization': 'Bearer [REDACTED]' });

    const response = await axios.post(url, payload, { headers });

    console.log('Payment token created successfully:', response.data);
    return response.data;
    
  } catch (error: any) {
    console.error('Full error object:', error);
    console.error('Error response data:', error.response?.data);
    console.error('Error response status:', error.response?.status);
    console.error('Error response headers:', error.response?.headers);
    console.error('Error message:', error.message);
    
    throw new Error(
      `Failed to create payment token: ${error.response?.data?.message || error.response?.data?.error || error.message}`
    );
  }
}

// Get payment token details - FIXED
export async function getLayerPaymentToken(tokenId: string): Promise<any> {
  try {
    const url = ZWITCH_ENVIRONMENT === 'live'
      ? `${BASE_URL_LIVE}/payment_token/${tokenId}`
      : `${BASE_URL_SANDBOX}/payment_token/${tokenId}`;

    console.log('Fetching payment token:', url);

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZWITCH_ACCESS_KEY}:${ZWITCH_SECRET_KEY}` // Ensure correct format
      }
    });

    console.log('Payment token fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to get payment token:', error.response?.data || error.message);
    throw new Error(
      `Failed to get payment token: ${error.response?.data?.message || error.response?.data?.error || error.message}`
    );
  }
}

// Get payment details - FIXED
export async function getLayerPaymentDetails(paymentId: string): Promise<any> {
  try {
    const url = ZWITCH_ENVIRONMENT === 'live'
      ? `${BASE_URL_LIVE}/payment/${paymentId}`
      : `${BASE_URL_SANDBOX}/payment/${paymentId}`;

    console.log('Fetching payment details:', url);

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ZWITCH_ACCESS_KEY}:${ZWITCH_SECRET_KEY}` // Ensure correct format
      }
    });

    console.log('Payment details fetched:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Failed to get payment details:', error.response?.data || error.message);
    throw new Error(
      `Failed to get payment details: ${error.response?.data?.message || error.response?.data?.error || error.message}`
    );
  }
}