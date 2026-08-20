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

interface FeatureItemProps {
  icon: "wallet" | "user-tick" | "support" | "messages";
  title: string;
  description: string;
}

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  const renderIcon = () => {
    switch (icon) {
      case "wallet":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary w-6 h-6"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <line x1="2" x2="22" y1="10" y2="10" />
            <path d="M16 14h.01" />
          </svg>
        );
      case "user-tick":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary w-6 h-6"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <polyline points="16 11 18 13 22 9" />
          </svg>
        );
      case "support":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary w-6 h-6"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" x2="12" y1="22.08" y2="12" />
          </svg>
        );
      case "messages":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary w-6 h-6"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-row items-center gap-6 w-full text-left">
      <div className="flex-shrink-0 w-16 h-16 rounded-icon-container bg-bg-accent-blue flex items-center justify-center">
        {renderIcon()}
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="font-sans font-medium text-xl leading-[30px] text-black">
          {title}
        </h3>
        <p className="font-sans font-normal text-base leading-6 text-text-medium-gray max-w-[420px]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function WhyChooseUs() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate the car image sliding in from left with smooth reveal
    gsap.from(".why-animate-car", {
      scrollTrigger: {
        trigger: ".why-animate-car",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      x: -80,
      opacity: 0,
      scale: 0.96,
      duration: 1.2,
      ease: "power3.out",
    });

    // Animate the text block titles sliding up
    gsap.from(".why-animate-header > *", {
      scrollTrigger: {
        trigger: ".why-animate-header",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate the features list elements staggering in
    gsap.from(".why-animate-features > *", {
      scrollTrigger: {
        trigger: ".why-animate-features",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 30,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white lg:h-[900px] min-h-[800px] lg:min-h-0 flex flex-col justify-center py-16 lg:px-40 lg:py-0 overflow-hidden ">

      {/* Decorative Left Vector - Desktop Only */}
      <div className="absolute top-[100px] left-[-200px] w-[650px] h-[650px] pointer-events-none hidden lg:block select-none opacity-60 z-0">
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <circle cx="50" cy="50" r="50" fill="rgba(15, 125, 242, 0.1)" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-0 h-full flex flex-col lg:flex-row items-center justify-between">

        {/* Left Side: Overlapping Car Image */}
        <div className="why-animate-car relative w-full max-w-[750px] lg:max-w-none lg:w-[950px] lg:h-[480px] lg:absolute lg:top-[160px] lg:left-[-220px] pointer-events-none flex justify-center items-center order-2 lg:order-1 mt-12 lg:mt-0 z-10">
          <Image
            src="/images/trocv2.png"
            alt="Volkswagen T-Roc graphic"
            width={1013}
            height={659}
            className="w-full h-auto lg:w-full lg:h-full object-contain"
            priority
          />
        </div>

        {/* Right Side: Text details and features list */}
        <div className="flex flex-col gap-5 max-w-[576px] w-full text-center lg:text-left items-center lg:items-start lg:absolute lg:top-[92px] lg:left-[733px] z-10 order-1 lg:order-2">

          {/* Header titles */}
          <div className="why-animate-header flex flex-col items-center lg:items-start gap-[32px] w-full">
            <CategoryBadge label="POURQUOI NOUS CHOISIR" />
            <h2 className="font-sans font-medium text-[32px] md:text-[36px] lg:text-[38px] leading-[1.3] text-text-dark-gray max-w-[480px]">
              Nous offrons la meilleure expérience avec nos offres de location
            </h2>
          </div>

          {/* Features grid */}
          <div className="why-animate-features flex flex-col gap-10 w-full mt-4">
            <FeatureItem
              icon="wallet"
              title="Meilleur prix garanti"
              description="Vous trouvez moins cher ailleurs ? Nous vous remboursons 100 % de la différence."
            />
            <FeatureItem
              icon="user-tick"
              title="Chauffeurs expérimentés"
              description="Vous n'avez pas de chauffeur ? Ne vous inquiétez pas, nous avons des chauffeurs expérimentés pour vous."
            />
            <FeatureItem
              icon="support"
              title="Livraison de voiture 24h/24"
              description="Réservez votre voiture à tout moment et nous vous la livrerons directement."
            />
            <FeatureItem
              icon="messages"
              title="Assistance technique 24h/24 et 7j/7"
              description="Une question ? Contactez le support Localik à tout moment en cas de problème."
            />
          </div>

        </div>

      </div>
    </section>
  );
}
