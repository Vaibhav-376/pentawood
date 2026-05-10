"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: any;
}

import { getColorHex } from "@/lib/colors";

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const firstVariant = product.variants?.edges?.[0]?.node;
  const priceRange = product.priceRange?.minVariantPrice;
  
  const price = parseFloat(firstVariant?.price?.amount || priceRange?.amount || "0");
  const compareAtPrice = parseFloat(firstVariant?.compareAtPrice?.amount || "0");
  const currency = 'INR';

  const firstImage = product.images?.edges?.[0]?.node?.url || product.featuredImage?.url;
  const secondImage = product.images?.edges?.[1]?.node?.url;
  const hasMultipleImages = Boolean(secondImage && secondImage !== firstImage);

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

  return (
    <div className="group flex flex-col cursor-pointer transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F7F7F7] rounded-sm mb-4">
        <Link href={`/products/${product.handle}`}>
          {firstImage ? (
            <>
              <img
                src={firstImage}
                alt={product.title}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${hasMultipleImages ? 'group-hover:opacity-0' : ''}`}
                loading="lazy"
              />
              {hasMultipleImages && (
                <img
                  src={secondImage}
                  alt={`${product.title} alternate view`}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
                  loading="lazy"
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-light text-sm">
              No Image
            </div>
          )}
        </Link>

        {/* Sale Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-[#29402E] text-white text-[10px] uppercase tracking-widest px-3 py-1 font-bold shadow-md">
            Sale
          </span>
        </div>
        
        {/* Wishlist Button */}
        <button 
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/80 hover:bg-white text-gray-700 transition-colors shadow-sm"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            // Wishlist functionality here
          }}
        >
          <Heart size={18} strokeWidth={1.5} />
        </button>

        {/* GST Badge Overlay (Conditional) */}
        {discount > 40 && (
          <div className="absolute bottom-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-wider px-2 py-1 font-medium text-gray-800 shadow-sm border border-gray-100">
              GST Benefit Included
            </span>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="flex flex-col pt-3 px-1 md:px-2">
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
