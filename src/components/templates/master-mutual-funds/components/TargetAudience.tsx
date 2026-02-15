import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { targetAudience } from '../data';

export const TargetAudience: React.FC = () => (
  <div className="mt-24 max-w-4xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Who is this workshop for?</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {targetAudience.map((item) => (
        <div key={item} className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
          <span className="text-lg text-gray-800 text-left whitespace-normal md:whitespace-nowrap">{item}</span>
        </div>
      ))}
    </div>
    <div className="mt-6">
      <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow w-full">
        <div className="flex items-start md:items-center gap-4">
          <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5 md:mt-0" />
          <span className="text-lg text-gray-800 text-left whitespace-normal lg:whitespace-nowrap">Anyone Interested in Mastering Mutual Funds</span>
        </div>
      </div>
    </div>
  </div>
);