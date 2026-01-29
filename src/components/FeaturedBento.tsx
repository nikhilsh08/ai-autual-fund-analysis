"use client"
import React from 'react'
import { ArrowRight, Cpu, Terminal, Shield, Layers } from 'lucide-react';
import { Button } from './ui/button';
import Coursecard from './Coursecard';


const FeaturedBento = () => {
const courses = [
    { 
      id: 1, 
      title: "Full-Stack AI Engineering", 
      category: "Engineering", 
      price: 199,
      originalPrice: 1999,
      students: 5000,
      isNew: true,
      features: ["Build 5 AI apps", "RAG pipelines", "Vercel AI SDK"]
    },
    { 
      id: 2, 
      title: "Design Systems", 
      category: "Design", 
      price: 149, 
      originalPrice: 1499,
      students: 3200, 
      isNew: false,
      features: ["Figma variables", "Component API", "Documentation"]
    },
    { 
      id: 3, 
      title: "React Performance", 
      category: "Frontend", 
      price: 129, 
      originalPrice: 1299,
      students: 4500, 
      isNew: false,
      features: ["Re-render fixing", "Memory profiling", "Bundle optimization"]
    },
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
         {courses.map((course) => (
            <Coursecard 
              key={course.id}
              course={course}
            />
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
