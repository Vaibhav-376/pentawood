"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductImageCarouselProps {
  images: string[];
  title: string;
  selectedVariantImage?: string;
}

export function ProductImageCarousel({ images, title, selectedVariantImage }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [[page, direction], setPage] = useState([0, 0]);
  const isDragging = useRef(false);
  const lastSelectedVariantImage = useRef(selectedVariantImage);

  // Update carousel when selected variant image changes
  useEffect(() => {
    if (selectedVariantImage && selectedVariantImage !== lastSelectedVariantImage.current) {
      const index = images.findIndex(img => img === selectedVariantImage);
      if (index !== -1 && index !== currentIndex) {
        const newDirection = index > currentIndex ? 1 : -1;
        setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
        setCurrentIndex(index);
      }
      lastSelectedVariantImage.current = selectedVariantImage;
    }
  }, [selectedVariantImage, images, currentIndex]);

  const paginate = useCallback((newDirection: number) => {
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    setCurrentIndex((prev) => (prev + newDirection + images.length) % images.length);
  }, [images.length]);

  const setIndex = (newIndex: number) => {
    if (newIndex === currentIndex) return;
    const newDirection = newIndex > currentIndex ? 1 : -1;
    setPage(([prevPage]) => [prevPage + newDirection, newDirection]);
    setCurrentIndex(newIndex);
  };

  const nextImage = useCallback(() => paginate(1), [paginate]);
  const prevImage = useCallback(() => paginate(-1), [paginate]);

  if (images.length === 0) return null;

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      zIndex: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      zIndex: 0
    })
  };

  const swipeConfidenceThreshold = 1000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="flex flex-col w-full select-none">
      <div className="relative w-full aspect-[3/4] group overflow-hidden rounded-sm bg-[#F2EFEA]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={page}
            src={images[currentIndex]}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag={images.length > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={() => {
              isDragging.current = true;
            }}
            onDragEnd={(e, { offset, velocity }) => {
              // Use a small timeout to ensure onClick knows we were dragging
              setTimeout(() => {
                isDragging.current = false;
              }, 50);

              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold || offset.x < -50) {
                nextImage();
              } else if (swipe > swipeConfidenceThreshold || offset.x > 50) {
                prevImage();
              }
            }}
            alt={`${title} image ${currentIndex + 1}`}
            onClick={() => {
              if (!isDragging.current) {
                setIsLightboxOpen(true);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover cursor-grab active:cursor-grabbing"
          />
        </AnimatePresence>

        {images.length > 1 && (
          <div className="absolute inset-0 pointer-events-none z-10">
            {/* Navigation Arrows - Using separate container for pointer events */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-auto p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white text-[#2C352D] active:scale-90"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2} />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-auto p-2 bg-white/90 backdrop-blur-md rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-white text-[#2C352D] active:scale-90"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 pointer-events-auto">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIndex(idx);
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentIndex ? "bg-[#2C352D] w-4" : "bg-[#2C352D]/20 hover:bg-[#2C352D]/40"
                  }`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <>
          {/* Mobile Thumbnails */}
          <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar md:hidden pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`relative flex-shrink-0 w-20 aspect-[3/4] rounded-sm overflow-hidden border-2 transition-all ${
                  idx === currentIndex ? "border-[#2C352D]" : "border-transparent opacity-60"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          {/* Desktop Thumbnails */}
          <div className="hidden md:flex gap-3 mt-6 flex-wrap">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setIndex(idx)}
                className={`relative w-20 aspect-[3/4] rounded-sm overflow-hidden border transition-all ${
                  idx === currentIndex ? "border-[#2C352D] ring-1 ring-[#2C352D]" : "border-[#C5BAA8]/30 opacity-60 hover:opacity-100"
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </>
      )}

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
              className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors z-[110]"
              onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false); }}
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
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-[110]" onClick={(e) => e.stopPropagation()}>
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
