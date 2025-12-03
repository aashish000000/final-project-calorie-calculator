"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import {
  FiGlobe,
  FiLock,
  FiCoffee,
  FiActivity,
  FiBarChart2,
} from "react-icons/fi";

const content = siteContent.projectOverview;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  web: FiGlobe,
  auth: FiLock,
  food: FiCoffee,
  calc: FiActivity,
  metrics: FiBarChart2,
};

export function ProjectOverview() {
  return (
    <AnimatedSection id="overview" className="bg-navy-800/30">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.features.map((feature, index) => {
          const Icon = iconMap[feature.icon] || FiGlobe;
          return (
            <StaggerItem key={index}>
              <FeatureCard
                icon={<Icon className="w-6 h-6" />}
                title={feature.title}
                description={feature.description}
                className="h-full"
              />
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </AnimatedSection>
  );
}

