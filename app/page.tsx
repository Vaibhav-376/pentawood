import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center bg-secondary overflow-hidden">
        {/* Abstract shapes / gradients for premium look without hardcoded images initially */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-primary/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute -bottom-1/4 right-0 w-3/4 h-3/4 bg-gradient-to-t from-accent/30 to-transparent blur-3xl rounded-full" />
        </div>

        <div className="z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
          <span className="text-primary tracking-[0.3em] uppercase text-xs font-semibold mb-6 block">
            The Essentials Collection
          </span>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-foreground font-light tracking-tight leading-[1.1] mb-8">
            Elevate your <br className="hidden md:block" /> everyday wear.
          </h1>
          <p className="text-foreground/70 text-lg md:text-xl font-light max-w-2xl mx-auto mb-12 tracking-wide">
            Premium clothing crafted with meticulous attention to detail. Designed in beige and subtle greens to reflect nature and sophistication.
          </p>
          <div className="flex flex-col sm:flex-row gap-6">
            <Link
              href="/collections"
              className="px-10 py-4 bg-primary text-white text-sm uppercase tracking-widest hover:bg-primary/90 transition-all font-medium"
            >
              Shop Collection
            </Link>
            <Link
              href="/about"
              className="px-10 py-4 bg-transparent border border-foreground/20 text-foreground text-sm uppercase tracking-widest hover:border-foreground/60 transition-all font-medium"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 md:py-36 bg-background px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light mb-8 text-foreground leading-tight">
              Redefining luxury <br /> through simplicity.
            </h2>
            <p className="text-foreground/80 font-light leading-relaxed mb-8 tracking-wide">
              At Pentawood, we believe true elegance lies in understatement. Our garments are constructed using ethically sourced materials that not only feel exceptional but age beautifully over time.
            </p>
            <Link
              href="/collections"
              className="inline-flex items-center text-sm uppercase tracking-widest text-primary font-medium hover:opacity-70 transition-opacity border-b border-primary pb-1"
            >
              Discover the fit
            </Link>
          </div>
          <div className="relative aspect-[4/5] bg-secondary rounded-sm overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/40 to-transparent" />
              <p className="z-10 text-primary/40 font-serif italic text-2xl px-12 text-center">Quality over quantity.</p>
          </div>
        </div>
      </section>

      {/* Featured Products Placeholders */}
      <section className="py-24 bg-secondary/30 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light">New Arrivals</h2>
            <Link href="/collections" className="hidden sm:block text-xs uppercase tracking-widest border-b border-foreground/30 pb-1 hover:border-foreground transition-all">
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <Link href={`/products/item-${item}`} key={item} className="group">
                <div className="aspect-[3/4] bg-secondary w-full relative overflow-hidden mb-6 flex items-center justify-center group-hover:bg-accent/30 transition-colors duration-500">
                  <div className="text-primary/30 uppercase tracking-widest text-xs font-medium">Coming Soon</div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-medium tracking-wide">Essential Piece {item}</h3>
                    <p className="text-sm text-foreground/60 mt-1 font-light">Premium Cotton</p>
                  </div>
                  <span className="text-sm font-medium">$120</span>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center sm:hidden">
            <Link href="/collections" className="text-xs uppercase tracking-widest border-b border-foreground/30 pb-1 hover:border-foreground transition-all">
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Branding / Marquee or impactful statement */}
      <section className="py-20 md:py-32 bg-primary text-[#f2ede4] overflow-hidden flex flex-col items-center text-center px-6">
        <span className="text-[#f2ede4] tracking-[0.3em] uppercase text-xs font-semibold mb-6 block">Our Commitment</span>
        <h2 className="font-serif text-3xl md:text-5xl lg:text-6xl font-light max-w-4xl leading-tight">
          Crafting pieces you&apos;ll reach for every single day.
        </h2>
      </section>
    </div>
  );
}
