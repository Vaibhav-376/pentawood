"use client";

import React, { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getColorHex } from "@/lib/colors";

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isDragging = useRef(false);
  const dragStartPos = useRef(0);

  const firstVariant = product.variants?.edges?.[0]?.node;
  const priceRange = product.priceRange?.minVariantPrice;
  
  const price = parseFloat(firstVariant?.price?.amount || priceRange?.amount || "0");
  const compareAtPrice = parseFloat(firstVariant?.compareAtPrice?.amount || "0");
  const currency = 'INR';

  // Get all images
  const images = product.images?.edges?.map((edge: any) => edge.node.url) || [];
  if (images.length === 0) {
    const fallback = product.featuredImage?.url;
    if (fallback) images.push(fallback);
  }

  const hasMultipleImages = images.length > 1;

  const colorOption = product.options?.find((o: any) => o.name.toLowerCase() === "color");
  const colorValues = colorOption?.values || [];

  const discount = compareAtPrice > price 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) 
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const nextImage = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const handleDragStart = (e: any) => {
    isDragging.current = false;
    dragStartPos.current = e.clientX || (e.touches && e.touches[0].clientX);
  };

  const handleDragEnd = (e: any) => {
    const endPos = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
    const diff = dragStartPos.current - endPos;

    if (Math.abs(diff) > 5) {
      isDragging.current = true;
    }

    if (Math.abs(diff) > 50) {
      if (diff > 0) nextImage();
      else prevImage();
    }
  };

  return (
    <div className="group flex flex-col cursor-pointer transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] rounded-sm mb-2">
        <Link 
          href={`/products/${product.handle}`}
          onClick={(e) => {
            if (isDragging.current) {
              e.preventDefault();
            }
          }}
          className="block w-full h-full"
        >
          <div 
            className="relative w-full h-full"
            onMouseDown={handleDragStart}
            onMouseUp={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchEnd={handleDragEnd}
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt={`${product.title} - image ${currentIndex + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
              />
            </AnimatePresence>
            
            {/* Fallback if no images */}
            {images.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-light text-sm">
                No Image
              </div>
            )}
          </div>
        </Link>

        {/* Navigation Arrows - Only show on hover for desktop, always available for interaction */}
        {hasMultipleImages && (
          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={prevImage}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#29402E] shadow-sm pointer-events-auto transition-transform active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft size={16} strokeWidth={2.5} />
            </button>
            <button
              onClick={nextImage}
              className="p-1.5 rounded-full bg-white/80 hover:bg-white text-[#29402E] shadow-sm pointer-events-auto transition-transform active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight size={16} strokeWidth={2.5} />
            </button>
          </div>
        )}

        {/* Dots Indicator */}
        {hasMultipleImages && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {images.map((_: string, idx: number) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-4 bg-[#29402E]" : "w-1 bg-[#29402E]/30"
                }`}
              />
            ))}
          </div>
        )}

        {/* Sale Tag */}
        <div className="absolute top-2 left-2 z-10">
          <span className="bg-[#29402E] text-white text-[8px] uppercase tracking-[0.15em] px-2 py-0.5 font-bold shadow-sm">
            Sale
          </span>
        </div>
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors shadow-sm z-20"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // Wishlist functionality here
          }}
        >
          <Heart size={18} strokeWidth={1.5} />
        </button>

        {/* GST Badge Overlay (Conditional) removed */}
      </div>

      {/* Metadata */}
      <div className="flex flex-col pt-1.5 px-1 md:px-2">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <Link href={`/products/${product.handle}`} className="flex-1">
            <h2 className="text-[#29402E] text-[13px] md:text-sm font-medium line-clamp-2 uppercase tracking-wide">
              {product.title}
            </h2>
          </Link>
          <div className="flex flex-col items-end">
            <span className="text-[#29402E] text-[13px] md:text-sm font-bold whitespace-nowrap">
              {formatCurrency(price)}
            </span>
            {compareAtPrice > price && (
              <span className="text-[10px] text-[#5A665D] line-through opacity-60">
                {formatCurrency(compareAtPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Color Info & Discount */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            {colorValues.length > 0 && (
              <div className="flex items-center">
                <div 
                  className="w-2.5 h-2.5 rounded-full border border-gray-200 mr-2"
                  style={{ backgroundColor: getColorHex(colorValues[0]) }}
                />
                <span className="text-[10px] text-[#5A665D] uppercase tracking-widest font-medium">
                  {colorValues.length} {colorValues.length === 1 ? 'Colour' : 'Colours'}
                </span>
              </div>
            )}
          </div>
          
          {discount > 0 && (
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-tighter">
              -{discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
