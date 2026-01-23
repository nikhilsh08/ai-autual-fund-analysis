import { Button } from "@/components/ui/button";


const page = () => {
   return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm max-w-md w-full">
         <div className="text-center mb-8">
            <h1 className="text-2xl font-medium text-zinc-900">Create an account</h1>
            <p className="text-zinc-500 text-sm mt-2">Start your journey with CFC Academy today.</p>
         </div>
         <div className="space-y-4">
             <div>
               <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Full Name</label>
               <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
               <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Email</label>
               <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <div>
               <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Password</label>
               <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
            </div>
            <Button className="w-full">Create Account</Button>
            
            <p className="text-xs text-zinc-400 text-center leading-relaxed px-4">
               By joining, you agree to our Terms of Service and Privacy Policy.
            </p>
         </div>
         <div className="mt-8 text-center text-sm text-zinc-500">
            Already have an account? <button  className="text-zinc-900 font-medium hover:underline">Sign in</button>
         </div>
      </div>
    </div>
   );
}

export default page

