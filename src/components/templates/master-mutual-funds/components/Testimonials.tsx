import React from 'react';
import { testimonials } from '../data';

const AVATAR_COLORS = ['bg-[#13432B]', 'bg-[#2E6B4A]', 'bg-[#9A7B33]'];

export const Testimonials: React.FC = () => (
  <div className="mt-24 max-w-6xl mx-auto px-4">
    <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
      What past attendees wrote after the session.
    </h2>
    <p className="text-gray-600 text-center mb-12">
      Shown exactly as written. These are individual experiences.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {testimonials.map((testimonial, index) => (
        <figure
          key={testimonial.name + index}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 flex flex-col gap-4"
        >
          <blockquote className="text-gray-900 text-base leading-relaxed flex-1">
            {testimonial.quote}
          </blockquote>
          <figcaption className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <span
              className={`w-9 h-9 rounded-full ${AVATAR_COLORS[index % AVATAR_COLORS.length]} text-white text-xs font-bold flex items-center justify-center flex-none`}
            >
              {testimonial.initials}
            </span>
            <span className="text-sm font-semibold text-gray-900">{testimonial.name}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
);