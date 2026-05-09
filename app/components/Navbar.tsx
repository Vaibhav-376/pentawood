"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Search, User, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/lib/cart-context";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";

import { useRouter } from "next/navigation";

export function Navbar({ collections = [], menu, customerName }: { collections: any[], menu?: any, customerName?: string | null }) {
  const router = useRouter();
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
    if (debouncedSearchQuery) {
      router.push(`/search?q=${encodeURIComponent(debouncedSearchQuery)}`);
    }
  }, [debouncedSearchQuery, router]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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

  const navItems = (menu?.items?.length > 0 ? menu.items : [
    { title: "Men", url: "/collections/men" },
    { title: "Women", url: "/collections/women" },
    { title: "Sale", url: "/collections/sale" },
    { title: "New Arrivals", url: "/collections/new-arrivals" },
    { title: "Collection", url: "/collections" }
  ]).map((item: any) => ({
    ...item,
    url: item.url?.replace(/^https?:\/\/[^\/]+/, '') || `/collections/${item.title.toLowerCase().replace(' ', '-')}`
  }));

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled || activeDropdown
            ? "bg-[#EAE8DF]/95 backdrop-blur-md py-2 shadow-sm border-b border-[#C5BAA8]/20"
            : "bg-[#EAE8DF]"
          }`}
        onMouseLeave={() => setActiveDropdown(null)}
      >
        <div className="w-full px-6 md:px-12 grid grid-cols-3 items-center">

          {/* Mobile Menu Toggle - Always on left in 3-col grid on mobile */}
          <div className="flex items-center">
            <button
              aria-label="Menu"
              className="text-[#5A665D] hover:text-[#29402E] transition-colors md:hidden"
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
                      href={item.url}
                      className={`hover:text-[#29402E] transition-colors cursor-pointer py-2 block ${activeDropdown === item.title ? "text-[#29402E]" : ""
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
                                className="text-[#5A665D] hover:text-[#29402E] text-[11px] uppercase tracking-widest font-light transition-colors"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                            <div className="pt-4 mt-2 border-t border-[#C5BAA8]/30">
                              <Link
                                href={item.url}
                                className="text-[#29402E] font-medium text-[11px] uppercase tracking-widest hover:text-[#5A665D] transition-colors"
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

          <div className="flex justify-center">
            <Link href="/" className="flex flex-col items-center group">
              <Image 
                src="/pwlogo.png" 
                alt="Logo" 
                width={120} 
                height={40} 
                className={`${isScrolled ? 'w-16' : 'w-20'} md:w-24 h-auto object-contain transition-all duration-500`} 
                priority
              />
            </Link>
          </div>

          {/* Right Actions - Text only without icon-hover animations */}
          <div className="flex items-center justify-end space-x-5 md:space-x-8 text-[#5A665D]">
            {/* Search - Icon on mobile, Bar on desktop */}
            <div className="flex items-center">
              <Link href="/search" className="md:hidden hover:text-[#29402E] transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center bg-[#F2EFEA]/30 border border-[#C5BAA8]/20 px-3 py-1 rounded-sm">
                <input
                  type="text"
                  placeholder="SEARCH..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-[10px] uppercase tracking-[0.15em] font-medium placeholder:text-[#5A665D]/50 outline-none w-[80px] focus:w-[120px] transition-all duration-300"
                />
              </form>
            </div>

            {/* Account - Icon on mobile, Text on desktop */}
            <Link href={customerName ? "/account" : "/login"} className="hover:text-[#29402E] transition-colors flex items-center">
              <User className="w-5 h-5 md:hidden" strokeWidth={1.5} />
              {customerName ? (
                <span className="hidden md:block text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">
                  {customerName}
                </span>
              ) : (
                <span className="hidden md:block text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium">
                  Sign In
                </span>
              )}
            </Link>

            {/* Cart - Icon with badge on mobile, Text on desktop */}
            <button 
              aria-label="Cart" 
              onClick={openCart} 
              className="hover:text-[#29402E] transition-colors text-[10px] md:text-xs uppercase tracking-[0.15em] font-medium cursor-pointer flex items-center gap-2"
            >
              <div className="relative md:hidden">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#29402E] text-white text-[7px] w-3 h-3 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:block">Cart ({cartCount})</span>
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
              className="absolute top-8 right-8 text-[#29402E] transition-transform duration-300"
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
                        href={item.url}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-lg font-serif text-[#29402E] uppercase tracking-wide"
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
                                className="text-[10px] uppercase tracking-[0.2em] font-light hover:text-[#29402E] transition-colors"
                              >
                                {subItem.title}
                              </Link>
                            ))}
                            <Link
                              href={item.url || "/collections"}
                              onClick={() => setMobileMenuOpen(false)}
                              className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#29402E]"
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

            <div className="mt-auto py-8 border-t border-[#C5BAA8]/20 flex flex-col gap-8">
              {/* Search Bar in Mobile Menu */}
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#F2EFEA] border border-[#C5BAA8]/20 px-4 py-3 rounded-sm">
                <input
                  type="text"
                  placeholder="SEARCH PRODUCTS..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-[11px] uppercase tracking-[0.2em] font-medium placeholder:text-[#5A665D]/50 outline-none w-full"
                />
                <button 
                  type="submit"
                  className="p-1 hover:text-[#29402E] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                </button>
              </form>

              <div className="grid grid-cols-2 gap-4">
                {customerName ? (
                  <Link 
                    href="/account" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 py-5 bg-[#F2EFEA]/50 border border-[#C5BAA8]/20 rounded-sm group active:bg-[#EAE8DF] transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#5A665D]">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#5A665D]">{customerName}</span>
                  </Link>
                ) : (
                  <Link 
                    href="/login" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex flex-col items-center justify-center gap-2 py-5 bg-[#F2EFEA]/50 border border-[#C5BAA8]/20 rounded-sm group active:bg-[#EAE8DF] transition-colors"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#5A665D]">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3" />
                    </svg>
                    <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#5A665D]">Sign In</span>
                  </Link>
                )}

                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCart();
                  }}
                  className="flex flex-col items-center justify-center gap-2 py-5 bg-[#F2EFEA]/50 border border-[#C5BAA8]/20 rounded-sm group active:bg-[#EAE8DF] transition-colors"
                >
                  <div className="relative">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[#5A665D]">
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-2 bg-[#29402E] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                        {cartCount}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] uppercase tracking-[0.15em] font-bold text-[#5A665D]">Cart</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
