"use client";

import { useRef } from "react";
import Image from "next/image";
import CategoryBadge from "./CategoryBadge";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LocationSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate the header text sliding up
    gsap.from(".location-animate-header > *", {
      scrollTrigger: {
        trigger: ".location-animate-header",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate the map container rising
    gsap.from(".location-animate-map", {
      scrollTrigger: {
        trigger: ".location-animate-map",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 50,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white lg:pt-8 pt-6 flex flex-col justify-center overflow-hidden">
      <div className="relative w-full flex flex-col items-center">
        
        {/* Centered header content */}
        <div className="location-animate-header flex flex-col items-center text-center gap-6  px-4">
          <Image
            src="/images/localik.png"
            alt="Localik Logo"
            width={82}
            height={26}
            className="object-contain"
            priority
          />
          <CategoryBadge label="NOTRE LOCALISATION" />
          <h2 className="font-sans font-medium text-[32px] md:text-[36px] lg:text-[38px] leading-[1.3] text-text-dark-gray mb-10">
            Où nous trouver ? 
          </h2>
        </div>

        {/* Full-width Map Container */}
        <div className="location-animate-map w-full h-[450px] md:h-[500px] relative border-y border-gray-100 shadow-inner overflow-hidden">
          <iframe
            src="https://maps.google.com/maps?q=Casablanca,%20Morocco&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps Location - Casablanca"
          />
        </div>

      </div>
    </section>
  );
}
