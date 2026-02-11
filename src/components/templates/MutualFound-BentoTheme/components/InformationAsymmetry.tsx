
import React from 'react';
import { ArrowDown, MessageSquare, ShieldCheck, Zap, Info, Lock } from 'lucide-react';

interface InformationAsymmetryProps {
  theme: 'dark' | 'light';
}

const PyramidTier: React.FC<{ 
  title: string; 
  subtitle: string; 
  items: string[]; 
  isUser?: boolean;
  isDark: boolean;
}> = ({ title, subtitle, items, isUser, isDark }) => (
  <div className={`p-6 md:p-8 rounded-3xl border transition-all hover:scale-[1.01] ${isUser 
    ? (isDark ? 'border-white/30 bg-white/5 ring-1 ring-white/20' : 'border-black/20 bg-black/[0.02] ring-1 ring-black/10 shadow-lg') 
    : (isDark ? 'border-white/10 bg-white/[0.02]' : 'border-black/5 bg-white shadow-sm')}`}>
    <div className="flex justify-between items-start mb-6">
      <div>
        <h4 className={`text-xl font-bold transition-theme ${isUser ? (isDark ? 'text-white' : 'text-black') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>{title}</h4>
        <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
      </div>
      {isUser ? (
        <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wider transition-theme ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>Targeted Tier</span>
      ) : (
        <Lock size={16} className="text-gray-500" />
      )}
    </div>
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-center gap-3 text-sm transition-theme text-gray-500">
          <div className={`w-1 h-1 rounded-full flex-shrink-0 ${isUser ? (isDark ? 'bg-white' : 'bg-black') : 'bg-gray-400'}`}></div>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const ConversationBox: React.FC<{ 
  role: string; 
  text: string; 
  isPrimary?: boolean;
  isDark: boolean;
}> = ({ role, text, isPrimary, isDark }) => (
  <div className={`p-4 rounded-2xl border transition-theme ${isPrimary 
    ? (isDark ? 'bg-white/10 border-white/10' : 'bg-black/5 border-black/10') 
    : (isDark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-black/5 shadow-sm')}`}>
    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">{role}</p>
    <p className={`text-sm leading-relaxed transition-theme ${isPrimary ? (isDark ? 'text-white font-medium' : 'text-black font-semibold') : (isDark ? 'text-gray-400' : 'text-gray-600')}`}>"{text}"</p>
  </div>
);

export const InformationAsymmetry: React.FC<InformationAsymmetryProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <section id="solution" className={`py-24 px-6 relative overflow-hidden transition-theme ${isDark ? 'bg-[#050505]' : 'bg-white'}`}>
      {/* Decorative Gradient Line */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent ${isDark ? 'via-white/10' : 'via-black/10'} to-transparent`}></div>
      
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-500 mb-4 italic">The Information Asymmetry</h2>
          <h3 className={`text-3xl md:text-5xl font-bold tracking-tight mb-8 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            Why Ultra-HNIs Get Better Advice <br className="hidden md:block" />
            <span className="text-gray-500">(It's Not What You Think)</span>
          </h3>
          <div className={`max-w-2xl mx-auto space-y-4 text-lg transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>You might think the ultra-wealthy get better investment advice because they have smarter advisors.</p>
            <p className={`font-semibold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>That's not it.</p>
            <p>They get better advice because they have access to better <span className={isDark ? 'text-white font-medium' : 'text-black font-semibold'}>TOOLS</span>.</p>
          </div>
        </div>

        {/* The Pyramid */}
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-24">
          <PyramidTier 
            isDark={isDark}
            title="ULTRA HNI" 
            subtitle="₹50Cr+ Portfolios" 
            items={[
              "RIA (0.5-1.5%, capped at ₹30L+/year)",
              "Institutional Database (ACE, Bloomberg)",
              "Direct Fund Manager Calls",
              "Dedicated Risk Analytics Team"
            ]}
          />
          
          <div className="hidden lg:flex flex-col justify-center items-center opacity-20">
             <ArrowDown size={32} className={isDark ? 'text-white' : 'text-black'} />
             <span className={`text-[10px] font-bold tracking-tighter uppercase mt-2 ${isDark ? 'text-white' : 'text-black'}`}>The Gap</span>
          </div>

          <PyramidTier 
            isDark={isDark}
            title="HNI" 
            subtitle="₹5-50Cr Portfolios" 
            items={[
              "Fee-only RIA or Commission Advisor",
              "Morningstar Direct Access",
              "Quarterly Portfolio Reviews",
              "Risk-adjusted Return Analysis"
            ]}
          />

          <div className="hidden lg:flex flex-col justify-center items-center opacity-20">
             <ArrowDown size={32} className={isDark ? 'text-white' : 'text-black'} />
             <span className={`text-[10px] font-bold tracking-tighter uppercase mt-2 ${isDark ? 'text-white' : 'text-black'}`}>The Gap</span>
          </div>

          <PyramidTier 
            isDark={isDark}
            title="YOU" 
            subtitle="₹5-50L Portfolios" 
            isUser
            items={[
              "Commission-based Advisor or DIY",
              "\"Trust the Recommendation\"",
              "No Verification Tools",
              "Regular Plans cost 0.5-1% more annually"
            ]}
          />
        </div>

        {/* The Gap in Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24">
          {/* Ultra HNI Scenario */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap size={20} className="text-yellow-500" />
              <h4 className={`text-xl font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Ultra-HNI Conversation</h4>
            </div>
            <div className="space-y-4">
              <ConversationBox isDark={isDark} role="Client" text="Show me the downside-risk metric for this balanced fund during the 2020 crash." isPrimary />
              <ConversationBox isDark={isDark} role="Advisor" text="It dropped to 0.31 during March 2020, indicating poor crash protection. I recommend this alternative with 0.94 during the same period." />
              <div className="flex items-center gap-2 text-xs font-bold text-green-500 uppercase tracking-widest pt-2">
                <ShieldCheck size={14} />
                Decision: Data-driven. Verified. Confident.
              </div>
            </div>
          </div>

          {/* Your Scenario */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Info size={20} className="text-blue-500" />
              <h4 className={`text-xl font-bold transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Your Conversation</h4>
            </div>
            <div className="space-y-4">
              <ConversationBox isDark={isDark} role="You" text="Is this balanced fund good?" isPrimary />
              <ConversationBox isDark={isDark} role="Advisor" text="Yes, it protects downside during crashes. Trust me." />
              <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest pt-2">
                <MessageSquare size={14} />
                Decision: Trust-based. Unverified. Anxious.
              </div>
            </div>
          </div>
        </div>

        {/* Final Hook */}
        <div className={`max-w-3xl mx-auto text-center border-t pt-16 transition-theme ${isDark ? 'border-white/5' : 'border-black/5'}`}>
          <p className={`mb-6 italic transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>"But I don't have ₹1 lakh for expensive data tools. So what am I supposed to do?"</p>
          <h4 className={`text-2xl md:text-3xl font-bold mb-10 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>
            That's exactly why <span className={`underline underline-offset-8 ${isDark ? 'underline-white/30' : 'underline-black/20 font-semibold'}`}>these AI prompts</span> exist.
          </h4>
          
          <div className="flex flex-col items-center gap-6">
            <button className={`group relative px-12 py-6 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-2xl ${isDark ? 'bg-white text-black hover:scale-[1.02]' : 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02]'}`}>
              ENROLL NOW — ₹999
            </button>
            <p className="text-sm text-gray-500">Stop making unverified decisions. Bridge the gap today.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
