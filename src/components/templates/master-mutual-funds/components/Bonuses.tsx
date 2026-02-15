import React from "react";
import { bonuses } from "../data"; // Assuming your data file is correctly set up


export const Bonuses: React.FC = () => {
  // Calculate the total worth of all bonuses
  const totalWorth = bonuses.reduce((sum, bonus) => sum + Number(bonus.worth), 0);

 
  
 

  return (
    <div className="mt-24 py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          {/* Kept the original heading */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Register before midnight of {new Date().toLocaleDateString()} .
          </h2>
          {/* Added a new, prominent heading for the bonus value */}
          <p className="text-2xl md:text-3xl font-semibold text-gray-800">
            to Unlock Bonuses Worth
          </p>
          <p className="text-4xl md:text-5xl font-extrabold text-orange-600 mt-2">
            ₹{totalWorth.toLocaleString()}/- for FREE!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bonuses.map((bonus, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="bg-gray-900 p-8 flex justify-center items-center">
                <bonus.icon className="w-12 h-12 text-orange-500" />
              </div>
              <div className="p-6  flex flex-col ">
                <div className="text-sm text-blue-600 font-semibold mb-2">
                  Bonus {index + 1}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 ">
                  {bonus.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm px-1">{bonus.description}</p>
                <div className="text-lg font-bold text-orange-500 flex-3">
                  Worth ₹{bonus.worth.toLocaleString()}/-
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* This section explicitly shows the total value again at the bottom if needed */}
        {/* <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900">
            Total Value of All Bonuses:
            <span className="text-green-600 ml-2">₹{totalWorth.toLocaleString()}/-</span>
          </h3>
        </div> */}
      </div>
    </div>
  );
};

