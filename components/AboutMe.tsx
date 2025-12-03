"use client";

import { AnimatedSection } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import { FiUser, FiCode, FiHeart } from "react-icons/fi";

const content = siteContent.aboutMe;

export function AboutMe() {
  return (
    <AnimatedSection id="about">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <div className="max-w-3xl mx-auto">
        <Card className="relative overflow-hidden" glow>
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-navy-900">
                <FiUser className="w-12 h-12" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Aashish Joshi</h3>
              <p className="text-accent text-sm font-medium mb-4">
                Computer Science Major • NJCU
              </p>
              
              <div className="space-y-3">
                {content.description.map((text, index) => (
                  <p key={index} className="text-slate-400 leading-relaxed">
                    {text}
                  </p>
                ))}
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-6">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm">
                  <FiCode className="w-3.5 h-3.5" />
                  Full-Stack Dev
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm">
                  <FiHeart className="w-3.5 h-3.5" />
                  Health Tech
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AnimatedSection>
  );
}

