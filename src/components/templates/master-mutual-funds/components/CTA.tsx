import React, { useState, useEffect } from "react";

interface CTAProps {
  price: number;
  originalPrice?: number;
  onEnroll?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ price, originalPrice = 999, onEnroll }) => {

  const [showStrike, setShowStrike] = useState(false);
  const [showNewPrice, setShowNewPrice] = useState(false);

  useEffect(() => {
    // Start animation sequence
    const timer1 = setTimeout(() => setShowStrike(true), 500);
    const timer2 = setTimeout(() => setShowNewPrice(true), 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="w-full lg:flex lg:justify-center">
      <div className="lg:w-1/2">
        <button
          onClick={onEnroll}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 cursor-pointer"
        >
          <span className="text-2xl font-bold">
            Enroll Now for ₹{price}{" "}
            <span className="relative inline-block text-sm">
              <span className={`transition-opacity duration-300 ${showStrike ? 'opacity-70' : ''}`}>
                ₹{originalPrice}
              </span>
              {/* Animated strike line */}
              <div
                className={`absolute top-1/2 left-0 h-0.5 bg-white transition-all duration-700 ${showStrike ? 'w-full' : 'w-0'
                  }`}
                style={{ transform: 'translateY(-50%)' }}
              />
            </span>
          </span>
        </button>
        <p className="mt-4 hidden text-gray-600">
          Use code{" "}
          <span className="font-mono font-bold  text-orange-600">
            MUTUALFUNDS100
          </span>{" "}
          on checkout
        </p>
      </div>
    </div>
  );
};