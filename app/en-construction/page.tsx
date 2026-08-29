"use client";

import { useRef } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Button from "@/components/Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function EnConstructionPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Smooth animated entrance for branding elements
      const tl = gsap.timeline();
      
      tl.fromTo(
        ".construction-animate-fade",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Pulse animation for the gear image container
      gsap.to(".gear-pulse", {
        scale: 1.05,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <main ref={containerRef} className="flex flex-col min-h-screen bg-white relative">
      <Navbar />

      {/* Main Content Section */}
      <section className="relative flex-grow flex items-center justify-center pt-32 pb-16 lg:pt-40 lg:pb-24 bg-gradient-to-br from-[#ECF5FF] via-white to-white overflow-hidden">
        {/* Background Visual Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 flex flex-col items-center justify-center relative z-10 text-center">
          {/* Card Container with glassmorphism */}
          <div className="construction-animate-fade w-full max-w-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-widget p-8 md:p-12 flex flex-col items-center gap-8">
            
            {/* Localik Logo */}
            <div className="construction-animate-fade flex justify-center">
              <Image
                src="/images/localik.png"
                alt="Localik Logo"
                width={120}
                height={38}
                className="h-auto select-none pointer-events-none"
                priority
              />
            </div>

            {/* Gear animation */}
            <div className="construction-animate-fade gear-pulse w-36 h-36 relative flex items-center justify-center">
              <Image
                src="/images/Gear how it works.svg"
                alt="Working on it"
                fill
                className="w-full h-full object-contain select-none pointer-events-none"
                priority
              />
            </div>

            {/* Branded Message */}
            <div className="flex flex-col gap-4 max-w-lg">
              <h1 className="construction-animate-fade font-sans font-semibold text-3xl md:text-4xl text-dark tracking-tight leading-tight">
                Page en cours de <span className="text-primary">construction</span>
              </h1>
              
              <p className="construction-animate-fade font-sans font-normal text-base md:text-lg leading-relaxed text-text-gray">
                Nous travaillons activement sur cette fonctionnalité pour vous offrir une expérience de location de voiture exceptionnelle. Cette page sera disponible très prochainement.
              </p>
            </div>

            {/* Button Link Back to Home */}
            <div className="construction-animate-fade mt-2">
              <Button label="Retourner à l'accueil" variant="primary" href="/" className="px-8 py-4 font-sans text-base" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      {/* Prevent FOUC by hiding elements initially */}
      <style>{`
        .construction-animate-fade {
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
