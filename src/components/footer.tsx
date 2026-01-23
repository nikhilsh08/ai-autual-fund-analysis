import { Button } from "./ui/button";



export const Footer = () => (
  <footer className="py-20 bg-zinc-50 border-t border-zinc-200 text-sm">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 font-bold text-lg text-zinc-900 mb-6">
            <div className="w-5 h-5 bg-black rounded-sm flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-white rounded-full" />
            </div>
            CFC ACADEMY
          </div>
          <p className="text-zinc-500 max-w-xs mb-8">
            The learning platform for ambitious developers. Master your craft with institutional-grade resources.
          </p>
          <div className="flex gap-4">
             <Button variant="secondary" className="py-2 px-4 h-auto text-xs bg-white">Join Discord</Button>
          </div>
        </div>
        
        <div>
           <h4 className="font-medium text-zinc-900 mb-6">Platform</h4>
           <ul className="space-y-4 text-zinc-500">
             <li><a href="#" className="hover:text-zinc-900 transition-colors">Courses</a></li>
             <li><a href="#" className="hover:text-zinc-900 transition-colors">Workshops</a></li>
             <li><a href="#" className="hover:text-zinc-900 transition-colors">Pricing</a></li>
           </ul>
        </div>

        <div>
           <h4 className="font-medium text-zinc-900 mb-6">Company</h4>
           <ul className="space-y-4 text-zinc-500">
             <li><a href="#" className="hover:text-zinc-900 transition-colors">About</a></li>
             <li><a href="#" className="hover:text-zinc-900 transition-colors">Careers</a></li>
             <li><a href="#" className="hover:text-zinc-900 transition-colors">Blog</a></li>
           </ul>
        </div>
        
        <div>
           <h4 className="font-medium text-zinc-900 mb-6">Legal</h4>
           <ul className="space-y-4 text-zinc-500">
             <li><a href="#" className="hover:text-zinc-900 transition-colors">Privacy</a></li>
             <li><a href="#" className="hover:text-zinc-900 transition-colors">Terms</a></li>
           </ul>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-zinc-200 text-zinc-500 text-xs">
        <div>&copy; 2024 CashFlowCrew Academy. All rights reserved.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span>San Francisco</span>
          <span>Tokyo</span>
          <span>London</span>
        </div>
      </div>
    </div>
  </footer>
);
