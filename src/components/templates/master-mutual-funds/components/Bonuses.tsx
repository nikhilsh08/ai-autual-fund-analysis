import React from "react";
import Image from "next/image";
import { guides } from "../data";
import { CTA } from "./CTA";

interface BonusesProps {
  onEnroll?: () => void;
  price?: number;
}

export const Bonuses: React.FC<BonusesProps> = ({ onEnroll, price }) => {
  return (
    <div className="mt-24 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Five guides, included with your seat.
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shared as PDFs during the live workshop. They are yours to keep.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-[3/4] bg-gray-100">
                <Image
                  src={guide.cover}
                  alt={`Cover of ${guide.title}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col">
                <div className="text-sm text-blue-600 font-semibold mb-2">
                  PDF {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {guide.title}
                </h3>
                <p className="text-gray-600 text-sm px-1">{guide.description}</p>
              </div>
            </div>
          ))}
        </div>

        {onEnroll && price && (
          <div className="mt-16">
            <CTA price={price} onEnroll={onEnroll} />
          </div>
        )}
      </div>
    </div>
  );
};

