// src/components/footer.tsx
import Link from "next/link";

export const Footer = () => (
  <footer className="py-20 bg-zinc-50 border-t border-zinc-200 text-sm">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">

        {/* Brand Column */}
        <div>
          <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6">CashFlowCrew</h3>
          <p className="text-zinc-500 leading-relaxed mb-6 max-w-sm">
            Empowering Indian investors with institutional-grade financial education.
          </p>
          <div className="flex gap-4">
            {/* Social Links Placeholders */}
            <a href="#" className="text-zinc-400 hover:text-blue-600 transition-colors">Instagram</a>
            <a href="#" className="text-zinc-400 hover:text-red-600 transition-colors">YouTube</a>
            <a href="#" className="text-zinc-400 hover:text-blue-700 transition-colors">LinkedIn</a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-bold text-zinc-900 mb-6">Quick Links</h4>
          <ul className="space-y-4 text-zinc-600">
            <li><Link href="/courses" className="hover:text-blue-600 transition-colors">All Courses</Link></li>
            <li><Link href="/workshops" className="hover:text-blue-600 transition-colors">Live Workshops</Link></li>
            <li><Link href="/about" className="hover:text-blue-600 transition-colors">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-blue-600 transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-bold text-zinc-900 mb-6">Legal</h4>
          <ul className="space-y-4 text-zinc-600">
            <li><Link href="/privacy-policy" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-conditions" className="hover:text-blue-600 transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/refund-policy" className="hover:text-blue-600 transition-colors">Refund Policy</Link></li>
            <li><Link href="/delivery-policy" className="hover:text-blue-600 transition-colors">Delivery Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200 pt-8 text-zinc-500 text-xs leading-relaxed space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p>&copy; 2026 CashFlowCrew. All rights reserved.</p>
          <p>Collabroot Marketing Private Limited, Gurugram, Haryana</p>
        </div>
        <p className="max-w-4xl opacity-80">
          Disclaimer: For educational purposes only. Not investment advice. Consult a SEBI-registered RIA for personalized advice.
        </p>
      </div>
    </div>
  </footer>
);
