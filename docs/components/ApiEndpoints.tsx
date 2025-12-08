"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/config/content";

const content = siteContent.apiEndpoints;

const methodColors: Record<string, string> = {
  GET: "method-get",
  POST: "method-post",
  PUT: "method-put",
  DELETE: "method-delete",
};

export function ApiEndpoints() {
  return (
    <AnimatedSection id="api">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <StaggerContainer className="space-y-8 max-w-4xl mx-auto">
        {content.groups.map((group) => (
          <StaggerItem key={group.name}>
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent" />
                {group.name}
              </h3>
              
              <div className="space-y-3">
                {group.endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 rounded-lg bg-navy-900/50 hover:bg-navy-900/80 transition-colors"
                  >
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                        methodColors[endpoint.method]
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-white font-mono text-sm flex-1">
                      {endpoint.path}
                    </code>
                    <span className="text-slate-400 text-sm hidden sm:block">
                      {endpoint.description}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </AnimatedSection>
  );
}

