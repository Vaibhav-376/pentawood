"use client";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

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

import { getColorHex } from "@/lib/colors";

interface AddToCartButtonProps {
  options: Option[];
  variants: Variant[];
  selectedOptions: Record<string, string>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  selectedVariant: Variant | undefined;
}

export function AddToCartButton({ 
  options, 
  variants, 
  selectedOptions, 
  setSelectedOptions, 
  selectedVariant 
}: AddToCartButtonProps) {
  const { addItemToCart, isLoading } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    if (!selectedVariant) return;
    
    setIsAdding(true);
    await addItemToCart(selectedVariant.id, 1);
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col gap-8 mb-10">
      {options.map((option) => {
        const isColor = option.name.toLowerCase() === "color" || option.name.toLowerCase() === "colour";
        
        return (
          <div key={option.id} className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs uppercase tracking-widest text-[#5A665D] font-medium">
              <span>Select {option.name}</span>
              {option.name.toLowerCase() === "size" && (
                <button className="underline opacity-60 hover:opacity-100 transition-opacity capitalize tracking-normal text-[10px]">Size Guide</button>
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

      <button 
        onClick={handleAdd}
        disabled={isAdding || isLoading || !selectedVariant || !selectedVariant.availableForSale}
        className="w-full bg-[#29402E] text-white py-5 uppercase tracking-[0.2em] text-xs font-medium hover:bg-black transition-all rounded-sm shadow-md disabled:opacity-50 mt-4"
      >
        {isAdding 
          ? "Adding..." 
          : !selectedVariant 
            ? "Select Options" 
            : !selectedVariant.availableForSale 
              ? "Unavailable" 
              : "Add to Cart"}
      </button>
    </div>
  );
}
