"use client";

import { AnimatedSection, FadeIn } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { siteContent } from "@/config/content";
import { FiKey, FiLink } from "react-icons/fi";

const content = siteContent.databaseSchema;

export function DatabaseSchema() {
  return (
    <AnimatedSection id="schema" className="bg-navy-800/30">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Tables */}
        <div className="space-y-6">
          {content.tables.map((table, index) => (
            <FadeIn key={table.name} delay={index * 0.1}>
              <Card>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <FiKey className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">{table.name}</h4>
                    <p className="text-sm text-slate-400">{table.description}</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">Field</th>
                        <th className="text-left py-2 px-3 text-slate-400 font-medium">Type</th>
                        <th className="text-center py-2 px-3 text-slate-400 font-medium">Key</th>
                      </tr>
                    </thead>
                    <tbody>
                      {table.fields.map((field) => (
                        <tr key={field.name} className="border-b border-white/5">
                          <td className="py-2 px-3 text-white font-mono">{field.name}</td>
                          <td className="py-2 px-3 text-accent font-mono text-xs">{field.type}</td>
                          <td className="py-2 px-3 text-center">
                            {field.key && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-yellow-500/20 text-yellow-400">
                                <FiKey className="w-3 h-3" />
                              </span>
                            )}
                            {field.fk && (
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-blue-500/20 text-blue-400">
                                <FiLink className="w-3 h-3" />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </FadeIn>
          ))}
        </div>

        {/* Code Example */}
        <FadeIn delay={0.2}>
          <div className="lg:sticky lg:top-24">
            <h4 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Entity Model (C#)
            </h4>
            <CodeBlock
              code={content.codeExample}
              language="csharp"
              title="EntryItem.cs"
              showLineNumbers
            />
          </div>
        </FadeIn>
      </div>
    </AnimatedSection>
  );
}

