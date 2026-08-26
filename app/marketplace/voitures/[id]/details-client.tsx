"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Phone,
  MapPin,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  Settings,
  Snowflake,
  DoorClosed,
  Activity,
  CheckCircle,
  Globe,
  Share2,
  Star,
  ShieldCheck,
  BadgeCheck,
  X,
} from "lucide-react";
import { createBookingAction } from "@/lib/db-actions";
import { toast, Toaster } from "react-hot-toast";
import CarCard from "@/components/CarCard";

const MoroccoMap = dynamic(() => import("@/components/MoroccoMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400 animate-pulse">
      Chargement de la carte...
    </div>
  ),
});

interface CarType {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  passengers: number;
  transmission: string;
  airConditioning: boolean;
  doors: number;
  price: number;
  imageSrc: string;
  isAvailable: boolean;
  location: string;
  description: string;
  images: string[];
  fuelType: string;
  fiscalPower: number;
}

interface CarDetailsClientProps {
  car: CarType;
  suggestedCars?: CarType[];
}

const CITIES = ["Casablanca", "Marrakech", "Fes", "Rabat", "Tangier", "Agadir", "Sefrou"];

function LocalikPromoRail({ onBook }: { onBook: () => void }) {
  return (
    <aside
      aria-label="Les avantages Localik"
      className="hidden xl:flex min-w-0 flex-col"
    >
      <div className="sticky top-20 flex flex-col gap-5">
        <Link
          href="/marketplace"
          aria-label="Découvrir toutes les voitures Localik"
          className="relative h-[360px] overflow-hidden border border-blue-300/20 bg-gradient-to-b from-[#1572D3] via-[#0B4BB3] to-[#051C34] shadow-sm"
        >
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[26px] border-white/10" />
          <div className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 text-[8px] font-extrabold uppercase tracking-[0.16em] text-blue-100">
            <Image
              src="/images/localik.png"
              alt="Localik"
              width={84}
              height={34}
              className="h-4 w-auto object-contain brightness-0 invert"
            />
            <span>Select</span>
          </div>
          <div className="absolute inset-x-2 top-14 h-32">
            <Image
              src="/images/touareg.png"
              alt=""
              fill
              sizes="(min-width: 1536px) 220px, 200px"
              className="object-contain drop-shadow-2xl"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-white">
            <div>
              <h2 className="text-lg font-black leading-tight">
                Le bon véhicule, au juste prix.
              </h2>
              <p className="mt-2 text-[11px] font-medium leading-relaxed text-blue-100">
                Comparez les offres vérifiées près de chez vous.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
              Voir toutes les voitures
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </Link>

        <div className="relative overflow-hidden border border-white/10 bg-[#051C34] p-5 text-white shadow-sm">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-2xl" />
          <div className="relative flex flex-col gap-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-blue-400/20 bg-blue-400/10 text-blue-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Image
                  src="/images/localik.png"
                  alt="Localik"
                  width={84}
                  height={34}
                  className="h-4 w-auto object-contain brightness-0 invert"
                />
                <span className="text-[8px] font-extrabold uppercase tracking-[0.16em] text-blue-400">La garantie</span>
              </div>
              <h2 className="mt-2 text-base font-black leading-snug">
                Votre location, en toute sérénité.
              </h2>
            </div>
            <div className="flex flex-col gap-3 text-[10px] font-bold text-slate-300">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                Véhicules et loueurs vérifiés
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                Tarifs clairs et transparents
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                Assistance clientèle 24h/7
              </span>
            </div>
            <button
              type="button"
              onClick={onBook}
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg shadow-primary/20 transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#051C34]"
            >
              Réserver ce véhicule
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function CarDetailsClient({ car, suggestedCars = [] }: CarDetailsClientProps) {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  // Booking Form State
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [pickupLocation, setPickupLocation] = useState(car.location);
  const [locationSearch, setLocationSearch] = useState("");

  // Date states
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(new Date().getTime() + 24 * 60 * 60 * 1000) // Default: +1 day
  );

  // Popover toggles
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showWebsiteModal, setShowWebsiteModal] = useState(false);

  // Description collapse state
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  // Drawer open state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Refs for click outside
  const locationRef = useRef<HTMLDivElement>(null);
  const startCalRef = useRef<HTMLDivElement>(null);
  const endCalRef = useRef<HTMLDivElement>(null);

  // Image gallery state
  const allImages = [car.imageSrc, ...(car.images || [])];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex];
  const [isHoveringImage, setIsHoveringImage] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (locationRef.current && !locationRef.current.contains(target)) {
        setIsLocationOpen(false);
      }
      if (startCalRef.current && !startCalRef.current.contains(target)) {
        setIsStartDateOpen(false);
      }
      if (endCalRef.current && !endCalRef.current.contains(target)) {
        setIsEndDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setClientPhone(value);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();
  const totalPrice = car.price * rentalDays;

  const displayDays = mounted ? rentalDays : 1;
  const displayPrice = mounted ? totalPrice : car.price;

  const formatDateDisplay = (date: Date | null, placeholder: string) => {
    if (!date) return placeholder;
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const displayStartDate = mounted ? formatDateDisplay(startDate, "À choisir") : "Départ";
  const displayEndDate = mounted ? formatDateDisplay(endDate, "À choisir") : "Retour";
  const drawerStartDate = mounted ? formatDateDisplay(startDate, "Départ") : "Départ";
  const drawerEndDate = mounted ? formatDateDisplay(endDate, "Retour") : "Retour";

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i > 0 ? i - 1 : allImages.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((i) => (i < allImages.length - 1 ? i + 1 : 0));
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Le lien de cette voiture a été copié.");
    } catch {
      toast.error("Impossible de partager ce véhicule pour le moment.");
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent, type: "whatsapp" | "website") => {
    if (e) e.preventDefault();

    if (!clientName.trim()) {
      toast.error("Veuillez saisir votre nom complet.");
      return;
    }
    if (clientPhone.length !== 10) {
      toast.error("Le numéro de téléphone doit comporter exactement 10 chiffres.");
      return;
    }
    if (!startDate || !endDate) {
      toast.error("Veuillez sélectionner vos dates de location.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await createBookingAction({
        carId: car.id,
        clientName,
        clientPhone,
        pickupLocation,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice,
      });

      if (res.success) {
        if (type === "whatsapp") {
          toast.success("Demande enregistrée! Redirection vers WhatsApp...");

          const startStr = formatDateDisplay(startDate, "");
          const endStr = formatDateDisplay(endDate, "");
          const message = `Bonjour Localik,\n\nJe souhaite effectuer une réservation :\n- *Nom complet* : ${clientName}\n- *Téléphone* : ${clientPhone}\n- *Lieu* : ${pickupLocation}\n- *Véhicule* : ${car.name} (${car.price} DH/j)\n- *Période* : du ${startStr} au ${endStr}\n- *Durée* : ${rentalDays} jour(s)\n- *Total* : ${totalPrice} DH`;

          const whatsappUrl = `https://wa.me/212770566628?text=${encodeURIComponent(message)}`;

          setTimeout(() => {
            window.open(whatsappUrl, "_blank");
            router.push("/marketplace");
          }, 1500);
        } else {
          setShowWebsiteModal(true);
        }
      } else {
        toast.error(res.error || "Erreur lors de la réservation.");
      }
    } catch {
      toast.error("Une erreur est survenue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCities = CITIES.filter((city) =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const specs = [
    { icon: Users, label: "Passagers", value: `${car.passengers} places` },
    { icon: Settings, label: "Boîte", value: car.transmission },
    { icon: Snowflake, label: "Climatisation", value: car.airConditioning ? "Oui" : "Non" },
    { icon: DoorClosed, label: "Portes", value: `${car.doors} portes` },
    { icon: Activity, label: "Carburant", value: car.fuelType },
    { icon: Settings, label: "Puissance", value: `${car.fiscalPower} CV` },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#F7F8FA] pb-24 lg:pb-0">
      <Toaster position="bottom-right" />

      <section
        aria-label="Localik, la location de voiture pensée pour le Maroc"
        className="relative h-[190px] w-full overflow-hidden border-b border-white/10 bg-[#0B4BB3] sm:h-[230px]"
        >
          <div className="relative mx-auto flex h-full w-full max-w-[1536px] items-center px-5 sm:px-8 lg:px-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[48%] top-1/2 h-[260px] w-[260px] -translate-y-1/2 rounded-full border-[38px] border-white/[0.055] sm:h-[360px] sm:w-[360px] sm:border-[50px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-[58%] top-1/2 h-[150px] w-[150px] -translate-y-1/2 rounded-full border border-white/10 sm:h-[220px] sm:w-[220px]"
            />
            <div className="relative z-10 max-w-lg text-white">
            <Image
              src="/images/localik.png"
              alt="Localik"
              width={112}
              height={45}
              preload
              className="h-7 w-auto object-contain brightness-0 invert sm:h-8"
            />
            <h2 className="mt-3 text-2xl font-black leading-[1.08] tracking-[-0.03em] sm:text-4xl">
              Votre route. Votre rythme.
            </h2>
            <p className="mt-3 max-w-sm text-[11px] font-medium leading-relaxed text-blue-100 sm:text-sm">
              Des voitures vérifiées, des prix clairs et une équipe proche de vous.
            </p>
          </div>
            <div className="pointer-events-none absolute -bottom-16 -right-10 z-0 w-[360px] opacity-35 sm:-bottom-24 sm:right-2 sm:w-[500px] sm:opacity-75 lg:right-12 lg:w-[560px] lg:opacity-90">
              <Image
              src="/images/troc.png"
              alt="Volkswagen T-Roc disponible à la location avec Localik"
              width={800}
              height={500}
              sizes="(min-width: 1024px) 560px, (min-width: 640px) 500px, 360px"
                className="h-auto w-full object-contain"
              />
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-[42%] right-0 z-[1] bg-gradient-to-r from-[#0B4BB3] via-[#0B4BB3]/15 to-[#061F3F]/25 hidden sm:block"
            />
          </div>
      </section>

      {/* Floating Back button */}
      <div className="mx-auto w-full max-w-[1536px] px-4 pt-5 sm:px-6 lg:px-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm transition-all hover:scale-[1.01] hover:bg-gray-100 hover:text-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux véhicules</span>
        </Link>
      </div>

      {/* Responsive layout: promo rail, vehicle details, and trust information */}
      <div className="relative mx-auto grid w-full max-w-[1536px] grid-cols-1 items-start gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8 xl:grid-cols-[200px_minmax(0,1fr)_320px] 2xl:grid-cols-[220px_minmax(0,1fr)_340px]">

        <LocalikPromoRail onBook={() => setIsDrawerOpen(true)} />
        
        {/* MAIN COLUMN: Vehicle details */}
        <section className="flex min-w-0 w-full flex-col gap-6 text-left">
          
          {/* 1. Gallery Section */}
          <div
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
            className="relative flex h-[320px] w-full select-none flex-col gap-4 overflow-hidden border border-gray-200 bg-white p-4 shadow-sm sm:h-[420px] md:h-[480px]"
          >
            <div className="relative flex w-full flex-grow items-center justify-center overflow-hidden border border-gray-100/50 bg-gray-50/50 p-4">
              <img
                src={activeImage}
                alt={car.name}
                className="max-h-full max-w-full object-contain"
              />
              {allImages.length > 1 && isHoveringImage && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full border border-gray-200 shadow-md hover:scale-105 transition-all z-20 cursor-pointer flex items-center justify-center animate-none"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-855 rounded-full border border-gray-200 shadow-md hover:scale-105 transition-all z-20 cursor-pointer flex items-center justify-center animate-none"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail horizontal strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 custom-scrollbar justify-start w-full flex-shrink-0">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`relative flex h-12 w-16 flex-shrink-0 cursor-pointer items-center justify-center rounded-md border bg-gray-50/50 p-0.5 transition-all ${
                      activeIndex === i ? "border-primary ring-1 ring-primary/10 bg-white" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Human-first vehicle summary */}
          <div className="border-y border-gray-200 py-5 sm:py-6">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-primary">
                    <BadgeCheck className="h-3.5 w-3.5" />
                    Localik Select
                  </span>
                  <span className="h-3 w-px bg-gray-300" />
                  <span className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.12em] text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Disponible
                  </span>
                </div>
                <div>
                  <h1 className="text-2xl font-black leading-tight text-gray-950 sm:text-3xl">
                    {car.name}
                  </h1>
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gray-500">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    Retrait à {car.location}, Maroc
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-bold text-gray-600">
                  {car.reviews > 0 ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      {car.rating.toFixed(1)} · {car.reviews} avis
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      Loueur professionnel vérifié
                    </span>
                  )}
                  <span className="hidden h-1 w-1 rounded-full bg-gray-300 sm:block" />
                  <span>Confirmation rapide par Localik</span>
                </div>
                <div className="mt-1 lg:hidden">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">À partir de</span>
                  <p className="text-2xl font-black text-primary">
                    {car.price} DH <span className="text-xs font-bold text-gray-400">/ jour</span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-500 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                >
                  <Share2 className="h-4 w-4" />
                  Copier le lien
                </button>
              </div>
            </div>
          </div>

          {/* 3. Reassurance strip */}
          <div className="grid grid-cols-1 divide-y divide-gray-200 border-y border-gray-200 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {[
              { icon: Calendar, title: "Annulation flexible", detail: "Gratuite jusqu’à 48 h avant" },
              { icon: BadgeCheck, title: "Tarif transparent", detail: "Votre total est annoncé" },
              { icon: Phone, title: "Assistance humaine", detail: "Une équipe disponible 24h/7" },
            ].map((benefit) => (
              <div key={benefit.title} className="flex items-center gap-3 px-2 py-4 sm:px-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center text-primary">
                  <benefit.icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold text-gray-900">{benefit.title}</p>
                  <p className="mt-0.5 text-[9px] font-semibold leading-snug text-gray-500">{benefit.detail}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Specs Characteristics Grid */}
          <div className="flex flex-col gap-4 border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-[11px] font-extrabold text-gray-400 uppercase tracking-[0.15em] border-b border-gray-100 pb-2">
              Caractéristiques du véhicule
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {specs.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 border-l-2 border-blue-100 px-3 py-2"
                >
                  <div className="text-primary">
                    <s.icon className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[9px] font-extrabold text-gray-400 uppercase leading-none">{s.label}</span>
                    <span className="text-xs font-extrabold text-gray-900 mt-1">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="font-extrabold text-xs text-gray-900 uppercase tracking-wider">Description</h3>
            <p className="font-medium text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {car.description 
                ? (car.description.length > 250 && !isDescExpanded 
                    ? car.description.slice(0, 250) + "..." 
                    : car.description)
                : "Aucune description fournie pour ce véhicule."}
            </p>
            {car.description && car.description.length > 250 && (
              <button
                type="button"
                onClick={() => setIsDescExpanded(!isDescExpanded)}
                className="text-primary hover:text-blue-650 font-bold text-xs mt-2 self-start transition-all cursor-pointer"
              >
                {isDescExpanded ? "Voir moins" : "Voir plus"}
              </button>
            )}
          </div>

          {/* 4. Rules additionnelles & Usage */}
          <div className="flex flex-col gap-4 border border-gray-200 bg-white p-6 text-left shadow-sm">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest flex items-center gap-2 border-b border-gray-100 pb-3">
              <ShieldCheck className="w-4.5 h-4.5 text-primary" />
              Règles additionnelles & Usage
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-gray-600 font-medium">
              <div className="flex gap-3">
                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-gray-800">Annulation Flexible</h4>
                  <p className="mt-0.5 leading-relaxed text-[11px]">Annulation gratuite jusqu’à 48 heures avant le début de la location sans aucun frais.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <BadgeCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-gray-800">Pièces justificatives</h4>
                  <p className="mt-0.5 leading-relaxed text-[11px]">Présentation obligatoire d’une pièce d’identité (CIN ou passeport original) en cours de validité.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-gray-800">Circulation et routes</h4>
                  <p className="mt-0.5 leading-relaxed text-[11px]">Utilisation autorisée exclusivement sur routes goudronnées. La conduite sur pistes non revêtues est interdite.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <CheckCircle className="w-4.5 h-4.5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-gray-800">Usage commercial interdit</h4>
                  <p className="mt-0.5 leading-relaxed text-[11px]">La sous-location, le transport de passagers payants ou le remorquage de véhicules sont strictement interdits.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Localisation du véhicule (Map) in Left Column */}
          <div className="overflow-hidden border-y border-gray-200 bg-white text-left shadow-sm">
            <div className="p-6">
              <h3 className="flex items-center gap-2 border-b border-gray-100 pb-3 text-xs font-black uppercase tracking-widest text-gray-900">
                <MapPin className="h-4.5 w-4.5 text-primary" />
                Localisation du véhicule
              </h3>
              <p className="mt-4 text-[11px] font-medium leading-relaxed text-gray-500">
                Véhicule disponible pour retrait à <strong className="font-extrabold text-gray-800">{car.location}</strong>.
              </p>
            </div>
            <div className="relative z-10 h-[320px] w-full border-t border-gray-200 sm:h-[400px]">
              <MoroccoMap cars={[car]} />
            </div>
          </div>

        </section>

        {/* RIGHT COLUMN: Conversion-focused booking summary */}
        <aside className="flex w-full min-w-0 flex-col gap-5 font-sans lg:sticky lg:top-20">
          <div className="overflow-hidden border border-gray-200 bg-white shadow-[0_18px_45px_rgba(5,28,52,0.10)]">
            <div className="border-b border-gray-100 bg-white p-6">
              <div className="flex items-center justify-end">
                <span className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-primary">Meilleur tarif</span>
              </div>
              <p className="mt-5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-gray-400">Votre réservation</p>
              <div className="mt-1 flex items-end justify-between gap-3">
                <div>
                  <span className="text-3xl font-black tracking-tight text-gray-950">{car.price} DH</span>
                  <span className="ml-1 text-[11px] font-bold text-gray-400">/ jour</span>
                </div>
                <span className="rounded-sm bg-white px-2 py-1 text-[9px] font-bold text-gray-500 shadow-sm">{displayDays} jour{displayDays > 1 ? "s" : ""}</span>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-6">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="rounded-sm border border-gray-200 bg-gray-50/70 p-3">
                  <div className="flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-wider text-gray-400">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Départ
                  </div>
                  <p className="mt-1.5 truncate text-[11px] font-extrabold capitalize text-gray-900">{displayStartDate}</p>
                </div>
                <div className="rounded-sm border border-gray-200 bg-gray-55/70 p-3">
                  <div className="flex items-center gap-1.5 text-[8px] font-extrabold uppercase tracking-wider text-gray-400">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    Retour
                  </div>
                  <p className="mt-1.5 truncate text-[11px] font-extrabold capitalize text-gray-900">{displayEndDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-sm border border-gray-200 bg-gray-55/70 p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-white text-primary shadow-sm">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[8px] font-extrabold uppercase tracking-wider text-gray-400">Lieu de retrait</p>
                  <p className="mt-0.5 truncate text-[11px] font-extrabold text-gray-900">{pickupLocation}, Maroc</p>
                </div>
              </div>

              <div className="rounded-sm bg-[#F7F8FA] p-4">
                <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500">
                  <span>{car.price} DH × {displayDays} jour{displayDays > 1 ? "s" : ""}</span>
                  <span className="font-extrabold text-gray-800">{displayPrice} DH</span>
                </div>
                <div className="my-3 h-px bg-gray-200" />
                <div className="flex items-end justify-between gap-3">
                  <span className="text-xs font-extrabold text-gray-955">Total estimé</span>
                  <span className="text-xl font-black text-primary">{displayPrice} DH</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsDrawerOpen(true)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-none bg-primary px-5 text-xs font-extrabold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
              >
                Continuer la réservation
                <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={`https://wa.me/212770566628?text=${encodeURIComponent(`Bonjour Localik,\nJe souhaite réserver la ${car.name} (${car.price} DH/j) disponible à ${car.location}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md text-[10px] font-extrabold text-[#168A43] transition-colors hover:bg-emerald-50"
              >
                <Phone className="h-3.5 w-3.5" />
                Poser une question sur WhatsApp
              </a>

              <p className="flex items-center justify-center gap-1.5 text-center text-[9px] font-bold text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Aucun paiement demandé maintenant
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden bg-[#051C34] p-5 text-white shadow-sm">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/25 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4.5 w-4.5 text-blue-400" />
                <h3 className="text-[10px] font-extrabold uppercase tracking-[0.16em]">Inclus avec Localik</h3>
              </div>
              <div className="mt-4 grid gap-3 text-[10px] font-semibold text-slate-300">
                {[
                  "Loueur professionnel vérifié",
                  "Assurance tous risques avec franchise",
                  "Kilométrage illimité sauf indication",
                  "Assistance clientèle 24h/7",
                ].map((item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>

      {/* SUGGESTED VEHICLES BLOCK */}
      {suggestedCars && suggestedCars.length > 0 && (
        <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-200 mt-6 text-left">
          <h2 className="text-base font-extrabold text-gray-900 uppercase tracking-wider mb-6">
            Véhicules similaires suggérés
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {suggestedCars.map((item) => (
              <CarCard
                key={item.id}
                id={item.id}
                name={item.name}
                rating={0}
                reviews={0}
                passengers={item.passengers}
                transmission={item.transmission}
                airConditioning={item.airConditioning}
                doors={item.doors}
                price={item.price}
                imageSrc={item.imageSrc}
                isAvailable={item.isAvailable}
                href={`/marketplace/voitures/${item.id}`}
              />
            ))}
          </div>
        </section>
      )}



      {/* Mobile conversion bar */}
      <div className="fixed inset-x-3 bottom-3 z-[80] flex items-center justify-between gap-4 rounded-none border border-white/70 bg-white/95 p-3 pl-4 shadow-[0_16px_45px_rgba(5,28,52,0.22)] backdrop-blur-xl lg:hidden">
        <div className="min-w-0">
          <span className="block text-[8px] font-extrabold uppercase tracking-wider text-gray-400">À partir de</span>
          <span className="text-lg font-black text-gray-950">{car.price} DH</span>
          <span className="ml-1 text-[9px] font-bold text-gray-400">/ jour</span>
        </div>
        <button
          type="button"
          onClick={() => setIsDrawerOpen(true)}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-none bg-primary px-5 text-[11px] font-extrabold text-white shadow-lg shadow-primary/25 transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          Réserver
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Website Booking Congratulation Modal */}
      {showWebsiteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] p-4 flex items-center justify-center animate-fadeIn">
          <div className="bg-white rounded-none p-6 md:p-8 max-w-sm w-full text-center shadow-2xl flex flex-col items-center gap-4.5 border border-gray-200 animate-none">
            <div className="p-4 rounded-full bg-green-50 text-green-500 animate-none">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Félicitations !</h3>
            <p className="text-xs font-semibold text-gray-500 leading-relaxed">
              Votre réservation a été enregistrée avec succès. Notre équipe vous contactera sous peu.
            </p>
            <button
              type="button"
              onClick={() => {
                setShowWebsiteModal(false);
                router.push("/marketplace");
              }}
              className="w-full h-10 mt-2 bg-primary hover:bg-blue-600 active:scale-95 text-white font-bold text-xs rounded-none shadow-md transition-all cursor-pointer animate-none"
            >
              Retour au marketplace
            </button>
          </div>
        </div>
      )}

      {/* SLIDE-IN BOOKING DRAWER (Right to Left drawer) */}
      <div 
        className={`fixed inset-0 z-[999] transition-all duration-300 ${
          isDrawerOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        {/* Backdrop overlay */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          onClick={() => setIsDrawerOpen(false)}
        />

        {/* Drawer content box */}
        <div 
          className={`absolute right-0 top-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-10 flex flex-col transition-transform duration-300 ease-in-out ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-extrabold text-primary uppercase tracking-widest">Réservation sécurisée</span>
              <h3 className="text-base font-extrabold text-gray-900 mt-0.5">Détails de la demande</h3>
            </div>
            <button 
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-left">
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
              
              {/* Selected Car preview */}
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-none p-3 select-none">
                <img src={car.imageSrc} alt="" className="w-16 h-10 object-contain rounded-none bg-white border border-gray-100 p-0.5 flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">{car.name}</span>
                  <span className="text-xs font-extrabold text-gray-900 mt-0.5">{car.price} DH / jour</span>
                </div>
              </div>

              {/* Nom Complet */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-sans">Nom Complet</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ayoub Ameur"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full pl-10 pr-3 h-11 bg-gray-50 border border-gray-200 rounded-none text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white text-gray-800 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-sans">Téléphone</label>
                  <span className="text-[8px] font-extrabold text-gray-400">{clientPhone.length}/10</span>
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 0612345678"
                    value={clientPhone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-3 h-11 bg-gray-50 border border-gray-200 rounded-none text-xs font-semibold focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 focus:bg-white text-gray-800 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Lieu de retrait */}
              <div className="flex flex-col gap-1.5 relative" ref={locationRef}>
                <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-sans">Lieu de retrait</label>
                <button
                  type="button"
                  onClick={() => {
                    setIsLocationOpen(!isLocationOpen);
                    setIsStartDateOpen(false);
                    setIsEndDateOpen(false);
                  }}
                  className={`w-full bg-gray-50 border rounded-none px-3.5 h-11 text-xs font-semibold flex items-center justify-between transition-all cursor-pointer font-sans ${
                    isLocationOpen
                      ? "border-primary bg-white ring-2 ring-primary/10"
                      : "border-gray-200 hover:bg-gray-100/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-gray-700 truncate">{pickupLocation}</span>
                  </div>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isLocationOpen ? "rotate-180" : ""}`} />
                </button>

                {isLocationOpen && (
                  <div className="absolute left-0 mt-1 top-[100%] w-full bg-white rounded-none shadow-xl border border-gray-200 z-50 p-2.5 flex flex-col gap-1.5">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher..."
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-none text-xs font-semibold text-gray-800 focus:outline-none font-sans"
                      />
                    </div>
                    <div className="max-h-[140px] overflow-y-auto flex flex-col gap-0.5 custom-scrollbar">
                      {filteredCities.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setPickupLocation(c);
                            setIsLocationOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 text-xs font-bold rounded-none cursor-pointer font-sans ${
                            pickupLocation === c
                              ? "bg-primary-light text-primary"
                              : "text-gray-700 hover:bg-gray-55"
                          }`}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dates Picker */}
              <div className="grid grid-cols-2 gap-3 relative">
                <div className="flex flex-col gap-1.5 text-left" ref={startCalRef}>
                  <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-sans">Départ</label>
                  <div
                    onClick={() => {
                      setIsStartDateOpen(!isStartDateOpen);
                      setIsEndDateOpen(false);
                      setIsLocationOpen(false);
                    }}
                    className={`flex items-center gap-2 cursor-pointer h-11 px-3 border bg-gray-50 rounded-none hover:bg-gray-100/30 transition-all ${
                      isStartDateOpen ? "border-primary bg-white ring-2 ring-primary/10" : "border-gray-200"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] font-bold text-gray-700 truncate font-sans">
                      {drawerStartDate}
                    </span>
                  </div>
                  {isStartDateOpen && (
                    <div className="absolute left-0 mt-1 top-[100%] z-50 bg-white rounded-none shadow-xl border border-gray-200 p-2">
                      <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => {
                          setStartDate(date);
                          setIsStartDateOpen(false);
                          setIsEndDateOpen(true);
                          if (date) {
                            const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
                            if (!endDate || endDate < nextDay) {
                              setEndDate(nextDay);
                            }
                          }
                        }}
                        inline
                        minDate={new Date()}
                      />
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 text-left" ref={endCalRef}>
                  <label className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider font-sans">Retour</label>
                  <div
                    onClick={() => {
                      setIsEndDateOpen(!isEndDateOpen);
                      setIsStartDateOpen(false);
                      setIsLocationOpen(false);
                    }}
                    className={`flex items-center gap-2 cursor-pointer h-11 px-3 border bg-gray-55 rounded-none hover:bg-gray-100/30 transition-all ${
                      isEndDateOpen ? "border-primary bg-white ring-2 ring-primary/10" : "border-gray-200"
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="text-[11px] font-bold text-gray-700 truncate font-sans">
                      {drawerEndDate}
                    </span>
                  </div>
                  {isEndDateOpen && (
                    <div className="absolute right-0 mt-1 top-[100%] z-50 bg-white rounded-none shadow-xl border border-gray-200 p-2">
                      <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => {
                          setEndDate(date);
                          setIsEndDateOpen(false);
                        }}
                        inline
                        minDate={startDate ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000) : new Date()}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="bg-gray-50 border border-gray-200 rounded-none p-4 text-left flex flex-col gap-2 mt-1">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-500 font-sans">
                  <span>Tarif journalier</span>
                  <span className="font-bold text-gray-800">{car.price} DH / jour</span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-gray-500 font-sans">
                  <span>Durée de location</span>
                  <span className="font-bold text-gray-800">{displayDays} jour(s)</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-gray-900 text-sm font-sans">Total estimé</span>
                  <span className="font-extrabold text-primary text-lg font-sans">{displayPrice} DH</span>
                </div>
              </div>

              {/* Drawer Submission Buttons (Humanized CTA & Official Icons) */}
              <div className="flex flex-col gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={(e) => {
                    handleBookingSubmit(e, "whatsapp");
                    setIsDrawerOpen(false);
                  }}
                  disabled={isSubmitting}
                  className="w-full h-11 bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-50 text-white rounded-none font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-green-500/15 transition-all font-sans"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 448 512" 
                    className="w-3.5 h-3.5 fill-white text-white"
                  >
                    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                  </svg>
                  Envoyer ma demande via WhatsApp
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    handleBookingSubmit(e, "website");
                    setIsDrawerOpen(false);
                  }}
                  disabled={isSubmitting}
                  className="w-full h-11 bg-primary hover:bg-blue-600 disabled:opacity-50 text-white rounded-none font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/20 transition-all font-sans"
                >
                  <Globe className="w-3.5 h-3.5 text-white" />
                  Confirmer ma réservation sur le site
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .custom-scrollbar-dark::-webkit-scrollbar {
          height: 4px;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar-dark::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.35);
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
