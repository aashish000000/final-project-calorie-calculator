"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  gradient?: boolean;
}

export function Card({
  children,
  className = "",
  hover = true,
  glow = false,
  gradient = false,
}: CardProps) {
  const baseClasses = `
    relative rounded-2xl p-6
    bg-navy-800/50 backdrop-blur-xl
    border border-white/10
    ${glow ? "shadow-glow" : "shadow-card"}
    ${gradient ? "border-gradient" : ""}
  `;

  const hoverClasses = hover
    ? "transition-all duration-300 hover:scale-[1.02] hover:border-accent/30 hover:shadow-glow"
    : "";

  return (
    <motion.div
      className={`${baseClasses} ${hoverClasses} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({ icon, title, description, className = "" }: FeatureCardProps) {
  return (
    <Card className={`flex flex-col items-start gap-4 ${className}`}>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}

interface MetricCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  unit: string;
  description: string;
  className?: string;
}

export function MetricCard({
  icon,
  title,
  value,
  unit,
  description,
  className = "",
}: MetricCardProps) {
  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
            {icon}
          </div>
          <span className="text-sm font-medium text-slate-400">{title}</span>
        </div>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white">{value}</span>
          <span className="text-sm text-accent">{unit}</span>
        </div>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
    </Card>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  description: string;
  isLast?: boolean;
}

export function StepCard({ number, title, description, isLast = false }: StepCardProps) {
  return (
    <div className="relative flex gap-4">
      {/* Timeline line */}
      {!isLast && (
        <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-accent/50 to-transparent" />
      )}
      
      {/* Step number */}
      <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-navy-900 font-bold text-sm">
        {number}
      </div>
      
      {/* Content */}
      <Card className="flex-1 mb-4" hover={false}>
        <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </Card>
    </div>
  );
}

interface TechCardProps {
  name: string;
  icon: ReactNode;
  description: string;
}

export function TechCard({ name, icon, description }: TechCardProps) {
  return (
    <Card className="flex items-center gap-4 p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-accent text-2xl">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-white truncate">{name}</h4>
        <p className="text-xs text-slate-400 truncate">{description}</p>
      </div>
    </Card>
  );
}

