import { shopifyFetch } from "@/lib/shopify";
import { getPageQuery } from "@/lib/queries";
import Link from "next/link";
import { Mail, Phone, MapPin, Send } from "lucide-react";

const FALLBACK_PAGES: Record<string, { title: string; subtitle: string; content: React.ReactNode }> = {
  contact: {
    title: "Contact Us",
    subtitle: "We are here to assist you with any inquiries about our premium clothing and your orders.",
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start my-12">
        <div className="space-y-8">
          <h3 className="text-2xl font-serif text-[#29402E]">Get in touch</h3>
          <p className="text-[#5A665D] font-light leading-relaxed text-sm md:text-base max-w-md">
            Whether you have a question about sizing, fabric details, or shipping timelines, our dedicated concierge team is available to ensure your experience is flawless.
          </p>
          <div className="space-y-6 pt-4 border-t border-[#C5BAA8]/30">
            <div className="flex items-center gap-4 text-[#29402E]">
              <div className="w-10 h-10 rounded-full bg-[#F2EFEA] flex items-center justify-center text-[#29402E]">
                <Mail className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5A665D]">Email</p>
                <a href="mailto:support@pentawood.in" className="text-sm font-medium hover:underline">support@pentawood.in</a>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#29402E]">
              <div className="w-10 h-10 rounded-full bg-[#F2EFEA] flex items-center justify-center text-[#29402E]">
                <Phone className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5A665D]">Phone</p>
                <a href="tel:+919876543210" className="text-sm font-medium hover:underline">+91 98765 43210</a>
              </div>
            </div>
            <div className="flex items-center gap-4 text-[#29402E]">
              <div className="w-10 h-10 rounded-full bg-[#F2EFEA] flex items-center justify-center text-[#29402E]">
                <MapPin className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#5A665D]">Studio</p>
                <p className="text-sm font-medium">New Delhi, India</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#FDFBF7] border border-[#C5BAA8]/40 p-8 md:p-12 rounded-sm shadow-sm">
          <h4 className="font-serif text-xl text-[#29402E] mb-6">Send a Message</h4>
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-[#5A665D] block">Your Name</label>
              <input type="text" placeholder="John Doe" className="w-full bg-transparent border-b border-[#C5BAA8]/50 pb-2 text-sm focus:border-[#29402E] outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-[#5A665D] block">Your Email</label>
              <input type="email" placeholder="john@example.com" className="w-full bg-transparent border-b border-[#C5BAA8]/50 pb-2 text-sm focus:border-[#29402E] outline-none transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-[11px] uppercase tracking-widest text-[#5A665D] block">Message</label>
              <textarea rows={4} placeholder="How can we help you?" className="w-full bg-transparent border-b border-[#C5BAA8]/50 pb-2 text-sm focus:border-[#29402E] outline-none transition-colors resize-none" />
            </div>
            <button type="button" className="w-full py-4 bg-[#29402E] text-white hover:bg-[#1f3022] transition-colors uppercase tracking-[0.2em] text-xs font-medium rounded-sm flex items-center justify-center gap-2">
              <span>Submit Inquiry</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    ),
  },
  about: {
    title: "Our Story",
    subtitle: "Crafting timeless essentials without compromise.",
    content: (
      <div className="max-w-3xl mx-auto space-y-8 my-12 text-[#5A665D] font-light leading-relaxed md:text-lg">
        <p>
          Pentawood was founded on a singular philosophy: creating apparel that serves as the enduring foundation of a modern wardrobe. We believe true luxury lies in exceptional materials, uncompromising craftsmanship, and timeless silhouettes.
        </p>
        <p>
          Every piece in our collection is thoughtfully engineered in our design studios, utilizing the highest caliber organic cottons, premium linens, and sustainable blends sourced from world-renowned mills.
        </p>
        <div className="border-l-2 border-[#29402E] pl-6 my-12 italic text-xl text-[#29402E]">
          &quot;We don&apos;t follow fleeting trends. We create garments designed to be worn, loved, and passed down.&quot;
        </div>
        <p>
          By maintaining direct relationships with our artisan workshops and bypassing traditional markups, we deliver uncompromising luxury directly to our discerning community. Welcome to Pentawood.
        </p>
      </div>
    ),
  },
  faq: {
    title: "Frequently Asked Questions",
    subtitle: "Everything you need to know about our products and services.",
    content: (
      <div className="max-w-3xl mx-auto space-y-10 my-12">
        <div className="border-b border-[#C5BAA8]/30 pb-6">
          <h4 className="font-serif text-xl text-[#29402E] mb-2">What is your shipping policy?</h4>
          <p className="text-[#5A665D] font-light text-sm md:text-base leading-relaxed">
            We offer complimentary standard shipping on all qualifying orders. Most orders are processed within 24-48 hours and arrive within 3-5 business days depending on your location.
          </p>
        </div>
        <div className="border-b border-[#C5BAA8]/30 pb-6">
          <h4 className="font-serif text-xl text-[#29402E] mb-2">How do returns and exchanges work?</h4>
          <p className="text-[#5A665D] font-light text-sm md:text-base leading-relaxed">
            We gladly accept returns or exchanges of unworn, unwashed items in their original packaging within 14 days of delivery. Please visit our returns portal or reach out to our support team to initiate a return.
          </p>
        </div>
        <div className="border-b border-[#C5BAA8]/30 pb-6">
          <h4 className="font-serif text-xl text-[#29402E] mb-2">How should I care for my Pentawood garments?</h4>
          <p className="text-[#5A665D] font-light text-sm md:text-base leading-relaxed">
            To ensure the longevity of premium fabrics, we recommend gentle cold washing with like colors and laying flat or hanging to dry. Detailed care instructions are included on every garment care tag.
          </p>
        </div>
      </div>
    ),
  },
  shipping: {
    title: "Shipping & Returns",
    subtitle: "Delivering uncompromising quality directly to your doorstep.",
    content: (
      <div className="max-w-3xl mx-auto space-y-8 my-12 text-[#5A665D] font-light leading-relaxed">
        <h3 className="font-serif text-2xl text-[#29402E]">Processing & Dispatch</h3>
        <p>All orders placed before 2 PM IST on business days are processed on the same day. Orders placed on weekends or holidays will be dispatched on the following business day.</p>
        
        <h3 className="font-serif text-2xl text-[#29402E] pt-6">Express & Standard Delivery</h3>
        <p>We partner with premier courier networks to ensure secure and timely delivery. Standard shipping takes 3-5 business days across major cities, while expedited delivery options are available at checkout.</p>
        
        <h3 className="font-serif text-2xl text-[#29402E] pt-6">Seamless Returns</h3>
        <p>If your purchase is anything less than perfect, our 14-day return window ensures peace of mind. Refunds are processed to the original payment method within 5-7 business days upon inspection at our studio.</p>
      </div>
    ),
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Legal agreements and policies.",
    content: (
      <div className="max-w-3xl mx-auto space-y-8 my-12 text-[#5A665D] font-light leading-relaxed text-sm">
        <p>Welcome to Pentawood. By accessing or using our website and services, you agree to be bound by these terms and conditions.</p>
        <h4 className="font-serif text-lg text-[#29402E]">Intellectual Property</h4>
        <p>All content, imagery, logos, and design elements presented on this platform are the exclusive property of Pentawood and protected by applicable copyright laws.</p>
        <h4 className="font-serif text-lg text-[#29402E]">Product Accuracy</h4>
        <p>We strive to display garment colors and textures as accurately as possible. However, subtle variations may occur depending on individual monitor calibrations.</p>
      </div>
    ),
  },
};

