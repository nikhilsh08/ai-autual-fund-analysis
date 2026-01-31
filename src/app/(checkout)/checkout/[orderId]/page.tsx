"use client"
import React, { useState, useEffect } from 'react';
import { ChevronLeft, User, Mail, Lock, Check, FileBadge, Zap, ArrowRight, ShieldCheck, Loader2, Plus, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Form & Validation Imports
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Store Imports
import { useCartStore } from '@/store/cart-store';
import { useStore } from '@/hooks/use-store';

// 1. Define Validation Schema
const checkoutSchema = z.object({
  name: z.string().min(2, { message: "Full name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const CheckoutPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  // --- CONNECT TO STORE ---
  const cartStore = useStore(useCartStore, (state) => state);
  
  // Local State
  const [isProcessing, setIsProcessing] = useState(false);
  const [addCertificate, setAddCertificate] = useState(false);
  const [addLifetimeUpdates, setAddLifetimeUpdates] = useState(false);

  // Constants
  const certificatePrice = 49;
  const lifetimeUpdatesPrice = 29;
  const taxRate = 0.08;

  const upsellItem = {
    id: "mentorship-addon-99", 
    title: "1-on-1 Career Mentorship",
    price: 99,
    thumbnail: "" 
  };

  // --- 2. SETUP FORM ---
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors } 
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  // Pre-fill form when session loads
  useEffect(() => {
    if (session?.user) {
      setValue("name", session.user.name || "");
      setValue("email", session.user.email || "");
    }
  }, [session, setValue]);

  // Loading State
  if (!cartStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }
  

  const { items, addItem, clearCart, getCartTotal } = cartStore;
  const cart = items;

  // Dynamic Calculations
  const subtotal = getCartTotal(); 
  const currentSubtotal = subtotal + (addCertificate ? certificatePrice : 0) + (addLifetimeUpdates ? lifetimeUpdatesPrice : 0);
  const tax = currentSubtotal * taxRate;
  const total = currentSubtotal + tax;

  // --- 3. HANDLE SUBMIT ---
  const onPaymentSubmit = async (data: CheckoutFormValues) => {
    if (!isLoggedIn) {
        toast.info("Please login to complete purchase");
        // Optional: Redirect to login
        return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call using the Form Data + Cart Data
      console.log("Processing Order for:", data); 
      console.log("Items:", cart);
      console.log("Extras:", { certificate: addCertificate, lifetime: addLifetimeUpdates });

      await new Promise((resolve) => setTimeout(resolve, 2000));

      clearCart();
      toast.success("Payment Successful!");
      router.push('/success');
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddUpsell = () => {
    addItem(upsellItem, isLoggedIn);
  };

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-zinc-50">
       <div className="max-w-7xl mx-auto mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors">
            <ChevronLeft size={16} /> Back to Cart
          </button>
       </div>
       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Forms & Items */}
          <div className="space-y-8">
             <div className="flex items-center gap-2 mb-2">
                <ShieldCheck className="text-green-600" size={20} />
                <span className="text-sm font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">Secure Checkout</span>
             </div>
             
             {/* Contact Form (Connected to React Hook Form) */}
             <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                <h2 className="text-xl font-medium text-zinc-900 mb-6 flex items-center gap-2">
                   <User size={20} className="text-blue-600"/> Contact Information
                </h2>
                <div className="space-y-4">
                   
                   {/* Name Input */}
                   <div>
                      <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Full Name</label>
                      <div className="relative">
                         <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                         <input 
                            {...register("name")}
                            type="text" 
                            placeholder="John Doe" 
                            className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.name ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-zinc-200 focus:border-blue-500 focus:ring-blue-500'}`}
                         />
                      </div>
                      {errors.name && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                           <AlertCircle size={12} /> {errors.name.message}
                        </p>
                      )}
                   </div>

                   {/* Email Input */}
                   <div>
                      <label className="block text-xs font-medium text-zinc-700 uppercase mb-1">Email Address</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                         <input 
                            {...register("email")}
                            type="email" 
                            placeholder="you@example.com" 
                            className={`w-full pl-10 pr-4 py-3 bg-zinc-50 border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-zinc-200 focus:border-blue-500 focus:ring-blue-500'}`}
                         />
                      </div>
                      {errors.email && (
                        <p className="flex items-center gap-1 text-red-500 text-xs mt-1">
                           <AlertCircle size={12} /> {errors.email.message}
                        </p>
                      )}
                   </div>

                </div>
             </div>

                {/* Items List */}
                <div className="space-y-4 mb-8">
                   {cart.map((item: any, i: number) => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-xl border border-zinc-100 bg-white shadow-sm">
                         <div className={`w-16 h-16 rounded-lg bg-zinc-100 flex-shrink-0 bg-gradient-to-br border border-zinc-100 ${
                            i % 3 === 0 ? 'from-blue-50 to-cyan-50' : i % 3 === 1 ? 'from-purple-50 to-pink-50' : 'from-amber-50 to-orange-50'
                         }`} />
                         <div className="flex-1 flex flex-col justify-center">
                             <div className="font-medium text-zinc-900 text-sm leading-tight line-clamp-2 mb-1">{item.title}</div>
                             <div className="text-[10px] text-zinc-500 uppercase tracking-wider mb-2">{item.category || "Course"}</div>
                             <div className="font-mono text-zinc-900 text-sm font-medium">${item.price}</div>
                         </div>
                      </div>
                   ))}
                   {cart.length === 0 && (
                     <div className="text-sm text-zinc-400 italic">Your cart is empty.</div>
                   )}
                </div>

                {/* Upsell Card */}
                {!cart.find((i) => i.id === upsellItem.id) && (
                  <div className="mt-12 p-6 bg-zinc-50 border border-zinc-200 rounded-2xl relative overflow-hidden transition-all hover:border-zinc-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100/50 blur-[50px] rounded-full pointer-events-none" />
                    <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-center">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-yellow-100 flex items-center justify-center text-yellow-600 flex-shrink-0">
                            <Zap size={24} />
                        </div>
                        <div>
                          <h4 className="font-medium text-zinc-900">{upsellItem.title}</h4>
                          <p className="text-sm text-zinc-500 font-mono">${upsellItem.price}</p>
                        </div>
                      </div>
                      <Button variant="secondary" onClick={handleAddUpsell} className="bg-white shadow-sm w-full sm:w-auto hover:bg-zinc-50">
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

                {/* Extras Toggles */}
                {cart.length > 0 && (
                <div className="space-y-4 mb-8">
                    {/* Certificate */}
                    <div className={`p-4 rounded-xl border transition-all cursor-pointer ${addCertificate ? 'bg-zinc-50 border-zinc-300 ring-1 ring-zinc-300' : 'bg-white border-zinc-200 hover:border-zinc-300'}`} onClick={() => setAddCertificate(!addCertificate)}>
                       <div className="flex items-start gap-4">
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
                             <p className="text-xs text-zinc-500 leading-relaxed pr-2">Add a digitally signed certificate of completion to your LinkedIn profile.</p>
                          </div>
                       </div>
                    </div>

                    {/* Lifetime */}
                    <div className={`p-4 rounded-xl border transition-all cursor-pointer ${addLifetimeUpdates ? 'bg-zinc-50 border-zinc-300 ring-1 ring-zinc-300' : 'bg-white border-zinc-200 hover:border-zinc-300'}`} onClick={() => setAddLifetimeUpdates(!addLifetimeUpdates)}>
                       <div className="flex items-start gap-4">
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
                             <p className="text-xs text-zinc-500 leading-relaxed pr-2">Get permanent access to all future course updates.</p>
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

                {/* 4. CONNECT BUTTON TO FORM HANDLER */}
                <Button 
                    className="w-full mt-8 h-12 text-base" 
                    onClick={handleSubmit(onPaymentSubmit)} 
                    disabled={isProcessing || cart.length === 0}
                >
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

export default CheckoutPage