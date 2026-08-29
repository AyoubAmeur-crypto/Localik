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

export default function CommentCaMarchePage() {
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
        path: "/images/Study discussion.json?v=" + Date.now(),
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

      // Timeline items scroll entrance
      gsap.fromTo(
        ".timeline-item-animate",
        { y: 50, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".timeline-section",
            start: "top 80%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.2,
          ease: "power3.out",
        }
      );

      // Trust cards scroll entrance
      gsap.fromTo(
        ".trust-card-animate",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".trust-section",
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

      // CTA section scroll entrance
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

  const steps = [
    {
      stepNum: "1",
      title: "Trouvez le véhicule idéal",
      subtitle: "Recherche & Filtres",
      desc: "Indiquez votre ville de départ au Maroc (Casablanca, Marrakech, Rabat, Tanger, Agadir...) ainsi que vos dates et heures de location. Notre moteur de recherche affiche instantanément les voitures disponibles. Utilisez les filtres avancés (prix, type de carburant, boîte de vitesses, marque) pour affiner votre choix.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 transition-colors duration-300"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" x2="16.65" y1="21" y2="16.65" />
          <path d="M8 11h6" />
          <path d="M11 8v6" />
        </svg>
      ),
    },
    {
      stepNum: "2",
      title: "Réservez en toute sécurité",
      subtitle: "Validation & Paiement",
      desc: "Une fois votre véhicule choisi, valisez votre demande de réservation. Après acceptation rapide par le propriétaire (généralement en moins de 2 heures), procédez au paiement en ligne 100% sécurisé via notre plateforme. Vous recevez une confirmation immédiate ainsi que les coordonnées du propriétaire.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 transition-colors duration-300"
        >
          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      stepNum: "3",
      title: "Prenez la route",
      subtitle: "État des lieux & Remise des clés",
      desc: "Retrouvez le propriétaire au lieu convenu (aéroport, gare, ou adresse personnalisée). Ensemble, effectuez un rapide état des lieux photographique du véhicule directement depuis l'application Localik. Signez le contrat de location numérique sur l'écran du smartphone, récupérez les clés, et commencez votre trajet !",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 transition-colors duration-300"
        >
          <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
          <circle cx="7" cy="17" r="2" />
          <circle cx="17" cy="17" r="2" />
          <path d="M13 17H9" />
        </svg>
      ),
    },
    {
      stepNum: "4",
      title: "Restituez en toute sérénité",
      subtitle: "Fin de location & Évaluation",
      desc: "À la fin de votre location, restituez la voiture avec le même niveau de carburant qu'à la prise en main. Effectuez l'état des lieux de retour avec le propriétaire et prenez des photos de contrôle. Validez la fin du trajet sur l'application. Enfin, laissez une note et un avis pour partager votre expérience avec la communauté.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-8 h-8 transition-colors duration-300"
        >
          <path d="M21.5 12H16c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h5.5c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1z" />
          <path d="M12 18H3c-.55 0-1-.45-1-1V5c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v6" />
          <path d="M12 8l-4 4 4 4" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
  ];

  return (
    <main ref={containerRef} className="flex flex-col flex-1 bg-white relative">
      <Navbar />

      {/* Hero Header (Reduced top/bottom padding & removed grid pattern) */}
      <section className="relative pb-16 lg:pt-24 lg:pb-24 bg-gradient-to-br from-[#ECF5FF] via-white to-white overflow-hidden border-b border-gray-100">
        {/* Background Visual Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">

          {/* Left Column: Text (Aligned Left) */}
          <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-22">
            <h1 className="hero-animate font-sans font-semibold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-dark tracking-tight mb-6">
              Comment ça marche sur <span className="text-primary whitespace-nowrap">Localik ?</span>
            </h1>

            <p className="hero-animate font-sans font-normal text-base md:text-lg leading-[27px] text-text-gray mb-10 max-w-[600px]">
              Une expérience 100% digitale, transparente et sécurisée. Louer une voiture n'a
              jamais été aussi simple et intuitif.
            </p>

            <div className="hero-animate">
              <Button label="Louer une voiture" variant="primary" href="/marketplace" />
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

      {/* Visual Timeline Section */}
      <section className="timeline-section py-20 lg:py-28 bg-white">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40">
          <div className="flex flex-col gap-16 lg:gap-24 relative">
            {/* Center line for desktop timeline */}
            <div className="absolute left-[50px] lg:left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-primary via-primary/30 to-primary/10 -translate-x-1/2 hidden md:block" />

            {steps.map((step, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`timeline-item-animate flex flex-col md:flex-row items-start justify-between w-full relative z-10 gap-8 md:gap-16 ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Step content card */}
                  <div className="w-full md:w-[45%] flex flex-col gap-4 text-left p-8 border border-border-card hover:border-primary bg-white shadow-sm hover:shadow-md transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                      {/* Icon container */}
                      <div className="flex-shrink-0 w-14 h-14 bg-bg-accent-blue text-primary rounded-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {step.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-sans font-semibold text-xs text-primary uppercase tracking-wider">
                          {step.subtitle}
                        </span>
                        <h3 className="font-sans font-medium text-xl text-black mt-0.5">
                          {step.title}
                        </h3>
                      </div>
                    </div>
                    <hr className="border-gray-100 my-2" />
                    <p className="font-sans font-normal text-sm md:text-base leading-7 text-text-medium-gray">
                      {step.desc}
                    </p>
                  </div>

                  {/* Timeline Badge (Center Indicator) */}
                  <div className="absolute left-[50px] lg:left-1/2 w-10 h-10 rounded-full bg-primary border-4 border-white shadow-md flex items-center justify-center -translate-x-1/2 z-20 text-white font-sans font-semibold text-sm top-8 hidden md:flex">
                    {step.stepNum}
                  </div>

                  {/* Empty placeholder column to balance flex grid layout */}
                  <div className="w-full md:w-[45%] hidden md:block" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety & Trust Section */}
      <section className="trust-section py-20 lg:py-28 bg-[#F7FBFF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-sans font-medium text-[32px] md:text-[38px] leading-[1.3] text-text-dark-gray mb-4">
              La sécurité au cœur de notre démarche
            </h2>
            <p className="font-sans font-normal text-base text-text-medium-gray">
              Nous mettons tout en œuvre pour vous offrir des trajets en toute sécurité et en toute
              confiance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="trust-card-animate bg-white p-8 border border-gray-100 shadow-sm text-left flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-bg-accent-blue text-primary flex items-center justify-center rounded-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
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
              </div>
              <h3 className="font-sans font-medium text-lg text-black mt-2 group-hover:text-primary transition-colors">
                Paiement 100% Sécurisé
              </h3>
              <p className="font-sans font-normal text-sm leading-6 text-text-medium-gray">
                Vos transactions sont cryptées et protégées via les passerelles de paiement de
                référence au Maroc. Le propriétaire n'est payé qu'une fois la location commencée.
              </p>
            </div>

            {/* Card 2 */}
            <div className="trust-card-animate bg-white p-8 border border-gray-100 shadow-sm text-left flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-bg-accent-blue text-primary flex items-center justify-center rounded-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
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
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </div>
              <h3 className="font-sans font-medium text-lg text-black mt-2 group-hover:text-primary transition-colors">
                Véhicules & Propriétaires Vérifiés
              </h3>
              <p className="font-sans font-normal text-sm leading-6 text-text-medium-gray">
                Chaque profil de propriétaire et chaque document de véhicule (carte grise,
                assurance, contrôle technique) sont minutieusement vérifiés avant d'être mis en
                ligne.
              </p>
            </div>

            {/* Card 3 */}
            <div className="trust-card-animate bg-white p-8 border border-gray-100 shadow-sm text-left flex flex-col gap-4 group hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-bg-accent-blue text-primary flex items-center justify-center rounded-sm group-hover:bg-primary group-hover:text-white transition-all duration-300">
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
              </div>
              <h3 className="font-sans font-medium text-lg text-black mt-2 group-hover:text-primary transition-colors">
                Assistance 24h/24 & 7j/7
              </h3>
              <p className="font-sans font-normal text-sm leading-6 text-text-medium-gray">
                Une assistance technique de premier ordre vous accompagne en cas de panne,
                d'imprévu ou de litige, pour que vous ne soyez jamais seul sur la route.
              </p>
            </div>
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
              Prêt à planifier votre prochain voyage ?
            </h2>
            <p className="font-sans font-normal text-base text-text-footer-link/80 mt-2">
              Trouvez les meilleures offres de location de voitures au Maroc, sans frais cachés.
            </p>
          </div>

          {/* Vertical white divider line 2 */}
          <div className="cta-element-animate hidden lg:block w-[1px] h-20 bg-white/20 flex-shrink-0" />

          {/* CTA Button on Right (whitespace-nowrap & flexible width) */}
          <div className="cta-element-animate flex-shrink-0 flex items-center justify-center lg:pl-12 w-full lg:w-auto">
            <Button
              label="Voir les voitures disponibles"
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
        .hero-animate, .timeline-item-animate, .trust-card-animate, .cta-element-animate {
          opacity: 0;
        }
      `}</style>
    </main>
  );
}