"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
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

interface FAQItem {
  question: string;
  answer: string;
}

export default function DevenirLocatairePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

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

      // Prerequisites cards scroll entrance
      gsap.fromTo(
        ".prereq-card-animate",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".prereq-section",
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

      // Steps list scroll entrance
      gsap.fromTo(
        ".step-card-animate",
        { y: 40, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".steps-section",
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

      // FAQ section scroll entrance
      gsap.fromTo(
        ".faq-animate",
        { y: 30, opacity: 0 },
        {
          scrollTrigger: {
            trigger: ".faq-section",
            start: "top 85%",
            toggleActions: "play none none none",
          },
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // CTA section elements scroll entrance
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

  const prerequisites = [
    {
      title: "Âge minimum requis",
      desc: "Avoir au moins 21 ans pour les véhicules des catégories standard. Pour les véhicules haut de gamme et SUV de luxe, un âge minimum de 25 ans est exigé.",
    },
    {
      title: "Permis de conduire valide",
      desc: "Être titulaire d'un permis de conduire en cours de validité depuis plus de 2 ans. Les permis étrangers sont acceptés s'ils sont rédigés en caractères latins ou accompagnés d'un permis international.",
    },
    {
      title: "Documents d'identité officiels",
      desc: "Présenter une carte nationale d'identité marocaine (CNIE) ou un passeport en cours de validité. Une copie de votre justificatif de domicile récent sera également demandée.",
    },
    {
      title: "Dépôt de garantie (Caution)",
      desc: "Disposer d'une carte bancaire (Visa, Mastercard, etc.) au nom du conducteur principal pour le blocage de la caution. Le montant dépend de la catégorie du véhicule choisi.",
    },
  ];

  const steps = [
    {
      num: "01",
      title: "Inscription & Profil",
      desc: "Créez votre compte gratuitement sur Localik en quelques clics. Renseignez vos informations et chargez vos documents (permis, pièce d'identité) pour une validation rapide par nos équipes.",
    },
    {
      num: "02",
      title: "Recherche du véhicule",
      desc: "Explorez notre marketplace. Filtrez par ville, dates de location, catégorie de voiture et options pour trouver le véhicule idéal correspondant à votre budget et à vos besoins.",
    },
    {
      num: "03",
      title: "Réservation sécurisée",
      desc: "Effectuez votre demande de réservation. Une fois validée par le propriétaire, procédez au paiement en ligne sécurisé pour bloquer définitivement le véhicule pour votre séjour.",
    },
    {
      num: "04",
      title: "Prise en main & Trajet",
      desc: "Retrouvez le propriétaire au point de rendez-vous convenu. Réalisez l'état des lieux d'entrée sur l'application, signez le contrat de location numérique, récupérez les clés et prenez la route !",
    },
  ];

  const faqs: FAQItem[] = [
    {
      question: "Quels sont les documents obligatoires lors du retrait du véhicule ?",
      answer: "Lors du retrait, vous devez impérativement présenter l'original de votre permis de conduire en cours de validité (physique, pas de photo), votre pièce d'identité (CNIE ou passeport) et la carte bancaire ayant servi à la caution. Le propriétaire est en droit de refuser la location si ces documents ne sont pas présentés.",
    },
    {
      question: "Comment fonctionne le dépôt de garantie (la caution) ?",
      answer: "La caution est bloquée sous forme de pré-autorisation bancaire sur votre carte lors de la signature du contrat. Elle n'est pas débitée de votre compte, mais nécessite un plafond suffisant. Elle est libérée automatiquement après la restitution du véhicule s'il n'y a aucun dommage ou frais supplémentaire (carburant, kilométrage dépassé).",
    },
    {
      question: "Puis-je annuler ma réservation et être remboursé ?",
      answer: "Oui, vous pouvez annuler votre réservation. L'annulation est gratuite jusqu'à 48 heures avant le début prévu de la location, avec un remboursement intégral à 100 %. Pour les annulations effectuées moins de 48 heures à l'avance, des frais de dossier peuvent s'appliquer conformément à nos conditions générales.",
    },
    {
      question: "Qui paye le carburant pendant la location ?",
      answer: "Le carburant est à la charge du locataire. La règle générale est de restituer le véhicule avec le même niveau de carburant qu'à la prise en main. Si vous restituez la voiture avec moins de carburant, la différence vous sera facturée au tarif en vigueur plus des frais de service.",
    },
    {
      question: "Que faire en cas d'accident ou de panne avec la voiture ?",
      answer: "En cas de problème, Localik met à votre disposition une assistance technique disponible 24h/24 et 7j/7. En cas d'accident, sécurisez les passagers, contactez les autorités pour établir un constat à l'amiable et prévenez immédiatement notre service client ainsi que le propriétaire.",
    },
  ];

  return (
    <main ref={containerRef} className="flex flex-col flex-1 bg-white relative">
      <Navbar />

      {/* Hero Section (Spacing matching comment-ca-marche, plain white bg) */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 bg-white overflow-hidden border-b border-gray-100">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-30 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20 relative z-10">
          
          {/* Left Column: Text (Aligned Left) */}
          <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left mt-8 lg:mt-22">
            <h1 className="hero-animate font-sans font-semibold text-4xl md:text-5xl lg:text-[56px] leading-[1.1] text-dark tracking-tight mb-6">
              Devenez locataire sur <span className="text-primary">Localik</span>
            </h1>

            <p className="hero-animate font-sans font-normal text-base md:text-lg leading-[27px] text-text-gray mb-10 max-w-[600px]">
              Rejoignez la plus grande communauté de location de voitures au Maroc.
              <br/> Louez des
              véhicules vérifiés auprès de propriétaires de confiance en toute simplicité.
            </p>

            <div className="hero-animate flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
              <Button
                label="Trouver une voiture"
                variant="primary"
                href="/marketplace"
                className="w-full sm:w-auto"
              />
              <Link
                href="#conditions"
                className="w-full sm:w-auto border border-primary text-primary hover:bg-primary-light rounded-button py-4 px-8 font-sans font-medium transition-all text-center justify-center inline-flex items-center"
              >
                Voir les conditions
              </Link>
            </div>
          </div>

          {/* Right Column: Premium Realistic Car & Typographic Backdrop */}
          <div className="hero-animate w-full lg:w-[50%] hidden lg:flex justify-center items-center relative h-[380px] md:h-[420px] overflow-visible">
            {/* Layer 1: Giant Typographic Backdrop */}
            <div className="absolute top-10 md:top-5 font-sans font-black text-[139px] md:text-[150px] lg:text-[140px] text-gray-100 select-none z-0 tracking-tighter leading-none text-start">
              DEVENEZ<br/>LOCATAIRE
            </div>
            
            {/* Layer 2: Glowing Blue Spot */}

            {/* Layer 3: Realistic Car PNG */}
            <Image
              src="/images/trocv2.png"
              alt="Devenir Locataire Localik"
              width={700}
              height={500}
              className="z-20 relative mt-auto w-full max-w-[680px] lg:max-w-[680px] h-auto object-contain select-none pointer-events-none drop-shadow-[0_20px_40px_rgba(21,114,211,0.18)] translate-y-[15px]"
              priority
            />
          </div>

        </div>
      </section>

      {/* Conditions / Prerequisites Section */}
      <section
        id="conditions"
        className="prereq-section py-20 lg:py-28 bg-white border-b border-gray-100"
      >
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40">
          <div className="text-center max-w-[700px] mx-auto mb-16">
            <h2 className="font-sans font-medium text-[32px] md:text-[38px] leading-[1.3] text-text-dark-gray mb-4">
              Les conditions requises pour louer
            </h2>
            <p className="font-sans font-normal text-base text-text-medium-gray">
              Pour assurer la sécurité et la sérénité de notre communauté,
               chaque locataire doit
              remplir les critères d'éligibilité suivants avant son premier trajet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {prerequisites.map((item, idx) => (
              <div
                key={idx}
                className="prereq-card-animate flex flex-col md:flex-row gap-6 p-8 border border-border-card hover:border-primary transition-all duration-300 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-sm bg-bg-accent-blue text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
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
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-sans font-medium text-xl text-black group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-sans font-normal text-sm md:text-base leading-6 text-text-medium-gray">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works stepped process */}
      <section className="steps-section py-20 lg:py-28 bg-[#F7FBFF]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40">
          <div className="text-center max-w-[700px] mx-auto mb-20">
            <h2 className="font-sans font-medium text-[32px] md:text-[38px] leading-[1.3] text-text-dark-gray mb-4">
              Comment commencer votre première location ?
            </h2>
            <p className="font-sans font-normal text-base text-text-medium-gray">
              Une démarche simplifiée de bout en bout pour vous permettre de prendre le volant le
              plus rapidement possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className="step-card-animate flex flex-col gap-6 p-8 bg-white border border-gray-100 shadow-sm relative group hover:-translate-y-2 transition-all duration-300"
              >
                <div className="font-sans font-semibold text-[44px] leading-none text-primary/20 group-hover:text-primary transition-colors">
                  {step.num}
                </div>
                <h3 className="font-sans font-medium text-lg text-black">
                  {step.title}
                </h3>
                <p className="font-sans font-normal text-sm leading-6 text-text-medium-gray">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section py-20 lg:py-28 bg-white">
        <div className="w-full max-w-[900px] mx-auto px-4 md:px-12 faq-animate">
          <div className="text-center mb-16">
            <h2 className="font-sans font-medium text-[32px] md:text-[38px] leading-[1.3] text-text-dark-gray mb-4">
              Questions Fréquentes
            </h2>
            <p className="font-sans font-normal text-base text-text-medium-gray">
              Toutes les réponses à vos questions concernant la location de voiture sur Localik.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-border-card overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors focus:outline-none"
                  >
                    <span className="font-sans font-medium text-base md:text-lg text-black pr-4">
                      {faq.question}
                    </span>
                    <span
                      className={`transform transition-transform duration-300 text-primary ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
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
                        className="w-5 h-5"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      isOpen ? "max-h-[500px] border-t border-gray-100" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 bg-gray-50 text-[#555] font-sans font-normal text-sm md:text-base leading-7">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section (Navy blue box with white dividers) */}
      <section className="cta-section py-10 md:py-12 lg:py-16 bg-[#051C34] text-white relative overflow-hidden">
        {/* Background visual highlights */}
        <div className="absolute top-[-50%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 md:gap-6 lg:gap-8">
          
          {/* Logo on Left */}
          <div className="cta-element-animate flex-shrink-0 flex items-center justify-center lg:pr-8">
            <Image
              src="/images/localik.png"
              alt="Localik Logo"
              width={110}
              height={35}
              className="w-24 md:w-28 h-auto brightness-0 invert opacity-90 hover:opacity-100 transition-all duration-300"
              priority
            />
          </div>

          {/* Vertical white divider line 1 */}
          <div className="cta-element-animate hidden lg:block w-[1px] h-12 bg-white/20 flex-shrink-0" />

          {/* Texts in Middle */}
          <div className="cta-element-animate flex-grow lg:px-8 text-center lg:text-left">
            <h2 className="font-sans font-semibold text-xl md:text-2xl lg:text-3xl leading-[1.2] text-white">
              Trouvez la voiture idéale pour votre prochain déplacement
            </h2>
            <p className="font-sans font-normal text-xs md:text-sm text-text-footer-link/80 mt-1">
              Des centaines de voitures disponibles à Casablanca, Marrakech, Rabat, Tanger et partout au Maroc.
            </p>
          </div>

          {/* Vertical white divider line 2 */}
          <div className="cta-element-animate hidden lg:block w-[1px] h-12 bg-white/20 flex-shrink-0" />

          {/* CTA Button on Right */}
          <div className="cta-element-animate flex-shrink-0 flex items-center justify-center lg:pl-8 w-full lg:w-auto">
            <Button
              label="Découvrir les offres"
              variant="primary"
              href="/marketplace"
              className="bg-primary hover:bg-blue-600 font-sans px-6 py-3 lg:px-8 lg:py-3.5 shadow-md w-full lg:w-auto text-center whitespace-nowrap"
            />
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />

      {/* Prevent FOUC by hiding elements initially */}
      <style>{`
        .hero-animate, .prereq-card-animate, .step-card-animate, .faq-animate, .cta-element-animate {
          opacity: 0;
        }
      `}</style>
    </main>
  );
}
