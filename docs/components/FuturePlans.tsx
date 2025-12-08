"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import { FiCpu, FiCamera, FiSmartphone, FiWatch } from "react-icons/fi";

const content = siteContent.futurePlans;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ai: FiCpu,
  barcode: FiCamera,
  mobile: FiSmartphone,
  wearable: FiWatch,
};

export function FuturePlans() {
  return (
    <AnimatedSection id="future" className="bg-navy-800/30">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <div className="max-w-4xl mx-auto">
        <StaggerContainer className="grid md:grid-cols-2 gap-6">
          {content.plans.map((plan, index) => {
            const Icon = iconMap[plan.icon] || FiCpu;
            return (
              <StaggerItem key={index}>
                <Card className="h-full relative overflow-hidden">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        plan.status === "Planned"
                          ? "bg-accent/20 text-accent"
                          : "bg-slate-500/20 text-slate-400"
                      }`}
                    >
                      {plan.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent flex-shrink-0">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="pr-16">
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {plan.title}
                      </h3>
                      <p className="text-slate-400 text-sm leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>

      {/* Footer */}
      <div className="mt-20 text-center">
        <p className="text-slate-500 text-sm">
          Designed and developed by{" "}
          <span className="text-accent">Aashish Joshi</span>
        </p>
        <p className="text-slate-600 text-xs mt-2">
          New Jersey City University • 2024
        </p>
      </div>
    </AnimatedSection>
  );
}

