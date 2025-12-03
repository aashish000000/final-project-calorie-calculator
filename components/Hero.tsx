"use client";

import { motion } from "framer-motion";
import { siteContent } from "@/config/content";
import { FiArrowDown, FiLayers } from "react-icons/fi";

const content = siteContent.hero;

export function Hero() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          {content.badge}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {content.title.split(" ").slice(0, -2).join(" ")}{" "}
          <span className="text-gradient">
            {content.title.split(" ").slice(-2).join(" ")}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {content.subtitle}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            onClick={() => scrollToSection("overview")}
            className="flex items-center gap-2 px-6 py-3 bg-accent text-navy-900 rounded-xl font-semibold hover:bg-accent-light transition-colors shadow-glow"
          >
            {content.ctaPrimary}
            <FiArrowDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollToSection("tech")}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white rounded-xl font-semibold border border-white/10 hover:bg-white/10 hover:border-accent/30 transition-all"
          >
            <FiLayers className="w-4 h-4" />
            {content.ctaSecondary}
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div className="w-1.5 h-3 rounded-full bg-accent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

