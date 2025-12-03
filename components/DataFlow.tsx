"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const content = siteContent.dataFlow;

export function DataFlow() {
  return (
    <AnimatedSection id="dataflow">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <div className="relative max-w-4xl mx-auto">
        {/* Connection line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent/50 to-accent/20 hidden lg:block" />

        <div className="space-y-6">
          {content.flows.map((flow, index) => (
            <motion.div
              key={flow.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center gap-6 ${
                index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
              }`}
            >
              {/* Content Card */}
              <Card className="flex-1">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-navy-900 font-bold text-sm">
                    {flow.step}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">
                      {flow.title}
                    </h4>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {flow.description}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Center point (desktop) */}
              <div className="hidden lg:flex items-center justify-center w-12">
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-navy-800 border-2 border-accent text-accent">
                  <FiArrowRight className="w-4 h-4" />
                </div>
              </div>

              {/* Spacer for alternating layout */}
              <div className="hidden lg:block flex-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}

