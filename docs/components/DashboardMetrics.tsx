"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MetricCard } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import { FiActivity, FiTrendingUp, FiPieChart, FiAward } from "react-icons/fi";

const content = siteContent.dashboardMetrics;

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  daily: FiActivity,
  weekly: FiTrendingUp,
  macro: FiPieChart,
  top: FiAward,
};

export function DashboardMetrics() {
  return (
    <AnimatedSection id="metrics" className="bg-navy-800/30">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <StaggerContainer className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {content.metrics.map((metric, index) => {
          const Icon = iconMap[metric.icon] || FiActivity;
          return (
            <StaggerItem key={index}>
              <MetricCard
                icon={<Icon className="w-5 h-5" />}
                title={metric.title}
                value={metric.value}
                unit={metric.unit}
                description={metric.description}
              />
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      {/* Mock Dashboard Preview */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="p-6 rounded-2xl bg-navy-900/50 border border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="text-xs text-slate-400 ml-2 font-mono">Dashboard Preview</span>
          </div>
          
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: "Calories", value: "2,150", color: "bg-accent" },
              { label: "Protein", value: "156g", color: "bg-green-500" },
              { label: "Carbs", value: "245g", color: "bg-yellow-500" },
              { label: "Fat", value: "78g", color: "bg-pink-500" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-white/5">
                <div className={`w-2 h-2 rounded-full ${stat.color} mx-auto mb-2`} />
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* Mock Chart */}
          <div className="h-32 flex items-end gap-2">
            {[40, 65, 50, 80, 70, 90, 75].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-accent to-accent-light rounded-t transition-all hover:opacity-80"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-slate-500">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

