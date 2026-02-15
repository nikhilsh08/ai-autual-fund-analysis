
import React from 'react';

interface FooterProps {
  theme: 'dark' | 'light';
}

export const Footer: React.FC<FooterProps> = ({ theme }) => {
  const isDark = theme === 'dark';

  return (
    <footer className={`border-t py-16 px-6 relative z-10 transition-theme ${isDark ? 'border-white/10 bg-black text-white' : 'border-black/5 bg-white text-black'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

          {/* Brand Column */}
          <div>
            <h3 className="text-blue-600 font-bold text-lg mb-6">CashFlowCrew</h3>
            <p className={`text-sm leading-relaxed transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Empowering individuals with professional-grade mutual fund investment knowledge and strategies.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className={`font-bold text-lg mb-6 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Quick Links</h4>
            <ul className={`space-y-4 text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>Meet Your Mentor</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>Workshop Details</a></li>
              <li><a href="#" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>FAQs</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h4 className={`font-bold text-lg mb-6 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Legal</h4>
            <ul className={`space-y-4 text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <li><a href="/privacy-policy" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>Privacy Policy</a></li>
              <li><a href="/terms-conditions" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>Terms & Conditions</a></li>
              <li><a href="/refund-policy" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>Refund Policy</a></li>
              <li><a href="/delivery-policy" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>Delivery Policy</a></li>
              <li><a href="/contact-us" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>Contact us</a></li>
            </ul>
          </div>

          {/* Contact Us Column */}
          <div>
            <h4 className={`font-bold text-lg mb-6 transition-theme ${isDark ? 'text-white' : 'text-black'}`}>Contact Us</h4>
            <ul className={`space-y-4 text-sm transition-theme ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <li><a href="mailto:support@cashflowcrew.in" className={`transition-colors ${isDark ? 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600' : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600'}`}>support@cashflowcrew.in</a></li>
              <li className={`font-medium ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>CollaBroot Marketing Private Limited</li>
              <li className="leading-relaxed">
                3rd Floor, Vision Comptech Integrators Limited, Time Square, 106 Sushant Lok Phase 1, B-Block<br />
                Gurugram, Haryana, 122009
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`flex flex-col md:flex-row justify-between items-center pt-8 border-t text-xs transition-theme ${isDark ? 'border-white/10 text-gray-500' : 'border-zinc-200 text-gray-500'}`}>
          <div>&copy; 2026 CashFlowCrew. All rights reserved.</div>
          <div className="mt-4 md:mt-0">
            <a href="#" className={`transition-colors ${isDark ? 'hover:text-gray-300' : 'hover:text-gray-900'}`}>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
