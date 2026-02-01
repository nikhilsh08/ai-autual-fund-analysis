'use server'

import { auth } from "@/server/auth/auth";
import {prisma} from "../../lib/dbPrisma"
import { revalidatePath } from "next/cache";

// FETCH CART
export async function getCartAction() {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: { course: true } // Relation to Course model
        }
      }
    });

    if (!cart) return [];

    // Map Prisma structure to Store structure
    return cart.items.map(item => ({
      id: item.course.id,
      title: item.course.title,
      price: item.course.price,
      thumbnail: item.course.thumbnail || ""
    }));
  } catch (error) {
    console.error("Cart fetch error:", error);
    return [];
  }
}

// ADD ITEM
export async function addToCartAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  try {
    // 1. Get or Create Cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id }
      });
    }

    // 2. Check strict deduplication
    const exists = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, courseId }
    });

    if (exists) return { success: true };

    // 3. Create Item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        courseId: courseId
      }
    });

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    console.error("Add to cart error:", error);
    return { success: false };
  }
}

// REMOVE ITEM
export async function removeFromCartAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  try {
    const cart = await prisma.cart.findUnique({ where: { userId: session.user.id } });
    if (!cart) return { success: false };

    await prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        courseId: courseId
      }
    });

    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// clear cart 
