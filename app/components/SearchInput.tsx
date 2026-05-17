"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

function SearchInputComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams?.get("q") || "";
  
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const inputRef = useRef<HTMLInputElement>(null);

  // When URL query changes from outside (e.g. mobile menu or desktop header), update local query
  useEffect(() => {
    const currentQ = searchParams?.get("q") || "";
    setQuery(currentQ);
    setIsSearching(false);
  }, [searchParams]);

  useEffect(() => {
    const currentQ = searchParams?.get("q") || "";
    if (debouncedQuery !== currentQ) {
      setIsSearching(true);
      if (debouncedQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
      } else {
        router.push(`/search`);
      }
    }
  }, [debouncedQuery, router, searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push(`/search`);
    }
  };

  const clearSearch = () => {
    setQuery("");
    setIsSearching(true);
    router.push(`/search`);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center bg-[#FDFBF7] border border-[#C5BAA8]/50 rounded-sm shadow-[0_2px_15px_rgb(0,0,0,0.03)] focus-within:border-[#29402E] focus-within:shadow-[0_4px_20px_rgb(0,0,0,0.06)] transition-all duration-300 py-3 px-4 md:py-4 md:px-6"
      >
        <Search className="w-5 h-5 text-[#5A665D] shrink-0 mr-3 md:mr-4" strokeWidth={1.5} />
        <input
          ref={inputRef}
          type="text"
          placeholder="SEARCH COLLECTIONS, PRODUCTS, OR KEYWORDS..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsSearching(true);
          }}
          className="bg-transparent text-base md:text-sm uppercase tracking-[0.18em] font-medium text-[#29402E] placeholder:text-[#5A665D]/40 outline-none w-full pr-12"
          autoFocus
        />
        <div className="absolute right-4 md:right-6 flex items-center gap-3">
          {isSearching && (
            <Loader2 className="w-4 h-4 text-[#5A665D] animate-spin shrink-0" strokeWidth={1.5} />
          )}
          {query && !isSearching && (
            <button
              type="button"
              onClick={clearSearch}
              className="p-1 text-[#5A665D] hover:text-[#29402E] transition-colors cursor-pointer shrink-0"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export function SearchInput() {
  return (
    <Suspense fallback={
      <div className="w-full max-w-3xl mx-auto mb-12 h-14 bg-[#FDFBF7] border border-[#C5BAA8]/30 rounded-sm animate-pulse" />
    }>
      <SearchInputComponent />
    </Suspense>
  );
}
