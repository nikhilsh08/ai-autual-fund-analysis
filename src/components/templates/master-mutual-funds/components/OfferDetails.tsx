import React from "react";
import { Check } from "lucide-react";


export const OfferDetails: React.FC = () => {

  return (
    <div className="mt-24 bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">
          Get the offer while it lasts!
        </h2>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column - Pricing */}
          <div className="flex-1 bg-white rounded-3xl p-8 shadow-xl">
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Mutual Fund Mastery Workshop
              </h3>
              <div className="text-orange-500 font-semibold mb-6">
                (Save 50%)
              </div>
              <div className="text-sm text-blue-600 mb-8">
                *Offer Auto Applied on Checkout
              </div>

              <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-5xl md:text-6xl font-bold text-gray-900">
                  ₹{100}
                </span>
                <span className="text-2xl text-gray-400 line-through">
                  ₹999
                </span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-left text-gray-600">
                    Enroll now and unlock bonuses worth ₹8,999 for FREE.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-left text-gray-600">
                    Enjoy the discounted price of ₹{100} and save a total of 50%.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <p className="text-left text-gray-600">
                    The launch offer expires tonight, January 22, 2025.
                  </p>
                </div>
              </div>

              <div className="text-sm text-gray-500 mb-8">
                Note: No exceptions will be made beyond the offer expiry date.
                Prices will increase, and free bonuses will no longer be
                available.
              </div>

              <button
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* Right Column - Features */}
          <div className="flex-1 space-y-12">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                What you'll learn:
              </h3>
              <div className="space-y-4">
                {[
                  "Master the fundamentals of mutual fund investing.",
                  "Build a diversified portfolio that aligns with your financial goals.",
                  "Learn how to analyze and select the best mutual funds.",
                  "Discover strategies to maximize your portfolio returns.",
                  "Gain insights into market trends and risk management.",
                  "Understand how to navigate mutual fund platforms effectively.",
                  "Decode complex financial jargon and tools with ease.",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                And bonuses worth ₹8,999+
              </h3>
              <div className="space-y-4">
                {[
                  "Mutual Fund Investment Starter Guide",
                  "Quick Hacks to Improve Portfolio Returns",
                  "Monthly Portfolio Audit Checklist",
                  "Essential Mutual Fund Strategies for Beginners",
                  "Portfolio Analysis Tools & Templates",
                  "ChatGPT Prompts for Analyzing Fund Performances",
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
