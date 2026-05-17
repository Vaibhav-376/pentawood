"use server";

import { prisma } from "@/lib/prisma";

export async function submitContactInquiry(formData: {
  name: string;
  email: string;
  subject: string;
  orderId?: string;
  message: string;
}) {
  try {
    const { name, email, subject, orderId, message } = formData;

    if (!name || !email || !message) {
      return { success: false, error: "Name, email, and message are required." };
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        email,
        subject: subject || "General Inquiry",
        orderId: orderId || null,
        message,
      },
    });

    return { success: true, inquiryId: inquiry.id };
  } catch (error) {
    console.error("Prisma submit inquiry error:", error);
    return { success: false, error: "Failed to save inquiry to database. Please verify MongoDB connection." };
  }
}
