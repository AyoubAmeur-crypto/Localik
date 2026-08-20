"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { User, Phone, MapPin, Calendar, Car, Send, ChevronDown, Search, X } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const cities = ["Casablanca", "Marrakech", "Fès", "Rabat", "Tanger", "Agadir", "Sefrou"];

const cars = [
  {
    id: "dacia-sandero",
    name: "Dacia Sandero Stepway",
    price: 250,
    imageSrc: "/images/1.png",
  },
  {
    id: "renault-clio-gray",
    name: "Renault Clio",
    price: 300,
    imageSrc: "/images/2.png",
  },
  {
    id: "vw-troc",
    name: "Volkswagen T-Roc",
    price: 450,
    imageSrc: "/images/3.png",
  },
  {
    id: "renault-clio-blue",
    name: "Renault Clio Esprit Alpine",
    price: 380,
    imageSrc: "/images/4.png",
  },
  {
    id: "hyundai-tucson",
    name: "Hyundai Tucson",
    price: 550,
    imageSrc: "/images/5.png",
  },
];

export default function ContactFormSection() {
  const containerRef = useRef<HTMLElement>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("Casablanca");
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedCarId, setSelectedCarId] = useState("dacia-sandero");

  // Popover toggle states
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCarOpen, setIsCarOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  // Date picker states
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Default: +1 day
  );

  // Monitor clicks outside all popovers to close them
  const calendarRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setIsStartDateOpen(false);
        setIsEndDateOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(target)) {
        setIsLocationOpen(false);
      }
      if (carRef.current && !carRef.current.contains(target)) {
        setIsCarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Allow only digits
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  // Format dates for input button display
  const formatDateDisplay = (date: Date | null, placeholder: string) => {
    if (!date) return placeholder;
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const activeCar = cars.find((c) => c.id === selectedCarId);
  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Veuillez saisir votre nom complet.");
      return;
    }
    if (phone.length !== 10) {
      alert("Le numéro de téléphone doit comporter exactement 10 chiffres (ex: 0612345678).");
      return;
    }
    if (!startDate || !endDate) {
      alert("Veuillez sélectionner vos dates de réservation.");
      return;
    }

    const startStr = formatDateDisplay(startDate, "");
    const endStr = formatDateDisplay(endDate, "");
    const selectedCarName = activeCar ? activeCar.name : selectedCarId;
    const selectedCarPrice = activeCar ? `${activeCar.price} DH/jour` : "";

    // Build the template WhatsApp message
    const message = `Bonjour Localik,\n\nJe souhaite effectuer une réservation :\n- *Nom complet* : ${name}\n- *Téléphone* : ${phone}\n- *Lieu* : ${selectedLocation}\n- *Véhicule* : ${selectedCarName} (${selectedCarPrice})\n- *Période* : du ${startStr} au ${endStr}`;

    const whatsappUrl = `https://wa.me/212770566628?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  useGSAP(() => {
    // Animate the banner sliding up
    gsap.from(".contact-animate-banner", {
      scrollTrigger: {
        trigger: ".contact-animate-banner",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 35,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    });

    // Fade in form card
    gsap.from(".contact-animate-form", {
      scrollTrigger: {
        trigger: ".contact-animate-form",
        start: "top 85%",
        toggleActions: "play none none none",
      },
      y: 40,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full bg-white flex flex-col justify-between overflow-x-clip overflow-y-visible border-t border-gray-100 z-30">
      
      {/* Top Panel: Branding Banner (Dark Blue - Full Width) */}
      <div className="contact-animate-banner w-full bg-[#051C34] text-white py-16 px-6 sm:px-12 lg:py-20 lg:px-24 relative overflow-hidden flex flex-col items-center text-center">
        {/* Background Accent Graphics */}
        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] rounded-full bg-primary/10 pointer-events-none"></div>
        <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] rounded-full bg-primary/10 pointer-events-none"></div>

        <div className="flex flex-col items-center gap-6 relative z-10 w-full max-w-[1000px]">
          <Image
            src="/images/localik.png"
            alt="Localik Logo"
            width={142}
            height={28}
            className="brightness-0 invert object-contain"
            priority
          />
          
          <div className="flex flex-col gap-3">
            <h3 className="font-sans font-semibold text-2xl lg:text-3xl leading-tight text-white">
              Réservation Directe WhatsApp
            </h3>
            <p className="font-sans font-normal text-sm lg:text-base leading-relaxed text-[#D6D6D6] max-w-2xl mx-auto">
              Sélectionnez vos critères, renseignez vos coordonnées et soumettez votre demande instantanément. Votre conseiller vous répondra immédiatement sur WhatsApp.
            </p>
          </div>

          {/* Horizontal USP Bullet list */}
          <ul className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-10 mt-6 w-full text-center">
            <li className="flex items-center gap-2.5 font-sans text-sm text-[#E2E8F0] justify-center">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/25 text-primary font-bold text-xs flex-shrink-0">✓</span>
              Aucun paiement en ligne requis
            </li>
            <li className="flex items-center gap-2.5 font-sans text-sm text-[#E2E8F0] justify-center">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/25 text-primary font-bold text-xs flex-shrink-0">✓</span>
              Annulation gratuite à tout moment
            </li>
            <li className="flex items-center gap-2.5 font-sans text-sm text-[#E2E8F0] justify-center">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/25 text-primary font-bold text-xs flex-shrink-0">✓</span>
              Livraison à domicile et aéroport
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Panel: Interactive Contact & Booking Form (Full Width Container, centered content) */}
      <form
        onSubmit={handleFormSubmit}
        className="contact-animate-form w-full bg-white py-16 px-6 sm:px-12 lg:py-20 lg:px-24 flex flex-col items-center justify-center border-t border-gray-100"
      >
        <div className="w-full max-w-[1000px] flex flex-col gap-6 text-left">
          
          {/* Main Form Title */}
          <div className="flex flex-col gap-1.5 mb-2 text-center items-center">
            <span className="font-sans font-medium text-xs text-primary uppercase tracking-wider">Demande Rapide</span>
            <h3 className="font-sans font-semibold text-2xl text-dark">Réservez votre véhicule</h3>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
            
            {/* Field 1: Nom Complet */}
            <div className="flex flex-col gap-2 w-full">
              <label className="font-sans font-semibold text-xs text-dark uppercase tracking-wider">Nom Complet</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  placeholder="Ex: Ayoub Ameur"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans text-dark placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Field 2: Téléphone */}
            <div className="flex flex-col gap-2 w-full">
              <div className="flex items-center justify-between">
                <label className="font-sans font-semibold text-xs text-dark uppercase tracking-wider">N° de Téléphone</label>
                <span className="text-[10px] font-sans text-gray-400 font-medium">{phone.length}/10 chiffres</span>
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  required
                  placeholder="Ex: 0612345678"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-sans text-dark placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Field 3: Lieu de prise en charge (Custom Premium Dropdown) */}
            <div className="flex flex-col gap-2 w-full relative" ref={locationRef}>
              <label className="font-sans font-semibold text-xs text-dark uppercase tracking-wider">Lieu de prise en charge</label>
              <button
                type="button"
                onClick={() => {
                  setIsLocationOpen(!isLocationOpen);
                  setIsCarOpen(false);
                  setIsStartDateOpen(false);
                  setIsEndDateOpen(false);
                }}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-dark text-left text-sm font-sans flex items-center justify-between transition-all ${
                  isLocationOpen ? "border-primary bg-white shadow-sm" : "border-gray-200 hover:bg-gray-100/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-sans font-medium">{selectedLocation} (Maroc)</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              {isLocationOpen && (
                <div className="absolute left-0 mt-2 top-[100%] w-full bg-white rounded-xl shadow-widget border border-gray-150 z-50 p-3 flex flex-col gap-2 transform origin-top transition-all duration-200">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Rechercher une ville..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-sans text-dark placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                      autoFocus
                    />
                    {locationSearch && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setLocationSearch("");
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="max-h-[160px] overflow-y-auto flex flex-col gap-0.5 pr-1 custom-scrollbar">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => {
                            setSelectedLocation(city);
                            setIsLocationOpen(false);
                            setLocationSearch("");
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-sans rounded-lg transition-all flex justify-between items-center ${
                            selectedLocation === city
                              ? "bg-primary-light text-primary font-medium"
                              : "text-dark hover:bg-gray-50"
                          }`}
                        >
                          <span>{city}</span>
                          {selectedLocation === city && (
                            <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded-md font-semibold">Actif</span>
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-gray-400 font-sans">Aucune ville trouvée</div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Field 4: Véhicule (Custom Premium Dropdown) */}
            <div className="flex flex-col gap-2 w-full relative" ref={carRef}>
              <label className="font-sans font-semibold text-xs text-dark uppercase tracking-wider">Véhicule souhaité</label>
              <button
                type="button"
                onClick={() => {
                  setIsCarOpen(!isCarOpen);
                  setIsLocationOpen(false);
                  setIsStartDateOpen(false);
                  setIsEndDateOpen(false);
                }}
                className={`w-full bg-gray-50 border rounded-xl px-4 py-3 text-dark text-left text-sm font-sans flex items-center justify-between transition-all ${
                  isCarOpen ? "border-primary bg-white shadow-sm" : "border-gray-200 hover:bg-gray-100/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Car className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-sans font-medium">{activeCar ? activeCar.name : "Choisir un véhicule"}</span>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </button>

              {isCarOpen && (
                <div className="absolute left-0 mt-2 top-[100%] w-full bg-white rounded-xl shadow-widget border border-gray-150 z-50 p-2 flex flex-col gap-1 max-h-[220px] overflow-y-auto custom-scrollbar transform origin-top transition-all duration-200">
                  {cars.map((car) => (
                    <button
                      key={car.id}
                      type="button"
                      onClick={() => {
                        setSelectedCarId(car.id);
                        setIsCarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-sans rounded-lg transition-all flex items-center justify-between ${
                        selectedCarId === car.id
                          ? "bg-primary-light text-primary font-medium"
                          : "text-dark hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-6 relative bg-white border border-gray-100 rounded p-0.5 flex items-center justify-center flex-shrink-0">
                          <Image src={car.imageSrc} alt={car.name} width={36} height={20} className="object-contain" />
                        </div>
                        <span>{car.name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-medium">{car.price} DH/j</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Interactive Selected Car Preview Panel */}
          {activeCar && (
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-gray-50/50 border border-gray-200/50 p-4 rounded-2xl w-full">
              <div className="relative w-full sm:w-28 h-20 sm:h-14 bg-white rounded-xl border border-gray-250 p-1 flex items-center justify-center flex-shrink-0 select-none">
                <Image
                  src={activeCar.imageSrc}
                  alt={activeCar.name}
                  width={90}
                  height={55}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-left flex-grow">
                <span className="font-sans font-semibold text-sm text-dark">{activeCar.name}</span>
                <span className="font-sans text-xs text-gray-500 mt-0.5">Catégorie Compacte / Économique</span>
              </div>
              <div className="text-right sm:border-l sm:border-gray-200 sm:pl-6 w-full sm:w-auto mt-2 sm:mt-0 flex sm:flex-col justify-between items-baseline sm:items-end">
                <span className="font-sans text-xs text-gray-400">Tarif estimé</span>
                <span className="font-sans font-semibold text-base text-primary whitespace-nowrap mt-0.5">{activeCar.price} DH / jour</span>
              </div>
            </div>
          )}

          {/* Field 5: Rental Period Date Selector Card (Hotel Style split view with separate DatePickers) */}
          <div className="flex flex-col gap-2 w-full relative" ref={calendarRef}>
            <label className="font-sans font-semibold text-xs text-dark uppercase tracking-wider">Période de Location</label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {/* Departure Input Card */}
              <div className="relative">
                <div
                  onClick={() => {
                    setIsStartDateOpen(!isStartDateOpen);
                    setIsEndDateOpen(false);
                    setIsLocationOpen(false);
                    setIsCarOpen(false);
                  }}
                  className={`flex flex-row items-center gap-4 cursor-pointer p-3 bg-gray-50 border rounded-xl hover:bg-gray-100/50 transition-all ${
                    isStartDateOpen ? "border-primary bg-white shadow-sm" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-light text-primary flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sans font-semibold text-[10px] text-gray-400 uppercase tracking-wider leading-none">Date de départ</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-sans font-semibold text-xs text-dark leading-none">
                        {formatDateDisplay(startDate, "Choisir")}
                      </span>
                      <span className="text-[9px] font-sans text-gray-400 bg-gray-200/50 px-1 py-0.5 rounded leading-none">09:00</span>
                    </div>
                  </div>
                </div>

                {/* Departure Picker Popover */}
                {isStartDateOpen && (
                  <div className="absolute left-0 mt-2 bottom-[105%] lg:bottom-auto lg:top-[100%] bg-white rounded-2xl border border-gray-200/80 shadow-widget z-50 p-4 flex flex-col items-center transform origin-top transition-all duration-200">
                    <div className="flex items-center justify-between w-full border-b border-gray-100 pb-3 mb-3">
                      <span className="font-sans font-semibold text-xs text-dark uppercase tracking-wider">
                        Date de départ
                      </span>
                    </div>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => {
                        setStartDate(date);
                        setIsStartDateOpen(false);
                        setIsEndDateOpen(true);
                        // Ensure end date is at least start date + 1 day
                        if (date) {
                          const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                          if (!endDate || endDate < nextDay) {
                            setEndDate(nextDay);
                          }
                        }
                      }}
                      inline
                      minDate={new Date()}
                      disabledKeyboardNavigation
                    />
                  </div>
                )}
              </div>

              {/* Return Input Card */}
              <div className="relative">
                <div
                  onClick={() => {
                    setIsEndDateOpen(!isEndDateOpen);
                    setIsStartDateOpen(false);
                    setIsLocationOpen(false);
                    setIsCarOpen(false);
                  }}
                  className={`flex flex-row items-center gap-4 cursor-pointer p-3 bg-gray-50 border rounded-xl hover:bg-gray-100/50 transition-all ${
                    isEndDateOpen ? "border-primary bg-white shadow-sm" : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-light text-primary flex-shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-sans font-semibold text-[10px] text-gray-400 uppercase tracking-wider leading-none">Date de retour</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="font-sans font-semibold text-xs text-dark leading-none">
                        {formatDateDisplay(endDate, "Choisir")}
                      </span>
                      <span className="text-[9px] font-sans text-gray-400 bg-gray-200/50 px-1 py-0.5 rounded leading-none">18:00</span>
                    </div>
                  </div>
                </div>

                {/* Return Picker Popover */}
                {isEndDateOpen && (
                  <div className="absolute left-0 lg:left-auto lg:right-0 mt-2 bottom-[105%] lg:bottom-auto lg:top-[100%] bg-white rounded-2xl border border-gray-200/80 shadow-widget z-50 p-4 flex flex-col items-center transform origin-top transition-all duration-200">
                    <div className="flex items-center justify-between w-full border-b border-gray-100 pb-3 mb-3">
                      <span className="font-sans font-semibold text-xs text-dark uppercase tracking-wider">
                        Date de retour
                      </span>
                    </div>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => {
                        setEndDate(date);
                        setIsEndDateOpen(false);
                      }}
                      inline
                      minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                      disabledKeyboardNavigation
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Direct WhatsApp Submit Button */}
          <button
            type="submit"
            className="w-full mt-4 h-12 bg-primary hover:bg-blue-600 text-white rounded-xl font-sans font-semibold text-sm flex items-center justify-center gap-2 shadow-button active:scale-[0.98] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4 text-white" />
            Soumettre la demande sur WhatsApp
          </button>

        </div>
      </form>
    </section>
  );
}
