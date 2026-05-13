import { shopifyFetch } from "@/lib/shopify";
import { getAllProductsQuery, getCollectionsQuery } from "@/lib/queries";
import Link from "next/link";
import ProductCard from "./components/ProductCard";
import Image from "next/image";

import { HeroCarousel } from "./components/HeroCarousel";

export default async function Home() {
  let products = [];
  let collections = [];

  try {
    const productsData = await shopifyFetch(getAllProductsQuery);
    products = productsData?.products?.edges || [];

    const collectionsData = await shopifyFetch(getCollectionsQuery);
    collections = collectionsData?.collections?.edges?.filter(({ node }: any) => 
      !node.handle.includes('frontpage')
    ).slice(0, 3) || [];
  } catch (error) {
    console.error("Home page data fetch error:", error);
  }

  return (
    <div className="flex flex-col w-full overflow-hidden bg-[#FDFBF7]">
      <HeroCarousel />

      {/* Philosophy Section - Minimal & Airy */}
      {/* <section className="py-32 md:py-48 bg-[#FDFBF7] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-[#C5BAA8] uppercase tracking-[0.3em] text-[10px] font-bold mb-6 block">Our Philosophy</span>
              <h2 className="font-serif text-4xl md:text-6xl font-light mb-10 text-[#29402E] leading-tight tracking-tight">
                Crafting pieces you&apos;ll <br /> reach for every day.
              </h2>
              <p className="text-[#5A665D] font-light leading-relaxed mb-12 tracking-wide text-lg max-w-lg">
                We believe in the beauty of simplicity. Our garments are constructed using ethically sourced materials that not only feel exceptional but age beautifully over time.
              </p>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <h4 className="text-[#29402E] font-bold text-xs uppercase tracking-widest mb-3">Material</h4>
                  <p className="text-[#5A665D] text-sm font-light">100% Organic Cotton & Linen</p>
                </div>
                <div>
                  <h4 className="text-[#29402E] font-bold text-xs uppercase tracking-widest mb-3">Origin</h4>
                  <p className="text-[#5A665D] text-sm font-light">Small-batch Production</p>
                </div>
              </div>
              <Link
                href="/about"
                className="inline-flex items-center text-[10px] uppercase tracking-[0.3em] text-[#29402E] font-bold hover:opacity-70 transition-opacity border-b-2 border-[#29402E] pb-1"
              >
                Learn More
              </Link>
            </div>
            <div className="order-1 lg:order-2 relative aspect-square bg-[#F2EFEA] rounded-sm overflow-hidden group">
                <Image 
                  src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1200&auto=format&fit=crop"
                  alt="Craftsmanship"
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                />
            </div>
          </div>
        </div>
      </section> */}

      {/* Featured Collections - Visual Categories */}
      {/* <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-20">
            <span className="text-[#C5BAA8] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Categories</span>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-[#29402E] tracking-tight">Curated Collections</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collections.length > 0 ? (
              collections.map(({ node }: any) => (
                <Link 
                  href={`/collections/${node.handle}`} 
                  key={node.id} 
                  className="group relative aspect-[4/5] overflow-hidden bg-[#F2EFEA]"
                >
                  <Image 
                    src={node.image?.url || "https://images.unsplash.com/photo-1540221652346-e5dd6b50f3e7?q=80&w=800&auto=format&fit=crop"}
                    alt={node.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                  <div className="absolute bottom-8 left-8 text-white z-10">
                    <h3 className="text-xl font-serif mb-2">{node.title}</h3>
                    <span className="text-[10px] uppercase tracking-[0.2em] border-b border-white pb-1">Shop Now</span>
                  </div>
                </Link>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <div key={i} className="aspect-[4/5] bg-[#F2EFEA] animate-pulse" />
              ))
            )}
          </div>
        </div>
      </section> */}

      {/* New Arrivals - Product Grid */}
      <section className="py-16 bg-[#FDFBF7] px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-7">
            <div>
              <span className="text-[#C5BAA8] uppercase tracking-[0.3em] text-[10px] font-bold mb-1 block">Store</span>
              <h2 className="font-serif text-4xl md:text-5xl font-light text-[#29402E] tracking-tight">New Arrivals</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-16">
            {products.length > 0 ? (
              products.map(({ node }: any) => (
                <ProductCard key={node.id} product={node} />
              ))
            ) : (
              <div className="col-span-full  text-center text-[#5A665D] font-light">
                Our latest collection is arriving soon.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Lifestyle Lookbook - Visual Collage */}
      <section className="py-24 bg-white px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 grid-rows-2 gap-4 h-[600px] md:h-[800px]">
            <div className="col-span-8 row-span-2 relative bg-[#F2EFEA] overflow-hidden group">
              <Image 
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
                alt="Lifestyle 1"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
            <div className="col-span-4 row-span-1 relative bg-[#F2EFEA] overflow-hidden group">
              <Image 
                src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop"
                alt="Lifestyle 2"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
            <div className="col-span-4 row-span-1 relative bg-[#F2EFEA] overflow-hidden group">
              <Image 
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop"
                alt="Lifestyle 3"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section - Full Width Impact */}
      <section className="relative py-48 md:py-64 bg-[#29402E] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=2000&auto=format&fit=crop"
            alt="Sustainability Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <span className="text-[#FDFBF7] tracking-[0.4em] uppercase text-[10px] font-bold mb-8 block opacity-60">Earth First</span>
          <h2 className="font-serif text-4xl md:text-7xl text-[#FDFBF7] font-light leading-[1.1] mb-10 tracking-tight">
            Rooted in nature, <br /> crafted for longevity.
          </h2>
          <p className="text-[#FDFBF7]/80 text-sm md:text-lg font-light max-w-2xl mx-auto mb-12 leading-relaxed">
            Every Pentawood piece is born from a commitment to the planet. We use zero-waste manufacturing processes and plastic-free packaging, ensuring your style never comes at the cost of the environment.
          </p>
          <Link
            href="/sustainability"
            className="inline-flex items-center text-[10px] uppercase tracking-[0.3em] text-[#FDFBF7] font-bold hover:opacity-70 transition-opacity border-b-2 border-[#FDFBF7] pb-1"
          >
            Our Sustainability Promise
          </Link>
        </div>
      </section>

      {/* Testimonials - Social Proof */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-10 text-[#C5BAA8]">
            {[1, 2, 3, 4, 5].map((i) => (
              <svg key={i} width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <h3 className="font-serif text-2xl md:text-4xl font-light italic text-[#29402E] leading-relaxed mb-10">
            &quot;The quality of the organic cotton is unlike anything I&apos;ve owned. It feels weighted yet breathable, and the fit is perfect for every occasion.&quot;
          </h3>
          <div className="flex flex-col items-center">
            <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#29402E]">Sarah Jenkins</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5BAA8] mt-1">Verified Customer</span>
          </div>
        </div>
      </section>

      {/* FAQ Section - Trust & Utility */}
      <section className="py-32 bg-[#FDFBF7] px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#C5BAA8] uppercase tracking-[0.3em] text-[10px] font-bold mb-4 block">Help Center</span>
            <h2 className="font-serif text-3xl md:text-5xl font-light text-[#29402E]">Frequently Asked</h2>
          </div>
          <div className="space-y-6">
            {[
              { q: "How do your sizes run?", a: "Our pieces are designed for a relaxed, contemporary fit. We recommend ordering your usual size for the intended look, or sizing down for a more tailored silhouette." },
              { q: "What is your return policy?", a: "We offer a 30-day window for all returns and exchanges. Items must be in their original, unworn condition with tags attached." },
              { q: "Where are your materials sourced?", a: "Sustainability is at our core. We source 100% GOTS certified organic cotton from sustainable farms in Portugal and Turkey." }
            ].map((faq, i) => (
              <div key={i} className="border-b border-[#C5BAA8]/20 pb-6">
                <h4 className="text-sm font-bold text-[#29402E] uppercase tracking-widest mb-3 flex justify-between items-center cursor-pointer group">
                  {faq.q}
                  <span className="text-lg font-light text-[#C5BAA8] group-hover:text-[#29402E]">+</span>
                </h4>
                <p className="text-[#5A665D] text-sm font-light leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter - Minimal Impact */}
      <section className="py-40 bg-[#29402E] text-[#FDFBF7] px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="tracking-[0.4em] uppercase text-[10px] font-bold mb-8 block opacity-60">Stay Connected</span>
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-12 leading-tight">
            Join the inner circle for exclusive early access.
          </h2>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="YOUR@EMAIL.COM" 
              className="bg-transparent border-b border-[#FDFBF7]/30 py-4 focus:outline-none focus:border-[#FDFBF7] transition-all text-sm uppercase tracking-widest flex-grow"
            />
            <button className="bg-[#FDFBF7] text-[#29402E] px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white transition-all shadow-xl">
              Subscribe
            </button>
          </form>
          <p className="mt-8 text-[9px] uppercase tracking-widest opacity-40">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </div>
      </section>

      {/* Values Section - Premium Icons/Text */}
      <section className="py-24 bg-white border-t border-[#C5BAA8]/10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-6 flex items-center justify-center border border-[#C5BAA8]/30 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#29402E" strokeWidth="1">
                <path d="M20 7h-9m3 3h-3m-9-3h3m0 0l1 10a2 2 0 002 2h10a2 2 0 002-2l1-10M5 7L3 3h18l-2 4" />
              </svg>
            </div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#29402E]">Global Shipping</h3>
            <p className="text-[#5A665D] text-sm font-light max-w-xs">Direct to your doorstep, anywhere in the world.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-6 flex items-center justify-center border border-[#C5BAA8]/30 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#29402E" strokeWidth="1">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#29402E]">Secure Checkout</h3>
            <p className="text-[#5A665D] text-sm font-light max-w-xs">Encrypted payments and data protection.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-6 flex items-center justify-center border border-[#C5BAA8]/30 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#29402E" strokeWidth="1">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M22 6l-10 7L2 6" />
              </svg>
            </div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-bold mb-4 text-[#29402E]">Personal Service</h3>
            <p className="text-[#5A665D] text-sm font-light max-w-xs">Our dedicated team is here to assist you.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
