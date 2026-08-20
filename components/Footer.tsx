"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface FooterColumnProps {
  title: string;
  links: string[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-8 w-full md:w-auto text-left">
      <h3 className="font-sans font-medium text-base leading-6 text-white uppercase tracking-wider">
        {title}
      </h3>
      <ul className="flex flex-col gap-4">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              href="#"
              className="font-sans font-normal text-sm leading-[21px] text-[#D6D6D6] hover:text-primary transition-colors duration-200"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Elegant fade in for the footer grid
    gsap.from(".footer-animate-content", {
      scrollTrigger: {
        trigger: ".footer-animate-content",
        start: "top 90%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 20,
      duration: 1.2,
      ease: "power2.out",
    });
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="w-full bg-[#051C34] py-16 lg:py-20 text-white overflow-hidden">
      <div className="footer-animate-content w-full max-w-[1440px] mx-auto px-4 md:px-[160px] flex flex-col gap-12">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 items-start w-full">
          
          {/* Logo & Info column */}
          <div className="flex flex-col gap-8 lg:col-span-1 text-left">
            
            {/* Logo */}
            <div className="flex flex-row items-center gap-2">
              <Image
                src="/images/localik.png"
                alt="Localik Logo"
                width={82}
                height={26}
                className="brightness-0 invert"
                priority
              />
            </div>

            {/* Contacts */}
            <div className="flex flex-col gap-6">
              {/* Address */}
              <div className="flex flex-row items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-footer-link w-5 h-5 mt-0.5 flex-shrink-0"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="font-sans font-normal text-sm leading-[21px] text-[#D6D6D6] max-w-[200px]">
                  142 Boulevard Massira Khadra, Maarif, 20390 Casablanca, Maroc
                </span>
              </div>

              {/* Call */}
              <div className="flex flex-row items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-footer-link w-5 h-5 flex-shrink-0"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <span className="font-sans font-normal text-sm leading-[21px] text-[#D6D6D6]">
                  +212 770 566 628
                </span>
              </div>

              {/* SMS */}
              <div className="flex flex-row items-center gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-footer-link w-5 h-5 flex-shrink-0"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <span className="font-sans font-normal text-sm leading-[21px] text-[#D6D6D6]">
                  contact@localik.ma
                </span>
              </div>
            </div>

          </div>

          {/* Links columns */}
          <FooterColumn
            title="Notre Produit"
            links={["Carrières", "Voitures", "Formules", "Fonctionnalités", "Tarifs"]}
          />
          
          <FooterColumn
            title="Ressources"
            links={["Téléchargements", "Centre d'aide", "Guides", "Réseau partenaires", "Croisières", "Développeurs"]}
          />
          
          <FooterColumn
            title="À propos de Localik"
            links={["Pourquoi nous choisir", "Notre histoire", "Relations investisseurs", "Espace presse", "Publicité"]}
          />

          {/* Follow us column */}
          <div className="flex flex-col gap-8 text-left">
            <h3 className="font-sans font-medium text-base leading-6 text-white uppercase tracking-wider">
              Suivez-nous
            </h3>
            <div className="flex flex-row items-center gap-4">
              <Link href="#" aria-label="Facebook">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#D6D6D6] w-5 h-5 hover:text-primary transition-colors cursor-pointer"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>
              <Link href="#" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#D6D6D6] w-5 h-5 hover:text-primary transition-colors cursor-pointer"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </Link>
              <Link href="#" aria-label="Youtube">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#D6D6D6] w-5 h-5 hover:text-primary transition-colors cursor-pointer"
                >
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                  <polygon points="10 15 15 12 10 9" />
                </svg>
              </Link>
            </div>
          </div>

        </div>

        {/* Divider copyright bar */}
        <div className="flex flex-col gap-6 w-full mt-8">
          <hr className="w-full border-t border-border-footer-divider" />
          <div className="flex flex-col md:flex-row justify-between items-center w-full gap-4 text-center md:text-left">
            <span className="font-sans font-normal text-xs leading-[18px] text-[#D6D6D6]">
              Copyright 2026 ・ Localik, Tous droits réservés
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
