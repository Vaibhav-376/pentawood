import { shopifyFetch } from "@/lib/shopify";
import { searchProductsQuery } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "@/app/components/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q: query } = await searchParams;
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
      <div className="mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-[#2C352D] mb-4">
          {query ? `Search results for "${query}"` : "Search"}
        </h1>
        <p className="text-[#5A665D] tracking-wide uppercase text-xs">
          {products.length} {products.length === 1 ? "Product" : "Products"} Found
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-sm mb-8 text-sm">
          {error}
        </div>
      )}

      {!query && (
        <div className="text-center py-24 border border-dashed border-[#C5BAA8]/30 rounded-sm">
          <p className="text-[#5A665D] font-light italic">Enter a keyword to start searching...</p>
        </div>
      )}

      {query && products.length === 0 && !error && (
        <div className="text-center py-24 border border-dashed border-[#C5BAA8]/30 rounded-sm">
          <p className="text-[#5A665D] font-light italic">No products found matching your search.</p>
          <Link href="/" className="inline-block mt-6 text-[#2C352D] underline underline-offset-4 text-sm">
            Continue Shopping
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
