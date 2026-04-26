"use client";

import { useActionState, useEffect } from "react";
import { registerCustomer } from "@/app/actions/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const useFormStateFixed = typeof useActionState === 'function' ? useActionState : require('react-dom').useFormState;

export default function RegisterPage() {
  const [state, formAction, isPending] = useFormStateFixed(registerCustomer, null);
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
          <h1 className="font-serif text-4xl text-[#2C352D] mb-4 tracking-tight">Create Account</h1>
          <p className="text-[#5A665D] font-light tracking-wide text-sm">
            Join Pentawood to unlock a personalized tailored experience.
          </p>
        </div>

        <form action={formAction} className="space-y-6">
          {state?.error && (
            <div className="bg-red-50 text-red-600 p-4 border border-red-100 text-xs uppercase tracking-widest text-center">
              {state.error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="firstName" className="text-xs uppercase tracking-widest text-[#5A665D]">First Name</label>
              <input type="text" name="firstName" required className="w-full border-b border-[#C5BAA8]/50 bg-transparent py-3 focus:outline-none focus:border-[#2C352D] transition-colors font-light text-[#2C352D]" placeholder="First" />
            </div>
            <div className="space-y-2">
              <label htmlFor="lastName" className="text-xs uppercase tracking-widest text-[#5A665D]">Last Name</label>
              <input type="text" name="lastName" required className="w-full border-b border-[#C5BAA8]/50 bg-transparent py-3 focus:outline-none focus:border-[#2C352D] transition-colors font-light text-[#2C352D]" placeholder="Last" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-[#5A665D]">Email</label>
            <input type="email" name="email" required className="w-full border-b border-[#C5BAA8]/50 bg-transparent py-3 focus:outline-none focus:border-[#2C352D] transition-colors font-light text-[#2C352D]" placeholder="Enter your email" />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-widest text-[#5A665D]">Password</label>
            <input type="password" name="password" required minLength={8} className="w-full border-b border-[#C5BAA8]/50 bg-transparent py-3 focus:outline-none focus:border-[#2C352D] transition-colors font-light text-[#2C352D]" placeholder="Create a password" />
          </div>

          <button type="submit" disabled={isPending} className="w-full bg-[#2C352D] hover:bg-black text-white py-5 text-xs uppercase tracking-[0.2em] font-medium transition-colors mt-8 disabled:opacity-50">
             {isPending ? "Creating Profile..." : "Register"}
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="text-[#5A665D] text-xs uppercase tracking-widest">
            Already have an account?{" "}
            <Link href="/login" className="text-[#2C352D] font-medium hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
