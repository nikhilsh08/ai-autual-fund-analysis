"use client";

import Link from "next/link";
import { ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center space-y-8">
                {/* Error Code */}
                <div>
                    <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                        404
                    </h1>
                    <h2 className="mt-6 text-3xl font-bold text-zinc-900 tracking-tight sm:text-4xl">
                        Page not found
                    </h2>
                    <p className="mt-4 text-lg text-zinc-600">
                        Sorry, we couldn't find the page you're looking for. The link you followed might be broken, or the page may have been removed.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto hover:bg-zinc-100"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Go Back
                    </Button>

                    <Link href="/" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                            <Home className="w-4 h-4 mr-2" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="mt-16 text-center text-sm text-zinc-400">
                &copy; {new Date().getFullYear()} CashFlowCrew. All rights reserved.
            </div>
        </div>
    );
}
