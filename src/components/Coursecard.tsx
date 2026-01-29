
import React from 'react';
import { Check, ShoppingCart, Eye, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { CartItem, useCartStore } from '@/store/cart-store';
import { useStore } from '@/hooks/use-store';
import { useSession } from 'next-auth/react';


const Coursecard = ({ course, onSelect, className = "" }: any) => {
      const { data: session } = useSession();
      const isLoggedIn = !!session;
    const cartStore = useStore(useCartStore, (state) => state);

  if (!cartStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
      </div>
    );
  }

  const {  removeItem, addItem } = cartStore;
    const onBuyNow = (id:number)=>{

    }
    const onAddToCart = (item:CartItem)=>{
        console.log(item);
        addItem(item,isLoggedIn);
    }
  return (
    <div className={`relative group z-0 hover:z-30 transition-all ${className}`}>
       {/* Base Card (Visible by default, fades out slightly on hover) */}
       <div className="h-full flex flex-col bg-white border border-zinc-200 rounded-2xl p-6 transition-opacity duration-200 group-hover:opacity-0 shadow-sm cursor-default">
          <div className="aspect-[4/3] mb-6 rounded-lg bg-zinc-100 overflow-hidden relative border border-zinc-100">
             <div className={`absolute inset-0 bg-gradient-to-br opacity-10 ${
               course.id % 3 === 0 ? 'from-blue-500 to-indigo-500' : course.id % 3 === 1 ? 'from-indigo-500 to-violet-500' : 'from-blue-400 to-cyan-400'
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
                  {course.category.toUpperCase()}
                </div>
             </div>
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-medium text-zinc-900 mb-2 truncate">{course.title}</h3>
            <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono mt-4">
              <span>${course.price}</span>
              <span>•</span>
              <span>{(course.students / 1000).toFixed(1)}k Students</span>
            </div>
          </div>
       </div>

       {/* Hover Card (Pops over) */}
       <div 
         className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] bg-white rounded-xl shadow-2xl shadow-zinc-900/10 border border-zinc-200 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 scale-95 group-hover:scale-100 flex flex-col gap-4 z-40"
         style={{ minWidth: '320px' }}
       >
         <div className="flex justify-between items-start">
           <h3 className="text-xl font-bold text-zinc-900 leading-tight">{course.title}</h3>
           <div className="flex flex-col items-end">
              <span className="text-xs text-zinc-400 line-through decoration-zinc-400">${course.originalPrice || (course.price * 10)}</span>
              <span className="text-sm text-blue-600 font-bold">Save 90%</span>
           </div>
         </div>
         
         <div className="text-3xl font-bold text-zinc-900">${course.price}</div>
         
         <div className="space-y-2">
           {course.features && course.features.map((feature: string, idx: number) => (
             <div key={idx} className="flex items-start gap-2">
               <Check size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
               <span className="text-sm text-zinc-600 leading-tight">{feature}</span>
             </div>
           ))}
         </div>

         <div className="h-px bg-zinc-100 my-1" />

         <div className="space-y-3">
           {/* 1. Enroll Now (Buy Now) */}
           <Button className="w-full h-12 px-8 text-base" 
             onClick={(e) => { e.stopPropagation(); onBuyNow?.(course); }}
           >
             Enroll Now
           </Button>
           
           {/* 2. Add to Cart (Add to Cart) */}
           <Button  
             variant="outline" className="w-full h-12 px-8 text-base bg-white border-zinc-300" 
            onClick={(e) => { e.stopPropagation(); onAddToCart?.(course); }}
           >
             <ShoppingCart size={16} /> Add to Cart
           </Button>

           {/* 3. View Syllabus (View Details) */}
           <button 
             onClick={(e) => { e.stopPropagation(); onSelect?.(course.id); }}
             className="w-full text-zinc-500 hover:text-zinc-900 text-sm font-medium py-1 transition-colors flex items-center justify-center gap-2"
           >
             <Eye size={14} /> View Syllabus
           </button>
         </div>

         <div className="flex justify-center mt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-50 rounded-full border border-zinc-200">
               <div className="w-4 h-4 rounded-full bg-zinc-900 flex items-center justify-center text-[8px] font-bold text-white">30</div>
               <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-wide">Days Money Back</span>
            </div>
         </div>
       </div>
    </div>
  );
};


export default Coursecard
