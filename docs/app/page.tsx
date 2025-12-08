import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { AboutMe } from "@/components/AboutMe";
import { WhyProject } from "@/components/WhyProject";
import { Objectives } from "@/components/Objectives";
import { HowItWorks } from "@/components/HowItWorks";
import { TechStack } from "@/components/TechStack";
import { ProjectOverview } from "@/components/ProjectOverview";
import { DataFlow } from "@/components/DataFlow";
import { DatabaseSchema } from "@/components/DatabaseSchema";
import { ApiEndpoints } from "@/components/ApiEndpoints";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { Summary } from "@/components/Summary";
import { FuturePlans } from "@/components/FuturePlans";

export default function Home() {
  return (
    <>
      <Navigation />
      <main className="relative">
        <Hero />
        <AboutMe />
        <WhyProject />
        <Objectives />
        <HowItWorks />
        <TechStack />
        <ProjectOverview />
        <DataFlow />
        <DatabaseSchema />
        <ApiEndpoints />
        <DashboardMetrics />
        <Summary />
        <FuturePlans />
      </main>
    </>
  );
}

