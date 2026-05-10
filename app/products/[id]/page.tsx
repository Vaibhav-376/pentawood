import { shopifyFetch } from "@/lib/shopify";
import { getProductQuery } from "@/lib/queries";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ProductMainContent } from "./ProductMainContent";

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

  const options = productData.options || [];
  const variants = productData.variants?.edges?.map((edge: any) => edge.node) || [];

  const priceAmount = productData.priceRange?.minVariantPrice?.amount;
  const currency = productData.priceRange?.minVariantPrice?.currencyCode || 'USD';
  
  const firstVariant = productData.variants?.edges?.[0]?.node;
  const compareAtPriceAmount = firstVariant?.compareAtPrice?.amount;

  const formatPrice = (amount: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(parseFloat(amount));
  };

  const formattedPrice = priceAmount ? formatPrice(priceAmount) : '₹0';
  const formattedComparePrice = compareAtPriceAmount && parseFloat(compareAtPriceAmount) > parseFloat(priceAmount) 
    ? formatPrice(compareAtPriceAmount) 
    : null;

  const discount = formattedComparePrice 
    ? Math.round(((parseFloat(compareAtPriceAmount) - parseFloat(priceAmount)) / parseFloat(compareAtPriceAmount)) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-8 pb-24 text-[#2C352D]">
      <div className="px-6 md:px-12 py-2 border-b border-[#C5BAA8]/30 mb-4 flex items-center text-xs uppercase tracking-widest text-[#5A665D] max-w-[1400px] mx-auto">
        <Link href="/" className="hover:text-[#2C352D] transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
        <Link href="/collections" className="hover:text-[#2C352D] transition-colors">Collections</Link>
        <ChevronRight className="w-4 h-4 mx-2 opacity-50" />
        <span className="text-[#2C352D] font-medium">{title}</span>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <ProductMainContent 
          images={images}
          title={title}
          options={options}
          variants={variants}
          formattedPrice={formattedPrice}
          formattedComparePrice={formattedComparePrice}
          discount={discount}
          descriptionHtml={descriptionHtml}
        />
      </div>
    </div>
  );
}
