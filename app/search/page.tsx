import { shopifyFetch } from "@/lib/shopify";
import { searchProductsQuery } from "@/lib/queries";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";
import { SearchInput } from "@/app/components/SearchInput";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams?.q || "";
  let products = [];
  let error = null;

  if (query) {
    try {
      const data = await shopifyFetch(searchProductsQuery, { query });
      products = data?.products?.edges || [];
    } catch (err) {
      console.error("Search error:", err);
      error = "There was an error performing the search.";
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      <div className="text-center mb-8">
        <h1 className="font-serif text-3xl md:text-5xl text-[#2C352D] mb-3">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        <p className="text-[#5A665D] tracking-widest uppercase text-xs font-medium">
          {query ? `${products.length} ${products.length === 1 ? "Product" : "Products"} Found` : "Find your premium essentials"}
        </p>
      </div>

      {/* Premium Interactive Search Input Bar */}
      <SearchInput />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-8 text-sm text-center font-medium max-w-3xl mx-auto">
          {error}
        </div>
      )}

      {!query && (
        <div className="text-center py-24 px-6 border border-dashed border-[#C5BAA8]/40 bg-[#FDFBF7]/60 rounded-sm max-w-3xl mx-auto shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <p className="text-[#29402E] text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-3">Start Exploring</p>
          <p className="text-[#5A665D] font-light text-xs md:text-sm italic max-w-md mx-auto leading-relaxed">
            Type a keyword above to search across our premium apparel, new arrivals, and timeless essentials.
          </p>
        </div>
      )}

      {query && products.length === 0 && !error && (
        <div className="text-center py-24 px-6 border border-dashed border-[#C5BAA8]/40 bg-[#FDFBF7]/60 rounded-sm max-w-3xl mx-auto shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
          <p className="text-[#29402E] text-xs md:text-sm tracking-[0.2em] uppercase font-medium mb-3">No matching products</p>
          <p className="text-[#5A665D] font-light text-xs md:text-sm italic mb-8 max-w-md mx-auto leading-relaxed">
            We couldn&apos;t find anything matching &quot;{query}&quot;. Try checking your spelling or using more general terms.
          </p>
          <Link href="/collections" className="inline-block px-8 py-3.5 bg-[#29402E] text-white hover:bg-[#1f3022] transition-colors rounded-sm uppercase tracking-[0.2em] text-[11px] font-medium shadow-sm">
            Explore All Collections
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
        {products.map(({ node }: any) => (
          <ProductCard key={node.id} product={node} />
        ))}
      </div>
    </div>
  );
}
