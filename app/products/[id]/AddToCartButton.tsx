"use client";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import { createPortal } from "react-dom";

export interface Option {
  id: string;
  name: string;
  values: string[];
}

export interface Variant {
  id: string;
  title: string;
  image?: {
    url: string;
  };
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

import { useRouter } from "next/navigation";
import { getColorHex } from "@/lib/colors";
import { Minus, Plus, ShieldCheck, RotateCcw, Truck, Star, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AddToCartButtonProps {
  options: Option[];
  variants: Variant[];
  selectedOptions: Record<string, string>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedVariant: Variant | undefined;
  isLoggedIn: boolean;
}

export function AddToCartButton({ 
  options, 
  selectedOptions, 
  setSelectedOptions, 
  selectedVariant,
  isLoggedIn
}: AddToCartButtonProps) {
  const { addItemToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAdd = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    await addItemToCart(selectedVariant.id, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    
    setIsBuying(true);
    await addItemToCart(selectedVariant.id, quantity);
    setIsBuying(false);
    
    // Redirect to checkout or login
    if (isLoggedIn) {
      router.push("/checkout");
    } else {
      router.push("/login?redirect=/checkout");
    }
  };

  return (
    <div className="flex flex-col gap-8 mb-4">
      {options.filter(option => !option.name.toLowerCase().includes("gender")).map((option) => {
        const isColor = option.name.toLowerCase() === "color" || option.name.toLowerCase() === "colour";
        
        return (
          <div key={option.id} className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#5A665D] font-medium">
              <span>Select {option.name}</span>
              {option.name.toLowerCase() === "size" && (
                <button 
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="underline opacity-60 hover:opacity-100 transition-opacity capitalize tracking-normal text-[10px]"
                >
                  Size Guide
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              {option.values.map((value) => {
                const isSelected = selectedOptions[option.name] === value;
                
                if (isColor) {
                  const hex = getColorHex(value);
                  console.log(`Color Mapping: "${value}" -> ${hex}`);
                  return (
                    <button
                      key={value}
                      onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                      className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center p-0.5 ${
                        isSelected ? "border-[#29402E]" : "border-transparent"
                      }`}
                      title={value}
                    >
                      <div 
                        className="w-full h-full rounded-full border border-black/10 shadow-inner" 
                        style={{ backgroundColor: hex }}
                      >
                        {hex === "#E2E2E2" && (
                          <span className="text-[10px] font-bold text-[#5A665D] uppercase opacity-60">
                            {value.charAt(0)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                }

                return (
                  <button 
                    key={value}
                    onClick={() => setSelectedOptions(prev => ({ ...prev, [option.name]: value }))}
                    className={`border px-6 py-3 text-[11px] font-medium transition-all uppercase tracking-widest rounded-sm min-w-[60px] ${
                      isSelected 
                        ? "border-[#29402E] text-[#29402E] bg-[#29402E]/5 shadow-sm" 
                        : "border-[#C5BAA8]/40 hover:border-[#29402E] hover:text-[#29402E] text-[#5A665D] bg-[#FDFBF7]"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Quantity Counter */}
      <div className="flex flex-col gap-4">
        <label className="text-xs uppercase tracking-widest text-[#5A665D] font-medium">Quantity</label>
        <div className="flex items-center w-32 border border-[#C5BAA8]/40 rounded-sm">
          <button 
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="flex-1 py-3 flex items-center justify-center hover:bg-[#29402E]/5 transition-colors"
            disabled={quantity <= 1}
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
          <button 
            onClick={() => setQuantity(Math.min(10, quantity + 1))}
            className="flex-1 py-3 flex items-center justify-center hover:bg-[#29402E]/5 transition-colors"
            disabled={quantity >= 10}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <button 
          onClick={handleAdd}
          disabled={isAdding || isBuying || isLoading || !selectedVariant || !selectedVariant.availableForSale}
          className="w-full bg-[#29402E] text-white py-5 uppercase tracking-[0.2em] text-xs font-medium hover:bg-black transition-all rounded-sm shadow-md disabled:opacity-50"
        >
          {isAdding 
            ? "Adding..." 
            : !selectedVariant 
              ? "Select Options" 
              : !selectedVariant.availableForSale 
                ? "Unavailable" 
                : "Add to Cart"}
        </button>

        <button 
          onClick={handleBuyNow}
          disabled={isAdding || isBuying || isLoading || !selectedVariant || !selectedVariant.availableForSale}
          className="w-full border border-[#29402E] text-[#29402E] py-5 uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#29402E] hover:text-white transition-all rounded-sm disabled:opacity-50"
        >
          {isBuying ? "Processing..." : "Buy It Now"}
        </button>
      </div>

      {/* Trust Badges Section */}
      <div className="mt-6 pt-6 border-t border-[#C5BAA8]/20">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { 
              icon: ShieldCheck, 
              title: "100% Secure", 
              subtitle: "Payment" 
            },
            { 
              icon: RotateCcw, 
              title: "Easy", 
              subtitle: "Returns" 
            },
            { 
              icon: Truck, 
              title: "Fast", 
              subtitle: "Shipping" 
            },
            { 
              icon: Star, 
              title: "Quality", 
              subtitle: "Guaranteed" 
            }
          ].map((badge, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center justify-center p-4 bg-[#F9F8F6] border border-[#C5BAA8]/10 rounded-xl transition-all hover:bg-white hover:shadow-sm group"
            >
              <badge.icon className="w-5 h-5 mb-3 text-[#29402E] opacity-80 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
              <div className="text-center">
                <p className="text-[10px] font-bold text-[#2C352D] uppercase tracking-wider leading-tight">
                  {badge.title}
                </p>
                <p className="text-[10px] font-medium text-[#5A665D] uppercase tracking-wider leading-tight">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Size Guide Modal via Portal */}
      {isSizeGuideOpen && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {isSizeGuideOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
              onClick={() => setIsSizeGuideOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative max-w-4xl w-full max-h-[90vh] bg-[#FDFBF7] rounded-lg overflow-hidden shadow-2xl flex flex-col border border-[#C5BAA8]/30"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="absolute top-4 right-4 z-10">
                  <button
                    type="button"
                    onClick={() => setIsSizeGuideOpen(false)}
                    className="p-2 bg-white/80 hover:bg-white text-[#29402E] rounded-full shadow-md transition-transform active:scale-90 cursor-pointer"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="overflow-y-auto p-2 sm:p-6 flex items-center justify-center bg-[#FDFBF7]">
                  <img 
                    src="/sizechart.PNG" 
                    alt="Size Guide" 
                    className="w-full h-auto object-contain max-h-[85vh] rounded"
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}
