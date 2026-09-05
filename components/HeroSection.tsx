"use client";

import { useRef } from "react";
import Image from "next/image";
import Button from "./Button";
import SearchWidget from "./SearchWidget";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Staggered slide up & fade in for text column elements
    gsap.fromTo(".hero-animate-text > *", 
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        delay: 0.2,
      }
    );

    // Elegant reveal from right with subtle scaling for the car image
    gsap.fromTo(".hero-animate-car",
      { x: 80, opacity: 0, scale: 0.96 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.4,
      }
    );

    // Floating Search Widget slides up after text and car elements load
    gsap.fromTo(".hero-animate-widget",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.6,
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white overflow-x-clip overflow-y-visible lg:h-[800px] xl:h-[830px] 2xl:h-[860px] min-h-[860px] lg:min-h-0 z-30">
      
      {/* Decorative Background Blob - Desktop Only */}
      <div className="absolute top-[-33px] right-[-150px] xl:right-[-50px] 2xl:right-auto 2xl:left-[866px] w-[600px] xl:w-[720px] 2xl:w-[803px] h-[866px] opacity-[0.13] pointer-events-none hidden lg:block">
        <Image
          src="/images/bg-blob.svg"
          alt=""
          width={803}
          height={866}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Main Responsive Wrapper */}
      <div className="relative w-full max-w-[1440px] mx-auto h-full px-4 md:px-12 lg:px-8 xl:px-12 2xl:px-0 py-8 lg:py-0">
        
        {/* Responsive Content Container - pt-24 md:pt-28 to push it down below the floating glass navbar on mobile */}
        <div className="flex flex-col items-center gap-12 pt-24 md:pt-28 lg:pt-0 mt-0 lg:block">
          
          {/* Left Text Block */}
          <div className="hero-animate-text flex flex-col gap-6 xl:gap-8 2xl:gap-10 max-w-[480px] w-full text-center lg:text-left items-center lg:items-start lg:absolute lg:top-[130px] xl:top-[145px] 2xl:top-[160px] lg:left-8 xl:left-12 2xl:left-[160px] lg:w-[440px] xl:w-[470px] 2xl:w-[480px] z-10">
            <h1 className="font-sans font-semibold text-[48px] md:text-[54px] lg:text-[42px] xl:text-[50px] 2xl:text-[60px] leading-[1.1] md:leading-[1.1] lg:leading-[48px] xl:leading-[56px] 2xl:leading-[66px] text-dark tracking-tight">
              Trouvez, réservez et louez <br />
              <span className="relative inline-block text-primary whitespace-nowrap mt-1 lg:mt-0">
                Facilement
                <span className="absolute left-0 bottom-[-8px] w-full h-[15px] pointer-events-none">
                  <Image
                    src="/images/hero-highlight.svg"
                    alt=""
                    width={134}
                    height={48}
                    className="w-full h-full object-contain"
                    priority
                  />
                </span>
              </span>
            </h1>

            <p className="font-sans font-normal text-base md:text-lg leading-[27px] text-desc-gray">
              Trouvez et louez la voiture idéale pour vos déplacements au Maroc, directement en ligne et en toute simplicité.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
              <Button label="Louer maintenant" variant="primary" href="/marketplace" className="w-full sm:w-auto text-center" />
              <Button label="Voir les voitures" variant="link" href="/marketplace" className="w-full sm:w-auto border border-primary text-primary hover:bg-primary-light rounded-button py-4 px-8 font-sans font-medium transition-all text-center justify-center" />
            </div>
          </div>

          {/* Right Car Image Block */}
          <div className="hero-animate-car relative w-full max-w-[650px] md:max-w-[600px] lg:max-w-none lg:w-[580px] lg:h-[370px] xl:w-[700px] xl:h-[440px] 2xl:w-[848px] 2xl:h-[537px] lg:absolute lg:top-[150px] xl:top-[165px] 2xl:top-[182px] lg:right-0 xl:right-4 2xl:right-auto 2xl:left-[649px] pointer-events-none flex justify-center items-center">
            <Image
              src="/images/touareg.png"
              alt="Rentcar Header Graphic"
              width={1048}
              height={537}
              className="w-full h-auto lg:w-full lg:h-full object-contain"
              priority
            />
          </div>

        </div>

        {/* Floating Search Widget */}
        <div className="hero-animate-widget relative mt-12 lg:mt-0 lg:absolute lg:top-[670px] xl:top-[700px] 2xl:top-[740px] lg:left-8 lg:right-8 xl:left-12 xl:right-12 2xl:left-[160px] 2xl:right-auto 2xl:w-[1120px] max-w-[1120px] mx-auto 2xl:mx-0 z-40 bg-white rounded-widget shadow-widget border border-gray-100 p-6 md:p-8 lg:py-3 lg:pr-3 lg:pl-6 xl:pl-8 min-h-[72px] w-full">
          <SearchWidget />
        </div>

      </div>

      {/* Prevent GSAP visual snap/flash (FOUC) by hiding elements initially */}
      <style>{`
        .hero-animate-text > *, .hero-animate-car, .hero-animate-widget {
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