export default async function ShopifyPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  let pageData = null;

  try {
    const data = await shopifyFetch(getPageQuery, { handle });
    pageData = data?.page;
  } catch (err) {
    console.error("Shopify page fetch error:", err);
  }

  const fallback = FALLBACK_PAGES[handle.toLowerCase()];

  if (!pageData && !fallback) {
    return (
      <div className="min-h-[70vh] bg-[#FDFBF7] pt-32 pb-24 px-6 flex flex-col items-center justify-center text-center">
        <span className="text-[#5A665D] text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 block">Error 404</span>
        <h1 className="text-4xl md:text-5xl font-serif text-[#29402E] mb-4">Page Not Found</h1>
        <p className="text-[#5A665D] font-light max-w-md mx-auto mb-8 text-sm md:text-base">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/collections" className="inline-block px-8 py-3.5 bg-[#29402E] text-white hover:bg-[#1f3022] transition-colors rounded-sm uppercase tracking-[0.2em] text-[11px] font-medium shadow-sm">
          Return to Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 pt-20 md:pt-28">
        <div className="max-w-3xl mx-auto text-center border-b border-[#C5BAA8]/30 pb-8 mb-12">
          <span className="text-[#5A665D] text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 block">
            Pentawood Essentials
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#29402E] mb-4 tracking-tight capitalize">
            {pageData ? pageData.title : fallback?.title}
          </h1>
          {fallback?.subtitle && (
            <p className="text-[#5A665D] font-light text-sm md:text-base max-w-xl mx-auto">
              {fallback.subtitle}
            </p>
          )}
        </div>

        {pageData ? (
          <div 
            className="max-w-4xl mx-auto prose prose-stone lg:prose-lg text-[#5A665D] font-light leading-relaxed my-12"
            dangerouslySetInnerHTML={{ __html: pageData.body }} 
          />
        ) : (
          fallback?.content
        )}
      </div>
    </div>
  );
}
