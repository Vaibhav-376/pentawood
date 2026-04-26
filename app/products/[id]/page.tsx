import { shopifyFetch } from "@/lib/shopify";
import { getProductQuery } from "@/lib/queries";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { AddToCartButton } from "./AddToCartButton";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  let productData;
  try {
    const data = await shopifyFetch(getProductQuery, { handle: id });
    productData = data?.product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  if (!productData) {
    return notFound();
  }

  const title = productData.title;
  const descriptionHtml = productData.descriptionHtml || `<p>${productData.description}</p>`;
  
  const images = productData.images?.edges?.map((edge: any) => edge.node.url) || [];
  if (images.length === 0) {
    images.push("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800"); 
  }

  const sizeOption = productData.options?.find((o: any) => o.name.toLowerCase() === "size");
  const sizes = sizeOption?.values || [];

  // Build a mapped lookup table of specific size selections directly routing to specific Shopify variant GIDs
  const variantMap: Record<string, string> = {};
  productData.variants?.edges?.forEach(({ node }: any) => {
    const sizeVal = node.selectedOptions?.find((opt: any) => opt.name.toLowerCase() === "size")?.value;
    if (sizeVal) {
      variantMap[sizeVal] = node.id;
    } else {
      variantMap["Default Title"] = node.id; 
    }
  });

  const priceAmount = productData.priceRange?.minVariantPrice?.amount;
  const currency = productData.priceRange?.minVariantPrice?.currencyCode || 'USD';
  
  const formattedPrice = priceAmount 
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(parseFloat(priceAmount))
    : '$0.00';

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-28 pb-24 text-[#2C352D]">
      <div className="px-6 md:px-12 py-4 border-b border-[#C5BAA8]/30 mb-8 flex items-center text-xs uppercase tracking-widest text-[#5A665D] max-w-[1400px] mx-auto">
        <Link href="/" className="hover:text-[#2C352D] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
        <Link href="/collections" className="hover:text-[#2C352D] transition-colors">Collections</Link>
        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
        <span className="text-[#2C352D] font-medium">{title}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 relative mt-12">
          
          <div className="space-y-4 md:space-y-6">
            {images.map((img: string, idx: number) => (
              <div key={idx} className="bg-[#F2EFEA] relative aspect-[3/4] overflow-hidden rounded-sm">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={img} 
                  alt={`${title} image ${idx + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading={idx === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>

          <div className="md:sticky md:top-32 self-start h-fit mb-12">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light mb-4 text-[#2C352D] tracking-tight">
              {title}
            </h1>
            <p className="text-2xl font-light text-[#2C352D] mb-8">{formattedPrice}</p>
            
            <div 
              className="text-[#5A665D] font-light leading-relaxed mb-10 tracking-wide prose prose-p:mb-4 prose-a:text-[#2C352D] prose-a:underline prose-li:mb-2 max-w-none"
              dangerouslySetInnerHTML={{ __html: descriptionHtml }}
            />

            {/* Injected Client Side Component for Interaction & React State mapped to Cart Store */}
            <AddToCartButton variantMap={variantMap} sizes={sizes} />

            <p className="text-center text-xs text-[#5A665D] uppercase tracking-widest">
              Free shipping on orders over $150
            </p>
            
            <div className="mt-16 border-t border-[#C5BAA8]/50">
              <div className="py-6 border-b border-[#C5BAA8]/50 flex justify-between items-center cursor-pointer group">
                <span className="uppercase text-xs tracking-widest font-medium text-[#5A665D] group-hover:text-[#2C352D] transition-colors">Details & Care</span>
                <span className="text-xl font-light text-[#5A665D] group-hover:text-[#2C352D]">+</span>
              </div>
              <div className="py-6 border-b border-[#C5BAA8]/50 flex justify-between items-center cursor-pointer group">
                <span className="uppercase text-xs tracking-widest font-medium text-[#5A665D] group-hover:text-[#2C352D] transition-colors">Shipping & Returns</span>
                <span className="text-xl font-light text-[#5A665D] group-hover:text-[#2C352D]">+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
