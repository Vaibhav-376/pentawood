import type { Metadata } from "next";
export const dynamic = "force-dynamic";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { shopifyFetch } from "@/lib/shopify";
import { getCollectionsQuery, getCustomerQuery, getMenuQuery } from "@/lib/queries";
import { CartProvider } from "@/lib/cart-context";
import { CartDrawer } from "./components/CartDrawer";
import { cookies } from "next/headers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pentawood | Premium Essentials",
  description: "A new standard in premium clothing. Thoughtfully crafted essentials.",
};

import Script from 'next/script';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let collections = [];
  let menu = null;
  try {
    const collectionsData = await shopifyFetch(getCollectionsQuery, {}, "collections-cache", 3600);
    collections = collectionsData?.collections?.edges || [];
    
    const menuData = await shopifyFetch(getMenuQuery, { handle: "main-menu" }, "main-menu-cache", 3600);
    menu = menuData?.menu;
  } catch (error) {
    console.error("Layout Shopify error:", error);
  }

  // Intercept the Global Customer Authorization State Server-Side proactively!
  const cookieStore = await cookies();
  const token = cookieStore.get("customerAccessToken")?.value;
  let customerName = null;

  if (token) {
    try {
      const customerData = await shopifyFetch(getCustomerQuery, { customerAccessToken: token });
      customerName = customerData?.customer?.firstName || "Account";
    } catch (err) {
      console.error("Layout Shopify get customer error:", err);
    }
  }

  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <CartProvider>
          <Navbar collections={collections} menu={menu} customerName={customerName} />
          <CartDrawer isLoggedIn={!!token} />
          <main className="flex-grow pt-16 md:pt-20">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
