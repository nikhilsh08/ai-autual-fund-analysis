"use client"
import React from 'react'

import { motion } from 'framer-motion';

const LogoTicker = () => (
  <div className="border-b border-zinc-100 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 py-10 relative">
      <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <motion.div
          className="flex flex-none gap-16 pr-16"
          animate={{
            translateX: "-50%",
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop",
          }}
        >
          {['HDFC Mutual Fund', 'SBI Mutual Fund', 'ICICI Prudential', 'Nippon India', 'Axis Mutual Fund', 'HDFC Mutual Fund', 'SBI Mutual Fund', 'ICICI Prudential', 'Nippon India', 'Axis Mutual Fund'].map((logo, index) => (
            <span key={`${logo}-${index}`} className="text-xl font-bold text-zinc-900 tracking-tight whitespace-nowrap">{logo}</span>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
);

export default LogoTicker
