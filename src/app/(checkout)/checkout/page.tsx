"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import Image from 'next/image';
import { 
  ChevronLeft, User, Mail, Lock, Loader2, Plus, Phone, X, ShoppingBag, 
  ShieldCheck, ArrowRight, Zap 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { useStore } from '@/hooks/use-store';
import { getUpsellRecommendations } from '@/server/actions/get-recommendations';
import { getCourseByIdAction } from '@/server/actions/get-courses';
import { useZwitchPayment } from '@/hooks/useZwitchPayment';

const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid mobile number" }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// 1. The main logic component
const CheckoutContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  
  const buyNowId = searchParams.get('courseId');
  const cartStore = useStore(useCartStore, (state) => state);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [buyNowItem, setBuyNowItem] = useState<any>(null);
  const [isLoadingBuyNow, setIsLoadingBuyNow] = useState(!!buyNowId);
  const { initiateZwitch } = useZwitchPayment();

  const [upsellItem, setUpsellItem] = useState({
    id: "mentorship-addon-99", 
    title: "1-on-1 Career Mentorship",
    price: 99,
    thumbnail: "" 
  });
  
  const taxRate = 0.18;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: "", email: "", phone: "" }
  });

  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
    }
  }, [session, setValue]);

  useEffect(() => {
    const fetchBuyNowCourse = async () => {
      if (!buyNowId) {
        setBuyNowItem(null);
        setIsLoadingBuyNow(false);
        return;
      }

      try {
        setIsLoadingBuyNow(true);
        const course = await getCourseByIdAction(buyNowId);
        if (course) {
          setBuyNowItem({
            id: buyNowId,
            title: course.title, 
            price: course.price || 0,
            thumbnail: course.thumbnail || ""
          });
        }
      } catch (error) {
        console.error("Error fetching course", error);
      } finally {
        setIsLoadingBuyNow(false);
      }
    };

    fetchBuyNowCourse();
  }, [buyNowId]);

  useEffect(() => {
    const fetchUpsells = async () => {
        if (!cartStore) return;
        const idsToAnalyze: string[] = [];
        if (buyNowItem) idsToAnalyze.push(buyNowItem.id);
        if (cartStore.items.length > 0) idsToAnalyze.push(...cartStore.items.map(i => i.id));

        if (idsToAnalyze.length > 0) {
            try {
                const recommendations = await getUpsellRecommendations(idsToAnalyze);
                if (recommendations && recommendations.length > 0) {
                    const rec = recommendations[0];
                    setUpsellItem({
                        id: rec.id,
                        title: rec.title,
                        price: rec.price,
                        thumbnail: rec.thumbnail || ""
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
    };
    fetchUpsells();
  }, [buyNowItem, cartStore?.items]);

  if (!cartStore || isLoadingBuyNow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const { items,clearCart, addItem, removeItem } = cartStore;
  const displayItems = buyNowItem ? [buyNowItem] : items;
  const isEmpty = displayItems.length === 0;
  
  const isUpsellInCart = buyNowItem 
    ? buyNowItem.id === upsellItem.id
    : !!items.find((i) => i.id === upsellItem.id);

  const itemsTotal = displayItems.reduce((acc: number, item: any) => acc + item.price, 0);
  const tax = itemsTotal * taxRate;
  const currentSubtotal = (itemsTotal - tax);
  const total = itemsTotal; 

  const handleRemoveItem = (itemId: string) => {
    if (buyNowItem && itemId === buyNowItem.id) {
        setBuyNowItem(null);
        router.push('/checkout'); 
        toast.info("Removed course from checkout");
    } else {
        removeItem(itemId, isLoggedIn);
        toast.success("Item removed");
    }
  };

  const handleAddUpsell = async () => {
    if (buyNowItem) {
        await clearCart();
        await addItem(buyNowItem, isLoggedIn);
        await addItem(upsellItem, isLoggedIn);
        setBuyNowItem(null); 
        toast.success("Bundle created! Switching to cart view...");
        router.push('/checkout'); 
    } else {
        await addItem(upsellItem, isLoggedIn);
        toast.success("Added to order");
    }
  };

  const onPaymentSubmit = async (data: CheckoutFormValues) => {
    setIsProcessing(true);
    try {
        await initiateZwitch({...data, amount: total});
    } catch (error) {
      toast.error("Payment Failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const showUpsellCard = !isEmpty && !isUpsellInCart;

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-zinc-50">
       <div className="max-w-7xl mx-auto mb-8">
          <button 
            onClick={() => buyNowId ? router.push('/cart') : router.back()} 
            className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            <ChevronLeft size={16} /> {buyNowItem ? "Cancel & Go to Cart" : "Back"}
          </button>
       </div>
       
       <div className="max-w-7xl mx-auto">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-3xl border-2 border-dashed border-zinc-200 text-center">
               <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
                  <ShoppingBag size={32} className="text-zinc-300" />
               </div>
               <h2 className="text-2xl font-semibold text-zinc-900 mb-2">Your checkout is empty</h2>
               <p className="text-zinc-500 max-w-sm mb-8">
                  Looks like you haven't selected any courses yet.
               </p>
               <Button onClick={() => router.push('/')} size="lg" className="px-8 rounded-full">
                 Browse Courses
               </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column */}
              <div className="space-y-8">
                 <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="text-green-600" size={20} />
                    <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">Secure Checkout</span>
                 </div>
                 
                 <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                    <h2 className="text-xl font-medium text-zinc-900 mb-6 flex items-center gap-2">
                       <User size={20} className="text-blue-600"/> Contact Information
                    </h2>
                    {/* Wrapped in form for better accessibility */}
                    <form id="checkout-form" onSubmit={handleSubmit(onPaymentSubmit)} className="space-y-4">
                       <div>
                          <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Full Name</label>
                          <div className="relative">
                             <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                             <input {...register("name")} type="text" placeholder="John Doe" className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 focus:ring-blue-500'}`} />
                          </div>
                          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Email Address</label>
                          <div className="relative">
                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                             <input {...register("email")} type="email" placeholder="you@example.com" className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 focus:ring-blue-500'}`} />
                          </div>
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                       </div>
                       <div>
                          <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Mobile Number</label>
                          <div className="relative">
                             <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                             <input {...register("phone")} type="tel" placeholder="+1 (555) 000-0000" className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-zinc-200 focus:ring-blue-500'}`} />
                          </div>
                          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                       </div>
                    </form>
                 </div>

                 {showUpsellCard && (
                   <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl relative overflow-hidden transition-all hover:border-zinc-300">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/50 blur-[50px] rounded-full pointer-events-none" />
                     <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-center">
                       <div className="flex items-center gap-4">
                         <div className="w-16 h-16 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0 relative overflow-hidden">
                             {upsellItem.thumbnail ? (
                                 <Image src={upsellItem.thumbnail} alt={upsellItem.title} fill className="object-cover" />
                             ) : (
                                 <Zap size={24} />
                             )}
                         </div>
                         <div>
                           <h4 className="font-medium text-zinc-900">{upsellItem.title}</h4>
                           <p className="text-sm text-zinc-500 font-mono">₹{upsellItem.price}</p>
                         </div>
                       </div>
                       <Button variant="secondary" onClick={handleAddUpsell} className="bg-white shadow-sm w-full sm:w-auto hover:bg-zinc-50 border-zinc-200">
                         <Plus size={14} className="mr-1" /> Add to Order
                       </Button>
                     </div>
                   </div>
                 )}
              </div>

              {/* Right Column: Summary */}
              <div>
                 <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm sticky top-28">
                    <h2 className="text-xl font-medium text-zinc-900 mb-6">Order Summary</h2>
                    <div className="space-y-4 mb-8">
                       {displayItems.map((item: any, i: number) => (
                          <div key={item.id} className="relative flex gap-4 p-4 rounded-xl border border-zinc-100 bg-white shadow-sm group hover:border-zinc-300 transition-colors">
                             <div className={`w-16 h-16 rounded-lg bg-zinc-100 flex-shrink-0 overflow-hidden relative border border-zinc-100 ${i % 3 === 0 ? 'bg-gradient-to-br from-blue-50 to-cyan-50' : 'bg-gradient-to-br from-purple-50 to-pink-50'}`}>
                                {item.thumbnail && (
                                   <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                                )}
                             </div>
                             <div className="flex-1 flex flex-col justify-center pr-6">
                                <div className="font-medium text-zinc-900 text-sm leading-tight line-clamp-2 mb-1">{item.title}</div>
                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">Course</div>
                                <div className="font-mono text-zinc-900 text-sm font-medium">₹{item.price}</div>
                             </div>
                             <button 
                                onClick={() => handleRemoveItem(item.id)}
                                className="absolute top-3 right-3 p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                             >
                                <X size={16} />
                             </button>
                          </div>
                       ))}
                    </div>

                    <div className="space-y-3 pt-6 border-t border-zinc-100 text-sm">
                       <div className="flex justify-between text-zinc-500">
                          <span>Subtotal</span>
                          <span>₹{currentSubtotal.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-zinc-500">
                          <span>GST (18%)</span>
                          <span>₹{tax.toFixed(2)}</span>
                       </div>
                       <div className="flex justify-between text-lg font-medium text-zinc-900 pt-2">
                          <span>Total</span>
                          <span>₹{total.toFixed(2)}</span>
                       </div>
                    </div>

                    <Button 
                      form="checkout-form" 
                      type="submit" 
                      className="w-full mt-8 h-12 text-base" 
                      disabled={isProcessing}
                    >
                       {isProcessing ? (
                          <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin"/> Processing...</span>
                       ) : (
                          <>Pay ₹{total.toFixed(2)} <ArrowRight size={16} className="ml-2" /></>
                       )}
                    </Button>
                    <div className="mt-4 flex justify-center items-center gap-2 text-xs text-zinc-400">
                       <Lock size={12} /> 256-bit SSL Encrypted Payment
                    </div>
                 </div>
              </div>
            </div>
          )}
       </div>
    </div>
  )
}

// 2. The main Page export with Suspense
export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}