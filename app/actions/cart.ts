"use server";
import { shopifyFetch } from "@/lib/shopify";
import { createCartMutation, addToCartMutation, getCartQuery, removeFromCartMutation } from "@/lib/queries";

export async function createCart() {
  const data = await shopifyFetch(createCartMutation, { input: {} });
  return data?.cartCreate?.cart;
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch(getCartQuery, { cartId });
  return data?.cart;
}

export async function addToCart(cartId: string | null, variantId: string, quantity: number = 1) {
  let activeCartId = cartId;
  
  // Create cart if one doesn't exist locally
  if (!activeCartId) {
     const cart = await createCart();
     activeCartId = cart?.id;
  }
  
  if (!activeCartId) {
     throw new Error("Unable to create cart");
  }

  const data = await shopifyFetch(addToCartMutation, {
    cartId: activeCartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  
  return data?.cartLinesAdd?.cart;
}

export async function removeFromCart(cartId: string, lineId: string) {
  const data = await shopifyFetch(removeFromCartMutation, {
    cartId,
    lineIds: [lineId],
  });
  return data?.cartLinesRemove?.cart;
}
