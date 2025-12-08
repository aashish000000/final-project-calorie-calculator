"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import { FiHeart, FiUsers, FiTool, FiZap } from "react-icons/fi";

const content = siteContent.whyProject;

const icons = [FiHeart, FiUsers, FiTool, FiZap];

export function WhyProject() {
  return (
    <AnimatedSection id="why" className="bg-navy-800/30">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {content.reasons.map((reason, index) => {
          const Icon = icons[index];
          return (
            <StaggerItem key={index}>
              <Card className="h-full">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {reason.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </AnimatedSection>
  );
}

