"use client"
import React from 'react'
import { ArrowRight } from 'lucide-react';
const BentoStats = () => (
  <section className="py-32 bg-white">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div className="space-y-8">
          <h2 className="text-5xl md:text-6xl font-medium tracking-tighter text-zinc-900 leading-[0.95]">
            Gain <span className="text-blue-600 border-b-2 border-blue-200 pb-1">in-demand</span><br/>
            skills per month.
          </h2>
          <p className="text-zinc-500 text-lg max-w-md leading-relaxed">
            Give your career the acceleration it deserves. Our platform focuses on what matters most—shipping code and solving complex problems.
          </p>
          <div className="pt-8">
            <a href="#" className="text-zinc-900 border-b border-zinc-900 pb-1 inline-flex items-center gap-2 hover:text-zinc-600 hover:border-zinc-600 transition-colors">
              Explore outcomes <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px bg-zinc-200 border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
          {[
            { label: 'Students Enrolled', value: '20K+' },
            { label: 'Lines of Code', value: '50M+' },
            { label: 'Hours Saved', value: '250k+' },
            { label: 'Career Value', value: '$10M+' }
          ].map((stat, i) => (
            <div key={i} className="bg-zinc-50 p-10 hover:bg-white transition-colors group">
              <div className="text-xs font-medium text-zinc-500 uppercase tracking-widest mb-4 group-hover:text-blue-600 transition-colors">
                {stat.label}
              </div>
              <div className="text-4xl md:text-5xl font-medium text-zinc-900 tracking-tighter">
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default BentoStats
