"use client";

import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: any;
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

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const firstVariant = product.variants?.edges[0]?.node;
  const price = parseFloat(firstVariant?.price?.amount || "0");
  const compareAtPrice = parseFloat(firstVariant?.compareAtPrice?.amount || "0");
  const currency = firstVariant?.price?.currencyCode || 'INR';

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
      <div className="flex flex-col">
        {/* Color Swatches */}
        {colorValues.length > 0 && (
          <div className="flex gap-1.5 mb-3">
            {colorValues.slice(0, 4).map((color: string, idx: number) => {
              const hex = COLOR_MAP[color.toLowerCase()] || '#E2E2E2';
              return (
                <div 
                  key={idx}
                  className="w-3.5 h-3.5 rounded-full border border-gray-200 shadow-sm"
                  style={{ backgroundColor: hex }}
                  title={color}
                />
              );
            })}
            {colorValues.length > 4 && (
              <span className="text-[10px] text-gray-500 font-medium ml-1">
                +{colorValues.length - 4}
              </span>
            )}
          </div>
        )}

        <Link href={`/products/${product.handle}`}>
          <h2 className="text-gray-800 text-sm font-medium mb-1 line-clamp-1 group-hover:text-gray-600 transition-colors">
            {product.title}
          </h2>
        </Link>

        {/* Price Info */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-gray-900">
            {formatCurrency(price)}
          </span>
          {discount > 0 && (
            <>
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(compareAtPrice)}
              </span>
              <span className="text-xs font-bold text-red-500">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
        
        {/* Subtext info like in Image 1 */}
        {discount > 0 && (
          <p className="text-[10px] text-gray-400 italic mt-1 font-medium px-1 border-l-2 border-gray-100">
            GST Benefit Included
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
