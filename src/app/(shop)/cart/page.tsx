
"use client"
import React, { useState } from 'react';
import { ShoppingBag, Trash2, X, Zap, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';


const page = () => {
      const [cart, setCart] = useState([
    { id: 1, title: "Full-Stack AI Engineering", category: "Engineering", price: 199 }
  ]);
  const upsellItem = {
    id: 99,
    title: "1-on-1 Career Mentorship",
    category: "Coaching",
    price: 99,
    isNew: false
  };

  const total = cart.reduce((sum: number, item: any) => sum + item.price, 0);
  const tax = total * 0.08;

  const handleClearCart = () => setCart([]);
  const handleRemoveItem = (id: number) => setCart(cart.filter((i: any) => i.id !== id));
  const handleAddUpsell = () => {
    if (!cart.find((i: any) => i.id === upsellItem.id)) {
        setCart([...cart, upsellItem]);
    }
  };

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-medium text-zinc-900 tracking-tighter mb-12">Your Cart</h1>
        
        {cart.length === 0 ? (
           <div className="text-center py-24 bg-zinc-50 rounded-2xl border border-zinc-200">
             <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                <ShoppingBag size={32} />
             </div>
             <h2 className="text-xl font-medium text-zinc-900 mb-2">Your cart is empty</h2>
             <p className="text-zinc-500 mb-8 max-w-sm mx-auto">Looks like you haven't added any courses yet. Start your journey today.</p>
             <Button >Browse Courses</Button>
           </div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2">
               <div className="flex justify-between items-center mb-6">
                 <span className="text-sm text-zinc-500 font-medium">{cart.length} Course{cart.length !== 1 && 's'}</span>
                 <button onClick={handleClearCart} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-2 font-medium transition-colors">
                   <Trash2 size={14} /> Clear Cart
                 </button>
               </div>
               
               <div className="space-y-4">
                 {cart.map((item: any) => (
                   <div key={item.id} className="flex gap-6 p-4 bg-white border border-zinc-200 rounded-xl items-center hover:border-zinc-300 transition-colors shadow-sm">
                     <div className={`w-24 h-24 rounded-lg bg-zinc-100 flex-shrink-0 bg-gradient-to-br from-blue-100 to-indigo-100`} />
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">{item.category}</div>
                            <h3 className="text-lg font-medium text-zinc-900">{item.title}</h3>
                          </div>
                          <button onClick={() => handleRemoveItem(item.id)} className="text-zinc-400 hover:text-zinc-900 transition-colors p-1">
                            <X size={20} />
                          </button>
                        </div>
                        <div className="mt-2 text-zinc-600 font-mono text-sm">${item.price}</div>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Upsell Section */}
               {!cart.find((i: any) => i.id === upsellItem.id) && (
                 <div className="mt-12 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/50 blur-[50px] rounded-full pointer-events-none" />
                   <div className="relative z-10">
                     <div className="flex items-center gap-2 mb-4">
                       <div className="p-1 bg-yellow-100 text-yellow-700 rounded shadow-sm">
                          <Zap size={14} fill="currentColor" />
                       </div>
                       <span className="font-medium text-zinc-900 text-sm">Recommended for you</span>
                     </div>
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg bg-zinc-200 bg-gradient-to-br from-yellow-100 to-orange-100 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium text-zinc-900">{upsellItem.title}</h4>
                            <p className="text-sm text-zinc-500 font-mono mt-0.5">${upsellItem.price}</p>
                          </div>
                        </div>
                        <Button variant="secondary" className="px-4 py-2 h-auto text-xs bg-white w-full sm:w-auto shadow-sm" onClick={handleAddUpsell}>
                          <Plus size={14} className="mr-1" /> Add to Order
                        </Button>
                     </div>
                   </div>
                 </div>
               )}
             </div>

             <div className="lg:col-span-1">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sticky top-28 shadow-sm">
                   <h3 className="font-medium text-zinc-900 mb-6">Order Summary</h3>
                   <div className="space-y-4 text-sm mb-6">
                     <div className="flex justify-between text-zinc-500">
                       <span>Subtotal</span>
                       <span className="font-mono">${total.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between text-zinc-500">
                       <span>Tax (8%)</span>
                       <span className="font-mono">${tax.toFixed(2)}</span>
                     </div>
                     <div className="pt-4 border-t border-zinc-200 flex justify-between font-medium text-zinc-900 text-lg">
                       <span>Total</span>
                       <span className="font-mono">${(total + tax).toFixed(2)}</span>
                     </div>
                   </div>
                   <Button className="w-full" >Checkout</Button>
                   <p className="text-center text-xs text-zinc-400 mt-4">Secure checkout powered by Stripe</p>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default page
