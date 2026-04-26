import { getCollectionProductsQuery } from "@/lib/queries";
import { shopifyFetch } from "@/lib/shopify";
import Link from "next/link";
import ProductCard from "@/app/components/ProductCard";

export default async function CollectionPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  
  let collectionData;
  try {
    const data = await shopifyFetch(getCollectionProductsQuery, { handle });
    collectionData = data.collection;
  } catch (error) {
    console.error("Shopify fetch error:", error);
  }

  if (!collectionData) {
    return (
      <div className="min-h-screen bg-white pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-serif text-gray-900 mb-4">Collection Not Found</h1>
        <Link href="/products" className="text-gray-500 hover:text-gray-900 underline underline-offset-4 tracking-tight">
          Return to All Products
        </Link>
      </div>
    );
  }

  const products = collectionData.products?.edges || [];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 md:py-12 pt-16 md:pt-20">
        
        {/* Page Header */}
        <div className="mb-8 md:mb-12 flex flex-col items-center text-center max-w-2xl mx-auto">
          <span className="text-gray-500 text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 block">
            Collections / {collectionData.title}
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-gray-900 mb-3 capitalize tracking-tight">
            {collectionData.title}
          </h1>
          {collectionData.description ? (
            <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-lg">
              {collectionData.description}
            </p>
          ) : (
            <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed max-w-lg">
              Curated minimal essentials designed to form the foundation of your wardrobe.
            </p>
          )}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-32 text-gray-400 font-light tracking-tight">
            No products found in this collection.
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-12 md:gap-y-16">
            {products.map(({ node }: any) => (
              <ProductCard key={node.id} product={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
