
import React from 'react';
import { Quote, Star, Users, TrendingUp, IndianRupee, ArrowRight } from 'lucide-react';

interface ProofItWorksProps {
  theme: 'dark' | 'light';
}

const TestimonialCard: React.FC<{
  quote: string;
  name: string;
  role: string;
  portfolio: string;
  isDark: boolean;
}> = ({ quote, name, role, portfolio, isDark }) => (
  <div className={`p-8 rounded-3xl border transition-all flex flex-col justify-between group ${isDark ? 'border-white/10 bg-white/[0.02] hover:bg-white/[0.04]' : 'border-black/5 bg-white shadow-sm hover:shadow-md'}`}>
    <div>
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} className={`fill-current ${isDark ? 'text-white' : 'text-black'}`} />
        ))}
      </div>
      <p className={`leading-relaxed mb-8 italic transition-theme ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>"{quote}"</p>
    </div>
    
    <div className={`flex items-center gap-4 border-t pt-6 transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
      <div className={`w-12 h-12 rounded-full border flex items-center justify-center transition-theme ${isDark ? 'bg-gradient-to-br from-gray-700 to-gray-900 border-white/10' : 'bg-black/5 border-black/5'}`}>
        <span className={isDark ? 'text-white font-bold' : 'text-black font-bold'}>{name.charAt(0)}</span>
      </div>
      <div>
        <h5 className={`font-bold text-sm transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{name}</h5>
        <p className="text-gray-500 text-xs">{role}</p>
        <p className={`text-[10px] font-bold uppercase tracking-tighter mt-1 transition-theme ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>{portfolio}</p>
      </div>
    </div>
  </div>
);

export const ProofItWorks: React.FC<ProofItWorksProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-[#050505] border-white/5' : 'bg-[#fafafa] border-black/5'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">Proof It Works</h2>
          <h3 className={`text-3xl md:text-5xl font-bold tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            What Others Discovered
          </h3>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          <TestimonialCard 
            isDark={isDark}
            name="Amit S."
            role="IT Manager, Bangalore"
            portfolio="₹18L portfolio"
            quote="I had 4 'diversified' large cap funds. Turns out they had 71% overlap—I was basically paying 4 expense ratios for the same portfolio. Switched to 2 funds + 1 index fund. Saving ₹8,000/year in fees."
          />
          <TestimonialCard 
            isDark={isDark}
            name="Priya M."
            role="Doctor, Delhi"
            portfolio="₹12L portfolio"
            quote="My bank had been pushing a ULIP for 2 years. I ran the IRR calculation from the workshop—4.1% return vs 11% from index funds. Exposed. Avoided a ₹2L mistake over 15 years."
          />
          <TestimonialCard 
            isDark={isDark}
            name="Karthik R."
            role="Operations Head, Chennai"
            portfolio="₹28L portfolio"
            quote="I always felt guilty about not reviewing my portfolio. Now I spend 15 minutes every month running these prompts. For the first time, I actually know what I own and why."
          />
        </div>

        {/* The Aggregate Section */}
        <div className={`relative rounded-3xl border p-8 md:p-12 overflow-hidden transition-theme ${isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/5 bg-white shadow-xl'}`}>
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <Users size={200} className={isDark ? 'text-white' : 'text-black'} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <h4 className="text-sm font-bold tracking-widest text-gray-500 uppercase mb-6">The Aggregate</h4>
              <p className={`text-2xl md:text-3xl font-bold mb-6 leading-tight transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
                500+ investors have taken this workshop.
              </p>
              <div className="space-y-4">
                <div className={`flex items-start gap-4 p-4 rounded-xl border transition-theme ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                  <TrendingUp className="text-green-500 mt-1" size={20} />
                  <p className={`transition-theme ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Average discovery:</span> ₹11,000/year in avoidable fees or overlap inefficiency.
                  </p>
                </div>
                <div className={`flex items-start gap-4 p-4 rounded-xl border transition-theme ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
                  <IndianRupee className={isDark ? 'text-white mt-1' : 'text-black mt-1'} size={20} />
                  <p className={`transition-theme ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>Most common reaction:</span> "Why didn't I know this earlier?"
                  </p>
                </div>
              </div>
            </div>

            <div className={`flex flex-col items-center justify-center p-8 rounded-2xl text-center transition-theme ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              <p className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-50">Join the elite 1%</p>
              <h4 className="text-3xl font-black mb-8 leading-tight">Take back control of <br /> your wealth.</h4>
              <button className={`w-full py-5 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl ${isDark ? 'bg-black text-white hover:bg-black/90' : 'bg-white text-black hover:bg-white/90'}`}>
                ENROLL NOW — ₹999
                <ArrowRight size={20} />
              </button>
              <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Limited Slots for Next Cohort</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
