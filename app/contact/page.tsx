"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { submitContactInquiry } from "@/app/actions/contact";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    orderId: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const result = await submitContactInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        orderId: formData.orderId.trim(),
        message: formData.message.trim(),
      });

      if (!result.success) {
        setError(result.error || "Failed to submit message. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Premium Hero Section */}
      <section className="relative pt-16 md:pt-20 pb-12 px-6 md:px-12 bg-[#F2EFEA]/60 border-b border-[#C5BAA8]/20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-[#5A665D] text-[10px] uppercase tracking-[0.3em] font-semibold mb-3 block">
            Pentawood Concierge
          </span>
          <h1 className="font-serif text-4xl md:text-6xl text-[#29402E] mb-6 tracking-tight">
            How Can We Assist You?
          </h1>
          <p className="text-[#5A665D] font-light text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Whether you are inquiring about fabric specifications, order delivery updates, or styling recommendations, our dedicated team is at your service.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 items-start">
          
          {/* Contact Details (Left side - 5 cols) */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <h2 className="font-serif text-3xl text-[#29402E] mb-4">Direct Inquiries</h2>
              <p className="text-[#5A665D] font-light text-sm leading-relaxed max-w-md">
                We pride ourselves on providing prompt and attentive service to our community. Reach out through any of our direct channels below.
              </p>
            </div>

            <div className="space-y-8 pt-6 border-t border-[#C5BAA8]/30">
              
              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-sm bg-[#F2EFEA] flex items-center justify-center text-[#29402E] group-hover:bg-[#29402E] group-hover:text-white transition-all duration-300 shrink-0">
                  <Mail className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] mb-1">Email Concierge</p>
                  <a href="mailto:support@pentawood.in" className="text-sm md:text-base font-medium text-[#29402E] hover:underline">
                    support@pentawood.in
                  </a>
                  <p className="text-xs text-[#5A665D]/70 font-light mt-1">Average response within 12 hours</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-sm bg-[#F2EFEA] flex items-center justify-center text-[#29402E] group-hover:bg-[#29402E] group-hover:text-white transition-all duration-300 shrink-0">
                  <Phone className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] mb-1">Phone Assistance</p>
                  <a href="tel:+919667743121" className="text-sm md:text-base font-medium text-[#29402E] hover:underline">
                    +91 96677 43121
                  </a>
                  <p className="text-xs text-[#5A665D]/70 font-light mt-1">Mon - Sat, 10:00 AM - 6:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="w-12 h-12 rounded-sm bg-[#F2EFEA] flex items-center justify-center text-[#29402E] group-hover:bg-[#29402E] group-hover:text-white transition-all duration-300 shrink-0">
                  <MapPin className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] mb-1">Design Studio</p>
                  <p className="text-sm md:text-base font-medium text-[#29402E]">
                    Pentawood Apparel Studio
                  </p>
                  <p className="text-xs text-[#5A665D]/70 font-light mt-1">New Delhi, 110001, India</p>
                </div>
              </div>

            </div>

            <div className="bg-[#F2EFEA]/80 border border-[#C5BAA8]/30 p-6 rounded-sm space-y-3">
              <div className="flex items-center gap-2 text-[#29402E]">
                <Clock className="w-4 h-4" strokeWidth={1.5} />
                <span className="text-xs font-semibold uppercase tracking-wider">Business Operating Hours</span>
              </div>
              <p className="text-xs text-[#5A665D] leading-relaxed font-light">
                Our support desk is active Monday through Saturday. All inquiries received on Sundays or public holidays will be prioritized on the next business morning.
              </p>
            </div>
          </div>

          {/* Interactive Contact Form (Right side - 7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-[#C5BAA8]/40 p-8 md:p-14 rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
              <AnimatePresence mode="wait">
                {!isSubmitted ? (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="font-serif text-2xl text-[#29402E] mb-2">Send an Inquiry</h3>
                    <p className="text-[#5A665D] font-light text-xs md:text-sm mb-8">
                      Fill out the form below and we will route your inquiry to the appropriate specialist.
                    </p>

                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-sm text-xs font-medium mb-6 flex items-center gap-2">
                        <span>{error}</span>
                      </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] block">
                            Full Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-[#FDFBF7] border border-[#C5BAA8]/40 px-4 py-3 text-sm focus:border-[#29402E] focus:bg-white outline-none rounded-sm transition-colors"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="email" className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] block">
                            Email Address <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-[#FDFBF7] border border-[#C5BAA8]/40 px-4 py-3 text-sm focus:border-[#29402E] focus:bg-white outline-none rounded-sm transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label htmlFor="subject" className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] block">
                            Inquiry Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full bg-[#FDFBF7] border border-[#C5BAA8]/40 px-4 py-3 text-sm focus:border-[#29402E] focus:bg-white outline-none rounded-sm transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%235A665D%22%20d%3D%22M6%208.4L1.8%204.2c-.2-.2-.2-.5%200-.7s.5-.2.7%200L6%207l3.5-3.5c.2-.2.5-.2.7%200s.2.5%200%20.7L6%208.4z%22%2F%3E%3C%2Fsvg%3E')] bg-[position:calc(100%-16px)_center] bg-no-repeat pr-10"
                          >
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Order Status">Order Status & Delivery</option>
                            <option value="Returns & Exchanges">Returns & Exchanges</option>
                            <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
                            <option value="Partnerships & Press">Partnerships & Press</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="orderId" className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] block">
                            Order Number <span className="text-[#5A665D]/60 font-light">(Optional)</span>
                          </label>
                          <input
                            id="orderId"
                            name="orderId"
                            type="text"
                            placeholder="e.g. PW-10293"
                            value={formData.orderId}
                            onChange={handleChange}
                            className="w-full bg-[#FDFBF7] border border-[#C5BAA8]/40 px-4 py-3 text-sm focus:border-[#29402E] focus:bg-white outline-none rounded-sm transition-colors"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="message" className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#5A665D] block">
                          Your Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={5}
                          required
                          placeholder="Please provide details regarding your inquiry..."
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full bg-[#FDFBF7] border border-[#C5BAA8]/40 px-4 py-3 text-sm focus:border-[#29402E] focus:bg-white outline-none rounded-sm transition-colors resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-[#29402E] text-white hover:bg-[#1f3022] active:scale-[0.99] transition-all duration-300 uppercase tracking-[0.2em] text-xs font-medium rounded-sm flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                      >
                        {isSubmitting ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Submit Message</span>
                            <Send className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="py-16 text-center space-y-6 max-w-md mx-auto"
                  >
                    <div className="w-16 h-16 bg-[#29402E]/10 rounded-full flex items-center justify-center text-[#29402E] mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-3xl text-[#29402E]">Inquiry Received</h3>
                    <p className="text-[#5A665D] font-light text-sm leading-relaxed">
                      Thank you for reaching out to Pentawood. Your message has been safely received by our concierge desk. We have sent a copy of your inquiry to <span className="font-medium text-[#29402E]">{formData.email}</span>.
                    </p>
                    <div className="pt-8 border-t border-[#C5BAA8]/20 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({ name: "", email: "", subject: "General Inquiry", orderId: "", message: "" });
                        }}
                        className="w-full sm:w-auto px-6 py-3 border border-[#29402E] text-[#29402E] hover:bg-[#29402E]/5 transition-colors uppercase tracking-[0.15em] text-[11px] font-medium rounded-sm cursor-pointer"
                      >
                        Send Another Note
                      </button>
                      <Link
                        href="/collections"
                        className="w-full sm:w-auto px-6 py-3 bg-[#29402E] text-white hover:bg-[#1f3022] transition-colors uppercase tracking-[0.15em] text-[11px] font-medium rounded-sm flex items-center justify-center gap-2 shadow-sm"
                      >
                        <span>Continue Shopping</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* Quick Help / FAQ Teaser Section */}
      <section className="bg-[#F2EFEA]/40 border-t border-[#C5BAA8]/20 py-16 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#5A665D] text-[10px] uppercase tracking-[0.3em] font-semibold mb-2 block">Quick Answers</span>
              <h2 className="font-serif text-3xl text-[#29402E]">Common Questions</h2>
            </div>
            <Link href="/faq" className="text-[#29402E] hover:underline underline-offset-4 text-xs font-semibold uppercase tracking-widest mt-4 md:mt-0 flex items-center gap-1">
              <span>View Full FAQ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/80 p-6 rounded-sm border border-[#C5BAA8]/30 space-y-3">
              <h4 className="font-serif text-lg text-[#29402E]">Shipping Timelines</h4>
              <p className="text-xs text-[#5A665D] font-light leading-relaxed">
                Standard delivery generally takes 3 to 5 business days across major metro areas. Orders dispatch within 24 hours of confirmation.
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded-sm border border-[#C5BAA8]/30 space-y-3">
              <h4 className="font-serif text-lg text-[#29402E]">Returns & Exchanges</h4>
              <p className="text-xs text-[#5A665D] font-light leading-relaxed">
                Enjoy a hassle-free 14-day return window on all unworn items with original tags intact. We offer easy exchanges and full refunds.
              </p>
            </div>
            <div className="bg-white/80 p-6 rounded-sm border border-[#C5BAA8]/30 space-y-3">
              <h4 className="font-serif text-lg text-[#29402E]">Sizing Guidance</h4>
              <p className="text-xs text-[#5A665D] font-light leading-relaxed">
                Our garments follow modern tailored sizing. Detailed measurements and fit advice can be found on every individual product page.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
