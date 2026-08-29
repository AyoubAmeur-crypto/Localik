"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Button from "@/components/Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function PourquoiNousChoisirPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animation: any;
    let isDestroyed = false;

    import("lottie-web").then((lottieModule) => {
      if (isDestroyed || !lottieRef.current) return;

      // Clean container first to ensure no duplicates
      lottieRef.current.innerHTML = "";

      animation = lottieModule.default.loadAnimation({
        container: lottieRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        path: "/images/Thinking.json?v=" + Date.now(),
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      });
    });

    return () => {
      isDestroyed = true;
      if (animation) {
        animation.destroy();
      }
    };
  }, []);

  useGSAP(
    () => {
      // Hero entrance animations
      gsap.fromTo(
        ".hero-animate",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Stats dashboard trigger
      gsap.fromTo(
        ".stat-box-animate",
        { scale: 0.9, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".stats-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          scale: 1,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.5)",
        }
      );

      // Advantages grid trigger
      gsap.fromTo(
        ".advantage-card-animate",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".advantages-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
        }
      );

      // Testimonials cards trigger
      gsap.fromTo(
        ".testimonial-card-animate",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".testimonials-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      // CTA section trigger
      gsap.fromTo(
        ".cta-element-animate",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    },
    { scope: containerRef }
  );

  const advantages = [
    {
      title: "Meilleur prix garanti",
      desc: "We are committed to offering the most competitive rental prices in the Moroccan market. No hidden booking fees, no bad surprises at handover.",
      icon: (
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
          className="w-6 h-6 transition-colors duration-300"
        >
          <rect width="20" height="12" x="2" y="6" rx="2" />
          <circle cx="12" cy="12" r="2" />
          <path d="M6 12h.01M18 12h.01" />
        </svg>
      ),
    },
    {
      title: "Large choix de véhicules",
      desc: "Whether you need a small economy city car to park downtown, a comfortable sedan for your business trips, or a large 4x4 SUV to travel with family, we have the car you need.",
      icon: (
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
          className="w-6 h-6 transition-colors duration-300"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M13 17H9" />
        </svg>
      ),
    },
    {
      title: "Assistance 24/7 & Proximité",
      desc: "Travel with peace of mind. Our customer service and insurance partners provide you with highly responsive technical assistance in the event of a breakdown or accident, 24/7.",
      icon: (
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
          className="w-6 h-6 transition-colors duration-300"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
    },
    {
      title: "Annulation flexible & gratuite",
      desc: "A last minute change of plans? No problem. Cancel your booking for free up to 48 hours before the start of your rental and get an instant 100% refund.",
      icon: (
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
          className="w-6 h-6 transition-colors duration-300"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      ),
    },
    {
      title: "Transparence & Confiance",
      desc: "All our partner car owners are rigorously evaluated by the community. You can check reviews and ratings left by previous renters before booking.",
      icon: (
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
          className="w-6 h-6 transition-colors duration-300"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      title: "Processus 100% numérique",
      desc: "Say goodbye to long queues at physical agency counters. From search to signing the contract and state inspection, everything is managed online from your smartphone.",
      icon: (
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
          className="w-6 h-6 transition-colors duration-300"
        >
          <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
          <line x1="12" x2="12.01" y1="18" y2="18" />
        </svg>
      ),
    },
  ];

  const stats = [
    { value: "10 000+", label: "Clients satisfaits" },
    { value: "500+", label: "Voitures vérifiées" },
    { value: "30+", label: "Villes couvertes" },
    { value: "4.8/5", label: "Note satisfaction" },
  ];

  const testimonials = [
    {
      quote: "Une expérience fluide du début à la fin. Le propriétaire à Casablanca a été très professionnel, la voiture était propre et dans un état impeccable. Je recommande sans hésiter !",
      author: "Youssef B.",
      role: "Locataire régulier",
      city: "Casablanca",
      stars: 5,
    },
    {
      quote: "C'est la première fois que j'utilise Localik pour mes vacances à Marrakech. Le prix était bien inférieur à celui des agences traditionnelles et le service client a été d'une grande aide.",
      author: "Sofia K.",
      role: "Touriste nationale",
      city: "Marrakech",
      stars: 5,
    },
    {
      quote: "L'état des lieux photo et le contrat numérique sont des outils formidables. Tout est transparent et sécurisé, pas de mauvaises surprises. Je loue désormais exclusivement sur cette plateforme.",
      author: "Karim M.",
      role: "Professionnel de santé",
      city: "Rabat",
      stars: 5,
    },
  ];

  return (
    <main ref={containerRef} className="flex flex-col flex-1 bg-white relative">
      <Navbar />

      {/* Hero Header (Reduced top/bottom padding & removed grid pattern) */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-gradient-to-br from-[#ECF5FF] via-white to-white overflow-hidden border-b border-gray-100">
        {/* Background Visual Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">
          
          {/* Left Column: Text (Aligned Left) */}
          <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-10">
            <h1 className="hero-animate font-sans font-semibold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-dark tracking-tight mb-6">
              Pourquoi choisir <span className="text-primary">Localik</span> pour votre location ?
            </h1>

            <p className="hero-animate font-sans font-normal text-base md:text-lg leading-[27px] text-text-gray mb-10 max-w-[600px]">
              We reinvent car rental in Morocco by putting transparency, fair price and safety at the center of every trip.
            </p>

            <div className="hero-animate">
              <Button label="Découvrir les véhicules" variant="primary" href="/marketplace" />
            </div>
          </div>

          {/* Right Column: Lottie Animation */}
          <div className="hero-animate w-full lg:w-[55%] flex justify-center items-center">
            <div
              ref={lottieRef}
              className="w-full max-w-[500px] lg:max-w-[550px] h-[300px] lg:h-[400px] overflow-hidden select-none pointer-events-none drop-shadow-md"
            />
          </div>

        </div>
      </section>

      {/* Stats Dashboard Section */}
      <section className="stats-section py-12 bg-white relative z-20 -mt-8">
        <div className="w-full max-w-[1120px] mx-auto px-4 md:px-12 lg:px-0">
          <div className="bg-white border border-gray-100 shadow-widget p-8 lg:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-box-animate flex flex-col gap-2">
                <span className="font-sans font-semibold text-3xl md:text-4xl lg:text-[44px] leading-none text-primary">
                  {stat.value}
                </span>
                <span className="font-sans font-medium text-sm md:text-base text-text-medium-gray">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Grid */}
      <section className="advantages-section py-20 lg:py-28 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40">
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <h2 className="font-sans font-medium text-[32px] md:text-[38px] leading-[1.3] text-text-dark-gray mb-4">
              Les avantages exclusifs de Localik
            </h2>
            <p className="font-sans font-normal text-base text-text-medium-gray">
              Une gamme de services pensés pour rendre votre voyage agréable, sécurisé et totalement
              fluide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((adv, idx) => (
              <div
                key={idx}
                className="advantage-card-animate p-8 border border-border-card hover:border-primary transition-all duration-300 bg-white flex flex-col gap-4 text-left group hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-bg-accent-blue text-primary flex items-center justify-center rounded-sm group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  {adv.icon}
                </div>
                <h3 className="font-sans font-medium text-lg text-black mt-2 group-hover:text-primary transition-colors">
                  {adv.title}
                </h3>
                <p className="font-sans font-normal text-sm md:text-base leading-6 text-text-medium-gray">
                  {adv.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials section */}
      <section className="testimonials-section py-20 lg:py-28 bg-[#F7FBFF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-sans font-medium text-[32px] md:text-[38px] leading-[1.3] text-text-dark-gray mb-4">
              Ce que disent nos locataires
            </h2>
            <p className="font-sans font-normal text-base text-text-medium-gray">
              Des milliers de conducteurs nous font confiance. Voici quelques témoignages
              authentiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test, idx) => (
              <div
                key={idx}
                className="testimonial-card-animate bg-white p-8 border border-gray-100 shadow-sm text-left flex flex-col gap-6"
              >
                {/* Rating stars */}
                <div className="flex flex-row items-center gap-1">
                  {[...Array(test.stars)].map((_, starIdx) => (
                    <svg
                      key={starIdx}
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="#EFBF14"
                      stroke="#EFBF14"
                      strokeWidth="2"
                      className="w-[18px] h-[18px]"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>

                <p className="font-sans font-normal text-sm md:text-base leading-7 text-text-quote italic">
                  "{test.quote}"
                </p>

                <hr className="border-gray-100" />

                <div className="flex flex-col">
                  <span className="font-sans font-medium text-base text-text-author">
                    {test.author}
                  </span>
                  <span className="font-sans font-normal text-xs text-text-location mt-0.5">
                    {test.role} ・ {test.city}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section (Navy blue box with white dividers) */}
      <section className="cta-section py-16 lg:py-24 bg-[#051C34] text-white relative overflow-hidden">
        {/* Background visual highlights */}
        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* Logo on Left */}
          <div className="cta-element-animate flex-shrink-0 flex items-center justify-center lg:pr-12">
            <Image
              src="/images/localik.png"
              alt="Localik Logo"
              width={140}
              height={44}
              className="brightness-0 invert opacity-90 hover:opacity-100 transition-all duration-300"
              priority
            />
          </div>

          {/* Vertical white divider line 1 */}
          <div className="cta-element-animate hidden lg:block w-[1px] h-20 bg-white/20 flex-shrink-0" />

          {/* Texts in Middle */}
          <div className="cta-element-animate flex-grow lg:px-12 text-center lg:text-left">
            <h2 className="font-sans font-semibold text-3xl md:text-4xl leading-[1.2] text-white">
              Découvrez une nouvelle façon de louer une voiture au Maroc
            </h2>
            <p className="font-sans font-normal text-base text-text-footer-link/80 mt-2">
              Rejoignez-nous et bénéficiez du meilleur service de location en ligne.
            </p>
          </div>

          {/* Vertical white divider line 2 */}
          <div className="cta-element-animate hidden lg:block w-[1px] h-20 bg-white/20 flex-shrink-0" />

          {/* CTA Button on Right (whitespace-nowrap & flexible width) */}
          <div className="cta-element-animate flex-shrink-0 flex items-center justify-center lg:pl-12 w-full lg:w-auto">
            <Button
              label="Trouver mon véhicule"
              variant="primary"
              href="/marketplace"
              className="bg-primary hover:bg-blue-600 font-sans px-10 py-4 shadow-md w-full lg:w-auto text-center whitespace-nowrap"
            />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      {/* Prevent FOUC by hiding elements initially */}
      <style>{`
        .hero-animate, .stat-box-animate, .advantage-card-animate, .testimonial-card-animate, .cta-element-animate {
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
