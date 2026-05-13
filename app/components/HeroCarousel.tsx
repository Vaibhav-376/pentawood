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
    desktopImage: "/desktop/pw.PNG",
    mobileImage: "/mobile/mobile.PNG",
    bgColor: "#EAE8DF"
  },
  {
    id: 2,
    tagline: "The Essentials",
    title: "Timeless pieces. Modern silhouettes.",
    description: "Premium clothing crafted with meticulous attention to detail. Designed in beige and subtle greens.",
    desktopImage: "/desktop/pwmini.PNG",
    mobileImage: "/mobile/mobile.PNG", // Fallback to the available mobile image for now
    bgColor: "#EAE8DF"
  },
  {
    id: 3,
    tagline: "New Arrivals",
    title: "The Summer Lookbook.",
    description: "Lightweight fabrics and breathable silhouettes designed for the warmer months ahead.",
    desktopImage: "/desktop/image.PNG",
    mobileImage: "/mobile/mobile.PNG", // Fallback to the available mobile image for now
    bgColor: "#FDFBF7"
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);


  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentSlide = HERO_SLIDES[current] || HERO_SLIDES[0];

  return (
    <section className="relative aspect-[1.2/1] md:aspect-[3/1] w-full overflow-hidden bg-[#F7F7F7]">
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
            {/* Dark overlay removed */}
            
            {/* Desktop Image */}
            <div className="hidden md:block absolute inset-0">
              <Image
                src={currentSlide.desktopImage}
                alt={currentSlide.title}
                fill
                className="object-cover object-center"
                priority
                unoptimized={currentSlide.desktopImage.startsWith('/')}
              />
            </div>

            {/* Mobile Image */}
            <div className="md:hidden absolute inset-0">
              <Image
                src={currentSlide.mobileImage}
                alt={currentSlide.title}
                fill
                className="object-cover object-center"
                priority
                unoptimized={currentSlide.mobileImage.startsWith('/')}
              />
            </div>
          </motion.div>

          {/* Content Layer */}
          <div 
            className="relative z-20 h-full w-full flex items-center justify-center pt-8"
          >
            <div className="text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
              {/* Text overlays removed */}
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
