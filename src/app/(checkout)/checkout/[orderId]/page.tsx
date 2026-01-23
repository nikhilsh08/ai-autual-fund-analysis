
"use client"
import React, { useState } from 'react';
import { ChevronLeft, User, Mail, CreditCard, Lock, Check, FileBadge, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';


const page = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [addCertificate, setAddCertificate] = useState(false);
  const [addLifetimeUpdates, setAddLifetimeUpdates] = useState(false);
   const [cart, setCart] = useState([
    { id: 1, title: "Full-Stack AI Engineering", category: "Engineering", price: 199 }
  ]);
  const subtotal = cart.reduce((sum: number, item: any) => sum + item.price, 0);
  const certificatePrice = 49;
  const lifetimeUpdatesPrice = 29;
  const taxRate = 0.08;
  
  const currentSubtotal = subtotal + (addCertificate ? certificatePrice : 0) + (addLifetimeUpdates ? lifetimeUpdatesPrice : 0);
  const tax = currentSubtotal * taxRate;
  const total = currentSubtotal + tax;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setCart([]); // Clear the cart
    }, 2000);
  }

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-zinc-50">
       <div className="max-w-7xl mx-auto mb-8">
          <button className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
            <ChevronLeft size={16} /> Back to Cart
          </button>
       </div>
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Forms */}
          <div className="space-y-8">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-green-600" size={20} />
                <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">Secure Checkout</span>
             </div>
             
             {/* Contact */}
             <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <h2 className="text-xl font-medium text-zinc-900 mb-6 flex items-center gap-2">
                   <User size={20} className="text-blue-600"/> Contact Information
                </h2>
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Full Name</label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                         <input type="text" placeholder="John Doe" className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                      </div>
                   </div>
                   <div>
                      <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Email Address</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                         <input type="email" placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                      </div>
                   </div>
                </div>
             </div>

             {/* Payment */}
             <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <h2 className="text-xl font-medium text-zinc-900 mb-6 flex items-center gap-2">
                   <CreditCard size={20} className="text-blue-600"/> Payment Details
                </h2>
                <div className="space-y-4">
                   <div>
                      <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Card Number</label>
                      <div className="relative">
                         <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                         <input type="text" placeholder="0000 0000 0000 0000" className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                            <div className="w-8 h-5 bg-zinc-100 rounded border border-zinc-200" />
                            <div className="w-8 h-5 bg-zinc-100 rounded border border-zinc-200" />
                         </div>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Expiry</label>
                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">CVC</label>
                        <input type="text" placeholder="123" className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 transition-all" />
                      </div>
                   </div>
                   <div className="pt-2">
                     <label className="flex items-center gap-3 cursor-pointer group">
                        <input type="checkbox" className="w-4 h-4 border-zinc-300 rounded text-blue-600 focus:ring-blue-500" />
                        <span className="text-sm text-zinc-500 group-hover:text-zinc-900 transition-colors">Save card securely for future purchases</span>
                     </label>
                   </div>
                </div>
             </div>
          </div>

          {/* Right Column: Summary */}
          <div>
             <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm sticky top-28">
                <h2 className="text-xl font-medium text-zinc-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-8">
                   {cart.map((item: any, i: number) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-zinc-100 bg-white shadow-sm">
                         {/* Card Thumbnail */}
                         <div className={`w-16 h-16 rounded-lg bg-zinc-100 flex-shrink-0 bg-gradient-to-br border border-zinc-100 ${
                            i % 3 === 0 ? 'from-blue-50 to-cyan-50' : i % 3 === 1 ? 'from-purple-50 to-pink-50' : 'from-amber-50 to-orange-50'
                         }`} />
                         
                         <div className="flex-1 flex flex-col justify-center">
                             <div className="font-medium text-zinc-900 text-sm leading-tight line-clamp-2 mb-1">{item.title}</div>
                             <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{item.category}</div>
                             <div className="font-mono text-zinc-900 text-sm font-medium">${item.price}</div>
                         </div>
                      </div>
                   ))}
                   {cart.length === 0 && (
                     <div className="text-sm text-zinc-400 italic">Your cart is empty.</div>
                   )}
                </div>

                {/* Upsell Widgets */}
                {cart.length > 0 && (
                <div className="space-y-4 mb-8">
                    {/* Certificate Upsell */}
                    <div className={`p-4 rounded-xl border transition-all cursor-pointer ${addCertificate ? 'bg-zinc-50 border-zinc-300 ring-1 ring-zinc-300' : 'bg-white border-zinc-200 hover:border-zinc-300'}`} onClick={() => setAddCertificate(!addCertificate)}>
                       <div className="flex items-start gap-4">
                           {/* Checkbox */}
                          <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${addCertificate ? 'bg-blue-600 border-blue-600' : 'bg-white border-zinc-300'}`}>
                             {addCertificate && <Check size={14} className="text-white" />}
                          </div>
                          
                          <div className="flex-1">
                             <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-zinc-900 text-sm flex items-center gap-2">
                                   <FileBadge size={16} className="text-blue-600"/> Verified Certificate
                                </span>
                                <span className="font-mono text-sm font-bold text-zinc-900">+$49</span>
                             </div>
                             <p className="text-xs text-zinc-500 leading-relaxed pr-2">
                                Add a digitally signed certificate of completion to your LinkedIn profile. Validated by CFC Academy.
                             </p>
                          </div>
                       </div>
                    </div>

                    {/* Lifetime Access Upsell */}
                    <div className={`p-4 rounded-xl border transition-all cursor-pointer ${addLifetimeUpdates ? 'bg-zinc-50 border-zinc-300 ring-1 ring-zinc-300' : 'bg-white border-zinc-200 hover:border-zinc-300'}`} onClick={() => setAddLifetimeUpdates(!addLifetimeUpdates)}>
                       <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${addLifetimeUpdates ? 'bg-blue-600 border-blue-600' : 'bg-white border-zinc-300'}`}>
                             {addLifetimeUpdates && <Check size={14} className="text-white" />}
                          </div>

                          <div className="flex-1">
                             <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-zinc-900 text-sm flex items-center gap-2">
                                   <Zap size={16} className="text-blue-600"/> Lifetime Updates
                                </span>
                                <span className="font-mono text-sm font-bold text-zinc-900">+$29</span>
                             </div>
                             <p className="text-xs text-zinc-500 leading-relaxed pr-2">
                                Get permanent access to all future course updates, new modules, and community features.
                             </p>
                          </div>
                       </div>
                    </div>
                </div>
                )}

                <div className="space-y-3 pt-6 border-t border-zinc-100 text-sm">
                   <div className="flex justify-between text-zinc-500">
                      <span>Subtotal</span>
                      <span>${currentSubtotal.toFixed(2)}</span>
                   </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                   </div>
                   <div className="flex justify-between text-lg font-medium text-zinc-900 pt-2">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                   </div>
                </div>

                <Button className="w-full mt-8 h-12 text-base" onClick={handlePayment} disabled={isProcessing || cart.length === 0}>
                   {isProcessing ? (
                      <span className="flex items-center gap-2">
                         <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> Processing...
                      </span>
                   ) : (
                      <>Pay ${total.toFixed(2)} <ArrowRight size={16} /></>
                   )}
                </Button>
                
                <div className="mt-4 flex justify-center items-center gap-2 text-xs text-zinc-400">
                   <Lock size={12} /> 256-bit SSL Encrypted Payment
                </div>
             </div>
          </div>
       </div>
    </div>
  )
}


export default page
