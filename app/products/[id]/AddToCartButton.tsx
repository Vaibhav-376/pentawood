"use client";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

interface Option {
  id: string;
  name: string;
  values: string[];
}

interface Variant {
  id: string;
  title: string;
  image?: {
    url: string;
  };
  selectedOptions: {
    name: string;
    value: string;
  }[];
}

const COLOR_MAP: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  navy: "#000080",
  blue: "#2443ED",
  red: "#FF0000",
  green: "#008000",
  yellow: "#FFFF00",
  grey: "#808080",
  gray: "#808080",
  beige: "#F5F5DC",
  brown: "#A52A2A",
  pink: "#FFC0CB",
  purple: "#800080",
  orange: "#FFA500",
  charcoal: "#36454F",
  olive: "#808000",
  maroon: "#800000",
  teal: "#008080",
  burgundy: "#800020",
  mustard: "#FFDB58",
};

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
                  const hex = COLOR_MAP[value.toLowerCase()] || "#E2E2E2";
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
                      />
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
        disabled={isAdding || isLoading || !selectedVariant}
        className="w-full bg-[#29402E] text-white py-5 uppercase tracking-[0.2em] text-xs font-medium hover:bg-black transition-all rounded-sm shadow-md disabled:opacity-50 mt-4"
      >
        {isAdding ? "Adding..." : selectedVariant ? "Add to Cart" : "Unavailable"}
      </button>
    </div>
  );
}
