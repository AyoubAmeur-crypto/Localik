"use client";

import { useState, useEffect, useRef } from "react";
import BrandLogo from "./BrandLogo";
import NavLink from "./NavLink";
import Button from "./Button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navCardRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once on mount to handle pre-scrolled refreshes
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Entrance animation for the Navbar
  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        y: -80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.1,
      });
    },
    { scope: containerRef }
  );

  // No scroll morph animation needed - using simple and performant CSS transitions instead

  // Mobile menu opening animation
  useGSAP(
    () => {
      if (mobileMenuOpen && mobileMenuRef.current) {
        gsap.fromTo(
          mobileMenuRef.current,
          {
            opacity: 0,
            y: -15,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.2)", // bouncy organic entry
          }
        );
      }
    },
    { dependencies: [mobileMenuOpen], scope: containerRef }
  );

  return (
    <header
      ref={containerRef}
      className="fixed top-0 left-0 right-0 w-full z-50 flex justify-center pointer-events-none pt-4 lg:pt-4 px-4 md:px-12 lg:px-0"
    >
      <div
        ref={navCardRef}
        className={`pointer-events-auto relative w-full max-w-[1320px] flex flex-row items-center justify-between transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] py-4 px-8 border ${
          scrolled
            ? "bg-white border-gray-100 shadow-md rounded-xl scale-[0.98] lg:scale-100"
            : "bg-transparent border-transparent shadow-none rounded-none scale-100"
        }`}
      >
        <BrandLogo />

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex flex-row items-center gap-10">
          <NavLink label="Devenir locataire" href="#" />
          <NavLink label="Offres de location" href="#" />
          <NavLink label="Comment ça marche" href="#" />
          <NavLink label="Pourquoi nous choisir" href="#" />
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex flex-row items-center gap-6">
          <Button
            label="Espace Propriétaire"
            variant="primary"
            size="md"
            href="#"
            className="px-6 py-3 text-sm font-sans"
          />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-text-gray hover:text-primary focus:outline-none cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="absolute top-[calc(100%+12px)] left-0 right-0 bg-white/92 backdrop-blur-2xl shadow-widget rounded-widget p-6 flex flex-col gap-6 z-40 border border-white/40 lg:hidden"
          >
            <nav className="flex flex-col gap-4">
              <NavLink label="Devenir locataire" href="#" />
              <NavLink label="Offres de location" href="#" />
              <NavLink label="Comment ça marche" href="#" />
              <NavLink label="Pourquoi nous choisir" href="#" />
            </nav>
            <hr className="border-border-gray/30" />
            <div className="flex flex-col gap-4">
              <Button
                label="Espace Propriétaire"
                variant="primary"
                size="md"
                href="#"
                className="w-full py-3"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
