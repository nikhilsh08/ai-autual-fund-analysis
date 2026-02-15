import React from "react";
import { Award, Shield, BookOpen } from "lucide-react";

export const InstructorCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-8 group relative overflow-hidden">
    <div className="text-center transition-opacity duration-300 group-hover:opacity-0">
      <p className="text-sm text-gray-600 mb-2">Instructed by</p>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Nikhil Sharma</h3>
      <p className="text-lg text-blue-600 font-medium mb-4">
        Co-Founder, CashFlowCrew
      </p>
      <ul className="space-y-3 text-left">
        <li className="flex items-start gap-3">
          <Award className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <span className="text-gray-700">
            Managed Risk for ₹65B+ AUM at Goldman Sachs
          </span>
        </li>
        <li className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <span className="text-gray-700">
            2-Time Founder: LitmusEye & CashFlowCrew
          </span>
        </li>
        <li className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
          <span className="text-gray-700">
            Ex National Head of Operations & Enterprise Sales at LocoNav
          </span>
        </li>
      </ul>
    </div>

    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <img
        src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
        alt="Nikhil Sharma"
        className="w-full h-full object-cover object-[center_20%] rounded-xl"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <h3 className="text-2xl font-bold">Nikhil Sharma</h3>
        <p className="text-lg">Co-Founder, CashFlowCrew</p>
      </div>
    </div>
  </div>
);
