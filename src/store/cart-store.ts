import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { toast } from 'sonner';
import { addToCartAction,clearCartAction, removeFromCartAction } from '@/server/actions/cart.actions';

export type CartItem = {
  id: string; // Course or Bundle ID
  title: string;
  price: number;
  thumbnail?: string;
  type: 'course' | 'bundle';
  courseIds?: string[]; // For bundles - list of included course IDs
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;

  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem, isLoggedIn: boolean) => Promise<void>;
  addBundle: (bundle: CartItem, isLoggedIn: boolean) => Promise<void>;
  removeItem: (id: string, isLoggedIn: boolean) => Promise<void>;
  setItems: (items: CartItem[]) => void;
  clearCart: (isLoggedIn: boolean) => void;
  getCartTotal: () => number;
  hasConflictingCourses: (bundleCourseIds: string[]) => boolean;
  getCourseIds: () => string[];
  getBundleIds: () => string[];
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
        // Ensure type is set for backward compatibility
        const itemWithType = { ...item, type: item.type || 'course' as const };

        // Deduplication for courses
        if (currentItems.find((i) => i.id === itemWithType.id)) {
          toast.info("Item already in cart");
          return;
        }

        // Optimistic Update
        set({ items: [...currentItems, itemWithType], isOpen: true });
        toast.success("Course added");

        // Server Sync (only for courses, bundles are handled client-side only)
        if (isLoggedIn && itemWithType.type === 'course') {
          const result = await addToCartAction(item.id);
          if (!result.success) {
            set({ items: currentItems }); // Revert on failure
            toast.error("Sync failed");
          }
        }
      },

      addBundle: async (bundle, isLoggedIn) => {
        const currentItems = get().items;

        // Check if bundle already in cart
        if (currentItems.find((i) => i.id === bundle.id && i.type === 'bundle')) {
          toast.info("Bundle already in cart");
          return;
        }

        // Remove any individual courses that are included in the bundle
        const bundleCourseIds = bundle.courseIds || [];
        const filteredItems = currentItems.filter(item =>
          item.type === 'bundle' || !bundleCourseIds.includes(item.id)
        );

        const removedCount = currentItems.length - filteredItems.length;

        // Add bundle to cart
        const bundleItem: CartItem = {
          ...bundle,
          type: 'bundle'
        };

        set({ items: [...filteredItems, bundleItem], isOpen: true });

        if (removedCount > 0) {
          toast.success(`Bundle added! ${removedCount} individual course(s) replaced.`);
        } else {
          toast.success("Bundle added to cart!");
        }

        // Note: Bundles are not synced to server cart (they're stored locally only)
        // Server sync happens at checkout with bundleIds
      },

      removeItem: async (courseId, isLoggedIn) => {
        const currentItems = get().items;
        const itemToRemove = currentItems.find((i) => i.id === courseId);
        set({ items: currentItems.filter((i) => i.id !== courseId) });

        // Only sync course removals to server (not bundles)
        if (isLoggedIn && itemToRemove?.type !== 'bundle') {
          const result = await removeFromCartAction(courseId);
          if (!result.success) {
            set({ items: currentItems }); // Revert
            toast.error("Removal failed");
          }
        }
      },

      setItems: (items) => set({ items: items.map(item => ({ ...item, type: item.type || 'course' as const })) }),

      clearCart: async (isLoggedIn) =>{
        if(isLoggedIn){
          await clearCartAction();
        }
         set({ items: [] })
        },

      getCartTotal: () => get().items.reduce((total, item) => total + item.price, 0),

      hasConflictingCourses: (bundleCourseIds) => {
        const currentItems = get().items;
        return currentItems.some(item =>
          item.type === 'course' && bundleCourseIds.includes(item.id)
        );
      },

      getCourseIds: () => {
        return get().items
          .filter(item => item.type === 'course')
          .map(item => item.id);
      },

      getBundleIds: () => {
        return get().items
          .filter(item => item.type === 'bundle')
          .map(item => item.id);
      },
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);