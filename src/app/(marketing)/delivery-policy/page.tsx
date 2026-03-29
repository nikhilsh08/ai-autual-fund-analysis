import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Mail, Calendar, Video, FileText, Download, PlayCircle, Users, Headset } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Delivery Policy",
    description: "Understanding how courses and workshops are delivered by CashFlowCrew.",
};

export default function DeliveryPolicyPage() {
    return (
        <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8 font-sans text-ink">
            <div className="max-w-4xl mx-auto">

                {/* Back Link */}
                <div className="mb-8">
                    <Link href="/" className="inline-flex items-center text-sm text-ink-muted hover:text-accent transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold font-serif mb-4">Delivery Policy</h1>
                    <p className="text-ink-secondary max-w-2xl mx-auto">
                        How CashFlowCrew delivers our premium financial education workshops and what you can expect.
                    </p>
                </div>

                {/* Hero Card */}
                <div className="bg-accent text-cream rounded-t-2xl p-8 mb-0 shadow-sm">
                    <h2 className="text-xl font-bold mb-3">Digital Workshop Delivery</h2>
                    <p className="opacity-90 leading-relaxed text-sm md:text-base">
                        CashFlowCrew provides digital educational workshops focused on financial literacy and wealth building. Our delivery process ensures you receive timely access to all workshop materials and sessions.
                    </p>
                </div>

                {/* Process Grid */}
                <div className="bg-card p-8 rounded-b-2xl shadow-sm border border-border mb-8">
                    <h3 className="text-lg font-bold mb-6">Our Delivery Process</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Step 1 */}
                        <div className="bg-cream-dark p-6 rounded-xl border border-border hover:border-accent/30 transition-colors">
                            <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center mb-4 text-accent">
                                <Clock className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-ink mb-2">Confirmation Timeline</h4>
                            <p className="text-sm text-ink-secondary leading-relaxed">
                                Upon successful payment, you'll receive a confirmation email within 24 hours containing your purchase details and next steps.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-cream-dark p-6 rounded-xl border border-border hover:border-accent/30 transition-colors">
                            <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center mb-4 text-accent">
                                <Mail className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-ink mb-2">Access Information</h4>
                            <p className="text-sm text-ink-secondary leading-relaxed">
                                Workshop access credentials, including login details for our learning platform, will be sent to your registered email address.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-cream-dark p-6 rounded-xl border border-border hover:border-accent/30 transition-colors">
                            <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center mb-4 text-accent">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-ink mb-2">Live Workshop Scheduling</h4>
                            <p className="text-sm text-ink-secondary leading-relaxed">
                                For live workshops, you'll receive connection links and calendar invites at least 48 hours before the scheduled session.
                            </p>
                        </div>

                        {/* Step 4 */}
                        <div className="bg-cream-dark p-6 rounded-xl border border-border hover:border-accent/30 transition-colors">
                            <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center mb-4 text-accent">
                                <Video className="w-5 h-5" />
                            </div>
                            <h4 className="font-semibold text-ink mb-2">Workshop Recordings</h4>
                            <p className="text-sm text-ink-secondary leading-relaxed">
                                All live workshop recordings will be available within 72 hours after the session and accessible through our learning platform for 12 months.
                            </p>
                        </div>

                    </div>
                </div>

                {/* Included Items */}
                <div className="bg-card p-8 rounded-2xl shadow-sm border border-border mb-8">
                    <h3 className="text-lg font-bold mb-6">What's Included In Your Purchase</h3>
                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <FileText className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-ink-secondary">
                                <span className="font-semibold text-ink">Workshop Sessions:</span> Access to all scheduled live online workshop sessions as detailed in your purchase.
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Download className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-ink-secondary">
                                <span className="font-semibold text-ink">Digital Resources:</span> Downloadable worksheets, templates, calculators, and reference materials to support your learning.
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <PlayCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-ink-secondary">
                                <span className="font-semibold text-ink">On-Demand Content:</span> Pre-recorded supplementary lessons and demonstrations available immediately upon purchase.
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Users className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-ink-secondary">
                                <span className="font-semibold text-ink">Community Access:</span> Invitation to our private community forum for peer learning and networking opportunities.
                            </p>
                        </div>
                    </div>

                    {/* Important Notes */}
                    <div className="mt-8 bg-gold/10 border border-gold/20 rounded-xl p-6">
                        <h4 className="text-ink font-bold mb-3 text-sm">Important Notes</h4>
                        <ul className="space-y-2 text-xs md:text-sm text-ink-secondary">
                            <li className="flex gap-2">
                                <span className="font-semibold">Delivery Method:</span> All of our products are digital in nature. No physical items will be shipped.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold">Email Verification:</span> Please ensure the email address provided during checkout is correct and check your spam/junk folders if you don't receive our emails.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-semibold">Technical Requirements:</span> Live workshops are conducted via Zoom. Please ensure your device meets the minimum technical requirements for participation.
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Contact Support */}
                <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
                    <h3 className="text-lg font-bold mb-6">Need Help With Access?</h3>
                    <div className="flex items-start gap-4 bg-card border border-border rounded-xl p-6">
                        <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center text-accent flex-shrink-0">
                            <Headset className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-ink mb-1">Contact Support</h4>
                            <p className="text-sm text-ink-muted mb-3">
                                Our support team is available Monday-Friday, 9am-5pm IST to assist with any delivery or access issues.
                            </p>
                            <a href="mailto:support@cashflowcrew.in" className="text-accent text-sm font-medium hover:underline">
                                support@cashflowcrew.in
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
