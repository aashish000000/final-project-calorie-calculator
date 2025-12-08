"use client";

import { AnimatedSection, StaggerContainer, StaggerItem } from "@/components/ui/AnimatedSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TechCard } from "@/components/ui/Card";
import { siteContent } from "@/config/content";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiDotnet,
  SiPostman,
  SiGithub,
  SiVercel,
} from "react-icons/si";
import { FiDatabase, FiShield, FiCode, FiServer } from "react-icons/fi";
import { VscCode } from "react-icons/vsc";

const content = siteContent.techStack;

const iconMap: Record<string, React.ReactNode> = {
  nextjs: <SiNextdotjs />,
  tailwind: <SiTailwindcss />,
  dotnet: <SiDotnet />,
  ef: <FiDatabase />,
  jwt: <FiShield />,
  sqlserver: <FiServer />,
  vs: <VscCode />,
  postman: <SiPostman />,
  github: <SiGithub />,
  vercel: <SiVercel />,
};

export function TechStack() {
  return (
    <AnimatedSection id="tech">
      <SectionHeader title={content.title} subtitle={content.subtitle} />

      <div className="space-y-10">
        {content.categories.map((category, catIndex) => (
          <div key={category.name}>
            <h3 className="text-lg font-semibold text-accent mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" />
              {category.name}
            </h3>
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.technologies.map((tech, techIndex) => (
                <StaggerItem key={tech.name}>
                  <TechCard
                    name={tech.name}
                    icon={iconMap[tech.icon] || <FiDatabase />}
                    description={tech.description}
                  />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}

