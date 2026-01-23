import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addToCartAction, removeFromCartAction } from '@/actions/cart-actions';
import { toast } from 'sonner'; 

export type CartItem = {
  id: string; // This is the Course ID
  title: string;
  price: number;
  thumbnail?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem, isLoggedIn: boolean) => Promise<void>;
  removeItem: (id: string, isLoggedIn: boolean) => Promise<void>;
  setItems: (items: CartItem[]) => void; // Used for syncing from DB
  clearCart: () => void;
  
  // Computed
  getCartTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isLoading: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: async (item, isLoggedIn) => {
        const currentItems = get().items;
        
        // 1. Deduplication check (Courses are unique in cart)
        if (currentItems.find((i) => i.id === item.id)) {
          toast.info("Course already in cart");
          return;
        }

        // 2. Optimistic Update (Update UI instantly)
        set({ items: [...currentItems, item], isOpen: true });
        toast.success("Course added to cart");

        // 3. Server Sync (If logged in)
        if (isLoggedIn) {
            const result = await addToCartAction(item.id);
            if (!result.success) {
                // Revert on failure
                set({ items: currentItems });
                toast.error("Failed to sync with server");
            }
        }
      },

      removeItem: async (courseId, isLoggedIn) => {
        const currentItems = get().items;
        
        // 1. Optimistic Update
        set({ items: currentItems.filter((i) => i.id !== courseId) });

        // 2. Server Sync
        if (isLoggedIn) {
            const result = await removeFromCartAction(courseId);
            if (!result.success) {
                // Revert on failure
                set({ items: currentItems });
                toast.error("Failed to remove item");
            }
        }
      },

      setItems: (items) => set({ items }),
      
      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.price, 0);
      },
    }),
    {
      name: 'course-cart-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist strict data, skip UI states like 'isOpen' if desired
      partialize: (state) => ({ items: state.items }), 
    }
  )
);