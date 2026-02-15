import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsConditionsPage() {
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
                <h1 className="text-3xl font-bold mb-8 text-zinc-900">Terms and Conditions</h1>

                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-8 md:p-10 space-y-10">

                    <div className="text-sm text-blue-600 mb-6">
                        This website is operated by Nikhil Sharma
                    </div>

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">1. Workshop Access</h2>
                        <p className="text-sm text-zinc-600 mb-3">By purchasing our Mutual Fund Mastery Workshop, you receive:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
                            <li>Access to future updates</li>
                            <li>Downloadable resources and tools</li>
                            <li>Bonus materials as specified during purchase</li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">2. Intellectual Property</h2>
                        <p className="text-sm text-zinc-600 mb-3">All workshop materials, including but not limited to:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
                            <li>Video content</li>
                            <li>Written materials</li>
                            <li>Worksheets and templates</li>
                            <li>Bonus resources</li>
                        </ul>
                        <p className="text-sm text-zinc-600 mt-3">
                            are protected by copyright and may not be shared, distributed, or resold.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">3. Disclaimer</h2>
                        <p className="text-sm text-zinc-600 mb-3">
                            The workshop content is for educational purposes only and does not constitute financial advice. We do not guarantee any specific returns or investment outcomes.
                        </p>
                        <p className="text-sm text-zinc-600 mb-3">Users should:</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-zinc-600">
                            <li>Conduct their own research</li>
                            <li>Consult with financial advisors</li>
                            <li>Make investment decisions based on their own judgment</li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">4. User Conduct</h2>
                        <p className="text-sm text-zinc-600">
                            Users agree not to share login credentials, reproduce workshop materials, or engage in any activity that violates these terms or applicable laws.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">5. Account Security</h2>
                        <p className="text-sm text-zinc-600">
                            Users are responsible for maintaining the confidentiality of their account credentials and must notify us immediately of any unauthorized access.
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-lg font-bold text-zinc-900 mb-3">6. Modifications</h2>
                        <p className="text-sm text-zinc-600">
                            We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.
                        </p>
                    </section>

                </div>
            </div>
        </div>
    );
}
