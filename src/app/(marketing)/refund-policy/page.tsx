import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export default function RefundPolicyPage() {
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
                <h1 className="text-3xl font-bold mb-8 text-zinc-900">Refund Policy</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 md:p-10 space-y-10">

                    {/* Section 1: Guarantee */}
                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">7-Day Money-Back Guarantee</h2>
                        <p className="text-sm text-zinc-600 mb-6 leading-relaxed">
                            We offer a 7-day, no-questions-asked money-back guarantee on our Mutual Fund Mastery Workshop.
                        </p>

                        <div className="bg-green-50 border border-green-100 rounded-xl p-5 flex items-start gap-4">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h4 className="text-sm font-bold text-green-900 mb-1">100% Money-Back Guarantee</h4>
                                <p className="text-xs text-green-800">
                                    If you're not satisfied with the workshop content within 7 days of purchase, we'll provide a full refund.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Eligibility */}
                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Refund Eligibility</h2>
                        <p className="text-sm text-zinc-600 mb-4">To be eligible for a refund:</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
                            <li>Request must be made within 7 days of purchase</li>
                            <li>Workshop completion should not exceed 30%</li>
                            <li>Bonus materials should not be downloaded</li>
                            <li>Request must be submitted through official channels</li>
                        </ul>
                    </section>

                    {/* Section 3: Process */}
                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Refund Process</h2>
                        <p className="text-sm text-zinc-600 mb-4">To request a refund:</p>
                        <ol className="list-decimal pl-5 space-y-2 text-sm text-zinc-600">
                            <li>Email <a href="mailto:support@cashflowcrew.in" className="text-blue-600 hover:underline">support@cashflowcrew.in</a> with your purchase details</li>
                            <li>Include refund request name should be mentioned in the subject line</li>
                            <li>Provide your order number and reason for refund</li>
                            <li>Refunds will be credited to the original payment method within 5-7 business days</li>
                        </ol>
                    </section>

                    {/* Section 4: Non-Refundable */}
                    <section>
                        <h2 className="text-xl font-semibold text-zinc-900 mb-4">Non-Refundable Items</h2>
                        <p className="text-sm text-zinc-600 mb-4">The following are not eligible for refund:</p>
                        <ul className="list-disc pl-5 space-y-2 text-sm text-zinc-600">
                            <li>Workshop access after 7 days of purchase</li>
                            <li>Downloaded bonus materials</li>
                            <li>Special promotional offers marked as non-refundable</li>
                        </ul>
                    </section>

                    {/* Section 5: Contact */}
                    <section className="pt-8 border-t border-zinc-100">
                        <h2 className="text-lg font-semibold text-zinc-900 mb-2">Contact Us</h2>
                        <p className="text-sm text-zinc-500 mb-1">For refund-related queries, contact us at:</p>
                        <p className="text-sm text-zinc-900 font-medium">Email: support@cashflowcrew.in</p>
                        <p className="text-sm text-zinc-500">Response Time: Within 24 hours</p>
                    </section>

                </div>
            </div>
        </div>
    );
}
