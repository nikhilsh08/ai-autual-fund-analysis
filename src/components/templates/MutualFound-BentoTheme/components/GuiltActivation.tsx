
import React from 'react';
import { CheckCircle2, AlertCircle, Clock, FileText, Ban, Layers, TrendingDown, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

interface GuiltActivationProps { theme: 'dark' | 'light'; }

const ChecklistItem: React.FC<{ children: React.ReactNode; isDark: boolean; index: number }> = ({ children, isDark, index }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className={`flex items-start gap-4 p-6 rounded-3xl border transition-all group ${isDark ? 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04]' : 'border-black/5 bg-white hover:bg-black/[0.01] shadow-sm hover:shadow-md'}`}
  >
    <CheckCircle2 className={`mt-1 flex-shrink-0 transition-transform group-hover:scale-110 ${isDark ? 'text-white' : 'text-black'}`} size={20} />
    <div className={`leading-relaxed text-left transition-theme ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{children}</div>
  </motion.div>
);

const Step: React.FC<{ num: number; title: string; desc: string; icon: React.ReactNode; isDark: boolean; index: number }> = ({ num, title, desc, icon, isDark, index }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.1, duration: 0.4 }}
    className="flex gap-6 items-start relative pb-10 last:pb-0 group"
  >
    <div className={`absolute left-[15px] top-[30px] bottom-0 w-[1px] group-last:hidden transition-theme ${isDark ? 'bg-white/10' : 'bg-black/10'}`}></div>
    <div className={`z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border transition-theme ${isDark ? 'bg-white/10 border-white/20 text-white' : 'bg-black/5 border-black/10 text-black'}`}>
      {num}
    </div>
    <div className="flex-1 text-left">
      <div className="flex items-center gap-3 mb-1">
        <span className={isDark ? 'text-white/40' : 'text-black/40'}>{icon}</span>
        <h4 className={`font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>{title}</h4>
      </div>
      <p className={`text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
    </div>
  </motion.div>
);

export const GuiltActivation: React.FC<GuiltActivationProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <section id="problem" className={`py-32 px-6 relative overflow-hidden transition-theme ${isDark ? 'bg-black' : 'bg-[#fafafa]'}`}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="text-sm font-black tracking-[0.3em] uppercase text-gray-500 mb-6 italic"
          >
            Guilt Activation
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className={`text-4xl md:text-6xl font-black tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}
          >
            You've Been Meaning to Check This. <br className="hidden md:block" />
            But You Never Actually Did.
          </motion.h3>
        </div>

        {/* The Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-32">
          {[
            { text: <>You've Googled <span className={isDark ? 'text-white font-medium' : 'text-black font-semibold'}>"best mutual funds"</span> 5+ times → Still confused who to trust.</> },
            { text: <>Your advisor said <span className={isDark ? 'text-white font-medium' : 'text-black font-semibold'}>"don't worry about expense ratios"</span> → You wonder if 1.8% is high.</> },
            { text: <>You have <span className={isDark ? 'text-white font-medium' : 'text-black font-semibold'}>4-5 funds</span> for "diversification" → Never checked if they own the same stocks.</> },
            { text: <>You planned to review quarterly → It's been <span className={isDark ? 'text-white font-medium' : 'text-black font-semibold'}>18 months</span> since your last look.</> },
            { text: <>You're in <span className={isDark ? 'text-white font-medium' : 'text-black font-semibold'}>ULIPs</span> → Because your bank manager said "it's for your kids."</> },
            { text: <>Your fund fell 22% → You had <span className={isDark ? 'text-white font-medium' : 'text-black font-semibold'}>no framework</span> to decide if that was normal.</> }
          ].map((item, i) => (
            <ChecklistItem key={i} index={i} isDark={isDark}>{item.text}</ChecklistItem>
          ))}
        </div>

        {/* The Truth */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`border rounded-[3rem] p-10 md:p-20 text-center mb-32 relative overflow-hidden transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-black/5 shadow-2xl shadow-black/[0.02]'}`}
        >
          <h4 className={`text-4xl font-black mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>THE TRUTH</h4>
          <div className={`space-y-6 text-2xl transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>You're not bad with money. You're not lazy.</p>
            <p className={`font-black pt-4 ${isDark ? 'text-white' : 'text-black'}`}>You're missing ONE thing:</p>
            <p className={isDark ? 'text-white/80' : 'text-black/70'}>The tools to verify what you know you should be checking.</p>
          </div>
        </motion.div>

        {/* DIY Reality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div className="text-left">
            <h3 className={`text-4xl font-black mb-12 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Let me show you why you give up...</h3>
            <div className="space-y-0">
              <Step isDark={isDark} index={0} num={1} title="Factsheet Hunt" desc="Download factsheet for Fund A" icon={<FileText size={18}/>} />
              <Step isDark={isDark} index={1} num={2} title="Data Extraction" desc="Find the 'Top 10 Holdings' section" icon={<Layers size={18}/>} />
              <Step isDark={isDark} index={2} num={3} title="Excel Hell" desc="'Reliance Ind' vs 'RELIANCE' — manual mismatch." icon={<Ban size={18}/>} />
              <Step isDark={isDark} index={3} num={4} title="Repetition" desc="Repeat for Funds B, C, D, E → 2 hours gone" icon={<Clock size={18}/>} />
              <Step isDark={isDark} index={4} num={5} title="Manual Sync" desc="Manual checking names across 5 different PDFs." icon={<Layers size={18}/>} />
              <Step isDark={isDark} index={5} num={6} title="The Collapse" desc="Give up at 3 hours → Still don't know the overlap %" icon={<TrendingDown size={18}/>} />
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={`border p-12 rounded-[2.5rem] sticky top-32 transition-all ${isDark ? 'bg-white/[0.02] border-white/10' : 'bg-white border-black/5 shadow-2xl shadow-black/[0.05]'}`}
          >
            <h4 className={`text-2xl font-black mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>The Reality</h4>
            <div className={`space-y-8 leading-relaxed text-lg transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>It's because the <span className={isDark ? 'text-white font-black' : 'text-black font-black'}>EFFORT required vs TIME you have</span> makes it impossible.</p>
              <p>And that postponement costs you. Not because of a bad decision, but because you never had tools to make an <span className="underline underline-offset-8 decoration-white/20">INFORMED</span> one.</p>
              <div className="pt-8">
                <button className={`w-full py-6 rounded-2xl font-black text-xl transition-all shadow-xl active:scale-95 ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>
                  ENROLL NOW — ₹999
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
