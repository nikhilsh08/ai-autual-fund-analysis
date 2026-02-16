import React, { useState, useEffect } from 'react';
import { X, CheckCircle, FileText, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';


interface PopupProps {
  title?: string;
  highlightedText?: string;
  description?: string;
  buttonText?: string;
  apiEndpoint?: string;
}

export const Popup: React.FC<PopupProps> = ({
  title = "Get",
  highlightedText = "3 free investment checklists",
  description = "& join CashFlowCrew's mailing list, to master your personal finances",
  buttonText = "Send me the PDFs",
  apiEndpoint = "/api/v1/email/newletter"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Trigger popup when user scrolls 60% of the page
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Calculate scroll percentage (0 to 1)
      const scrollPercent = scrollTop / (docHeight - winHeight);

      if (scrollPercent > 0.6) {
        setIsOpen(true);
        // Remove listener so it only opens once
        window.removeEventListener('scroll', handleScroll);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Check immediately in case page is loaded already scrolled
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Email address is required');
      return;
    }

    // Basic regex check for format
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.match(emailRegex)) {
      setError('Please enter a valid email address');
      return;
    }

    // Strict domain check
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com'];
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain || !allowedDomains.includes(domain)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL || ''}${apiEndpoint}`, { email: email });
      // console.log("apply coupon res", res.data);
      if (res.data.success) {
        setIsSubmitted(true);

      }


    } catch (error: any) {
      setError(error?.response?.data?.message || "email not found");
      // console.error("Error applying coupon", error);

    }
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300 animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden transform transition-all scale-100 animate-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 bg-gray-50 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Top Bar - Brand Blue */}
        <div className="h-1.5 w-full bg-blue-600"></div>

        <div className="p-8">
          {!isSubmitted ? (
            <div className="text-center">
              {/* Icon - Brand Blue */}
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
                {title} <span className="text-blue-600">{highlightedText}</span>
              </h2>
              <p className="text-gray-600 mb-8 text-sm">
                {description}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-left" noValidate>
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={handleEmailChange}
                      className={`w-full px-4 py-3 border rounded-lg outline-none transition-all text-sm text-gray-900 bg-white placeholder:text-gray-400 ${error
                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400 bg-red-50'
                        : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                    />
                    {error && (
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="mt-1 text-xs text-red-600 animate-in slide-in-from-top-1">
                      {error}
                    </p>
                  )}
                </div>
                <button type="submit" className="text-base py-3 w-full shadow-blue-200 !bg-none !bg-blue-600 hover:!bg-blue-700 relative inline-flex items-center justify-center font-bold text-white uppercase tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg rounded-md overflow-hidden bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600">
                  {buttonText}
                </button>
                <p className="text-[10px] text-center text-gray-400 mt-4">
                  Join 15,000+ investors. Unsubscribe at any time.
                </p>
              </form>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                Almost there!
              </h3>
              <p className="text-gray-600 leading-relaxed text-sm">
                We've sent a confirmation link to <span className="font-semibold text-slate-800">{email}</span>. Click it to unlock your downloads.
              </p>

              <button
                onClick={() => setIsOpen(false)}
                className="mt-8 text-sm text-blue-600 font-semibold hover:text-blue-700 underline underline-offset-2"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};