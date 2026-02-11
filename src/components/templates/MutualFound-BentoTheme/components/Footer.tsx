
import React from 'react';

interface FooterProps {
  theme: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  
  return (
    <footer className={`border-t py-16 px-6 relative z-10 transition-theme ${isDark ? 'border-white/10 bg-black' : 'border-black/5 bg-white text-black'}`}>
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
        
        {/* Brand Section */}
        <div className="max-w-xs space-y-6">
          <h3 className="text-2xl font-bold text-blue-600">CashFlowCrew</h3>
          <p className={`text-sm leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Empowering individuals with professional-grade mutual fund investment knowledge and strategies.
          </p>
        </div>
        
        {/* Links Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-12 w-full">
          
          {/* Quick Links */}
          <div className="space-y-6">
            <h5 className={`font-bold text-lg transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Quick Links</h5>
            <ul className={`space-y-4 text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Meet Your Mentor</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>workshop Details</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>FAQs</a></li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="space-y-6">
            <h5 className={`font-bold text-lg transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Legal</h5>
            <ul className={`space-y-4 text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Privacy Policy</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Terms & Conditions</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Refund Policy</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Delivery Policy</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>Contact us</a></li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div className="space-y-6">
            <h5 className={`font-bold text-lg transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Contact Us</h5>
            <ul className={`space-y-4 text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              <li>
                <a href="mailto:support@cashflowcrew.in" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                  support@cashflowcrew.in
                </a>
              </li>
              <li>
                <span className={`block font-semibold mb-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>Collabroot Marketing Private Limited</span>
                <span className="leading-relaxed block opacity-80">
                  3rd Floor, Vision Comptech Integrators Limited, Time Square, 106 Sushant Lok Phase 1, B-Block Gurugram, Haryana, 122009
                </span>
              </li>
            </ul>
          </div>
          
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className={`max-w-6xl mx-auto mt-20 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm transition-theme ${isDark ? 'border-white/5 text-gray-600' : 'border-black/5 text-gray-500'}`}>
        <p>© 2026 CashFlowCrew. All rights reserved.</p>
        <a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-400' : 'hover:text-gray-800'}`}>Cookie Policy</a>
      </div>
    </footer>
  );
};
