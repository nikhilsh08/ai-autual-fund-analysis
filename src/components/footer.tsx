// src/components/footer.tsx
import Link from "next/link";

export const Footer = () => (
  <footer className="py-20 bg-ink border-t border-ink/20 text-sm">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">

        {/* Brand Column */}
        <div>
          <h3 className="text-xl font-bold text-cream mb-6">CashFlow<span className="text-accent">Crew</span></h3>
          <p className="text-cream/70 leading-relaxed mb-6 max-w-sm">
            Empowering Indian investors with institutional-grade financial education.
          </p>
          <div className="flex gap-4">
            {/* Social Links Placeholders */}
            {/* <a href="#" className="text-cream/50 hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="text-cream/50 hover:text-accent transition-colors">YouTube</a>
            <a href="#" className="text-cream/50 hover:text-accent transition-colors">LinkedIn</a> */}
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-bold text-cream mb-6">Quick Links</h4>
          <ul className="space-y-4 text-cream/70">
            <li><Link href="/courses" className="hover:text-accent transition-colors">All Courses</Link></li>
            <li><Link href="/ai-mutual-fund" className="hover:text-accent transition-colors">Live Workshops</Link></li>
            <li><Link href="/#about" className="hover:text-accent transition-colors">About Us</Link></li>
            <li><Link href="/contact-us" className="hover:text-accent transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-bold text-cream mb-6">Legal</h4>
          <ul className="space-y-4 text-cream/70">
            <li><Link href="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-conditions" className="hover:text-accent transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/refund-policy" className="hover:text-accent transition-colors">Refund Policy</Link></li>
            <li><Link href="/delivery-policy" className="hover:text-accent transition-colors">Delivery Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-cream/10 pt-8 text-cream/50 text-xs leading-relaxed space-y-4">
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
