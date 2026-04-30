import { getAllProductsQuery } from "@/lib/queries";
import { shopifyFetch } from "@/lib/shopify";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";

export default async function ProductsPage() {
  const data = await shopifyFetch(getAllProductsQuery);
  const products = data.products.edges;

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {/* Page Header */}
        <header className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#2C352D] mb-6 tracking-tight">
            Our Collection
          </h1>
          <p className="text-[#5A665D] text-lg font-light leading-relaxed">
            Discover our carefully curated pieces designed with intention.
            Crafted from high-quality materials for the modern, mindful wardrobe.
          </p>
        </header>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-16">
          {products.map(({ node }: any) => (
            <ProductCard key={node.id} product={node} />
          ))}
        </div>
      </div>
    </div>
  );
}