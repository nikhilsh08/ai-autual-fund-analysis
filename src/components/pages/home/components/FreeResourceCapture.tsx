'use client';

import { useState } from 'react';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { registerNewsletter } from '@/server/actions/newsletter.action';
import FadeIn from './FadeIn';

export default function FreeResourceCapture() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Email address is required';
    }

    // Basic regex check for format
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (!email.match(emailRegex)) {
      return 'Please enter a valid email address';
    }

    // Domain validation
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com'];
    const domain = email.split('@')[1]?.toLowerCase();

    if (!domain || !allowedDomains.includes(domain)) {
      return 'Please use Gmail, Yahoo, Outlook, Hotmail, or Live email';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validateEmail(email);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await registerNewsletter(email);
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError(res.error || res.message || 'Email already subscribed or invalid.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <section className="bg-card border-t border-border" style={{ padding: "clamp(40px,5vw,56px) 0" }}>
      <div className="max-w-[560px] mx-auto px-5 md:px-7 text-center">
        <FadeIn>
          <div className="p-8 px-7 bg-cream-dark rounded-[20px] border border-border">
            {!isSubmitted ? (
              <>
                <div className="text-[32px] mb-3">📋</div>
                <h3 className="font-serif text-xl font-black text-ink mb-2">
                  Get 3 free investment checklists
                </h3>
                <p className="text-sm text-ink-secondary leading-[1.65] font-light mb-5">
                  The same checklists our 10,000+ students use. Portfolio audit. Monthly expense tracker.
                  Asset allocation calculator. Free. No spam.
                </p>
                <form onSubmit={handleSubmit} noValidate>
                  <div className="flex gap-2.5 max-w-[400px] mx-auto flex-wrap justify-center">
                    <div className="flex-1 min-w-[200px] relative">
                      <input
                        type="email"
                        placeholder="your email address"
                        value={email}
                        onChange={handleEmailChange}
                        disabled={isLoading}
                        className={`w-full px-[18px] py-[13px] border-[1.5px] rounded-pill text-sm font-sans bg-card outline-none text-ink text-center md:text-left placeholder:text-center md:placeholder:text-left placeholder:text-ink-muted transition-colors ${
                          error
                            ? 'border-red-400 focus:border-red-500 bg-red-50'
                            : 'border-border focus:border-accent'
                        } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      {error && (
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`inline-flex items-center gap-2 px-6 py-[13px] rounded-pill text-sm font-medium bg-ink text-cream transition-transform cursor-pointer ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-px'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          sending...
                        </>
                      ) : (
                        'send me the checklists →'
                      )}
                    </button>
                  </div>
                  {error && (
                    <p className="text-xs text-red-600 mt-2 animate-in slide-in-from-top-1">
                      {error}
                    </p>
                  )}
                </form>
                <p className="text-[10px] text-ink-muted mt-2.5">
                  we'll email you the PDF. no spam. unsubscribe anytime.
                </p>
              </>
            ) : (
              <div className="py-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-serif text-xl font-black text-ink mb-2">
                  Check your inbox!
                </h3>
                <p className="text-sm text-ink-secondary leading-[1.65] font-light">
                  We've sent a confirmation link to <span className="font-semibold text-ink">{email}</span>.
                  <br />Click it to get your free checklists.
                </p>
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
