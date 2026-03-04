import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import ContactForm from "@/components/templates/contact/ContactForm";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Get in touch with CashFlowCrew for any questions or support regarding our courses.",
};

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

                    {/* Interactive Form Component */}
                    <ContactForm />

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
