import React from 'react';
import { motion,Variants } from 'framer-motion';
import { timelineItems } from '../data';

export const Timeline: React.FC = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // This will make each child animate one after the other
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      // Slide in from the side based on odd/even index
      x: index % 2 === 0 ? [50, 0] : [-50, 0],
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  return (
    <div id="timeline" className="py-24 bg-neutral-50">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4 text-center">
          What you'll master in <span className="text-blue-600">2.5 hours</span>
        </h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-16">
          A step-by-step curriculum designed to turn you into a confident, informed mutual fund investor.
        </p>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 w-0.5 h-full bg-gradient-to-b from-blue-400 to-teal-500 transform -translate-x-1/2" aria-hidden="true"></div>

          <motion.div
            className="space-y-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                className="relative flex items-start"
                custom={index}
                variants={itemVariants}
              >
                {/* Desktop: Alternating layout */}
                <div className={`hidden md:flex ${index % 2 === 0 ? 'ml-auto flex-row-reverse text-right' : 'mr-auto text-left'} w-2/5`}>
                  <div className="p-6 bg-white rounded-lg shadow-lg border border-neutral-200/80">
                    <h3 className="font-bold text-lg text-neutral-800 mb-2">{item.title}</h3>
                    <p className="text-neutral-600">{item.description}</p>
                  </div>
                </div>

                {/* Mobile: All on one side */}
                <div className="md:hidden ml-12 p-6 bg-white rounded-lg shadow-lg border border-neutral-200/80 w-full">
                  <h3 className="font-bold text-lg text-neutral-800 mb-2">{item.title}</h3>
                  <p className="text-neutral-600">{item.description}</p>
                </div>

                {/* Icon and Timeline Node */}
                <div className="absolute left-4 md:left-1/2 top-0 transform -translate-x-1/2 flex flex-col items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center shadow-md">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="mt-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                      {item.timeSlot}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};