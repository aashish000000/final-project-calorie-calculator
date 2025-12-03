"use client";

import { useState, useEffect, useCallback } from "react";

interface UseScrollSpyOptions {
  sectionIds: string[];
  offset?: number;
}

export function useScrollSpy({ sectionIds, offset = 100 }: UseScrollSpyOptions): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");

  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + offset;

    // Find the current section
    for (let i = sectionIds.length - 1; i >= 0; i--) {
      const section = document.getElementById(sectionIds[i]);
      if (section) {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }
    }

    // Default to first section if at top
    setActiveSection(sectionIds[0] || "");
  }, [sectionIds, offset]);

  useEffect(() => {
    // Initial check
    handleScroll();

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return activeSection;
}

// Alternative implementation using IntersectionObserver
export function useScrollSpyIntersection(sectionIds: string[]): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const visibleSections = new Map<string, number>();

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              visibleSections.set(id, entry.intersectionRatio);
            } else {
              visibleSections.delete(id);
            }

            // Find section with highest visibility
            let maxRatio = 0;
            let currentSection = sectionIds[0] || "";

            visibleSections.forEach((ratio, sectionId) => {
              if (ratio > maxRatio) {
                maxRatio = ratio;
                currentSection = sectionId;
              }
            });

            if (visibleSections.size > 0) {
              setActiveSection(currentSection);
            }
          });
        },
        {
          rootMargin: "-20% 0px -60% 0px",
          threshold: [0, 0.25, 0.5, 0.75, 1],
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionIds]);

  return activeSection;
}

