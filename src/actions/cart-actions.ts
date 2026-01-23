'use server'

import { auth } from "@/server/auth/auth";
import {prisma} from "../../prisma/dbPrisma"
import { revalidatePath } from "next/cache";

// 1. Get the User's Cart
export async function getCart() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const cart = await prisma.cart.findUnique({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          course: true, // Fetch the actual course details
        },
      },
    },
  });

  return cart;
}

// 2. Add Course to Cart
export async function addToCartAction(courseId: string) {
  const session = await auth();
  
  // If not logged in, we return false so Client can handle LocalStorage
  if (!session?.user?.id) return { success: false, message: "Not authenticated" };

  try {
    // Check if user already has a cart, if not create one
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
      });
    }

    // Check if item already exists in cart to prevent duplicates
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        courseId: courseId,
      },
    });

    if (existingItem) {
      return { success: true, message: "Item already in cart" };
    }

    // Add the item
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        courseId: courseId,
      },
    });

    revalidatePath('/'); // Refresh UI
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to add item" };
  }
}

// 3. Remove Course from Cart
export async function removeFromCartAction(courseId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false };

  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          courseId: courseId,
        },
      });
      revalidatePath('/');
    }
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}