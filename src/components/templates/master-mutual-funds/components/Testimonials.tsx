import React from 'react';
import { ArrowLeft, Phone, Video as VideoIcon, MoreVertical } from 'lucide-react';
import { testimonials } from '../data';

export const Testimonials: React.FC = () => (
  <div className="mt-24 overflow-hidden">
    <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Students Say</h2>
    <div className="relative testimonials-mask">
      <div className="flex gap-6 animate-scroll">
        {[...testimonials, ...testimonials].map((testimonial, index) => (
          <div key={index} className="flex-none w-[320px]">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-[#075E54] text-white p-2.5 flex items-center gap-2">
                <ArrowLeft className="w-5 h-5" />
                <img src={testimonial.avatar} alt={testimonial.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="flex-1 text-left">
                  <h3 className="font-semibold text-sm">{testimonial.name}</h3>
                  <p className="text-[10px] opacity-80">online</p>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-4 h-4" />
                  <VideoIcon className="w-4 h-4" />
                  <MoreVertical className="w-4 h-4" />
                </div>
              </div>
              
              <div className="whatsapp-chat p-3 space-y-2 h-[180px]">
                <div className="bg-gray-200/50 text-gray-600 text-[10px] text-center py-1 rounded-lg">Today</div>
                {testimonial.messages.map((message, mIndex) => (
                  <div key={mIndex} className={`flex ${message.type === 'student' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-lg p-2 relative ${
                      message.type === 'student' 
                        ? 'bg-[#E7FFDB] rounded-tr-none' 
                        : 'bg-white rounded-tl-none shadow-sm'
                    }`}>
                      <p className="text-xs leading-snug text-left">{message.text}</p>
                      <p className="text-[9px] text-gray-500 text-right mt-0.5">{message.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);