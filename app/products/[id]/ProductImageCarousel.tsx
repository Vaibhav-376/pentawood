"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductImageCarouselProps {
  images: string[];
  title: string;
}

export function ProductImageCarousel({ images, title }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const nextImage = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };



  if (images.length === 0) return null;

  return (
    <div className="relative w-full aspect-[3/4] group">
      <div className="relative w-full h-full overflow-hidden rounded-sm bg-[#F2EFEA]">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt={`${title} image ${currentIndex + 1}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setIsLightboxOpen(true)}
            className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
          />
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <>
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-[#2C352D]"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={1.5} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-[#2C352D]"
            aria-label="Next image"
          >
            <ChevronRight className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  idx === currentIndex ? "bg-[#2C352D] w-4" : "bg-[#2C352D]/20 hover:bg-[#2C352D]/40"
                }`}
                aria-label={`Go to image ${idx + 1}`}
              />
            ))}
          </div>
          
          {/* Mobile Thumbnails */}
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar md:hidden">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`relative flex-shrink-0 w-20 aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all ${
                  idx === currentIndex ? "border-[#2C352D]" : "border-transparent opacity-60"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}
      
      {/* Desktop Thumbnails (Side or Bottom) */}
      <div className="hidden md:flex gap-3 mt-6">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-20 aspect-[3/4] rounded-sm overflow-hidden border transition-all ${
              idx === currentIndex ? "border-[#2C352D] ring-1 ring-[#2C352D]" : "border-[#C5BAA8]/30 opacity-60 hover:opacity-100"
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
          </button>
        ))}
      </div>
      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="w-8 h-8" strokeWidth={1.5} />
            </motion.button>

            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={images[currentIndex]}
              alt={`${title} fullscreen`}
              className="max-w-full max-h-full object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {images.length > 1 && (
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                >
                  <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
