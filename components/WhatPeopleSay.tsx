"use client";

import { useRef } from "react";
import Image from "next/image";
import CategoryBadge from "./CategoryBadge";
import TestimonialCard, { TestimonialCardProps } from "./TestimonialCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials: (TestimonialCardProps & { id: string })[] = [
  {
    id: "jenny-wilson",
    name: "Jenny Wilson",
    location: "De New York, USA",
    rating: 5.0,
    quote: "“J'utilise vos services depuis 3 ans. Votre service est excellent, je continuerai à l'utiliser.”",
    imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "charlie-johnson",
    name: "Charlie Johnson",
    location: "De New York, USA",
    rating: 5.0,
    quote: "“Je me sens en toute sécurité en utilisant les services de Rentcars. Votre équipe de support est très enthousiaste et le chauffeur est toujours à l'heure.”",
    imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  },
];

export default function WhatPeopleSay() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate the giant background quote marks
    gsap.from(".testimonial-bg-quote", {
      scrollTrigger: {
        trigger: ".testimonial-bg-quote",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      scale: 0.8,
      opacity: 0,
      duration: 1.2,
      ease: "power2.out",
    });

    // Animate the heading section sliding up
    gsap.from(".testimonial-animate-header > *", {
      scrollTrigger: {
        trigger: ".testimonial-animate-header",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate the testimonial cards list
    gsap.from(".testimonial-animate-cards > *", {
      scrollTrigger: {
        trigger: ".testimonial-animate-cards",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 40,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-bg-testimonial lg:py-24 py-16 flex flex-col justify-center overflow-hidden">
      
      {/* Decorative Large Left Quote - Desktop Only */}
      <div className="testimonial-bg-quote absolute top-[90px] left-[137px] w-[292px] h-[310px] text-primary opacity-10 pointer-events-none hidden lg:block select-none font-sans font-semibold text-[350px] leading-none">
        “
      </div>

      {/* Decorative Large Right Quote - Desktop Only */}
      <div className="testimonial-bg-quote absolute top-[-70px] right-[106px] w-[279px] h-[297px] text-primary opacity-10 pointer-events-none hidden lg:block select-none font-sans font-semibold text-[350px] leading-none text-right">
        ”
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-16 flex flex-col items-center z-10">
        
        {/* Heading stack */}
        <div className="testimonial-animate-header flex flex-col items-center text-center gap-6 mb-16">
          <Image
            src="/images/localik.png"
            alt="Localik Logo"
            width={82}
            height={26}
            className="object-contain"
            priority
          />
          <CategoryBadge label="TÉMOIGNAGES" />
          <h2 className="font-sans font-medium text-[32px] md:text-[38px] leading-[1.3] text-text-dark-gray">
            Ce que les gens disent de nous
          </h2>
        </div>

        {/* Testimonials Flex Cards Layout */}
        <div className="testimonial-animate-cards flex flex-col lg:flex-row items-center justify-center gap-10 w-full">
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </div>

      </div>

    </section>
  );
}
