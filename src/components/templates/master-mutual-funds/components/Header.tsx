import React, { useState, useEffect } from "react";

export const Header: React.FC = () => {
  const START_TIME = 15 * 60; // 15 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(START_TIME);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          // restart timer when it hits 0
          return START_TIME;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <>

      <div className="pt-32 md:pt-40">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Master Mutual Funds:{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
            Invest Smarter
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          EXPOSED: The Risk Analysis Secrets Wall Street Uses to Pick Mutual
          Funds (That Your Financial Advisor Never Told You About)
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <div className="px-6 py-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-600 font-semibold flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Hurry! Only {minutes}:{seconds.toString().padStart(2, "0")} minutes left to enroll
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

