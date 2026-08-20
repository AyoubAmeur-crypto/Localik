"use client";

import { useRef } from "react";
import Image from "next/image";
import CategoryBadge from "./CategoryBadge";
import CarCard, { CarCardProps } from "./CarCard";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const popularCars: (CarCardProps & { id: string })[] = [
  {
    id: "dacia-sandero",
    name: "Dacia Sandero Stepway",
    rating: 4.5,
    reviews: 120,
    passengers: 5,
    transmission: "Manuelle",
    airConditioning: true,
    doors: 5,
    price: 250,
    imageSrc: "/images/1.png",
    isAvailable: true,
  },
  {
    id: "renault-clio-gray",
    name: "Renault Clio",
    rating: 4.7,
    reviews: 340,
    passengers: 5,
    transmission: "Manuelle",
    airConditioning: true,
    doors: 5,
    price: 300,
    imageSrc: "/images/2.png",
    isAvailable: true,
  },
  {
    id: "vw-troc",
    name: "Volkswagen T-Roc",
    rating: 4.8,
    reviews: 210,
    passengers: 5,
    transmission: "Automatique",
    airConditioning: true,
    doors: 5,
    price: 450,
    imageSrc: "/images/3.png",
    isAvailable: true,
  },
  {
    id: "renault-clio-blue",
    name: "Renault Clio Esprit Alpine",
    rating: 4.8,
    reviews: 95,
    passengers: 5,
    transmission: "Automatique",
    airConditioning: true,
    doors: 5,
    price: 380,
    imageSrc: "/images/4.png",
    isAvailable: false,
  },
  {
    id: "hyundai-tucson",
    name: "Hyundai Tucson",
    rating: 4.9,
    reviews: 410,
    passengers: 5,
    transmission: "Automatique",
    airConditioning: true,
    doors: 5,
    price: 550,
    imageSrc: "/images/5.png",
    isAvailable: true,
  },
];

export default function PopularDeals() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Animate the header text sliding up
    gsap.from(".popular-animate-header > *", {
      scrollTrigger: {
        trigger: ".popular-animate-header",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 35,
      opacity: 0,
      stagger: 0.15,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate the car cards list staggering in
    gsap.from(".popular-animate-cards > *", {
      scrollTrigger: {
        trigger: ".popular-animate-cards",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 40,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: "power3.out",
    });

    // Animate the CTA button fading in
    gsap.from(".popular-animate-btn", {
      scrollTrigger: {
        trigger: ".popular-animate-btn",
        start: "top 92%",
        toggleActions: "play none none none",
      },
      scale: 0.95,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white lg:py-24 py-16 flex flex-col justify-center overflow-hidden">
      <div className="relative w-full max-w-[1440px] mx-auto px-4 md:px-8 lg:px-12 xl:px-16 2xl:px-[16px] flex flex-col items-center">
        
        {/* Title stack block */}
        <div className="popular-animate-header flex flex-col items-center text-center gap-6 mb-16">
          <Image
            src="/images/localik.png"
            alt="Localik Logo"
            width={82}
            height={26}
            className="object-contain"
            priority
          />
          <CategoryBadge label="OFFRES DE LOCATION POPULAIRES" />
          <h2 className="font-sans font-medium text-[32px] md:text-[36px] lg:text-[38px] leading-[1.3] text-text-dark-gray max-w-[600px]">
            Offres de location de voitures les plus populaires
          </h2>
        </div>

        {/* Responsive Cards Layout */}
        <div className="popular-animate-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 justify-items-center items-stretch gap-6 xl:gap-8 w-full mb-16">
          {popularCars.map((car, index) => (
            <div
              key={car.id}
              className={`w-full flex justify-center ${
                index === popularCars.length - 1
                  ? "sm:col-span-2 sm:justify-self-center lg:col-span-1 lg:justify-self-auto xl:col-span-1 xl:justify-self-auto"
                  : ""
              }`}
            >
              <CarCard {...car} />
            </div>
          ))}
        </div>

        {/* Show all vehicles outline button */}
        <button className="popular-animate-btn flex flex-row items-center justify-center gap-2 h-12 w-[216px] rounded-lg border border-border-card text-[#4E4E4E] hover:text-black hover:border-gray-400 hover:bg-gray-50 active:scale-95 transition-all font-sans font-medium text-sm leading-[17px] cursor-pointer">
          <span>Voir tous les véhicules</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <line x1="5" x2="19" y1="12" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

      </div>
    </section>
  );
}
