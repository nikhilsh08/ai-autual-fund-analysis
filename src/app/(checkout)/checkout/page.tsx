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
  ShieldCheck, ArrowRight, Zap, Tag
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart-store';
import { useStore } from '@/hooks/use-store';
import { getUpsellRecommendations } from '@/server/actions/get-recommendations';
import { getCourseByIdAction } from '@/server/actions/get-courses';
import { useZwitchPayment } from '@/hooks/useZwitchPayment';
import { getCashfreeInstance } from '@/lib/PGinitialize';
import { validateCoupon } from '@/server/actions/coupon.action';
import axios from 'axios';

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
  let zwitchPayment = false;

  const [upsellItem, setUpsellItem] = useState<any>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountAmount: number; couponId: string } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

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
            originalPrice: (course as any).originalPrice,
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

  const items = cartStore?.items ?? [];
  const displayItems = buyNowItem ? [buyNowItem] : items;
  const isEmpty = displayItems.length === 0;

  const isUpsellInCart = upsellItem
    ? (buyNowItem
      ? buyNowItem.id === upsellItem.id
      : !!items.find((i) => i.id === upsellItem.id))
    : false;

  const itemsTotal = displayItems.reduce((acc: number, item: any) => acc + item.price, 0);

  // Totals Calculation
  // Totals Calculation (Inclusive GST)
  const grossTotal = itemsTotal;
  const discount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const total = Math.max(0, grossTotal - discount);
  const tax = total * taxRate; // 18% of the final price (as per user example)
  const subtotal = total - tax;

  // Create a stable string of item IDs for dependency tracking
  const itemIdsString = displayItems.map(i => i.id).sort().join(',');

  // Re-validate coupon when items change
  useEffect(() => {
    if (appliedCoupon) {
      validateCoupon(appliedCoupon.code, displayItems.map(i => i.id), itemsTotal)
        .then(res => {
          if (!res.success) {
            setAppliedCoupon(null);
            setCouponError("Coupon no longer valid for this order");
            toast.error("Coupon removed: conditions not met");
          } else {
            // Cast to any to avoid TS issues with server action return type inference
            const data = res.data as { code: string; discountAmount: number; couponId: string };
            // Only update if discount changed to avoid loops
            if (data.discountAmount !== appliedCoupon.discountAmount) {
              setAppliedCoupon({ ...data, code: appliedCoupon.code });
            }
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsTotal, itemIdsString, appliedCoupon?.code]); // Stable dependencies

  if (!cartStore || isLoadingBuyNow) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
      </div>
    );
  }

  const { clearCart, addItem, removeItem } = cartStore;

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");

    try {
      const courseIds = displayItems.map((item: any) => item.id);
      const res = await validateCoupon(couponCode, courseIds, itemsTotal);

      if (res.success && res.data) {
        setAppliedCoupon(res.data as { code: string; discountAmount: number; couponId: string });
        toast.success("Coupon applied!");
      } else {
        setCouponError(res.error || "Invalid coupon");
        setAppliedCoupon(null);
      }
    } catch (error) {
      setCouponError("Failed to validate coupon");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

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
      await clearCart(isLoggedIn);
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
    console.log("Payment Data:", data, { total });
    setIsProcessing(true);
    if (zwitchPayment) {
      try {
        await initiateZwitch({ ...data, amount: total });
      } catch (error) {
        toast.error("Payment Failed");
      } finally {
        setIsProcessing(false);
      }
    }
    else {
      try {


        const paymentSession = await axios.post('/api/payment/cashfree/initiate', {
          name: data.name,
          email: data.email,
          phone: data.phone,
          courseIds: displayItems.map((item: any) => item.id),
          couponCode: appliedCoupon?.code,
          // Capture UTMs
          utmParams: {
            utmSource: searchParams.get('utm_source') || undefined,
            utmMedium: searchParams.get('utm_medium') || undefined,
            utmCampaign: searchParams.get('utm_campaign') || undefined,
            utmTerm: searchParams.get('utm_term') || undefined,
            utmContent: searchParams.get('utm_content') || undefined,
          }
        });

        console.log("Payment Session Response:", paymentSession?.data?.paymentSession);
        const orderId = paymentSession?.data?.orderId;
        const payment_session_id = paymentSession?.data?.paymentSession?.payment_session_id;
        console.log("Initiating Cashfree Checkout with Session ID:", payment_session_id);

        if (paymentSession?.data?.success === true && payment_session_id) {
          console.log("Payment session created successfully. Launching Cashfree Checkout...");

          const cashfree = await getCashfreeInstance();

          let checkOutOptions = {
            paymentSessionId: payment_session_id,
            redirectTarget: "_modal",
          }


          // use setTimeout to ensure the checkout is triggered after the current call stack is cleared and .then .catch handlers are set up properly;

          setTimeout(() => {
            cashfree.checkout(checkOutOptions)
              .then((response: any) => {
                console.log("Cashfree Checkout Success Response:", response);
                toast.success("Payment Successful! Redirecting...");
                // Redirect to order confirmation or dashboard after successful payment
                router.push(`/order-status?order_id=${orderId}`);
              })
              .catch((error: any) => {
                console.error("Cashfree Checkout Error:", error);
                toast.error("Payment Failed. Please try again.");
              });
          }, 1000);

        }




      } catch (error) {
        console.error("Payment Error:", error);
        toast.error("Payment Failed");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const showUpsellCard = !isEmpty && upsellItem && !isUpsellInCart;

  return (
    <div className="pt-28 pb-32 px-6 min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto mb-8">
        <button
          onClick={() => buyNowId ? router.push('/cart') : router.back()}
          className="flex items-center gap-2 text-ink-muted hover:text-ink transition-colors"
        >
          <ChevronLeft size={16} /> {buyNowItem ? "Cancel & Go to Cart" : "Back"}
        </button>
      </div>

      <div className="max-w-7xl mx-auto">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-cream-dark rounded-3xl border-2 border-dashed border-border text-center">
            <div className="w-20 h-20 bg-cream-darkest rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={32} className="text-ink-muted" />
            </div>
            <h2 className="text-2xl font-semibold text-ink mb-2">Your checkout is empty</h2>
            <p className="text-ink-secondary max-w-sm mb-8">
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
                <ShieldCheck className="text-teal" size={20} />
                <span className="text-sm font-medium text-teal bg-teal/10 px-3 py-1 rounded-full border border-teal/20">Secure Checkout</span>
              </div>

              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm relative overflow-hidden">
                <h2 className="text-xl font-medium text-ink mb-6 flex items-center gap-2">
                  <User size={20} className="text-accent" /> Contact Information
                </h2>
                {/* Wrapped in form for better accessibility */}
                <form id="checkout-form" onSubmit={handleSubmit(onPaymentSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary uppercase mb-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
                      <input {...register("name")} type="text" placeholder="John Doe" className={`w-full pl-10 pr-4 py-3 bg-cream-dark border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-accent'}`} />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary uppercase mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
                      <input {...register("email")} type="email" placeholder="you@example.com" className={`w-full pl-10 pr-4 py-3 bg-cream-dark border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-accent'}`} />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-ink-secondary uppercase mb-1">Mobile Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" size={16} />
                      <input {...register("phone")} type="tel" placeholder="+91 98765 43210" className={`w-full pl-10 pr-4 py-3 bg-cream-dark border rounded-lg text-sm focus:outline-none focus:ring-1 transition-all ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-border focus:ring-accent'}`} />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </form>
              </div>

              {showUpsellCard && (
                <div className="p-6 bg-cream-dark border border-border rounded-2xl relative overflow-hidden transition-all hover:border-accent/30">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/20 blur-[50px] rounded-full pointer-events-none" />
                  <div className="relative z-10 flex flex-col sm:flex-row justify-between gap-4 items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-lg bg-gold/20 flex items-center justify-center text-gold flex-shrink-0 relative overflow-hidden">
                        {upsellItem.thumbnail ? (
                          <Image src={upsellItem.thumbnail} alt={upsellItem.title} fill className="object-cover" />
                        ) : (
                          <Zap size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-ink">{upsellItem.title}</h4>
                        <p className="text-sm text-ink-muted font-mono">₹{upsellItem.price}</p>
                      </div>
                    </div>
                    <Button variant="secondary" onClick={handleAddUpsell} className="bg-card shadow-sm w-full sm:w-auto hover:bg-cream border-border">
                      <Plus size={14} className="mr-1" /> Add to Order
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Summary */}
            <div>
              <div className="bg-card p-8 rounded-2xl border border-border shadow-sm sticky top-28">
                <h2 className="text-xl font-medium text-ink mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                  {displayItems.map((item: any, i: number) => (
                    <div key={item.id} className="relative flex gap-4 p-4 rounded-xl border border-border bg-cream-dark shadow-sm group hover:border-accent/30 transition-colors">
                      <div className={`w-16 h-16 rounded-lg bg-cream flex-shrink-0 overflow-hidden relative border border-border ${i % 3 === 0 ? 'bg-gradient-to-br from-accent-light to-cream-dark' : 'bg-gradient-to-br from-teal/10 to-cream-dark'}`}>
                        {item.thumbnail && (
                          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                        )}
                      </div>
                      <div className="flex-1 flex flex-col justify-center pr-6">
                        <div className="font-medium text-ink text-sm leading-tight line-clamp-2 mb-1">{item.title}</div>
                        <div className="text-[10px] text-ink-muted uppercase tracking-wider mb-2">Course</div>
                        <div className="font-mono text-ink text-sm font-medium">
                          {item.originalPrice > item.price && (
                            <span className="text-ink-muted line-through text-xs mr-2">₹{item.originalPrice}</span>
                          )}
                          ₹{item.price}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-3 right-3 p-1.5 text-ink-muted hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>



                {/* Coupon Input */}
                <div className="pt-6 border-t border-border">
                  <label className="block text-xs font-medium text-ink-secondary uppercase mb-2">Coupon Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      disabled={!!appliedCoupon}
                      placeholder="ENTER CODE"
                      className="flex-1 bg-cream-dark border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent uppercase"
                    />
                    {appliedCoupon ? (
                      <Button onClick={removeCoupon} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                        Remove
                      </Button>
                    ) : (
                      <Button onClick={handleApplyCoupon} disabled={!couponCode || isValidatingCoupon} size="sm" className="bg-ink text-cream hover:bg-ink/90">
                        {isValidatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Apply"}
                      </Button>
                    )}
                  </div>
                  {couponError && <p className="text-red-500 text-xs mt-1">{couponError}</p>}
                  {appliedCoupon && <p className="text-teal text-xs mt-1 flex items-center gap-1"><Tag size={12} /> Coupon applied successfully!</p>}
                </div>

                <div className="space-y-3 pt-6 border-t border-border text-sm">
                  <div className="flex justify-between text-ink-muted">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-teal font-medium">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-ink-muted">
                    <span>GST (18%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-medium text-ink pt-2 border-t border-border">
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
                    <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Processing...</span>
                  ) : (
                    <>Pay ₹{total.toFixed(2)} <ArrowRight size={16} className="ml-2" /></>
                  )}
                </Button>
                <div className="mt-4 flex justify-center items-center gap-2 text-xs text-ink-muted">
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
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <Loader2 className="w-8 h-8 animate-spin text-ink-muted" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}