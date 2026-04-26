"use client";

import { useState, useEffect } from "react";

export default function ComingSoon() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Updated launch date: 1st April
  const LAUNCH_DATE = new Date("2025-04-01T00:00:00");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = LAUNCH_DATE.getTime() - now.getTime();
      if (diff <= 0) return;

      setDays(Math.floor(diff / (1000 * 60 * 60 * 24)));
      setHours(Math.floor((diff / (1000 * 60 * 60)) % 24));
      setMinutes(Math.floor((diff / (1000 * 60)) % 60));
      setSeconds(Math.floor((diff / 1000) % 60));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="min-h-screen flex flex-col items-center justify-between px-8 py-14 bg-[#faf9f7] text-[#1a1a1a] font-light">
      {/* Logo */}
      <div className="w-full flex justify-center">
        <div className="font-serif text-xs sm:text-sm font-normal tracking-[0.3em] uppercase text-[#1a1a1a]">
          Pentawood
        </div>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center text-center">
        <p className="text-[0.65rem] tracking-[0.3em] uppercase text-gray-400 mb-8">
          Coming Soon
        </p>

        <h1 className="font-serif text-[2.2rem] sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight tracking-[-0.01em] text-[#1a1a1a] mb-6">
          A new standard
          <br />
          in premium clothing.
        </h1>

        <p className="text-[0.85rem] text-gray-500 tracking-[0.05em] leading-7 max-w-xs mb-14">
          Thoughtfully crafted essentials. Launching soon — be the first to
          know.
        </p>

        {/* Countdown */}
        {/* <div className="flex items-start gap-8 mb-14">
          <div className="flex flex-col items-center gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-light text-[#1a1a1a] leading-none tabular-nums min-w-[2.2ch] text-center">
              {pad(days)}
            </span>
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-gray-400">
              Days
            </span>
          </div>

          <span className="font-serif text-2xl text-gray-300 font-light mt-0.5 leading-none">
            ·
          </span>

          <div className="flex flex-col items-center gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-light text-[#1a1a1a] leading-none tabular-nums min-w-[2.2ch] text-center">
              {pad(hours)}
            </span>
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-gray-400">
              Hrs
            </span>
          </div>

          <span className="font-serif text-2xl text-gray-300 font-light mt-0.5 leading-none">
            ·
          </span>

          <div className="flex flex-col items-center gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-light text-[#1a1a1a] leading-none tabular-nums min-w-[2.2ch] text-center">
              {pad(minutes)}
            </span>
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-gray-400">
              Min
            </span>
          </div>

          <span className="font-serif text-2xl text-gray-300 font-light mt-0.5 leading-none">
            ·
          </span>

          <div className="flex flex-col items-center gap-1.5">
            <span className="font-serif text-2xl sm:text-3xl font-light text-[#1a1a1a] leading-none tabular-nums min-w-[2.2ch] text-center">
              {pad(seconds)}
            </span>
            <span className="text-[0.55rem] tracking-[0.25em] uppercase text-gray-400">
              Sec
            </span>
          </div>
        </div> */}

        {/* Form */}
        {submitted ? (
          <p className="text-[0.75rem] tracking-[0.1em] text-gray-500">
            Thank you. We&apos;ll be in touch.
          </p>
        ) : (
          <form
            className="flex w-full max-w-xs border-b border-gray-300"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 bg-transparent border-none outline-none text-[0.8rem] font-light text-[#1a1a1a] py-2 tracking-[0.04em] placeholder:text-gray-400"
            />
            <button
              type="submit"
              className="bg-transparent border-none text-[0.65rem] font-normal tracking-[0.2em] uppercase text-[#1a1a1a] cursor-pointer py-2 pl-4 hover:text-gray-500 whitespace-nowrap"
            >
              Notify me
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <p className="text-[0.6rem] tracking-[0.2em] uppercase text-gray-300">
        © 2026 Pentawood
      </p>
    </div>
  );
}