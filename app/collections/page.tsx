import Link from "next/link";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery } from "@/lib/queries";

export default async function CollectionsPage() {
  let collections = [];
  try {
    const data = await shopifyFetch(getCollectionsQuery);
    collections = data?.collections?.edges || [];
  } catch (error) {
    console.error("Shopify get collections error:", error);
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-24 px-6 md:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-20 mt-8">
          <span className="text-[#5A665D] text-xs uppercase tracking-[0.2em] font-medium mb-4 block">
            Discover
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#2C352D] mb-6 tracking-tight">
            Our Collections
          </h1>
          <p className="text-[#5A665D] text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Explore our curated ranges of premium everyday wear. Designed to be mixed, matched, and lived in.
          </p>
        </div>

        {collections.length === 0 ? (
          <div className="text-center py-20 text-[#5A665D] font-light">
            No collections found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
            {collections.map(({ node }: any) => {
              const image = node.image?.url || "https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&q=80&w=800";

              return (
                <Link 
                  key={node.id} 
                  href={`/collections/${node.handle}`}
                  className="group flex flex-col cursor-pointer transition-all duration-500 hover:shadow-sm"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-8 rounded-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={image}
                      alt={node.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                  </div>
                  
                  <div className="flex flex-col items-start">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-2 font-semibold">
                      Explore
                    </span>
                    <h2 className="font-serif text-3xl mb-4 text-gray-900 group-hover:text-gray-600 transition-colors tracking-tight">
                      {node.title}
                    </h2>
                    <div className="flex items-center text-xs uppercase font-medium tracking-widest text-gray-900 group-hover:text-gray-500 transition-colors">
                      <span className="border-b border-gray-900 group-hover:border-gray-400 pb-1.5 transition-all">
                        View Products
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
