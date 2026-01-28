import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { toast } from 'sonner';
import { addToCartAction, removeFromCartAction } from '@/server/actions/cart.actions';

export type CartItem = {
  id: string; // Course ID
  title: string;
  price: number;
  thumbnail?: string;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem, isLoggedIn: boolean) => Promise<void>;
  removeItem: (id: string, isLoggedIn: boolean) => Promise<void>;
  setItems: (items: CartItem[]) => void;
  clearCart: () => void;
  getCartTotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: async (item, isLoggedIn) => {
        const currentItems = get().items;
        // Deduplication for courses
        if (currentItems.find((i) => i.id === item.id)) {
          toast.info("Course already in cart");
          return;
        }

        // Optimistic Update
        set({ items: [...currentItems, item], isOpen: true });
        toast.success("Course added");

        // Server Sync
        if (isLoggedIn) {
          const result = await addToCartAction(item.id);
          if (!result.success) {
            set({ items: currentItems }); // Revert on failure
            toast.error("Sync failed");
          }
        }
      },

      removeItem: async (courseId, isLoggedIn) => {
        const currentItems = get().items;
        set({ items: currentItems.filter((i) => i.id !== courseId) });

        if (isLoggedIn) {
          const result = await removeFromCartAction(courseId);
          if (!result.success) {
            set({ items: currentItems }); // Revert
            toast.error("Removal failed");
          }
        }
      },

      setItems: (items) => set({ items }),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => get().items.reduce((total, item) => total + item.price, 0),
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);