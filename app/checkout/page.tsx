"use client";

import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, isLoading } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  if (!cart || cart.totalQuantity === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-serif mb-4">Your cart is empty</h1>
        <button onClick={() => router.push("/")} className="underline">Go Shopping</button>
      </div>
    );
  }

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create order on server
      const response = await fetch("/api/razorpay/order", {
        method: "POST",
        body: JSON.stringify({
          amount: cart.cost.subtotalAmount.amount,
          receipt: `rcpt_${cart.id.split("/").pop()}`,
        }),
      });
      const order = await response.json();

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Pentawood",
        description: "Premium Essentials Purchase",
        order_id: order.id,
        handler: function (response: any) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          // In a real app, you would verify payment on server and create Shopify order
        },
        prefill: {
          name: "Guest User",
          email: "guest@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#2C352D",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment initialization failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 pt-32">
      <h1 className="font-serif text-3xl mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-sm uppercase tracking-widest font-medium mb-6">Order Summary</h2>
          <div className="space-y-6">
            {cart.lines.edges.map(({ node }: any) => (
              <div key={node.id} className="flex gap-4">
                <div className="w-16 h-20 bg-gray-100 rounded-sm overflow-hidden">
                   {node.merchandise.image && <img src={node.merchandise.image.url} className="w-full h-full object-cover" alt="" />}
                </div>
                <div>
                  <h3 className="text-sm font-medium">{node.merchandise.product.title}</h3>
                  <p className="text-xs text-gray-500">{node.merchandise.title}</p>
                  <p className="text-xs mt-1">Qty: {node.quantity}</p>
                </div>
                <div className="ml-auto text-sm font-medium">
                  ₹{node.cost.totalAmount.amount}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F2EFEA] p-8 rounded-sm h-fit">
          <div className="flex justify-between mb-4">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{cart.cost.subtotalAmount.amount}</span>
          </div>
          <div className="flex justify-between mb-8 text-lg font-bold border-t border-gray-300 pt-4">
            <span>Total</span>
            <span>₹{cart.cost.subtotalAmount.amount}</span>
          </div>
          
          <button 
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full bg-[#2C352D] text-white py-4 uppercase tracking-widest text-xs font-medium hover:bg-black transition-colors disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Pay with Razorpay"}
          </button>
        </div>
      </div>
    </div>
  );
}
