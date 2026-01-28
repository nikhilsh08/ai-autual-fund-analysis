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
          setItems(serverItems);
        }
        isSynced.current = true;
      };
      sync();
    }
  }, [session, setItems]);

  return null;
}