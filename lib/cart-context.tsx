"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { getCart, addToCart, removeFromCart } from "@/app/actions/cart";

type CartContextType = {
  cart: any;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItemToCart: (variantId: string, quantity?: number) => Promise<void>;
  removeItemFromCart: (lineId: string) => Promise<void>;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Cart via persistent browser ID
  useEffect(() => {
    const initCart = async () => {
      const storedCartId = localStorage.getItem("shopify_cart_id");
      if (storedCartId) {
        const fetchedCart = await getCart(storedCartId);
        if (fetchedCart) {
          setCart(fetchedCart);
        } else {
          // Garbage collection on invalid legacy cart records
          localStorage.removeItem("shopify_cart_id");
        }
      }
      setIsLoading(false);
    };
    initCart();
  }, []);

  const addItemToCart = async (variantId: string, quantity = 1) => {
    console.log("Adding to cart:", { variantId, quantity });
    setIsLoading(true);
    const storedCartId = localStorage.getItem("shopify_cart_id");
    
    try {
      const updatedCart = await addToCart(storedCartId, variantId, quantity);
      console.log("Updated cart response:", updatedCart);
      if (updatedCart) {
        setCart(updatedCart);
        localStorage.setItem("shopify_cart_id", updatedCart.id);
        setIsCartOpen(true); // Open the drawer natively on addition
      }
    } catch(err) {
      console.error("Failed executing add to cart action", err);
    }
    
    setIsLoading(false);
  };

  const removeItemFromCart = async (lineId: string) => {
    console.log("Removing item from cart:", lineId);
    setIsLoading(true);
    const storedCartId = localStorage.getItem("shopify_cart_id");
    if (!storedCartId) return;

    try {
      const updatedCart = await removeFromCart(storedCartId, lineId);
      console.log("Cart after removal:", updatedCart);
      if (updatedCart) {
        setCart(updatedCart);
      }
    } catch(err) {
      console.error("Failed removing item", err);
      alert("Failed to remove item: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        addItemToCart,
        removeItemFromCart,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used inside a designated CartProvider");
  }
  return context;
};
