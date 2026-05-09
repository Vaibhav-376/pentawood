"use server";
import { shopifyFetch } from "@/lib/shopify";
import { createCartMutation, addToCartMutation, getCartQuery, removeFromCartMutation } from "@/lib/queries";

export async function createCart(lines: any[] = []) {
  const data = await shopifyFetch(createCartMutation, { 
    input: { lines } 
  });
  if (data?.cartCreate?.userErrors?.length > 0) {
    throw new Error(data.cartCreate.userErrors[0].message);
  }
  return data?.cartCreate?.cart;
}

export async function getCart(cartId: string) {
  const data = await shopifyFetch(getCartQuery, { cartId });
  return data?.cart;
}

export async function addToCart(cartId: string | null, variantId: string, quantity: number = 1) {
  let activeCartId = cartId;
  
  // If no cart exists, create one with the item already in it
  if (!activeCartId || activeCartId === "null" || activeCartId === "undefined") {
     const cart = await createCart([{ merchandiseId: variantId, quantity }]);
     return cart;
  }
  
  const data = await shopifyFetch(addToCartMutation, {
    cartId: activeCartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  
  if (data?.cartLinesAdd?.userErrors?.length > 0) {
    // If the cart expired or was deleted, try creating a new one
    if (data.cartLinesAdd.userErrors[0].message.toLowerCase().includes("not found") || 
        data.cartLinesAdd.userErrors[0].message.toLowerCase().includes("expired")) {
      return await createCart([{ merchandiseId: variantId, quantity }]);
    }
    throw new Error(data.cartLinesAdd.userErrors[0].message);
  }
  
  return data?.cartLinesAdd?.cart;
}

export async function removeFromCart(cartId: string, lineId: string) {
  const data = await shopifyFetch(removeFromCartMutation, {
    cartId,
    lineIds: [lineId],
  });
  return data?.cartLinesRemove?.cart;
}
