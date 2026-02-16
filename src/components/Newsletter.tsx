"use client"
import React, { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from './ui/button';

export const Newsletter: React.FC = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Email address is required');
            return;
        }

        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!email.match(emailRegex)) {
            setError('Please enter a valid email address');
            return;
        }

        const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'live.com'];
        const domain = email.split('@')[1]?.toLowerCase();

        if (!domain || !allowedDomains.includes(domain)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL || ''}/api/v1/email/newletter`, { email: email });
            if (res.data.success) {
                setIsSubmitted(true);
            }
        } catch (error: any) {
            setError(error?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError('');
    };

    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto bg-zinc-50 border border-zinc-200 rounded-[2rem] p-12 md:p-24 text-center relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 bg-noise opacity-30" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-100 blur-[100px] rounded-full pointer-events-none" />

                {!isSubmitted ? (
                    <>
                        <h2 className="relative text-4xl md:text-6xl font-medium tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
                            Ready to master your finances?
                        </h2>
                        <p className="relative text-zinc-600 text-lg max-w-xl mx-auto mb-10">
                            Join 10,000+ investors building their wealth. Subscribe to our newsletter for professional mutual fund strategies and market insights.
                        </p>

                        <form onSubmit={handleSubmit} className="relative max-w-md mx-auto space-y-4" noValidate>
                            <div className="relative">
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={handleEmailChange}
                                    className={`w-full px-6 py-4 border rounded-full outline-none transition-all text-base text-gray-900 bg-white shadow-sm placeholder:text-gray-400 ${error
                                        ? 'border-red-300 focus:ring-2 focus:ring-red-200 focus:border-red-400 bg-red-50'
                                        : 'border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                                        }`}
                                />
                                {error && (
                                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    </div>
                                )}
                            </div>
                            {error && (
                                <p className="text-left ml-4 text-sm text-red-600 animate-in slide-in-from-top-1">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 text-lg rounded-full shadow-blue-200 !bg-blue-600 hover:!bg-blue-700 font-bold text-white transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
                            >
                                {loading ? "Subscribing..." : "Subscribe Now"}
                            </Button>
                            <p className="text-xs text-center text-gray-400 mt-4">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </form>
                    </>
                ) : (
                    <div className="relative flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500">
                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                            Welcome Aboard!
                        </h3>
                        <p className="text-zinc-600 text-lg max-w-lg mx-auto leading-relaxed">
                            We've added <span className="font-semibold text-slate-900">{email}</span> to our exclusive list. Keep an eye on your inbox for value-packed insights!
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
