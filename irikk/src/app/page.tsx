"use client";

import { motion } from "framer-motion";
import { Armchair, Camera, School, Sparkles } from "lucide-react";
import { FeatureCard } from "@/components/home/FeatureCard";
import { Badge } from "@/components/ui/Badge";
import { PLAYFUL_QUOTES } from "@/lib/constants";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    setQuote(PLAYFUL_QUOTES[Math.floor(Math.random() * PLAYFUL_QUOTES.length)]);
  }, []);

  return (
    <main className="page-wrapper">
      <div className="max-w-lg mx-auto px-5 pt-12 pb-20 md:max-w-2xl lg:max-w-4xl">
        {/* Hero Section */}
        <section className="mb-12 md:mb-16">
          {/* Logo + Tagline */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <motion.h1
                className="font-display font-bold text-5xl md:text-6xl tracking-tighter text-irikk-black"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
              >
                IRIKK
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: -3 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 400, damping: 20 }}
              >
                <Badge variant="red" rotate={-3}>
                  premium butt parking
                </Badge>
              </motion.div>
            </div>

            <motion.p
              className="font-body text-sm md:text-base text-irikk-near-black/60 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
            </motion.p>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-irikk-black uppercase tracking-tight leading-[0.95]">
              WHERE DO YOU
              <br />
              WANNA{" "}
              <span className="text-irikk-red relative">
                SIT
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-1.5 bg-irikk-red rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                  style={{ transformOrigin: "left" }}
                />
              </span>
              ?
            </h2>
          </motion.div>

          {/* Supporting Text */}
          <motion.p
            className="font-body text-base md:text-lg text-irikk-near-black/70 leading-relaxed max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300, damping: 25 }}
          >
            Upload a photo. Tell us what you&apos;re doing.
            <br />
            We&apos;ll overthink the seat for you.
          </motion.p>
        </section>

        {/* Feature Cards */}
        <section className="space-y-5 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-12">
          <FeatureCard
            icon={
              <div className="flex items-center gap-2">
                <Armchair size={32} strokeWidth={2.5} />
              </div>
            }
            title="IS THIS SEAT TAKEN?"
            description="Got a suspiciously empty chair? Let's investigate."
            cta="CHECK THE SEAT"
            href="/seat"
            badge="SINGLE SEAT"
            badgeRotate={3}
            accentBorder="left"
            index={0}
          />
          <FeatureCard
            icon={
              <div className="flex items-center gap-2">
                <School size={32} strokeWidth={2.5} />
              </div>
            }
            title="WHERE SHOULD I SIT?"
            description="Show us the classroom. We'll judge every seat."
            cta="FIND MY SEAT"
            href="/classroom"
            badge="FULL ROOM"
            badgeRotate={-2}
            accentBorder="left"
            index={1}
          />
        </section>

        {/* Footer Quote */}
        <motion.footer
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="inline-block brutal-card-sm rounded-lg px-4 py-2.5">
            <p className="font-body text-xs md:text-sm text-irikk-near-black/60">
              {quote || "We take sitting very seriously."}
            </p>
          </div>
          <p className="mt-4 font-display text-xs text-irikk-gray-dark uppercase tracking-widest">
            Built with overthinking 
          </p>
        </motion.footer>
      </div>
    </main>
  );
}
