
import React from 'react';
import { ShieldCheck, Target, Zap, XCircle, CheckCircle2, Award, Briefcase } from 'lucide-react';

interface WhoTeachesThisProps {
  theme: 'dark' | 'light';
}

export const WhoTeachesThis: React.FC<WhoTeachesThisProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <section className={`py-24 px-6 relative overflow-hidden border-t transition-theme ${isDark ? 'bg-[#050505] border-white/5' : 'bg-[#fafafa] border-black/5'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">The Instructor</h2>
          <h3 className={`text-3xl md:text-5xl font-black tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            Built By Someone Who Did <br className="hidden md:block" />
            This For A Living
          </h3>
        </div>

        {/* Instructor Bio Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
          <div className="lg:col-span-5 relative group">
            <div className={`aspect-[4/5] rounded-3xl overflow-hidden relative border transition-all ${isDark ? 'bg-gradient-to-br from-gray-800 to-black border-white/10' : 'bg-white border-black/5 shadow-xl'}`}>
               {/* Visual Placeholder for Instructor Image */}
               <div className={`absolute inset-0 flex items-center justify-center transition-theme ${isDark ? 'opacity-20 text-white' : 'opacity-10 text-black'}`}>
                  <Briefcase size={120} />
               </div>
               <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t transition-theme ${isDark ? 'from-black to-transparent' : 'from-black/10 to-transparent'}`}>
                  <p className={`text-2xl font-bold mb-1 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Nikhil Sharma</p>
                  <p className={`text-sm font-medium transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ex-Goldman Sachs Risk Analyst</p>
               </div>
            </div>
            {/* Credential Badge */}
            <div className={`absolute -top-4 -right-4 p-6 rounded-2xl shadow-2xl flex flex-col items-center justify-center transform group-hover:rotate-3 transition-all ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
               <span className="text-3xl font-black">5Y</span>
               <span className="text-[10px] font-bold uppercase tracking-tighter">At Goldman Sachs</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
               <h4 className={`text-2xl font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Stress-testing Billions in AUM</h4>
               <p className={`text-lg leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Nikhil Sharma spent 5 years at <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>Goldman Sachs</span>. 
                  His job: Stress-testing mutual fund and hedge fund portfolios worth billions. 
                  Translation: Finding problems <span className={`underline underline-offset-4 ${isDark ? 'text-white underline-white/30' : 'text-black underline-black/20'}`}>BEFORE</span> they cost money.
               </p>
            </div>

            <div className={`p-8 rounded-3xl border relative overflow-hidden transition-theme ${isDark ? 'bg-white/[0.03] border-white/10' : 'bg-white border-black/5 shadow-sm'}`}>
               <div className={`absolute top-0 left-0 w-1 h-full transition-theme ${isDark ? 'bg-white/20' : 'bg-black/10'}`}></div>
               <h5 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                  <Target size={14} />
                  The Realisation
               </h5>
               <p className={`leading-relaxed mb-6 transition-theme ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  The tools Nikhil used daily—overlap analysis, risk-adjusted metrics, benchmark deviation tracking—weren't secret. The frameworks were documented. The data was freely available.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    "No institutional prompts",
                    "Didn't know which metrics",
                    "No interpretation framework",
                    "Didn't have 8 hours to waste"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-500 italic">
                      <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-red-500/50' : 'bg-red-500/30'}`}></span>
                      {item}
                    </div>
                  ))}
               </div>
               <p className={`mt-8 font-bold text-lg transition-theme ${isDark ? 'text-white' : 'text-black'}`}>This workshop fixes that.</p>
            </div>
          </div>
        </div>

        {/* What this is/isn't Manifesto */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-px rounded-3xl overflow-hidden border transition-theme ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'}`}>
          {/* What this isn't */}
          <div className={`p-10 md:p-14 space-y-8 transition-theme ${isDark ? 'bg-black' : 'bg-[#fafafa]'}`}>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 flex items-center gap-3">
               <XCircle size={14} className="text-red-500/50" />
               What This Isn't
            </h4>
            <ul className="space-y-6">
               {[
                 "\"Become a day trader\" course",
                 "\"Get rich with options\" scheme",
                 "Fund recommendations disguised as education",
                 "A sales funnel for advisory services"
               ].map((item, i) => (
                 <li key={i} className="flex items-center gap-4 text-gray-500 group">
                    <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-300'}`}></span>
                    <span className={`transition-colors ${isDark ? 'group-hover:text-gray-400' : 'group-hover:text-black'}`}>{item}</span>
                 </li>
               ))}
            </ul>
          </div>

          {/* What this is */}
          <div className={`p-10 md:p-14 space-y-8 transition-theme ${isDark ? 'bg-white/[0.02]' : 'bg-white'}`}>
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 flex items-center gap-3">
               <CheckCircle2 size={14} className="text-white/50" />
               What This Is
            </h4>
            <div className="space-y-6">
               <p className={`text-3xl font-black leading-tight transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
                  A one-time transfer of <br />
                  <span className={`text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-white to-gray-500' : 'from-black to-gray-500'}`}>verification capability.</span>
               </p>
               <div className={`h-px w-24 transition-theme ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
               <p className={`text-lg leading-relaxed italic transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  "After the workshop, you don't need us. That's the point."
               </p>
            </div>
          </div>
        </div>

        {/* Final Sticky Hook */}
        <div className="mt-24 text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-theme ${isDark ? 'border-white/10 bg-white/5 text-gray-400' : 'border-black/5 bg-black/[0.02] text-gray-500'}`}>
               <Award size={12} className={isDark ? 'text-white' : 'text-black'} />
               Institutional Frameworks. Retail Simplicity.
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
               <button className={`px-12 py-6 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl ${isDark ? 'bg-white text-black hover:scale-[1.02]' : 'bg-black text-white hover:scale-[1.02]'}`}>
                  ENROLL NOW — ₹999
               </button>
               <p className="text-gray-500 text-sm max-w-[200px] text-left leading-snug">
                  Unlock the prompts used by the top 1% of analysts.
               </p>
            </div>
        </div>
      </div>
    </section>
  );
};
