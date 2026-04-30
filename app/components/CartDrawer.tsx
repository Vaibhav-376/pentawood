"use client";
import { useCart } from "@/lib/cart-context";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function CartDrawer({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { cart, isCartOpen, closeCart, removeItemFromCart, isLoading } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#2C352D]/20 backdrop-blur-sm" 
            onClick={closeCart} 
          />
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-sm md:max-w-md bg-[#FDFBF7] h-full shadow-2xl flex flex-col"
          >
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-[#C5BAA8]/30">
              <h2 className="font-serif text-2xl text-[#2C352D] flex items-center gap-2">
                Your Cart {isLoading && <span className="w-4 h-4 rounded-full border-2 border-[#2C352D] border-t-transparent animate-spin ml-2"></span>}
              </h2>
              <button onClick={closeCart} className="text-[#5A665D] hover:text-[#2C352D] transition-colors hover:rotate-90">
                <X className="w-6 h-6" strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 md:p-8">
              {(!cart || cart.totalQuantity === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <p className="text-[#5A665D] uppercase tracking-widest text-xs font-medium mb-4">Your cart is empty</p>
                  <button onClick={closeCart} className="border-b border-[#2C352D] text-[#2C352D] uppercase tracking-widest text-[10px] pb-1 font-medium hover:text-[#5A665D] transition-colors">
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.lines.edges.map(({ node }: any) => {
                    const product = node.merchandise.product;
                    const variantTitle = node.merchandise.title !== "Default Title" ? node.merchandise.title : "";
                    return (
                      <div key={node.id} className="flex gap-6 group">
                        <div className="w-20 h-24 bg-[#F2EFEA] flex-shrink-0 relative overflow-hidden rounded-sm">
                          {node.merchandise.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                             <img src={node.merchandise.image.url} alt={product.title} className="object-cover w-full h-full" />
                          )}
                        </div>
                        <div className="flex flex-col flex-grow">
                          <div className="flex justify-between items-start w-full">
                            <div>
                               <h3 className="text-[#2C352D] font-medium tracking-wide text-sm leading-snug pr-4">{product.title}</h3>
                               {variantTitle && <p className="text-xs text-[#5A665D] mt-1 font-light">{variantTitle}</p>}
                            </div>
                            <button 
                               onClick={() => removeItemFromCart(node.id)} 
                               disabled={isLoading}
                               className="text-[#5A665D] hover:text-red-700 transition-colors py-1 disabled:opacity-30"
                               title="Remove item"
                            >
                               <Trash2 className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                            </button>
                          </div>
                          
                          <div className="mt-auto flex justify-between items-end w-full">
                            <p className="text-[10px] text-[#5A665D] uppercase tracking-widest">Qty: {node.quantity}</p>
                            <div className="text-right">
                              <p className="text-sm text-[#2C352D] font-medium">${node.cost.totalAmount.amount}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {(cart && cart.totalQuantity > 0) && (
              <div className="p-6 md:p-8 border-t border-[#C5BAA8]/30 bg-[#F2EFEA]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[#5A665D] uppercase tracking-widest text-xs font-medium">Subtotal</span>
                  <span className="text-xl font-medium text-[#2C352D]">${cart.cost.subtotalAmount.amount}</span>
                </div>
                
                {isLoggedIn ? (
                  <a 
                    href={cart.checkoutUrl} 
                    className="w-full bg-[#2C352D] hover:bg-black text-white text-center py-5 uppercase tracking-[0.2em] text-xs font-medium transition-colors block rounded-sm shadow-md"
                  >
                    Checkout
                  </a>
                ) : (
                  <div className="space-y-4">
                    <p className="text-[10px] text-center text-red-600 uppercase tracking-widest font-medium">
                      Please sign in to complete your purchase
                    </p>
                    <Link 
                      href="/login" 
                      onClick={closeCart}
                      className="w-full bg-[#2C352D] hover:bg-black text-white text-center py-5 uppercase tracking-[0.2em] text-xs font-medium transition-colors block rounded-sm shadow-md"
                    >
                      Sign In to Checkout
                    </Link>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
