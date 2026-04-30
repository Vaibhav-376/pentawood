"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const HERO_SLIDES = [
  {
    id: 1,
    tagline: "Signature Collection",
    title: "Minimalist living, redefined.",
    description: "Discover our latest drop featuring clean lines, premium fabrics, and a palette inspired by the earth.",
    primaryBtn: "Shop Now",
    primaryHref: "/products",
    secondaryBtn: "View Lookbook",
    secondaryHref: "/about",
    bgImage: "/image.png",
    bgColor: "#EAE8DF"
  },
  {
    id: 1,
    tagline: "The Essentials Collection",
    title: "Timeless pieces. Modern silhouettes.",
    description: "Premium clothing crafted with meticulous attention to detail. Designed in beige and subtle greens to reflect nature and sophistication.",
    primaryBtn: "Shop Collection",
    primaryHref: "/products",
    secondaryBtn: "Our Story",
    secondaryHref: "/about",
    bgImage: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=2000&auto=format&fit=crop",
    bgColor: "#EAE8DF"
  },
  {
    id: 2,
    tagline: "New Arrivals",
    title: "The Summer Lookbook.",
    description: "Lightweight fabrics and breathable silhouettes designed for the warmer months ahead. Explore our latest drop.",
    primaryBtn: "Explore Summer",
    primaryHref: "/collections/summer",
    secondaryBtn: "View All",
    secondaryHref: "/products",
    bgImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop",
    bgColor: "#FDFBF7"
  },
  {
    id: 3,
    tagline: "Finishing Touches",
    title: "Detail oriented. Design driven.",
    description: "Our accessories are designed to complement your core wardrobe with subtle, high-quality accents.",
    primaryBtn: "Shop Accessories",
    primaryHref: "/collections/accessories",
    secondaryBtn: "New Drops",
    secondaryHref: "/products",
    bgImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2000&auto=format&fit=crop",
    bgColor: "#EAE8DF"
  },
  {
    id: 4,
    tagline: "Winter Warmth",
    title: "Soft textures. Sustainable warmth.",
    description: "Responsibly sourced wool and cashmere pieces designed to keep you warm and refined through the season.",
    primaryBtn: "Explore Knitwear",
    primaryHref: "/collections/knitwear",
    secondaryBtn: "Our Story",
    secondaryHref: "/about",
    bgImage: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=2000&auto=format&fit=crop",
    bgColor: "#F2EFEA"
  },
  {
    id: 5,
    tagline: "Natural Fibers",
    title: "The Linen Edit. Breathable luxury.",
    description: "Experience the effortless elegance of pure organic linen. Perfect for relaxed afternoons and coastal escapes.",
    primaryBtn: "Shop Linen",
    primaryHref: "/collections/linen",
    secondaryBtn: "Explore",
    secondaryHref: "/products",
    bgImage: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=2000&auto=format&fit=crop",
    bgColor: "#EAE8DF"
  },
  {
    id: 6,
    tagline: "Premium Footwear",
    title: "Elegance in every step.",
    description: "Handcrafted leather footwear that blends traditional craftsmanship with modern comfort and style.",
    primaryBtn: "Shop Footwear",
    primaryHref: "/collections/footwear",
    secondaryBtn: "New Arrivals",
    secondaryHref: "/products",
    bgImage: "https://images.unsplash.com/photo-1449241743080-ca0020aa5027?q=80&w=2000&auto=format&fit=crop",
    bgColor: "#FDFBF7"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);



  const currentSlide = HERO_SLIDES[current] || HERO_SLIDES[0];

  return (
    <section className="relative h-[70vh] w-full overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Background Layer with Ken Burns effect */}
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-black/10 z-10" />
            <Image
              src={currentSlide.bgImage}
              alt={currentSlide.title}
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>

          {/* Content Layer */}
          <div 
            className="relative z-20 h-full w-full flex items-center justify-center pt-8"
            style={{ backgroundColor: `${currentSlide.bgColor}66` }}
          >
            <div className="text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
              <motion.span 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 0.7 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#29402E] tracking-[0.6em] uppercase text-[9px] md:text-[10px] font-bold mb-8 block"
              >
                {currentSlide.tagline}
              </motion.span>
              
              <motion.h1 
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-4xl md:text-6xl lg:text-8xl text-[#29402E] font-medium tracking-tight leading-[1.1] mb-10"
              >
                {currentSlide.title.split(".").map((part, i) => (
                  <React.Fragment key={i}>
                    {part}{i === 0 && part !== "" && "."}
                    {i === 0 && <br className="hidden md:block" />}
                  </React.Fragment>
                ))}
              </motion.h1>
              
              <motion.p 
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 0.9 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[#5A665D] text-xs md:text-base font-light max-w-xl mx-auto mb-14 tracking-wide leading-relaxed px-4"
              >
                {currentSlide.description}
              </motion.p>
              
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto items-center justify-center"
              >
                
               
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots - Refined */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-5">
        {HERO_SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group relative py-4"
            aria-label={`Go to slide ${index + 1}`}
          >
            <div className={`h-[2px] transition-all duration-700 ease-in-out ${
              current === index ? "bg-[#29402E] w-12" : "bg-[#29402E]/20 w-6 group-hover:bg-[#29402E]/40"
            }`} />
          </button>
        ))}
      </div>
    </section>
  );
}
