'use client';

import { useEffect, useRef } from 'react';
import { useCartStore } from '@/store/cart-store';

import { useSession } from 'next-auth/react';
import { getCartAction } from '@/server/actions/cart.actions';

export function CartSync() {
  const { data: session } = useSession();
  const setItems = useCartStore((state) => state.setItems);
  const isSynced = useRef(false);

  useEffect(() => {
    if (session?.user && !isSynced.current) {
      const sync = async () => {
        const serverItems = await getCartAction();
        if (serverItems && serverItems.length > 0) {
          // Add type field to server items (default to 'course' for backward compatibility)
          const itemsWithType = serverItems.map((item: any) => ({
            ...item,
            type: item.type || 'course',
          }));
          setItems(itemsWithType);
        }
        isSynced.current = true;
      };
      sync();
    }
  }, [session, setItems]);

  return null;
}