"use client";

import { useEffect } from "react";

export function RevealProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-motion");
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
      group.querySelectorAll<HTMLElement>(":scope > [data-reveal]").forEach((element, index) => {
        element.style.setProperty("--reveal-order", String(Math.min(index, 5)));
      });
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
  return null;
}
