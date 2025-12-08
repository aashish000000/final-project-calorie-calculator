"use client";

import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  centered = true,
  className = "",
}: SectionHeaderProps) {
  return (
    <motion.div
      className={`mb-12 ${centered ? "text-center" : ""} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
        {title.split(" ").map((word, i) => (
          <span key={i}>
            {i === title.split(" ").length - 1 ? (
              <span className="text-gradient">{word}</span>
            ) : (
              <span>{word} </span>
            )}
          </span>
        ))}
      </h2>
      {subtitle && (
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">{subtitle}</p>
      )}
      <div className={`mt-6 flex items-center gap-3 ${centered ? "justify-center" : ""}`}>
        <div className="h-1 w-12 rounded-full bg-accent" />
        <div className="h-1 w-3 rounded-full bg-accent/50" />
        <div className="h-1 w-1.5 rounded-full bg-accent/30" />
      </div>
    </motion.div>
  );
}

