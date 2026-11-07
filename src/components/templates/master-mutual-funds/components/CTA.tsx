import React from "react";

interface CTAProps {
  price: number;
  onEnroll?: () => void;
}

export const CTA: React.FC<CTAProps> = ({ price, onEnroll }) => {
  return (
    <div className="w-full lg:flex lg:justify-center">
      <div className="lg:w-1/2">
        <button
          onClick={onEnroll}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xl font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 cursor-pointer"
        >
          Book my seat — ₹{price}
        </button>
      </div>
    </div>
  );
};