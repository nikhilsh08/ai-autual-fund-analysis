"use client";
import React from "react";
import { experiences } from "../data";

export const MentorSection: React.FC = () => {
  return (
    <section id="mentor" className=" py-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Meet your <span className="bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">Mentor</span>
          </h2>
          {/* <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn from someone who’s walked the walk — helping individuals & businesses grow, excel, and achieve financial freedom.
          </p> */}
        </div>

        {/* Card Section */}
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden p-6 md:p-10 flex flex-col md:flex-row gap-10 items-center">
          {/* Profile Photo */}
          <div className="relative w-52 h-52 md:w-64 md:h-64 shrink-0">
            <img
              src="https://res.cloudinary.com/dq1llsy7f/image/upload/v1738855885/c1gzyxcgfokizkisio3j.jpg"
              alt="Nikhil Sharma"
              className="rounded-full w-full h-full object-cover border-4 border-orange-500"
            />
          </div>

          {/* Content */}
          <div className="flex-1 text-start">
            <h3 className="text-2xl md:text-4xl font-bold text-center text-gray-900 mb-2">
              Nikhil Sharma
            </h3>
            <p className="text-orange-600 text-center font-semibold mb-4">
              Founder – CashFlowCrew | Ex-Goldman Sachs
            </p>

            <p className="text-gray-700 mb-6 text-md leading-relaxed">
              "Hey! I'm Nikhil Sharma, and I'm super passionate about empowering professionals and businesses to achieve growth and excellence across various domains."
            </p>

            {/* Experience Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {experiences.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="flex items-start gap-4 bg-gray-100 p-4 rounded-xl transition hover:bg-white hover:shadow-md"
                >
                  <Icon className="w-6 h-6 text-orange-500 mt-1" />
                  <div>
                    <h4 className="text-gray-900 font-medium">{title}</h4>
                    <p className="text-gray-600 text-sm">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="italic text-gray-600 text-md bg-orange-50 p-4 rounded-xl shadow-inner">
              "As the founder of CashFlowCrew, my mission is to empower the average Indian with the knowledge and tools to achieve financial freedom. By simplifying complex financial concepts and teaching risk management strategies used by top investment banks, I help individuals and businesses unlock their full growth potential. Let’s turn ambition into achievement!"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
