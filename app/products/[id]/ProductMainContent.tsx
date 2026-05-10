"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProductImageCarousel } from "./ProductImageCarousel";
import { AddToCartButton, type Option, type Variant } from "./AddToCartButton";

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
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
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

        <div className="mt-16 border-t border-[#C5BAA8]/50">
          {[
            { 
              id: "details", 
              title: "Details & Care", 
              content: (
                <div className="space-y-4 text-sm font-light leading-relaxed text-[#5A665D]">
                  <p>Our premium garments are crafted from 100% GOTS certified organic cotton, ensuring both exceptional comfort and a reduced environmental footprint.</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Machine wash cold with like colors</li>
                    <li>Tumble dry low or line dry in shade</li>
                    <li>Iron on low heat if necessary</li>
                    <li>Do not bleach</li>
                  </ul>
                </div>
              )
            },
            { 
              id: "shipping", 
              title: "Shipping & Returns", 
              content: (
                <div className="space-y-4 text-sm font-light leading-relaxed text-[#5A665D]">
                  <p>We offer standard shipping on all orders. Most orders are processed within 1-2 business days.</p>
                  <p>If you are not entirely satisfied with your purchase, we offer easy 30-day returns and exchanges. Items must be in their original condition with all tags attached.</p>
                </div>
              )
            }
          ].map((section) => (
            <div key={section.id} className="border-b border-[#C5BAA8]/50">
              <button 
                onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
                className="w-full py-6 flex justify-between items-center cursor-pointer group"
              >
                <span className="uppercase text-xs tracking-[0.2em] font-bold text-[#5A665D] group-hover:text-[#2C352D] transition-colors">{section.title}</span>
                <span className={`text-xl font-light text-[#5A665D] transition-transform duration-300 ${openAccordion === section.id ? 'rotate-45' : ''}`}>
                  {openAccordion === section.id ? '×' : '+'}
                </span>
              </button>
              <AnimatePresence>
                {openAccordion === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8">
                      {section.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
