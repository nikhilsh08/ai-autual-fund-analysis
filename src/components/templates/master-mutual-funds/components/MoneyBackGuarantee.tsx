import React from "react";
import { CheckCircle } from "lucide-react";

export const MoneyBackGuarantee: React.FC = () => {


  return (
    <div className="mt-24 bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              No Questions Asked!
            </h2>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              100% Money Back Guarantee
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
              If you're not satisfied with the workshop because it didn't provide
              valuable insights into mutual fund investments, you may qualify
              for our{" "}
              <span className="font-bold">
                strong 100% money-back guarantee
              </span>
              . Get a full refund within 7 days of your purchase as per our
              Refund Policy.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mb-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-lg font-medium">
                  100% Refund Available
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <span className="text-lg font-medium">7-Day Refund Policy</span>
              </div>
            </div>

            <button
              className="bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
            >
              Enroll Risk-Free! Get an Exclusive Discount Today
            </button>
          </div>

          {/* Static Badge - Only visible on large screens */}
          <div className="hidden lg:block relative flex-1 max-w-md">
            <div className="absolute -top-12 -right-12 w-32 h-32 z-10">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-green-500 rounded-full"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-green-500">
                      7 DAYS
                    </div>
                    <div className="text-xs font-bold text-green-500">
                      MONEY BACK
                    </div>
                    <div className="text-[8px] text-green-500">GUARANTEE</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="aspect-square w-full overflow-hidden rounded-2xl shadow-2xl">
              <img
                src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
                alt="Instructor"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
