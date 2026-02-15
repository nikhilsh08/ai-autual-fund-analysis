"use client";
import React, { useState } from 'react';
import { Check, ShoppingCart, Eye, Loader2, Trash2, X } from 'lucide-react';
import { Button } from './ui/button';
import { CartItem, useCartStore } from '@/store/cart-store';
import { useStore } from '@/hooks/use-store';
import { useSession } from 'next-auth/react';
import { getRandomValue } from '@/Utils/get-random-value';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Coursecard = ({ course, className = "" }: any) => {
  const [showMobileDetails, setShowMobileDetails] = useState(false);
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const cartStore = useStore(useCartStore, (state) => state);
  const router = useRouter();

  if (!cartStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const { items, removeItem, addItem } = cartStore;
  const isInCart = items.some((item) => item.id === course.id);

  const toggleDetails = () => {
    setShowMobileDetails(!showMobileDetails);
  };
  const onSelect = () => {
    const slug = course.staticRoute || course.slug || course.id;
    if(course.staticRoute){
      router.push(`/${course.staticRoute}`);
    }else{
      router.push(`/course/${slug}`);
    }
  };

  const onBuyNow = (course: any) => {
    router.push(`/checkout?courseId=${course.id}`);
  };

  const handleCartAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInCart) {
      removeItem(course.id, isLoggedIn);
      toast.error("Removed from cart");
    } else {
      const itemToAdd: CartItem = {
        id: course.id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail || ""
      };
      addItem(itemToAdd, isLoggedIn);
      toast.success("Added to cart");
    }
  };

  return (
    <div
      className={`relative group z-0 transition-all ${className} ${showMobileDetails ? 'z-40' : 'hover:z-30'}`}
      onClick={toggleDetails}
    >
      {/* Base Card - Fades out when showMobileDetails is true or on desktop hover */}
      <div className={`h-full flex flex-col bg-white border border-zinc-200 rounded-2xl p-6 transition-opacity duration-200 shadow-sm cursor-pointer ${showMobileDetails ? 'opacity-0' : 'group-hover:opacity-0'}`}>
        <div className="aspect-[4/3] mb-6 rounded-lg bg-zinc-100 overflow-hidden relative border border-zinc-100">
          <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${course.id % 3 === 0 ? 'from-blue-500 to-indigo-500' : course.id % 3 === 1 ? 'from-indigo-500 to-violet-500' : 'from-blue-400 to-cyan-400'
            }`} />

          <div className="absolute top-4 right-4 flex gap-2">
            {course.isNew && (
              <span className="px-2 py-1 bg-white/90 backdrop-blur-md rounded border border-blue-200 text-[10px] text-blue-600 font-bold uppercase tracking-wider shadow-sm">
                New
              </span>
            )}
          </div>

          <div className="absolute bottom-4 left-4">
            <div className="px-2 py-1 bg-white/90 backdrop-blur-md rounded border border-zinc-200 text-[10px] text-zinc-900 font-mono shadow-sm">
              {course.category?.name?.toUpperCase() || "COURSE"}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-medium text-zinc-900 mb-2 truncate">{course.title}</h3>
          <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mt-4">
            <span>₹{course.price}</span>
            <span>•</span>
            <span>{(getRandomValue(1000, 10000) / 1000).toFixed(1)}k Students</span>
          </div>
        </div>
      </div>

      {/* Hover/Click Details Overlay */}
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] bg-white rounded-xl shadow-2xl shadow-zinc-900/10 border border-zinc-200 p-6 transition-all duration-200 scale-95 flex flex-col gap-4 z-40 
          ${showMobileDetails
            ? 'opacity-100 visible scale-100'
            : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:scale-100'
          }`}
        style={{ minWidth: '320px' }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <div className="flex justify-between items-start">
          <div className="flex-1 pr-4">
            <h3 className="text-xl font-bold text-zinc-900 leading-tight">{course.title}</h3>
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Close button visible only on mobile/touch when expanded */}
            <button
              onClick={toggleDetails}
              className="md:hidden p-1 text-zinc-400 hover:text-zinc-900 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-end">
              <span className="text-xs text-zinc-400 line-through decoration-zinc-400">₹{course.originalPrice || (course.price * 10)}</span>
              <span className="text-sm text-blue-600 font-bold text-nowrap">Save 90%</span>
            </div>
          </div>
        </div>

        <div className="text-3xl font-bold text-zinc-900">₹{course.price}</div>

        <div className="max-h-24 overflow-y-auto pr-2">
          {course.description && (
            <p className="text-sm text-zinc-600 leading-tight">
              {course.description}
            </p>
          )}
        </div>

        <div className="h-px bg-zinc-100 my-1" />

        <div className="space-y-3">
          <Button
            className="w-full h-12 text-base font-semibold"
            onClick={(e) => { e.stopPropagation(); onBuyNow(course); }}
          >
            Enroll Now
          </Button>

          <Button
            variant={isInCart ? "destructive" : "outline"}
            className={`w-full h-12 text-base ${!isInCart ? "bg-white border-zinc-300 hover:bg-zinc-50" : ""}`}
            onClick={handleCartAction}
          >
            {isInCart ? (
              <><Trash2 size={18} className="mr-2" /> Remove from Cart</>
            ) : (
              <><ShoppingCart size={18} className="mr-2" /> Add to Cart</>
            )}
          </Button>

          <button
            onClick={(e) => { e.stopPropagation(); onSelect(); }}
            className="w-full text-zinc-500 hover:text-zinc-900 text-sm font-medium py-1 transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={14} /> View Syllabus
          </button>
        </div>
      </div>
    </div>
  );
};

export default Coursecard;