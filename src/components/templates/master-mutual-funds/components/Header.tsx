import React from "react";

export const Header: React.FC = () => {
  return (
    <div className="pt-32 md:pt-40">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
        Learn to check a mutual fund&apos;s risk,{" "}
        <span className="bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          not only its past returns.
        </span>
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
        A repeatable set of checks for evaluating any mutual fund yourself,
        taught over one weekend by a former Goldman Sachs risk analyst.
        Education only, not investment advice.
      </p>
    </div>
  );
};

