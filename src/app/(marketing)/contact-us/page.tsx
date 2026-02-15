import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactUsPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#111] flex flex-col items-center">
            <div className="max-w-2xl w-full">

                {/* Back Link */}
                <div className="mb-8 text-center sm:text-left">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900">Get in touch</h1>
                        <p className="text-gray-600 leading-relaxed max-w-lg mx-auto">
                            Have questions about our workshops? We're here to help. Send us a message and we'll respond within 24 hours.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                        <div className="bg-zinc-50 rounded-xl p-6 flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-900 mb-3 shadow-sm">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-zinc-900 text-sm mb-1">Email</h3>
                            <a href="mailto:support@cashflowcrew.in" className="text-zinc-600 hover:text-black text-sm">
                                support@cashflowcrew.in
                            </a>
                        </div>

                        <div className="bg-zinc-50 rounded-xl p-6 flex flex-col items-center text-center">
                            <div className="w-10 h-10 bg-white border border-zinc-200 rounded-lg flex items-center justify-center text-zinc-900 mb-3 shadow-sm">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <h3 className="font-semibold text-zinc-900 text-sm mb-1">Office</h3>
                            <address className="text-zinc-600 not-italic text-sm">
                                Gurugram, Haryana
                            </address>
                        </div>
                    </div>

                    <form className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="first-name" className="text-sm font-medium text-zinc-700">First name</label>
                                <Input id="first-name" placeholder="First name" />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="last-name" className="text-sm font-medium text-zinc-700">Last name</label>
                                <Input id="last-name" placeholder="Last name" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium text-zinc-700">Email</label>
                            <Input id="email" type="email" placeholder="you@company.com" />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-zinc-700">Message</label>
                            <Textarea id="message" placeholder="Leave us a message..." className="min-h-[120px]" />
                        </div>

                        <Button type="submit" size="lg" className="w-full">
                            Send Message
                        </Button>
                    </form>
                </div>

                {/* Full Address Footer */}
                <div className="mt-8 text-center text-xs text-gray-500 leading-relaxed">
                    <p className="font-medium text-gray-900 mb-1">CollaBroot Marketing Private Limited</p>
                    <p>3rd Floor, Vision Comptech Integrators Limited, Time Square, 106 Sushant Lok Phase 1, B-Block</p>
                    <p>Gurugram, Haryana, 122009</p>
                </div>

            </div>
        </div>
    );
}
