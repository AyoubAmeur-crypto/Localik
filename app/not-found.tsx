import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Button from "@/components/Button";

export default function NotFound() {
  return (
    <main className="flex flex-col min-h-screen bg-white relative">
      <Navbar />

      <section className="flex-grow pt-32 pb-20 lg:pt-40 lg:pb-28 flex items-center justify-center border-b border-gray-100 overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-12 lg:px-40 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Left Column: Text Content */}
          <div className="w-full lg:w-[55%] flex flex-col items-center lg:items-start text-center lg:text-left">
            
            <h1 className="font-sans font-semibold text-3xl md:text-5xl lg:text-[56px] leading-[1.1] text-dark tracking-tight mb-6">
              Oups ! Vous avez <span className="text-primary">fait fausse route</span>
            </h1>

            <p className="font-sans font-normal text-base md:text-lg leading-[27px] text-text-gray mb-10 max-w-[540px]">
              La page ou le véhicule que vous recherchez n'existe pas ou a été déplacé. Pas d'inquiétude, Localik vous aide à retrouver votre chemin et à reprendre la route en toute sérénité.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center lg:justify-start">
              <Button
                label="Retourner à l'accueil"
                variant="primary"
                href="/"
                className="w-full sm:w-auto"
              />
              <Link
                href="/marketplace"
                className="w-full sm:w-auto border border-primary text-primary hover:bg-primary-light rounded-button py-4 px-8 font-sans font-medium transition-all text-center justify-center inline-flex items-center"
              >
                Explorer les offres
              </Link>
            </div>
          </div>

          {/* Right Column: Typographic "404" Map Pin Graphic */}
          <div className="w-full lg:w-[45%] flex justify-center items-center">
            <svg
              className="w-full max-w-[380px] md:max-w-[420px] h-auto select-none"
              viewBox="0 0 500 350"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Soft background shadow beneath the pin */}
              <ellipse cx="250" cy="245" rx="35" ry="8" fill="#1572D3" fillOpacity="0.1" />
              
              {/* Digit "4" (Left) */}
              <text
                x="60"
                y="235"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="800"
                fontSize="210"
                fill="#242424"
                letterSpacing="-6"
              >
                4
              </text>
              
              {/* Digit "4" (Right) */}
              <text
                x="315"
                y="235"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontWeight="800"
                fontSize="210"
                fill="#242424"
                letterSpacing="-6"
              >
                4
              </text>

              {/* Minimalist Map Location Pin representing the "0" (Middle) */}
              <g transform="translate(250, 135)">
                <path
                  d="M0 -75C-38.6 -75 -70 -43.6 -70 -5C-70 42.5 0 90 0 90C0 90 70 42.5 70 -5C70 -43.6 38.6 -75 0 -75Z"
                  fill="#1572D3"
                />
                {/* Inner white circle */}
                <circle cx="0" cy="-5" r="22" fill="white" />
                {/* Inner blue dot */}
                <circle cx="0" cy="-5" r="10" fill="#1572D3" />
              </g>
            </svg>
          </div>

        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
