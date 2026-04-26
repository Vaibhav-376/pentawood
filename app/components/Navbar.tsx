"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";

export function Navbar({ collections = [], menu, customerName }: { collections: any[], menu?: any, customerName?: string | null }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileAccordion, setMobileAccordion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Wire Shopify Cart bindings locally to the Client Header
  const { cart, openCart } = useCart();
  const cartCount = cart?.totalQuantity || 0;

  useEffect(() => {
    // When debounced search query changes, we could trigger a search or navigate
    if (debouncedSearchQuery) {
      console.log("Searching for:", debouncedSearchQuery);
      // Example: router.push(`/search?q=${debouncedSearchQuery}`);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getDropdownItems = (item: any) => {
    // 1. If the menu item has sub-items in Shopify, use them!
    if (item.items && item.items.length > 0) {
      return item.items.map((subItem: any) => ({
        title: subItem.title,
        href: subItem.url.replace(/^https?:\/\/[^\/]+/, '') // Make URL relative
      }));
    }

    // 2. Fallback: Filter collections based on the category name (original logic)
    const lowerTitle = item.title.toLowerCase();
    const filtered = collections.filter(({ node }) => {
      const colTitle = node.title.toLowerCase();
      if (lowerTitle === 'men') return colTitle.includes('men') && !colTitle.includes('women');
      if (lowerTitle === 'women') return colTitle.includes('women');
      return colTitle.includes(lowerTitle);
    });

    // 3. Last fallback: return empty if no matches found to avoid "all items" showing up
    return filtered.map(({ node }) => ({
      title: node.title,
      href: `/collections/${node.handle}`
    }));
  };

  const navItems = menu?.items?.length > 0 ? menu.items : [
    { title: "Men", url: "/collections/men" },
    { title: "Women", url: "/collections/women" },
    { title: "Sale", url: "/collections/sale" },
    { title: "New Arrivals", url: "/collections/new-arrivals" },
    { title: "Collection", url: "/collections" }
  ];

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || activeDropdown
            ? "bg-[#FDFBF7]/95 backdrop-blur-md py-4 shadow-sm border-b border-[#C5BAA8]/20"
            : "bg-[#FDFBF7] py-6"
        }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="w-full px-6 md:px-12 grid grid-cols-3 items-center">
          
          {/* Mobile Menu Toggle - Always on left in 3-col grid on mobile */}
          <div className="flex items-center">
            <button
              aria-label="Menu"
              className="text-[#5A665D] hover:text-[#2C352D] transition-colors md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" strokeWidth={1.5} />
            </button>
            <nav className="hidden md:flex items-center space-x-8 text-[11px] font-medium tracking-[0.14em] uppercase text-[#5A665D] relative">
              {navItems.map((item: any) => {
                const dropdownItems = getDropdownItems(item);
                const hasDropdown = dropdownItems.length > 0;

                return (
                  <div 
                    key={item.id || item.title} 
                    className="group relative"
                    onMouseEnter={() => hasDropdown && setActiveDropdown(item.title)}
                  >
                    <Link 
                      href={item.url || `/collections/${item.title.toLowerCase().replace(' ', '-')}`} 
                      className={`hover:text-[#2C352D] transition-colors cursor-pointer py-4 block ${
                        activeDropdown === item.title ? "text-[#2C352D]" : ""
                      }`}
                    >
                      {item.title}
                    </Link>
                    
                    <AnimatePresence>
                      {activeDropdown === item.title && hasDropdown && (
                        <motion.div 
                          key={`dropdown-${item.title}`}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 2, transition: { duration: 0.1 } }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-[100%] left-0 w-[240px] pt-4"
                        >
                          <div className="bg-[#FDFBF7] border border-[#C5BAA8]/30 shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-w-[240px] p-6 flex flex-col gap-4 rounded-sm">
                            {dropdownItems.slice(0, 8).map((subItem: any) => (
                              <Link 
                                key={subItem.href}
                                href={subItem.href}
                                className="text-[#5A665D] hover:text-[#2C352D] text-[11px] uppercase tracking-widest font-light transition-colors"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-[#C5BAA8]/30">
                              <Link 
                                href={item.url || "/collections"}
                                className="text-[#2C352D] font-medium text-[11px] uppercase tracking-widest hover:text-[#5A665D] transition-colors"
                              >
                                Explore All {item.title}
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
          </div>

          {/* Logo - Centered in 3-col grid */}
          <div className="flex justify-center">
            <Link href="/" className="flex flex-col items-center group">
             <Image src="/pentawood-logo.png" alt="Logo" width={100} height={100} />
            </Link>
          </div>

          {/* Right Actions - Text only without icon-hover animations */}
          <div className="flex items-center justify-end space-x-6 md:space-x-8 text-[#5A665D]">
            <div className="hidden md:flex items-center bg-[#F2EFEA]/30 border border-[#C5BAA8]/20 px-3 py-1 rounded-sm">
              <input 
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-[10px] uppercase tracking-[0.15em] font-medium placeholder:text-[#5A665D]/50 outline-none w-[80px] focus:w-[120px] transition-all duration-300"
              />
            </div>
            {customerName ? (
              <Link href="/account" className="hidden sm:block hover:text-[#2C352D] transition-colors text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">
                {customerName}
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:block hover:text-[#2C352D] transition-colors text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">
                Sign In
              </Link>
            )}
            <button aria-label="Cart" onClick={openCart} className="hover:text-[#2C352D] transition-colors text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium cursor-pointer">
              Cart ({cartCount})
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            className="fixed inset-0 z-[60] bg-[#FDFBF7] flex flex-col pt-24 px-8 overflow-y-auto"
          >
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-8 right-8 text-[#2C352D] transition-transform duration-300"
            >
              <X className="w-6 h-6" strokeWidth={1.5} />
            </button>
            
            <nav className="flex flex-col space-y-2 mt-8">
              {navItems.map((item: any) => {
                const subItems = getDropdownItems(item);
                const isOpen = mobileAccordion === item.title;

                return (
                  <div key={item.id || item.title} className="flex flex-col border-b border-[#C5BAA8]/20 overflow-hidden">
                    <div className="flex items-center justify-between py-5">
                      <Link 
                        href={item.url || `/collections/${item.title.toLowerCase()}`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-serif text-[#2C352D] uppercase tracking-wide"
                      >
                        {item.title}
                      </Link>
                      {subItems.length > 0 && (
                        <button 
                          onClick={() => setMobileAccordion(isOpen ? null : item.title)}
                          className={`p-2 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                        >
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#5A665D]">
                            <path d="M6 0V12M0 6H12" stroke="currentColor" strokeWidth="1.2" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                          <div className="flex flex-col space-y-4 pb-6 pl-2 text-[#5A665D]">
                            {subItems.slice(0, 10).map((subItem: any) => (
                              <Link 
                                key={subItem.href} 
                                href={subItem.href} 
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-[10px] uppercase tracking-[0.2em] font-light hover:text-[#2C352D] transition-colors"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                            <Link 
                              href={item.url || "/collections"} 
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#2C352D]"
                            >
                              Explore all {item.title}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </nav>
            
            <div className="mt-auto py-12 flex flex-col space-y-6 border-t border-[#C5BAA8]/20">
              <Link href="/search" onClick={() => setMobileMenuOpen(false)} className="text-[#5A665D] uppercase text-[10px] tracking-[0.2em] font-medium flex items-center justify-between">
                Search
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </Link>
              {customerName ? (
                <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-[#5A665D] uppercase text-[10px] tracking-[0.2em] font-medium flex items-center justify-between">
                  {customerName}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </Link>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="text-[#5A665D] uppercase text-[10px] tracking-[0.2em] font-medium flex items-center justify-between">
                  Sign In / Register
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/>
                  </svg>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
