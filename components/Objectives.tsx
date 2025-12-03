"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeatureCard } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import {
  FiSmartphone,
  FiShield,
  FiDatabase,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";

const content = siteContent.objectives;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  responsive: FiSmartphone,
  security: FiShield,
  database: FiDatabase,
  dashboard: FiPieChart,
  analytics: FiTrendingUp,
};

export function Objectives() {
  return (
    <AnimatedSection id="objectives">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.items.map((item, index) => {
          const Icon = iconMap[item.icon] || FiTrendingUp;
          return (
            <StaggerItem key={index}>
              <FeatureCard
                icon={<Icon className="w-6 h-6" />}
                title={item.title}
                description={item.description}
                className="h-full"
              />
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </AnimatedSection>
  );
}

