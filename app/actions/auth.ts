"use server";

import { shopifyFetch } from "@/lib/shopify";
import { customerCreateMutation, customerAccessTokenCreateMutation } from "@/lib/queries";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function registerCustomer(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const data = await shopifyFetch(customerCreateMutation, {
      input: { email, password, firstName, lastName },
    });

    const errors = data?.customerCreate?.customerUserErrors;
    if (errors && errors.length > 0) {
      return { error: errors[0].message };
    }

    // Auto-login upon successful registration
    return await loginCustomer(prevState, formData);
  } catch (error: any) {
    return { error: error.message || "Failed to register" };
  }
}

export async function loginCustomer(prevState: any, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const data = await shopifyFetch(customerAccessTokenCreateMutation, {
      input: { email, password },
    });

    const errors = data?.customerAccessTokenCreate?.customerUserErrors;
    if (errors && errors.length > 0) {
      return { error: errors[0].message || "Invalid credentials" };
    }

    const token = data?.customerAccessTokenCreate?.customerAccessToken?.accessToken;
    if (token) {
      // Must await cookies() exactly according to Next.js 15 App Router standard
      const cookieStore = await cookies();
      cookieStore.set("customerAccessToken", token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days cache
        sameSite: "lax",
      });
      return { success: true };
    }
    
    return { error: "Could not retrieve access token" };
  } catch (error: any) {
    return { error: "Failed to securely login" };
  }
}

export async function logoutCustomer() {
  const cookieStore = await cookies();
  cookieStore.delete("customerAccessToken");
  redirect("/login");
}
