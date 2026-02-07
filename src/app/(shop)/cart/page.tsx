"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ShoppingBag, Trash2, X, Zap, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { useStore } from '@/hooks/use-store';
import { getUpsellRecommendations } from '@/server/actions/get-recommendations';


const CartPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const cartStore = useStore(useCartStore, (state) => state);

  // State for dynamic upsell
  const [upsellItem, setUpsellItem] = useState({
    id: "mentorship-offer-99", 
    title: "1-on-1 Career Mentorship",
    price: 99,
    thumbnail: "" 
  });

  // Fetch dynamic recommendation when cart items change
  useEffect(() => {
    const fetchRecommendation = async () => {
      if (cartStore && cartStore.items.length > 0) {
        // Get IDs of items currently in cart
        const currentIds = cartStore.items.map(item => item.id);
        
        // Call server action
        const recommendations = await getUpsellRecommendations(currentIds);
        console.log(recommendations,"recommendation");
        
        // If we get a recommendation, update the upsell item
        if (recommendations && recommendations.length > 0) {
          const rec = recommendations[0];
          setUpsellItem({
            id: rec.id,
            title: rec.title,
            price: rec.price,
            thumbnail: rec.thumbnail || ""
          });
        }
      }
    };

    fetchRecommendation();
  }, [cartStore?.items]); // Re-run when items change

  if (!cartStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const { items, removeItem, clearCart, addItem, getCartTotal } = cartStore;
  const cartTotal = getCartTotal();
  const tax = cartTotal * 0.18;
  const subtotal = cartTotal-tax;
  const total = (cartTotal-tax) + tax;

  const handleCheckout = () => {
    router.push("/checkout");
  };
  
  const handleAddUpsell = () => {
    addItem(upsellItem, isLoggedIn);
  };

  console.log(items,"cart items");

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-medium text-zinc-900 tracking-tighter mb-12">Your Cart</h1>
        
        {items.length === 0 ? (
           <div className="text-center py-24 bg-zinc-50 rounded-2xl border border-zinc-200">
             <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                <ShoppingBag size={32} />
             </div>
             <h2 className="text-xl font-medium text-zinc-900 mb-2">Your cart is empty</h2>
             <Button asChild><Link href="/">Browse Courses</Link></Button>
           </div>
        ) : (
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
             <div className="lg:col-span-2">
               <div className="flex justify-between items-center mb-6">
                 <span className="text-sm text-zinc-500 font-medium">{items.length} Course{items.length !== 1 && 's'}</span>
                 <button onClick={() => clearCart(isLoggedIn)} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-2">
                   <Trash2 size={14} /> Clear Cart
                 </button>
               </div>
               
               <div className="space-y-4">
                 {items.map((item) => (
                   <div key={item.id} className="flex gap-6 p-4 bg-white border border-zinc-200 rounded-xl items-center shadow-sm">
                     <div className="relative w-24 h-24 rounded-lg bg-zinc-100 flex-shrink-0 overflow-hidden">
                        {item.thumbnail ? (
                            <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-100" />
                        )}
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-medium text-zinc-900">{item.title}</h3>
                          <button onClick={() => removeItem(item.id, isLoggedIn)} className="text-zinc-400 hover:text-zinc-900 p-1">
                            <X size={20} />
                          </button>
                        </div>
                        <div className="mt-2 text-zinc-600 font-mono text-sm">₹{item.price}</div>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Upsell Logic - Dynamically Fetched Item */}
               {!items.find((i) => i.id === upsellItem.id) && (
                 <div className="mt-12 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl relative overflow-hidden">
                    {/* Decorative Blob */}
                   <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/50 blur-[50px] rounded-full pointer-events-none" />
                   
                   <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 overflow-hidden relative">
                            {upsellItem.thumbnail ? (
                                <Image src={upsellItem.thumbnail} alt={upsellItem.title} fill className="object-cover" />
                            ) : (
                                <Zap size={24} />
                            )}
                        </div>
                        <div>
                          <h4 className="font-medium text-zinc-900">{upsellItem.title}</h4>
                          <p className="text-sm text-zinc-500 font-mono">${upsellItem.price}</p>
                        </div>
                      </div>
                      <Button variant="secondary" onClick={handleAddUpsell} className="bg-white shadow-sm w-full sm:w-auto">
                        <Plus size={14} className="mr-1" /> Add to Order
                      </Button>
                   </div>
                 </div>
               )}
             </div>

             <div className="lg:col-span-1">
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 sticky top-28 shadow-sm">
                   <h3 className="font-medium text-zinc-900 mb-6">Order Summary</h3>
                   <div className="space-y-4 text-sm mb-6">
                     <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span className="font-mono">₹{subtotal.toFixed(2)}</span></div>
                     <div className="flex justify-between text-zinc-500"><span>GST (18%)</span><span className="font-mono">₹{tax.toFixed(2)}</span></div>
                     <div className="pt-4 border-t border-zinc-200 flex justify-between font-medium text-lg">
                       <span>Total</span><span className="font-mono">₹{total.toFixed(2)}</span>
                     </div>
                   </div>
                   <Button className="w-full" onClick={handleCheckout}>Checkout</Button>
                   <p className="text-center text-xs text-zinc-400 mt-4">Secure checkout powered by Zwitch</p>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;