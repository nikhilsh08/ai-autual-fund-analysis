import  { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Lock, ExternalLink, AlertCircle } from 'lucide-react';

interface PaymentIframeProps {

  paymentUrl: string;
  onClose: () => void;
  onBack: () => void;
}

const PaymentIframe = ({ paymentUrl, onClose, onBack }: PaymentIframeProps  ) => {
 const [countdown, setCountdown] = useState(5);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRedirect();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRedirect = () => {
    setHasRedirected(true);
    window.location.href = paymentUrl;
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">PhonePe Payment</h1>
                <div className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-green-500" />
                  <span className="text-xs text-green-600">Secure Redirect</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-xl">Pe</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Redirecting to PhonePe</h2>
          <p className="text-gray-600 mb-8">
            You'll be redirected to PhonePe's secure payment gateway to complete your transaction.
          </p>

          {!hasRedirected ? (
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 relative">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" strokeWidth="4"
                      strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (countdown / 5)}`}
                      className="transition-all duration-1000 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-purple-600">{countdown}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-500">Redirecting in {countdown} seconds...</p>

              <button
                onClick={handleRedirect}
                className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Continue to PhonePe Now</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Redirecting to PhonePe...</p>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 mb-1">Why are we redirecting?</p>
                <p className="text-xs text-gray-600">
                  PhonePe uses enhanced security measures that require opening their payment page directly.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onBack}
            className="mt-6 w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200"
          >
            Go Back to Payment Form
          </button>
        </div>
      </div>
    </div>
  );

};
export default PaymentIframe;