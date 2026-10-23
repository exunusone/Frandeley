"use client";

import { useEffect } from "react";

export function RevealProvider() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    document.querySelectorAll<HTMLElement>("[data-reveal-stagger]").forEach((group) => {
      group.querySelectorAll<HTMLElement>(":scope > [data-reveal]").forEach((element, index) => {
        element.style.setProperty("--reveal-order", String(Math.min(index, 5)));
      });
    });
    const reveal = (element: Element) => element.classList.add("revealed");
    const visibleEdge = window.innerHeight + 150;
    elements.forEach((element) => {
      if (element.getBoundingClientRect().top < visibleEdge) reveal(element);
    });
    document.documentElement.classList.add("has-motion");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px 150px 0px" });
    elements.forEach((element) => observer.observe(element));
    const fallback = window.setTimeout(() => elements.forEach(reveal), 1800);
    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);
  return null;
}
