"use client";

import { useState, useMemo } from "react";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { AddToCartButton } from "./AddToCartButton";

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

interface ProductMainContentProps {
  images: string[];
  title: string;
  options: Option[];
  variants: Variant[];
  formattedPrice: string;
  formattedComparePrice: string | null;
  discount: number;
  descriptionHtml: string;
}

export function ProductMainContent({
  images,
  title,
  options,
  variants,
  formattedPrice,
  formattedComparePrice,
  discount,
  descriptionHtml
}: ProductMainContentProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    options.forEach(option => {
      initial[option.name] = option.values[0];
    });
    return initial;
  });

  const selectedVariant = useMemo(() => {
    const variant = variants.find(variant => {
      return variant.selectedOptions.every(
        option => selectedOptions[option.name] === option.value
      );
    });
    console.log("Selected Variant:", variant?.id, selectedOptions);
    return variant;
  }, [variants, selectedOptions]);

  // When variant changes, we might want to show its image
  const variantImage = selectedVariant?.image?.url;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 relative mt-12">
      <div className="relative">
        <ProductImageCarousel 
          images={images} 
          title={title} 
          selectedVariantImage={variantImage}
        />
      </div>

      <div className="md:sticky md:top-32 self-start h-fit mb-12">
        <div className="mb-4">
          <span className="bg-[#29402E] text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold">
            Sale
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-[#2C352D] tracking-tight">
          {title}
        </h1>
        <div className="flex items-center gap-4 mb-8">
          <span className="text-3xl font-light text-[#2C352D]">{formattedPrice}</span>
          {formattedComparePrice && (
            <>
              <span className="text-lg text-[#5A665D] line-through opacity-50 font-light">
                {formattedComparePrice}
              </span>
              <span className="bg-[#29402E] text-white text-[10px] px-2 py-1 uppercase tracking-widest font-bold">
                Save {discount}%
              </span>
            </>
          )}
        </div>
        
        <div 
          className="text-[#5A665D] font-light leading-relaxed mb-10 tracking-wide prose prose-p:mb-4 prose-a:text-[#2C352D] prose-a:underline prose-li:mb-2 max-w-none"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />

        <AddToCartButton 
          options={options} 
          variants={variants} 
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          selectedVariant={selectedVariant}
        />

        <p className="text-center text-xs text-[#5A665D] uppercase tracking-widest">
          Free shipping on orders over $150
        </p>
        
        <div className="mt-16 border-t border-[#C5BAA8]/50">
          <div className="py-6 border-b border-[#C5BAA8]/50 flex justify-between items-center cursor-pointer group">
            <span className="uppercase text-xs tracking-widest font-medium text-[#5A665D] group-hover:text-[#2C352D] transition-colors">Details & Care</span>
            <span className="text-xl font-light text-[#5A665D] group-hover:text-[#2C352D]">+</span>
          </div>
          <div className="py-6 border-b border-[#C5BAA8]/50 flex justify-between items-center cursor-pointer group">
            <span className="uppercase text-xs tracking-widest font-medium text-[#5A665D] group-hover:text-[#2C352D] transition-colors">Shipping & Returns</span>
            <span className="text-xl font-light text-[#5A665D] group-hover:text-[#2C352D]">+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
