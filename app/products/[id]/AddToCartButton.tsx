"use client";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

export function AddToCartButton({ variantMap, sizes }: { variantMap: Record<string, string>, sizes: string[] }) {
  const { addItemToCart, isLoading } = useCart();
  const [selectedSize, setSelectedSize] = useState(sizes[0] || "Default Title");
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    const variantId = variantMap[selectedSize] || variantMap["Default Title"];
    if (!variantId) return;
    
    setIsAdding(true);
    await addItemToCart(variantId, 1);
    setIsAdding(false);
  };

  return (
    <>
      {sizes.length > 0 && (
        <div className="mb-10">
          <div className="flex justify-between items-center mb-4 text-xs uppercase tracking-widest text-[#5A665D] font-medium">
            <span>Select Size</span>
            <button className="underline opacity-60 hover:opacity-100 transition-opacity">Size Guide</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {sizes.map((size: string) => (
              <button 
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`border py-4 text-sm font-medium transition-colors uppercase tracking-widest rounded-sm ${
                  selectedSize === size 
                    ? "border-[#2C352D] text-[#2C352D] bg-[#2C352D]/5" 
                    : "border-[#C5BAA8] hover:border-[#2C352D] hover:text-[#2C352D] text-[#5A665D] bg-[#FDFBF7]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={handleAdd}
        disabled={isAdding || isLoading || (!selectedSize && sizes.length > 0)}
        className="w-full bg-[#2C352D] text-white py-5 uppercase tracking-[0.2em] text-sm font-medium hover:bg-black transition-all mb-6 rounded-sm shadow-md disabled:opacity-50"
      >
        {isAdding ? "Adding..." : "Add to Cart"}
      </button>
    </>
  );
}
