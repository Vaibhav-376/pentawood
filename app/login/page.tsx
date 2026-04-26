"use client";

import { useActionState, useEffect } from "react";
import { loginCustomer } from "@/app/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Basic shim to prevent build errors with React 19's useActionState if older React is used
// Next 15 App Router standardizes on useActionState over useFormState
const useFormStateFixed = typeof useActionState === 'function' ? useActionState : require('react-dom').useFormState;

export default function LoginPage() {
  const [state, formAction, isPending] = useFormStateFixed(loginCustomer, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push("/account");
    }
  }, [state, router]);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center py-32 px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-[#2C352D] mb-4 tracking-tight">Login</h1>
          <p className="text-[#5A665D] font-light tracking-wide text-sm">
            Enter your credentials to access your account.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-xs uppercase tracking-widest text-center">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-[#5A665D]">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border-b border-[#C5BAA8]/50 bg-transparent py-3 focus:outline-none focus:border-[#2C352D] transition-colors font-light text-[#2C352D]"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <label className="text-xs uppercase tracking-widest text-[#5A665D]">Password</label>
              <Link href="#" className="text-[10px] uppercase tracking-widest text-[#5A665D] hover:text-[#2C352D] transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              required
              className="w-full border-b border-[#C5BAA8]/50 bg-transparent py-3 focus:outline-none focus:border-[#2C352D] transition-colors font-light text-[#2C352D]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#2C352D] hover:bg-black text-white py-5 text-xs uppercase tracking-[0.2em] font-medium transition-colors mt-8 disabled:opacity-50"
          >
            {isPending ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[#5A665D] text-xs uppercase tracking-widest">
            Don't have an account?{" "}
            <Link href="/register" className="text-[#2C352D] font-medium hover:underline underline-offset-4">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
