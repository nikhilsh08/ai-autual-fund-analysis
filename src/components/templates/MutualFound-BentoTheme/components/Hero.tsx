
import React from 'react';
import { ChevronRight, ShieldCheck, Users, Zap, TrendingUp, Search, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  theme: 'dark' | 'light';
}

const FloatingBadge: React.FC<{ 
  children: React.ReactNode; 
  className: string;
  isDark: boolean;
  delay?: number;
}> = ({ children, className, isDark, delay = 0 }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ 
      opacity: 1, 
      scale: 1, 
      y: [0, -10, 0],
    }}
    transition={{
      opacity: { duration: 0.8, delay },
      scale: { duration: 0.8, delay },
      y: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay
      }
    }}
    className={`absolute hidden lg:flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-md shadow-2xl z-20 ${className} ${
      isDark ? 'border-white/10 bg-white/5 text-white/80' : 'border-black/10 bg-white text-black/80 shadow-black/5'
    }`}
  >
    {children}
  </motion.div>
);

export const Hero: React.FC<HeroProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <section className={`relative pt-40 pb-24 px-6 hero-gradient overflow-hidden transition-theme min-h-[95vh] flex flex-col items-center justify-center`}>
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3] 
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] blur-[150px] rounded-full pointer-events-none transition-theme ${isDark ? 'bg-white/5' : 'bg-black/[0.04]'}`}
      ></motion.div>

      {/* Floating Elements filling the "Blank Parts" */}
      <FloatingBadge isDark={isDark} className="top-[20%] left-[8%]" delay={0.2}>
        <Zap size={14} className="text-yellow-500" />
        <span className="text-xs font-black uppercase tracking-widest">6 AI Prompts</span>
      </FloatingBadge>
      
      <FloatingBadge isDark={isDark} className="top-[35%] right-[10%]" delay={0.5}>
        <TrendingUp size={14} className="text-green-500" />
        <span className="text-xs font-black uppercase tracking-widest">₹11k Avg Discovery</span>
      </FloatingBadge>
      
      <FloatingBadge isDark={isDark} className="bottom-[45%] left-[12%]" delay={0.8}>
        <BarChart3 size={14} className="text-blue-500" />
        <span className="text-xs font-black uppercase tracking-widest">Risk Verified</span>
      </FloatingBadge>
      
      <FloatingBadge isDark={isDark} className="bottom-[50%] right-[6%]" delay={1.1}>
        <Search size={14} className="text-purple-500" />
        <span className="text-xs font-black uppercase tracking-widest">Portfolio Audit</span>
      </FloatingBadge>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Credibility Badge */}
          <div className={`inline-flex items-center gap-3 px-4 py-2 rounded-full border backdrop-blur-sm mb-8 text-sm transition-theme ${isDark ? 'border-white/10 bg-white/5 text-gray-400' : 'border-black/10 bg-black/[0.02] text-gray-500'}`}>
            <span className={`flex items-center gap-1.5 border-r pr-3 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <ShieldCheck size={16} className={isDark ? 'text-white' : 'text-black'} />
              Built by ex-Goldman Sachs Analyst
            </span>
            <span className="flex items-center gap-1.5">
              <Users size={16} className={isDark ? 'text-white' : 'text-black'} />
              500+ Investors
            </span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1] transition-theme ${isDark ? 'text-white' : 'text-black'}`}
        >
          Check If Your Mutual Funds <br className="hidden md:block" />
          Are <span className={`bg-gradient-to-b bg-clip-text text-transparent ${isDark ? 'from-white to-gray-500' : 'from-black to-gray-600 font-black'}`}>Actually Good</span> — In 5 Minutes
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className={`max-w-2xl mx-auto text-lg md:text-2xl mb-12 leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Copy-paste prompts that reveal exact portfolio overlap, hidden fee drag, and whether your returns justify the risk you're taking. <span className={isDark ? 'text-white font-medium' : 'text-black font-extrabold underline decoration-black/10 underline-offset-8'}>No finance degree. No Excel. Just answers.</span>
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col items-center gap-6"
        >
          <button className={`group relative px-14 py-7 rounded-2xl font-black text-2xl transition-all active:scale-95 shadow-2xl ${isDark ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800 shadow-black/20'}`}>
            ENROLL NOW — ₹999
            <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Wondering if this is actually your problem?
            </p>
            <p className="text-xs text-gray-400 italic font-bold uppercase tracking-[0.2em]">
              Scroll to see the reality...
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative Browser UI */}
      <motion.div 
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className={`mt-24 max-w-6xl mx-auto border rounded-2xl overflow-hidden backdrop-blur shadow-2xl transition-theme ${isDark ? 'border-white/10 bg-white/5' : 'border-black/5 bg-white shadow-xl shadow-black/5'}`}
      >
        <div className={`flex items-center gap-2 p-3 border-b transition-theme ${isDark ? 'bg-white/5 border-white/5' : 'bg-black/[0.03] border-black/5'}`}>
          <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          <div className={`ml-4 h-5 w-48 rounded-full transition-theme ${isDark ? 'bg-white/10' : 'bg-black/[0.08]'}`}></div>
        </div>
        <div className={`aspect-video p-8 md:p-16 flex items-center justify-center transition-theme ${isDark ? 'bg-[#0c0c0c]' : 'bg-white'}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full">
                <div className="space-y-6">
                    <div className={`h-6 w-3/4 rounded-full transition-theme ${isDark ? 'bg-white/10' : 'bg-black/[0.08]'}`}></div>
                    <div className={`h-6 w-1/2 rounded-full transition-theme ${isDark ? 'bg-white/10' : 'bg-black/[0.08]'}`}></div>
                    <div className={`h-40 w-full rounded-3xl border transition-theme ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/[0.02] border-black/5'}`}></div>
                </div>
                <div className="space-y-6 hidden md:block">
                    <div className={`h-48 w-full rounded-3xl border transition-theme ${isDark ? 'bg-gradient-to-br from-white/10 to-transparent border-white/10' : 'bg-gradient-to-br from-black/[0.03] to-transparent border-black/5'}`}></div>
                    <div className={`h-6 w-full rounded-full transition-theme ${isDark ? 'bg-white/10' : 'bg-black/[0.08]'}`}></div>
                </div>
            </div>
        </div>
      </motion.div>
    </section>
  );
};
