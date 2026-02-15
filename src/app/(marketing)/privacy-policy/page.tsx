import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8 font-sans text-[#111]">
            <div className="max-w-3xl mx-auto">

                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-[#0070f3] transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold mb-8 text-zinc-900">Privacy Policy</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 md:p-10 space-y-10">

                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">Consent</h2>
                        <p className="text-sm text-zinc-600">
                            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">Information We Collect</h2>
                        <p className="text-sm text-zinc-600 mb-3">
                            The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.
                        </p>
                        <p className="text-sm text-zinc-600 mb-3">
                            If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.
                        </p>
                        <p className="text-sm text-zinc-600">
                            When you register for an Account, we may ask for your contact information, including items such as name, address, email address, and telephone number.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">How We Use Your Information</h2>
                        <p className="text-sm text-zinc-600 mb-3">We use the information we collect in various ways, including to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
                            <li>Provide, operate, and maintain our website</li>
                            <li>Improve, personalize, and expand our website</li>
                            <li>Understand and analyze how you use our website</li>
                            <li>Develop new products, services, features, and functionality</li>
                            <li>Communicate with you, either directly or through one of our partners, including for customer service, to provide you with updates and other information relating to the website, and for marketing and promotional purposes</li>
                            <li>Send you emails</li>
                            <li>Find and prevent fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">Log Files & Cookies</h2>
                        <p className="text-sm text-zinc-600 mb-3">
                            CashFlowCrew's website uses cookies to store visitor preferences... (Standard Cookie Policy Text)
                        </p>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">GDPR Data Protection Rights</h2>
                        <p className="text-sm text-zinc-600 mb-3">
                            We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
                            <li>The right to access</li>
                            <li>The right to rectification</li>
                            <li>The right to erasure</li>
                            <li>The right to restrict processing</li>
                            <li>The right to object to processing</li>
                            <li>The right to data portability</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">Contact Us</h2>
                        <p className="text-sm text-zinc-600">
                            If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
                        </p>
                        <p className="text-sm text-zinc-900 font-medium mt-2">Email: support@cashflowcrew.in</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
