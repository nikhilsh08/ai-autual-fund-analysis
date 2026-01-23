
import { Button } from '@/components/ui/button';
import { Github, Globe } from 'lucide-react';


const page = () => {
    return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full">
         <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-zinc-900">Welcome back</h1>
            <p className="text-zinc-500 text-sm mt-2">Sign in to your account to continue</p>
         </div>
         
         <div className="space-y-4">
            <div>
               <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Email</label>
               <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
               <div className="flex justify-between items-center mb-1">
                 <label className="block text-xs font-medium text-zinc-700 uppercase">Password</label>
                 <a href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot?</a>
               </div>
               <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <Button className="w-full">Sign In</Button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-400">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
               <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors">
                 <Globe size={16} /> Google
               </button>
            </div>
         </div>
         
         <div className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account? <button  className="text-zinc-900 font-medium hover:underline">Sign up</button>
         </div>
      </div>
    </div>
  );
}

export default page

