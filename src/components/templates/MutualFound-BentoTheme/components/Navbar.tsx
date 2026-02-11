
import React from 'react';

interface NavbarProps {
  theme: 'dark' | 'light';
}

export const Navbar: React.FC<NavbarProps> = ({ theme }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center border-b border-black/5 bg-white/70 backdrop-blur-md transition-all">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-black text-white">
          <span className="font-bold text-lg">M</span>
        </div>
        <span className="font-semibold tracking-tight text-xl text-black">FundAI</span>
      </div>
      
      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#problem" className="transition-colors hover:text-black">The Problem</a>
          <a href="#solution" className="transition-colors hover:text-black">The Framework</a>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-full font-medium transition-all bg-black text-white hover:bg-gray-800">
            Enroll Now
          </button>
        </div>
      </div>
    </nav>
  );
};
