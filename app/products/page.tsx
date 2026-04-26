import { getAllProductsQuery } from "@/lib/queries";
import { shopifyFetch } from "@/lib/shopify";
import Link from "next/link";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
          {products.map(({ node }: any) => {
            const firstVariant = node.variants?.edges[0]?.node;
            const price = firstVariant?.price?.amount;
            const currency = firstVariant?.price?.currencyCode || 'USD';

            const firstImage = node.images?.edges?.[0]?.node?.url || node.featuredImage?.url;
            const secondImage = node.images?.edges?.[1]?.node?.url;
            const hasMultipleImages = Boolean(secondImage && secondImage !== firstImage);

            const colorOption = node.options?.find((o: any) => o.name.toLowerCase() === "color");
            const colorCount = colorOption?.values?.length || 0;

            // Simple elegant price formatting
            const formattedPrice = price
              ? new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency,
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(parseFloat(price))
              : null;

            return (
              <Link
                href={`/products/${node.handle || node.id.split('/').pop()}`}
                key={node.id}
                className="group flex flex-col cursor-pointer transition-all duration-300"
              >
                {/* Image Container with Hover Effects */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F2EFEA] rounded-sm mb-5">
                  {firstImage ? (
                    <>
                      <img
                        src={firstImage}
                        alt={node.title}
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${hasMultipleImages ? 'group-hover:opacity-0' : ''}`}
                        loading="lazy"
                      />
                      {hasMultipleImages && (
                        <img
                          src={secondImage}
                          alt={`${node.title} alternate view`}
                          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover:opacity-100 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[#8A958D] font-light">
                      No Image Available
                    </div>
                  )}

                  {/* Subtle Dark Overlay */}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Product Metadata */}
                <div className="flex flex-col flex-grow">
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <h2 className="text-[#2C352D] font-medium text-base tracking-wide flex-1">
                      {node.title}
                    </h2>
                    {formattedPrice && (
                      <span className="text-[#2C352D] font-medium whitespace-nowrap">
                        {formattedPrice}
                      </span>
                    )}
                  </div>

                  {/* Colors Context */}
                  {colorCount > 0 ? (
                    <div className="mt-auto pt-2 flex items-center text-xs text-[#5A665D] tracking-wide uppercase">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#E5E0D8] border border-[#C5BAA8] mr-2"></span>
                      {colorCount} {colorCount === 1 ? 'Colour' : 'Colours'}
                    </div>
                  ) : (
                    <div className="mt-auto pt-2 h-[22px]" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}