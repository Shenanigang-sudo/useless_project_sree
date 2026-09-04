"use client";

import { motion } from "framer-motion";
import { Armchair, School, ArrowRight, Crosshair, AlertTriangle } from "lucide-react";
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
      <div className="max-w-xl mx-auto px-4 sm:px-5 pt-6 sm:pt-8 pb-20 md:max-w-2xl lg:max-w-4xl">
        {/* Hero Section — Zine Poster Headline */}
        <section className="mb-8 sm:mb-10 md:mb-14">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <motion.h1
              className="font-display font-black text-5xl sm:text-7xl md:text-8xl tracking-tighter text-irikk-black leading-none uppercase"
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 25 }}
            >
              IRIKK
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -15 }}
              animate={{ opacity: 1, scale: 1, rotate: -2.5 }}
              transition={{ delay: 0.25, type: "spring", stiffness: 400, damping: 20 }}
            >
              <Badge variant="red">
                premium butt parking
              </Badge>
            </motion.div>
          </div>

          {/* Main Provocative Question */}
          <motion.div
            className="mb-4 sm:mb-6 space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          >
            <h2 className="font-display font-black text-2xl sm:text-4xl md:text-6xl text-irikk-black uppercase tracking-tight leading-[0.94] break-words">
              WHERE THE HELL
              <br />
              ARE YOU{" "}
              <span className="bg-irikk-red text-irikk-white px-2 py-0.5 inline-block -rotate-1 shadow-[3px_3px_0px_#0F0F0F]">
                SITTING
              </span>
              ?
            </h2>
          </motion.div>

          {/* Supporting Philosophy Text */}
          <motion.p
            className="font-body text-base md:text-lg text-irikk-near-black/85 leading-relaxed max-w-lg font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, type: "spring", stiffness: 300, damping: 25 }}
          >
            Let's put <strong className="text-irikk-black underline decoration-irikk-red decoration-2">WAY too much engineering</strong> into deciding where your ass should go. Snap a photo. State your demands. We&apos;ll overthink the furniture for you.
          </motion.p>
        </section>



        {/* Feature Cards — Underground Gig Poster Cards */}
        <section className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-12">
          <FeatureCard
            icon={<Armchair size={28} strokeWidth={2.5} />}
            title="IS THIS SEAT TAKEN?"
            description="Got a suspiciously empty chair? Let's investigate."
            cta="CHECK THE SEAT"
            href="/seat"
            badge="SINGLE SEAT"
            badgeRotate={3}
            accentBorder="left"
            specCode="SPEC_#01"
            index={0}
          />
          <FeatureCard
            icon={<School size={28} strokeWidth={2.5} />}
            title="WHERE SHOULD I SIT?"
            description="Show us the classroom. We'll investigate and judge every seat."
            cta="FIND MY SEAT"
            href="/classroom"
            badge="FULL ROOM"
            badgeRotate={-2}
            accentBorder="left"
            specCode="SPEC_#02"
            index={1}
          />
        </section>

        {/* Manifesto / Footer Notice */}
        <motion.footer
          className="border-t-3 border-irikk-black pt-6 text-center space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="inline-block brutal-card-sm px-4 py-2 rotate-[-0.5deg]">
            <p className="font-mono text-xs text-irikk-near-black font-bold uppercase tracking-wider">
              {quote || "WE TAKE SITTING WAY TOO SERIOUSLY."}
            </p>
          </div>

        </motion.footer>
      </div>
    </main>
  );
}
