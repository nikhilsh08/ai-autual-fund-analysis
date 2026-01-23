"use client"
import React from 'react'
import { ArrowRight, Cpu, Terminal, Shield, Layers } from 'lucide-react';
import { Button } from './ui/button';
const FeaturedBento = () => {
  const courses = [
    { title: "Full-Stack AI Engineering", category: "Engineering", meta: "12 Weeks • Advanced" },
    { title: "Design Systems", category: "Design", meta: "6 Weeks • Intermediate" },
    { title: "React Performance", category: "Frontend", meta: "4 Weeks • Expert" },
  ];

  return (
    <section className="py-32 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-center mb-16">
          <div className="text-center">
            <span className="text-xs font-medium text-blue-600 uppercase tracking-widest mb-2 block">Curriculum</span>
            <h2 className="text-4xl font-medium tracking-tighter text-zinc-900">Where our students <span className="text-zinc-400">specialize</span></h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course, i) => (
            <div key={i} className="group relative bg-white border border-zinc-200 rounded-2xl p-8 hover:border-zinc-300 hover:shadow-lg transition-all duration-300">
              <div className="absolute top-8 right-8 text-zinc-400 group-hover:text-zinc-900 transition-colors">
                <ArrowRight size={20} className="-rotate-45" />
              </div>
              
              <div className="h-40 mb-8 rounded-lg bg-zinc-100 overflow-hidden relative border border-zinc-100">
                 <div className={`absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity ${
                   i === 0 ? 'from-blue-500 to-cyan-500' : i === 1 ? 'from-purple-500 to-pink-500' : 'from-amber-500 to-orange-500'
                 }`} />
                 <div className="absolute inset-0 bg-noise opacity-30" />
                 <div className="absolute bottom-4 left-4">
                    <div className="px-2 py-1 bg-white/80 backdrop-blur-md rounded border border-zinc-200 text-[10px] text-zinc-900 font-mono">
                      {course.category.toUpperCase()}
                    </div>
                 </div>
              </div>

              <h3 className="text-xl font-medium text-zinc-900 mb-2">{course.title}</h3>
              <p className="text-zinc-500 text-sm">{course.meta}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="secondary" className="px-8" >View All Courses</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedBento
