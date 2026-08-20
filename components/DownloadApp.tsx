"use client";

import { useRef } from "react";
import CategoryBadge from "./CategoryBadge";
import AppBadge from "./AppBadge";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DownloadApp() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate the text block elements sliding up
    gsap.from(".download-animate-text > *", {
      scrollTrigger: {
        trigger: ".download-animate-text",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate the phone mockup rising and rotating slightly
    gsap.from(".download-animate-phone", {
      scrollTrigger: {
        trigger: ".download-animate-phone",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 100,
      rotation: 6,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white lg:h-[650px] min-h-[600px] flex flex-col justify-center py-16 lg:py-0 overflow-hidden">
      
      {/* Background Decorative Vector Blob */}
      <div className="absolute top-[-93px] left-[-244px] w-[893px] h-[684px] pointer-events-none opacity-[0.08] text-primary">
        <svg
          viewBox="0 0 893 684"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M100 200C300 100 500 50 650 150C800 250 900 450 850 550C800 650 600 700 450 650C300 600 100 500 50 350C0 200 100 200 100 200Z" />
        </svg>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-0 h-full flex flex-col lg:flex-row items-center justify-between">
        
        {/* Left Side: Info Column */}
        <div className="download-animate-text flex flex-col gap-10 max-w-[500px] w-full text-center lg:text-left items-center lg:items-start lg:absolute lg:top-[100px] lg:left-[160px] z-10">
          
          {/* Badge & Title */}
          <div className="flex flex-col items-center lg:items-start gap-6 w-full">
            <CategoryBadge label="TÉLÉCHARGER" />
            <h2 className="font-sans font-semibold text-[36px] md:text-[44px] lg:text-[48px] leading-[1.2] text-[#282828]">
              Téléchargez l&apos;application Localik <span className="text-primary">GRATUITEMENT</span>
            </h2>
          </div>

          {/* Description */}
          <p className="font-sans font-normal text-base md:text-lg leading-[1.5] text-[#3E3E3E]">
            Pour des réservations plus rapides, plus faciles et des offres exclusives.
          </p>

          {/* App store links row */}
          <div className="flex flex-row items-center gap-4">
            <AppBadge store="ios" href="#" width={175} height={52} className="rounded-[10px]" />
            <AppBadge store="android" href="#" width={175} height={52} className="rounded-[10px]" />
          </div>

        </div>

        {/* Right Side: Interactive CSS Phone Mockup */}
        <div className="download-animate-phone relative lg:absolute lg:top-[50px] lg:left-[839px] flex justify-center items-center mt-12 lg:mt-0 select-none pointer-events-none lg:pointer-events-auto">
          
          {/* Shadow container */}
          <div className="relative w-[320px] h-[640px] rounded-[48px] shadow-2xl p-[10px] bg-black border-4 border-slate-800 flex items-center justify-center transition-transform duration-300 hover:scale-105 hover:rotate-2">
            
            {/* Dynamic Island Notch */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[110px] h-[30px] bg-black rounded-full z-30 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800"></div>
              <div className="w-4 h-1 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            {/* Screen Content Viewport */}
            <div className="relative w-full h-full rounded-[38px] bg-slate-900 overflow-hidden flex flex-col justify-between p-5 text-white">
              
              {/* Header inside phone */}
              <div className="flex flex-row justify-between items-center mt-6">
                <span className="font-sans font-semibold text-xs text-primary">LOCALIK</span>
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
              </div>

              {/* Promo inside phone */}
              <div className="flex flex-col gap-2 mt-4 text-left">
                <span className="font-sans font-bold text-lg leading-tight text-white">
                  Explorez les meilleures offres au monde
                </span>
                <span className="font-sans font-normal text-[10px] text-slate-400">
                  Remises exclusives sur l&apos;application aujourd&apos;hui
                </span>
              </div>

              {/* Audi R8 Promo Card inside phone */}
              <div className="w-full bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 flex flex-col gap-3 my-4">
                <div className="relative w-full h-[100px] flex items-center justify-center">
                  <Image
                    src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=400"
                    alt="Audi R8 phone promo"
                    width={200}
                    height={100}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-row justify-between items-center">
                  <div className="flex flex-col text-left">
                    <span className="font-sans font-medium text-xs text-white">Audi R8 Coupe</span>
                    <span className="font-sans text-[10px] text-amber-400">★ 4.8</span>
                  </div>
                  <span className="font-sans font-semibold text-xs text-primary">$2,100/d</span>
                </div>
              </div>

              {/* Bottom Nav inside phone */}
              <div className="w-full h-10 bg-primary rounded-xl flex items-center justify-center text-xs font-semibold text-white cursor-pointer hover:bg-blue-600 transition-colors">
                Réserver
              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
