import Link from "next/link";
import { MoveRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-[#f2ede4] py-16 px-6 md:px-12 mt-24">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-[#f2ede4]/20 pb-16">
        
        {/* Brand */}
        <div className="md:col-span-2">
          <Link
            href="/"
            className="font-serif text-3xl font-medium tracking-[0.2em] uppercase text-[#f2ede4]"
          >
            Pentawood
          </Link>
          <p className="mt-6 text-sm font-light text-[#f2ede4]/70 max-w-sm leading-relaxed tracking-wide">
            A new standard in premium clothing. Thoughtfully crafted essentials using the finest materials. Join our community for exclusive access to new drops.
          </p>
          
          <div className="mt-8 flex items-center border-b border-[#f2ede4]/30 pb-2 max-w-sm">
            <input 
              type="email" 
              placeholder="Join our newsletter" 
              className="bg-transparent text-sm w-full outline-none placeholder:text-[#f2ede4]/50 focus:placeholder:opacity-0 transition-opacity"
            />
            <button className="text-[#f2ede4] hover:text-[#f2ede4]/70 transition-colors ml-4 focus:outline-none">
               <MoveRight strokeWidth={1.5} className="w-5 h-5"/>
            </button>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-serif text-lg text-[#f2ede4] mb-6">Explore</h4>
          <ul className="space-y-4 text-sm font-light text-[#f2ede4]/70">
            <li><Link href="/products" className="hover:text-[#f2ede4] transition-colors">Shop All</Link></li>
            <li><Link href="/collections/oversize-shirts" className="hover:text-[#f2ede4] transition-colors">Men</Link></li>
            <li><Link href="/collections/women-oversize" className="hover:text-[#f2ede4] transition-colors">Women</Link></li>
            <li><Link href="/about" className="hover:text-[#f2ede4] transition-colors">Our Story</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-serif text-lg text-[#f2ede4] mb-6">Support</h4>
          <ul className="space-y-4 text-sm font-light text-[#f2ede4]/70">
            <li><Link href="/faq" className="hover:text-[#f2ede4] transition-colors">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-[#f2ede4] transition-colors">Shipping & Returns</Link></li>
            <li><Link href="/contact" className="hover:text-[#f2ede4] transition-colors">Contact Us</Link></li>
            <li><Link href="/terms" className="hover:text-[#f2ede4] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="container mx-auto pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#f2ede4]/50 tracking-widest uppercase">
        <p>&copy; {new Date().getFullYear()} Pentawood.</p>
        <p className="mt-4 md:mt-0">Premium essentials.</p>
      </div>
    </footer>
  );
}
