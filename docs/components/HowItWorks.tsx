"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StepCard } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import { motion } from "framer-motion";

const content = siteContent.howItWorks;

export function HowItWorks() {
  return (
    <AnimatedSection id="how" className="bg-navy-800/30">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <div className="max-w-2xl mx-auto">
        {content.steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
          >
            <StepCard
              number={step.number}
              title={step.title}
              description={step.description}
              isLast={index === content.steps.length - 1}
            />
          </motion.div>
        ))}
      </div>
    </AnimatedSection>
  );
}

