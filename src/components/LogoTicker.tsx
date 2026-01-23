"use client"
import React from 'react'

const LogoTicker = () => (
  <div className="border-b border-zinc-100 bg-white">
    <div className="max-w-7xl mx-auto px-6 py-10 flex flex-wrap justify-center md:justify-between items-center gap-8 grayscale opacity-50 hover:opacity-100 transition-all">
      {['Stripe', 'Vercel', 'Linear', 'Raycast', 'OpenAI'].map((logo) => (
        <span key={logo} className="text-xl font-bold text-zinc-900 tracking-tight">{logo}</span>
      ))}
    </div>
  </div>
);

export default LogoTicker
