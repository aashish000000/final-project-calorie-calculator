"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import {
  FiZap,
  FiShield,
  FiDatabase,
  FiMonitor,
  FiCheckCircle,
} from "react-icons/fi";

const content = siteContent.summary;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  modern: FiZap,
  secure: FiShield,
  data: FiDatabase,
  interactive: FiMonitor,
  simple: FiCheckCircle,
};

export function Summary() {
  return (
    <AnimatedSection id="summary">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {content.points.map((point, index) => {
          const Icon = iconMap[point.icon] || FiCheckCircle;
          return (
            <StaggerItem key={index}>
              <Card className="h-full text-center" glow={index === 0}>
                <div className="flex flex-col items-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-accent mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {point.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {point.description}
                  </p>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </AnimatedSection>
  );
}

