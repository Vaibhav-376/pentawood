import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { shopifyFetch } from "@/lib/shopify";
import { getCustomerQuery } from "@/lib/queries";
import { logoutCustomer } from "@/app/actions/auth";
import Link from "next/link";

export default async function AccountPage() {
  // Await cookies() for strict Next.js 15 compatibility
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("customerAccessToken");
  const token = tokenCookie?.value;

  if (!token) {
    redirect("/login");
  }

  let customer = null;
  try {
    const data = await shopifyFetch(getCustomerQuery, { customerAccessToken: token });
    customer = data?.customer;
  } catch (err) {
    console.error("Failed to fetch customer", err);
  }

  if (!customer) {
    // If the Shopify API rejects the token mapping, kick them reliably out
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-40 pb-24 px-6 md:px-12">
      <div className="max-w-[1000px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-[#C5BAA8]/30 pb-8">
          <div>
            <h1 className="font-serif text-4xl text-[#2C352D] mb-2 tracking-tight">
              Welcome, {customer.firstName || "Guest"}
            </h1>
            <p className="text-[#5A665D] font-light tracking-wide">{customer.email}</p>
          </div>
          <form action={logoutCustomer}>
            <button type="submit" className="text-xs uppercase tracking-[0.15em] font-medium text-[#5A665D] hover:text-[#2C352D] border border-[#C5BAA8]/50 py-3 px-6 rounded-sm hover:border-[#2C352D] transition-all bg-transparent cursor-pointer">
              Log Out
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Order History */}
          <div className="md:col-span-2">
            <h2 className="text-sm uppercase tracking-widest font-medium text-[#2C352D] mb-6">Order History</h2>
            {(!customer.orders?.edges || customer.orders?.edges?.length === 0) ? (
              <div className="bg-[#F2EFEA] p-8 text-center rounded-sm">
                <p className="text-[#5A665D] font-light text-sm mb-4">You haven't placed any orders yet.</p>
                <Link href="/collections" className="text-xs uppercase tracking-widest font-medium text-[#2C352D] border-b border-[#2C352D] pb-1 hover:text-[#5A665D] transition-colors">Start Browsing</Link>
              </div>
            ) : (
              <div className="space-y-6">
                {customer.orders?.edges?.map(({ node }: any) => (
                  <div key={node.orderNumber} className="border border-[#C5BAA8]/30 p-6 flex justify-between items-center rounded-sm bg-white">
                    <div>
                      <p className="font-medium text-[#2C352D]">Order #{node.orderNumber}</p>
                      <p className="text-xs text-[#5A665D] mt-1">{new Date(node.processedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-[#2C352D]">{node.totalPrice?.currencyCode} {node.totalPrice?.amount}</p>
                      <span className="text-[10px] uppercase tracking-widest inline-flex mt-1 px-2 py-1 bg-[#F2EFEA] text-[#5A665D] rounded-sm">Processed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account Details SidePanel */}
          <div>
            <h2 className="text-sm uppercase tracking-widest font-medium text-[#2C352D] mb-6">Account Details</h2>
            <div className="bg-[#F2EFEA] p-8 rounded-sm">
              <p className="font-medium text-[#2C352D] mb-1">{customer.firstName} {customer.lastName}</p>
              <p className="text-sm text-[#5A665D] font-light mb-6">{customer.email}</p>
              
              <Link href="#" className="text-xs uppercase tracking-widest font-medium text-[#2C352D] border-b border-[#2C352D] pb-1 hover:text-[#5A665D] transition-colors">
                Edit Addresses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
