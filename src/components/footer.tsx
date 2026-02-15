// src/components/footer.tsx
import Link from "next/link";

export const Footer = () => (
  <footer className="py-20 bg-white border-t border-zinc-200 text-sm">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">

        {/* Brand Column */}
        <div>
          <h3 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 font-bold text-lg mb-6">CashFlowCrew</h3>
          <p className="text-zinc-500 leading-relaxed">
            Empowering individuals with professional-grade mutual fund investment knowledge and strategies.
          </p>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="font-medium text-zinc-900 mb-6">Quick Links</h4>
          <ul className="space-y-4 text-zinc-500">
            <li><Link href="/delivery-policy" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">Delivery Policy</Link></li>
            <li><Link href="/contact-us" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">Workshop Details</Link></li>
            <li><Link href="#" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">FAQs</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div>
          <h4 className="font-medium text-zinc-900 mb-6">Legal</h4>
          <ul className="space-y-4 text-zinc-500">
            <li><Link href="/privacy-policy" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms-conditions" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">Terms & Conditions</Link></li>
            <li><Link href="/refund-policy" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">Refund Policy</Link></li>
            <li><Link href="/delivery-policy" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">Delivery Policy</Link></li>
            <li><Link href="/contact-us" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">Contact us</Link></li>
          </ul>
        </div>

        {/* Contact Us Column */}
        <div>
          <h4 className="font-medium text-zinc-900 mb-6">Contact Us</h4>
          <ul className="space-y-4 text-zinc-500">
            <li><a href="mailto:support@cashflowcrew.in" className="hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-600 hover:to-indigo-600 transition-colors">support@cashflowcrew.in</a></li>
            <li className="font-medium text-zinc-900">CollaBroot Marketing Private Limited</li>
            <li className="leading-relaxed">
              3rd Floor, Vision Comptech Integrators Limited, Time Square, 106 Sushant Lok Phase 1, B-Block<br />
              Gurugram, Haryana, 122009
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-200 text-zinc-500 text-xs">
        <div>&copy; 2026 CashFlowCrew. All rights reserved.</div>
        <div className="mt-4 md:mt-0">
          <Link href="#" className="hover:text-zinc-900 transition-colors">Cookie Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);
