"use client";

import { useState, useEffect, useRef, Suspense, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MapPin,
  Calendar,
  Search,
  ChevronDown,
  X,
  SlidersHorizontal,
  Star,
  Globe,
  Users,
  Settings as SettingsIcon,
  Snowflake,
  DoorClosed,
  ChevronLeft,
  ChevronRight,
  Filter,
  SearchX,
  Home,
  User,
} from "lucide-react";

import Footer from "@/components/Footer";
import { getCarsPaginated } from "@/lib/db-actions";

// Dynamically import MoroccoMap to avoid SSR/window issues with Leaflet
const MoroccoMap = dynamic(() => import("@/components/MoroccoMap"), { ssr: false });

const MOROCCAN_CITIES = [
  "Casablanca",
  "Marrakech",
  "Fes",
  "Rabat",
  "Tangier",
  "Agadir",
  "Sefrou",
  "Chefchaouen",
  "Essaouira",
  "Ouarzazate",
  "Meknes",
  "Oujda",
];

// Price visualizer constants matching admin panel
const MIN_PRICE_LIMIT = 0;
const MAX_PRICE_LIMIT = 1500;
const SVG_W = 280;
const SVG_H = 60;

/** Generate a normal-distribution bell curve SVG path */
function bellCurvePath(): string {
  const mean = SVG_W / 2;
  const sigma = SVG_W / 5;
  const points: string[] = [];
  for (let x = 0; x <= SVG_W; x += 3) {
    const exponent = -0.5 * Math.pow((x - mean) / sigma, 2);
    const y = SVG_H - 4 - (SVG_H - 12) * Math.exp(exponent);
    points.push(`${x},${y}`);
  }
  return `M0,${SVG_H - 4} ` + points.map((p) => `L${p}`).join(" ") + ` L${SVG_W},${SVG_H - 4}`;
}

/** Build a clipped "filled area" path between xMin and xMax from the bell curve */
function bellFillPath(xMin: number, xMax: number): string {
  const mean = SVG_W / 2;
  const sigma = SVG_W / 5;
  const points: string[] = [];
  const startX = xMin;
  const endX = xMax;
  for (let x = startX; x <= endX; x += 3) {
    const exponent = -0.5 * Math.pow((x - mean) / sigma, 2);
    const y = SVG_H - 4 - (SVG_H - 12) * Math.exp(exponent);
    points.push(`${x},${y}`);
  }
  if (points.length === 0) return "";
  return (
    `M${startX},${SVG_H - 4} ` +
    points.map((p) => `L${p}`).join(" ") +
    ` L${endX},${SVG_H - 4} Z`
  );
}

function PriceCurveVisualizer({
  min,
  max,
  setMin,
  setMax,
  onApply,
}: {
  min: number;
  max: number;
  setMin: (v: number) => void;
  setMax: (v: number) => void;
  onApply: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"min" | "max" | null>(null);

  const xMin = ((min - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * SVG_W;
  const xMax = ((max - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * SVG_W;
  const curvePath = bellCurvePath();
  const fillPath = bellFillPath(xMin, xMax);

  const snap = (raw: number) => Math.round(raw / 50) * 50;

  const valueFromClientX = useCallback((clientX: number) => {
    if (!trackRef.current) return MIN_PRICE_LIMIT;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return snap(MIN_PRICE_LIMIT + pct * (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const val = valueFromClientX(e.clientX);
    const distMin = Math.abs(val - min);
    const distMax = Math.abs(val - max);
    draggingRef.current = distMin <= distMax ? "min" : "max";
    e.currentTarget.setPointerCapture(e.pointerId);
    if (draggingRef.current === "min") setMin(Math.min(val, max));
    else setMax(Math.max(val, min));
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const val = valueFromClientX(e.clientX);
    if (draggingRef.current === "min") setMin(Math.min(val, max));
    else setMax(Math.max(val, min));
  };

  const handlePointerUp = () => {
    draggingRef.current = null;
    onApply();
  };

  const minPct = ((min - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * 100;
  const maxPct = ((max - MIN_PRICE_LIMIT) / (MAX_PRICE_LIMIT - MIN_PRICE_LIMIT)) * 100;

  if (!mounted) {
    return <div className="h-[120px]" />;
  }

  return (
    <div className="space-y-0 w-full select-none text-left">
      {/* SVG Bell Curve Canvas */}
      <div className="relative w-full overflow-hidden rounded-t-xl">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 60 }}
        >
          {/* Grey background curve fill */}
          <path
            d={`M0,${SVG_H - 4} ${bellCurvePath().replace(`M0,${SVG_H - 4} `, "")} Z`}
            fill="#f1f5f9"
          />
          {/* Blue selected range fill */}
          {fillPath && <path d={fillPath} fill="rgba(21,114,211,0.18)" />}
          {/* Dimmed zones outside selection */}
          <rect x={0} y={0} width={xMin} height={SVG_H - 4} fill="rgba(241,245,249,0.72)" />
          <rect x={xMax} y={0} width={SVG_W - xMax} height={SVG_H - 4} fill="rgba(241,245,249,0.72)" />
          {/* Grey curve */}
          <path d={curvePath} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Blue active segment on top */}
          <clipPath id="active-clip">
            <rect x={xMin} y={0} width={xMax - xMin} height={SVG_H} />
          </clipPath>
          <path d={curvePath} fill="none" stroke="#1572D3" strokeWidth="2" strokeLinejoin="round" clipPath="url(#active-clip)" />
          {/* Dashed vertical cut lines */}
          <line x1={xMin} y1={0} x2={xMin} y2={SVG_H - 4} stroke="#1572D3" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
          <line x1={xMax} y1={0} x2={xMax} y2={SVG_H - 4} stroke="#1572D3" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
          {/* Bottom baseline */}
          <line x1={0} y1={SVG_H - 4} x2={SVG_W} y2={SVG_H - 4} stroke="#e2e8f0" strokeWidth="1" />
        </svg>
      </div>

      {/* Custom Dual Thumb Track — pointer-capture based */}
      <div
        className="relative h-8 cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        ref={trackRef}
      >
        {/* Track background */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-200 rounded-full">
          {/* Active range fill */}
          <div
            className="absolute h-full bg-primary rounded-full"
            style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
          />
        </div>
        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md transition-transform hover:scale-110"
          style={{ left: `calc(${minPct}% - 8px)` }}
        />
        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-primary rounded-full shadow-md transition-transform hover:scale-110"
          style={{ left: `calc(${maxPct}% - 8px)` }}
        />
      </div>

      {/* Min / Max value labels + manual inputs */}
      <div className="flex items-center justify-between pt-1 gap-2">
        <div className="flex-grow bg-blue-50 border border-blue-100 rounded-none px-2.5 py-1.5 flex items-center justify-between">
          <span className="text-[8px] uppercase font-extrabold text-blue-400 tracking-wider">Min</span>
          <div className="flex items-baseline gap-0.5">
            <input
              type="number"
              min={MIN_PRICE_LIMIT}
              max={MAX_PRICE_LIMIT}
              value={min}
              onChange={(e) => {
                const v = Math.min(max, Math.max(MIN_PRICE_LIMIT, Number(e.target.value)));
                setMin(v);
              }}
              onBlur={onApply}
              className="w-10 bg-transparent text-right text-xs font-extrabold text-primary outline-none border-none p-0"
            />
            <span className="text-[9px] font-extrabold text-primary">DH</span>
          </div>
        </div>

        <div className="w-3 h-px bg-blue-200 flex-shrink-0" />

        <div className="flex-grow bg-blue-50 border border-blue-100 rounded-none px-2.5 py-1.5 flex items-center justify-between">
          <span className="text-[8px] uppercase font-extrabold text-blue-400 tracking-wider">Max</span>
          <div className="flex items-baseline gap-0.5">
            <input
              type="number"
              min={MIN_PRICE_LIMIT}
              max={MAX_PRICE_LIMIT}
              value={max}
              onChange={(e) => {
                const v = Math.min(MAX_PRICE_LIMIT, Math.max(min, Number(e.target.value)));
                setMax(v);
              }}
              onBlur={onApply}
              className="w-10 bg-transparent text-right text-xs font-extrabold text-primary outline-none border-none p-0"
            />
            <span className="text-[9px] font-extrabold text-primary">DH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  description?: string;
  fuelType?: string;
}

function MarketplaceContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Loading States
  const [loading, setLoading] = useState(true);
  const [cars, setCars] = useState<CarType[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Hover state for linking listing with map markers
  const [hoveredCarId, setHoveredCarId] = useState<string | null>(null);

  // TOP BAR WIDGET STATE
  const [topLocation, setTopLocation] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [isDateOpen, setIsDateOpen] = useState(false);

  // SIDEBAR FILTER STATE
  const [searchVal, setSearchVal] = useState("");
  const [transmissionDraft, setTransmissionDraft] = useState<"all" | "manuelle" | "automatique">("all");
  const [fuelTypeDraft, setFuelTypeDraft] = useState<"all" | "Diesel" | "Essence" | "Hybride" | "Électrique">("all");
  const [airConditioningDraft, setAirConditioningDraft] = useState<"all" | "yes" | "no">("all");
  const [doorsDraft, setDoorsDraft] = useState<0 | 3 | 5>(0);
  const [minPriceDraft, setMinPriceDraft] = useState(0);
  const [maxPriceDraft, setMaxPriceDraft] = useState(1500);

  // Dropdown & responsive states
  const [isFuelOpen, setIsFuelOpen] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [monthsShown, setMonthsShown] = useState(2);

  const topLocationRef = useRef<HTMLDivElement>(null);
  const topDateRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setMonthsShown(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Detect clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (widgetRef.current && !widgetRef.current.contains(target)) {
        setIsLocationOpen(false);
        setIsDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync URL parameters on page mount and updates
  useEffect(() => {
    const location = searchParams.get("location") || "";
    const startStr = searchParams.get("startDate");
    const endStr = searchParams.get("endDate");
    
    const search = searchParams.get("search") || "";
    const transmission = searchParams.get("transmission") || "all";
    const fuelType = searchParams.get("fuelType") || "all";
    const airConditioning = searchParams.get("airConditioning") || "all";
    const doors = Number(searchParams.get("doors") || "0");
    const minPrice = Number(searchParams.get("minPrice") || "0");
    const maxPrice = Number(searchParams.get("maxPrice") || "1500");
    const page = Number(searchParams.get("page") || "1");

    setTopLocation(location);
    if (startStr) setStartDate(new Date(startStr));
    if (endStr) setEndDate(new Date(endStr));

    setSearchVal(search);
    setTransmissionDraft(transmission as any);
    setFuelTypeDraft(fuelType as any);
    setAirConditioningDraft(airConditioning as any);
    setDoorsDraft(doors as any);
    setMinPriceDraft(minPrice);
    setMaxPriceDraft(maxPrice);
    setCurrentPage(page);

    loadCars({
      location,
      search,
      transmission,
      fuelType,
      airConditioning,
      doors,
      minPrice,
      maxPrice,
      page,
    });
  }, [searchParams]);

  // Load cars from server
  async function loadCars(params: any) {
    setLoading(true);
    const activeFilters = {
      search: params.search || undefined,
      location: params.location || undefined,
      transmission: params.transmission === "all" ? undefined : params.transmission,
      fuelType: params.fuelType === "all" ? undefined : params.fuelType,
      airConditioning: params.airConditioning === "all" ? undefined : params.airConditioning === "yes",
      doors: params.doors === 0 ? undefined : params.doors,
      minPrice: params.minPrice || undefined,
      maxPrice: params.maxPrice || undefined,
      isAvailable: true,
    };

    const result = await getCarsPaginated(params.page, 8, activeFilters);
    if (result.success && result.cars) {
      setCars(result.cars as any);
      setTotalCars(result.totalCount);
    }
    setLoading(false);
  }

  // Format date display
  const formatDateDisplay = (date: Date | null, placeholder: string) => {
    if (!date) return placeholder;
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Push updated filters to URL
  const applyAllFilters = (updates: Record<string, any> = {}) => {
    const params = new URLSearchParams();

    // Preserve dates and location
    if (topLocation) params.set("location", topLocation);
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());

    // Search and side filters (prioritize passed updates)
    const activeSearch = updates.hasOwnProperty("search") ? updates.search : searchVal;
    const activeTrans = updates.hasOwnProperty("transmission") ? updates.transmission : transmissionDraft;
    const activeFuel = updates.hasOwnProperty("fuelType") ? updates.fuelType : fuelTypeDraft;
    const activeAC = updates.hasOwnProperty("airConditioning") ? updates.airConditioning : airConditioningDraft;
    const activeDoors = updates.hasOwnProperty("doors") ? updates.doors : doorsDraft;
    const activeMin = updates.hasOwnProperty("minPrice") ? updates.minPrice : minPriceDraft;
    const activeMax = updates.hasOwnProperty("maxPrice") ? updates.maxPrice : maxPriceDraft;

    if (activeSearch) params.set("search", activeSearch);
    if (activeTrans !== "all") params.set("transmission", activeTrans);
    if (activeFuel !== "all") params.set("fuelType", activeFuel);
    if (activeAC !== "all") params.set("airConditioning", activeAC);
    if (activeDoors !== 0) params.set("doors", String(activeDoors));
    if (activeMin !== 0) params.set("minPrice", String(activeMin));
    if (activeMax !== 1500) params.set("maxPrice", String(activeMax));

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleTopSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLocationOpen(false);
    setIsDateOpen(false);
    applyAllFilters();
  };

  const handleResetFilters = () => {
    // Reset inputs
    setTopLocation("");
    setSearchVal("");
    setTransmissionDraft("all");
    setFuelTypeDraft("all");
    setAirConditioningDraft("all");
    setDoorsDraft(0);
    setMinPriceDraft(0);
    setMaxPriceDraft(1500);

    // Push empty queries to URL
    router.push(pathname);
    setIsMobileFiltersOpen(false);
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diffTime = endDate.getTime() - startDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 1;
  };

  const rentalDays = calculateDays();

  const filteredCities = MOROCCAN_CITIES.filter((city) =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const isFiltered =
    topLocation !== "" ||
    searchVal !== "" ||
    transmissionDraft !== "all" ||
    fuelTypeDraft !== "all" ||
    airConditioningDraft !== "all" ||
    doorsDraft !== 0 ||
    minPriceDraft !== 0 ||
    maxPriceDraft !== 1500;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      
      {/* 1. CUSTOM DARK HEADER (Full-white logo, no landing page floating navbar) */}
      <header className="h-14 bg-[#051C34] flex items-center justify-between px-6 border-b border-white/5 flex-shrink-0 sticky top-0 z-[40]">
        <Link href="/" className="flex items-center">
          <img
            src="/images/localik.png"
            alt="Localik Logo"
            className="h-6 w-auto brightness-0 invert object-contain"
          />
        </Link>
        <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
          <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Visiter le site</span>
          </Link>
         
        </div>
      </header>

      {/* 2. TOP BANNER (Self-contained responsive banner image, correct aspect ratio scaling on all viewports) */}
      <section className="relative w-full flex-shrink-0 z-[20] select-none pointer-events-none">
        <img 
          src="/images/banner.jpg" 
          alt="Banner" 
          className="w-full h-auto block"
        />
      </section>

      {/* Sticky Search Widget Bar (Sticky on Desktop only to prevent taking too much height on Mobile) */}
      <div className="relative lg:sticky lg:top-14 z-[30] bg-[#051C34] py-4 px-6 border-b border-white/10 shadow-md flex items-center justify-center w-full flex-shrink-0">
        <div ref={widgetRef} className="w-full max-w-[1000px] flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-0 bg-white text-dark rounded-none shadow-lg p-2.5 border border-gray-200 select-none">
          
          {/* Main search input content */}
          <div className="flex flex-col lg:flex-row items-center flex-grow w-full gap-4 lg:gap-0 lg:mr-4">
            
            {/* Location selector */}
            <div className="relative w-full lg:w-1/3 flex items-center border-b lg:border-b-0 lg:border-r border-gray-200 py-1.5 px-3" ref={topLocationRef}>
              <MapPin className="w-4 h-4 text-primary mr-2.5 flex-shrink-0" />
              <div className="flex flex-col flex-1 text-left cursor-pointer" onClick={() => { setIsLocationOpen(!isLocationOpen); setIsDateOpen(false); }}>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Lieu de prise en charge</span>
                <span className="text-xs font-bold text-gray-700 truncate mt-1">
                  {topLocation ? `${topLocation}, Maroc` : "Rechercher une ville..."}
                </span>
              </div>
              
              {isLocationOpen && (
                <div className="absolute left-0 mt-3 top-[100%] w-full sm:w-[300px] bg-white rounded-none shadow-2xl border border-gray-200 z-50 p-2.5 transform origin-top transition-all duration-200">
                  <div className="relative p-0.5">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Saisir une ville..."
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      className="w-full pl-8 pr-7 py-1.5 bg-gray-50 border border-gray-200 rounded-none text-xs text-dark focus:outline-none focus:bg-white"
                      autoFocus
                    />
                    {locationSearch && (
                      <button
                        type="button"
                        onClick={() => setLocationSearch("")}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-450 hover:text-dark"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-52 overflow-y-auto mt-1.5 py-1 custom-scrollbar">
                    <button
                      type="button"
                      onClick={() => { setTopLocation(""); setIsLocationOpen(false); }}
                      className="w-full text-left px-2.5 py-1.5 text-[11px] font-bold text-gray-500 hover:bg-gray-50 rounded-none"
                    >
                      Toutes les villes
                    </button>
                    {filteredCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setTopLocation(city);
                          setIsLocationOpen(false);
                          setLocationSearch("");
                        }}
                        className={`flex items-center gap-2.5 w-full text-left px-2.5 py-2 rounded-none text-[11px] font-bold transition-colors ${
                          topLocation === city
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-primary/10"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{city}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dates picker wrapper with relative positioning for proper popover alignment */}
            <div className="relative flex flex-col sm:flex-row items-center w-full lg:w-2/3 gap-3 sm:gap-0" ref={topDateRef}>
              
              {/* Start Date */}
              <div className="flex items-center w-full sm:w-1/2 cursor-pointer py-1.5 px-3 lg:border-l lg:border-gray-200 lg:pl-6" onClick={() => { setIsDateOpen(!isDateOpen); setIsLocationOpen(false); }}>
                <Calendar className="w-4 h-4 text-primary mr-2.5 flex-shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Date départ</span>
                  <span className="text-xs font-bold text-gray-700 mt-1">
                    {formatDateDisplay(startDate, "Départ")}
                  </span>
                </div>
              </div>

              {/* End Date */}
              <div className="flex items-center w-full sm:w-1/2 cursor-pointer py-1.5 px-3 border-t sm:border-t-0 sm:border-l border-gray-200 sm:pl-6" onClick={() => { setIsDateOpen(!isDateOpen); setIsLocationOpen(false); }}>
                <Calendar className="w-4 h-4 text-primary mr-2.5 flex-shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none">Date retour</span>
                  <span className="text-xs font-bold text-gray-700 mt-1">
                    {formatDateDisplay(endDate, "Retour")}
                  </span>
                </div>
              </div>

              {/* Calendar dropdown positioned exactly under the bar */}
              {isDateOpen && (
                <div className="absolute left-0 mt-3 top-[100%] bg-white rounded-none border border-gray-200 shadow-2xl z-50 p-4 transform origin-top transition-all duration-200 flex flex-col items-center w-full sm:w-[540px]">
                  <DatePicker
                    onChange={(dates: [Date | null, Date | null]) => {
                      const [start, end] = dates;
                      setStartDate(start);
                      setEndDate(end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    selectsRange
                    inline
                    monthsShown={monthsShown}
                    minDate={new Date()}
                    disabledKeyboardNavigation
                    calendarClassName="rentcar-range-calendar"
                  />
                </div>
              )}

            </div>

          </div>

          {/* Buttons: Search & Clear (Soft gray border, integrated exactly) */}
          <div className="w-full lg:w-auto flex items-center justify-center py-0.5 lg:pl-3 gap-2 flex-shrink-0">
            <button
              onClick={handleTopSearchSubmit}
              className="h-9 px-4 bg-primary hover:bg-blue-600 active:scale-95 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0 shadow-sm shadow-primary/10"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Rechercher</span>
            </button>
            
            {isFiltered && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="h-9 px-3 bg-white border border-gray-200 hover:bg-gray-50 active:scale-95 text-gray-500 hover:text-gray-805 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-all shrink-0"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
                <span>Effacer</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. SPLIT PANES (Filters Left, Scrollable Rectangle Listings Center, Google Map Right) */}
      <div className="flex-1 w-full flex flex-row relative items-stretch">
        
        {/* Left pane: Filters (Designed exactly like admin panel VehicleFilters) */}
        <aside className="hidden md:block w-[280px] bg-white border-r border-gray-200 sticky lg:top-[152px] md:top-14 lg:h-[calc(100vh-152px)] md:h-[calc(100vh-56px)] overflow-y-auto p-5 flex-shrink-0 select-none custom-scrollbar">
          <div className="flex items-center justify-between pb-3.5 border-b border-gray-200 mb-5">
            <span className="text-xs font-extrabold text-gray-800 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
              Filtres de recherche
            </span>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-[10px] font-extrabold text-primary hover:underline cursor-pointer"
              >
                Tout effacer
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Input Search text */}
            <div className="space-y-2">
              <label className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Rechercher</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => {
                    setSearchVal(e.target.value);
                    applyAllFilters({ search: e.target.value });
                  }}
                  placeholder="Rechercher par nom..."
                  className="w-full h-8.5 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-none text-xs font-semibold focus:outline-none focus:border-primary focus:bg-white text-gray-700"
                />
              </div>
            </div>

            {/* Transmission */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Transmission</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-none border border-gray-200">
                {(["all", "manuelle", "automatique"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTransmissionDraft(t);
                      applyAllFilters({ transmission: t });
                    }}
                    className={`py-1 text-[10px] font-bold rounded-none cursor-pointer transition-all ${
                      transmissionDraft === t
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-550 hover:text-gray-800"
                    }`}
                  >
                    {t === "all" ? "Tous" : t === "manuelle" ? "Manu." : "Auto."}
                  </button>
                ))}
              </div>
            </div>

            {/* Carburant Custom Dropdown */}
            <div className="space-y-2 relative">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Carburant</span>
              <div
                onClick={() => setIsFuelOpen(!isFuelOpen)}
                className={`flex items-center justify-between cursor-pointer w-full h-8.5 px-3 bg-white rounded-none border border-gray-200 hover:border-gray-300 text-xs font-bold text-gray-700 transition-all ${
                  isFuelOpen ? "border-primary ring-2 ring-primary/10" : ""
                }`}
              >
                <span className="truncate">{fuelTypeDraft === "all" ? "Tous" : fuelTypeDraft}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isFuelOpen ? "rotate-180" : ""}`} />
              </div>
              {isFuelOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFuelOpen(false)} />
                  <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-none border border-gray-200 shadow-xl z-50 p-1 flex flex-col gap-0.5">
                    {([
                      { value: "all", label: "Tous" },
                      { value: "Diesel", label: "Diesel" },
                      { value: "Essence", label: "Essence" },
                      { value: "Hybride", label: "Hybride" },
                      { value: "Électrique", label: "Électrique" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFuelTypeDraft(opt.value);
                          setIsFuelOpen(false);
                          applyAllFilters({ fuelType: opt.value });
                        }}
                        className={`w-full px-3 py-1.5 rounded-none text-[11px] font-bold text-left transition-colors cursor-pointer ${
                          fuelTypeDraft === opt.value
                            ? "bg-primary text-white"
                            : "text-gray-700 hover:bg-primary/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Climatisation */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Climatisation</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-none border border-gray-200">
                {(["all", "yes", "no"] as const).map((ac) => (
                  <button
                    key={ac}
                    type="button"
                    onClick={() => {
                      setAirConditioningDraft(ac);
                      applyAllFilters({ airConditioning: ac });
                    }}
                    className={`py-1 text-[10px] font-bold rounded-none cursor-pointer transition-all ${
                      airConditioningDraft === ac
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-550 hover:text-gray-800"
                    }`}
                  >
                    {ac === "all" ? "Tous" : ac === "yes" ? "Clim" : "Sans"}
                  </button>
                ))}
              </div>
            </div>

            {/* Portes */}
            <div className="space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Portes</span>
              <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-none border border-gray-200">
                {([0, 3, 5] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => {
                      setDoorsDraft(d);
                      applyAllFilters({ doors: d });
                    }}
                    className={`py-1 text-[10px] font-bold rounded-none cursor-pointer transition-all ${
                      doorsDraft === d
                        ? "bg-white text-primary shadow-sm"
                        : "text-gray-550 hover:text-gray-800"
                    }`}
                  >
                    {d === 0 ? "Tous" : `${d} p.`}
                  </button>
                ))}
              </div>
            </div>

            {/* Bell Curve Price visualizer matching admin dashboard */}
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Tarif journalier</span>
                <span className="text-xs font-bold text-primary">
                  {minPriceDraft} – {maxPriceDraft} DH
                </span>
              </div>
              <PriceCurveVisualizer
                min={minPriceDraft}
                max={maxPriceDraft}
                setMin={setMinPriceDraft}
                setMax={setMaxPriceDraft}
                onApply={() => applyAllFilters({ minPrice: minPriceDraft, maxPrice: maxPriceDraft })}
              />
            </div>

          </div>
        </aside>

        {/* Center pane: Listings */}
        <section className="flex-1 bg-gray-50/50 p-6 flex flex-col gap-4">
          
          {/* Header indicator */}
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              {loading ? "Recherche de voitures..." : `${totalCars} résultats correspondants`}
            </h2>
            <button
              onClick={() => setIsMobileFiltersOpen(true)}
              className="md:hidden flex items-center gap-1.5 h-8 px-2.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtrer</span>
            </button>
          </div>

          {/* Listings */}
          <div className="flex flex-col gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="w-full bg-white border border-gray-200 rounded-none p-4 flex flex-col sm:flex-row items-center gap-5 shadow-sm animate-pulse h-36">
                  <div className="w-full sm:w-44 h-28 bg-gray-100 rounded-none" />
                  <div className="flex-1 space-y-3.5 py-1 text-left w-full">
                    <div className="h-4 bg-gray-100 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/5" />
                    <div className="flex gap-2 mt-2">
                      <div className="h-6 bg-gray-100 rounded w-16" />
                      <div className="h-6 bg-gray-100 rounded w-16" />
                      <div className="h-6 bg-gray-100 rounded w-16" />
                    </div>
                  </div>
                </div>
              ))
            ) : cars.length === 0 ? (
              <div className="bg-white rounded-none border border-gray-200 p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm w-full">
                <div className="p-4 rounded-full bg-gray-50 text-gray-400">
                  <SearchX className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Aucun résultat trouvé</h3>
                  <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">
                    Essayez d'élargir vos filtres ou de modifier votre ville de recherche.
                  </p>
                </div>
              </div>
            ) : (
              cars.map((car) => {
                const isHovered = hoveredCarId === car.id;
                const totalPrice = car.price * rentalDays;

                return (
                  <div
                    key={car.id}
                    onMouseEnter={() => setHoveredCarId(car.id)}
                    onMouseLeave={() => setHoveredCarId(null)}
                    className={`w-full bg-white border rounded-none p-4 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-center justify-between gap-5 cursor-pointer relative ${
                      isHovered ? "border-primary ring-1 ring-primary/10" : "border-gray-200"
                    }`}
                  >
                    {/* Cover click link */}
                    <Link href={`/marketplace/voitures/${car.id}`} className="absolute inset-0 z-10" />

                    {/* Left: Image container */}
                    <div className="w-full sm:w-44 h-28 bg-gray-55/50 rounded-none p-2 flex items-center justify-center flex-shrink-0 select-none">
                      <img
                        src={car.imageSrc}
                        alt={car.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>

                    {/* Middle: Details & Specs */}
                    <div className="flex-grow flex flex-col items-start text-left min-w-0">
                      <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        {car.location}, Maroc
                      </span>
                      <h3 className="text-base font-bold text-gray-900 leading-none mt-1 truncate w-full">
                        {car.name}
                      </h3>
                      
                      {/* Specs badges */}
                      <div className="flex flex-wrap gap-2 mt-4 text-[10px] font-bold text-gray-500">
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-none border border-gray-200">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {car.passengers} places
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-none border border-gray-200">
                          <SettingsIcon className="w-3.5 h-3.5 text-gray-400" />
                          {car.transmission}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-none border border-gray-200">
                          <Snowflake className="w-3.5 h-3.5 text-gray-400" />
                          {car.airConditioning ? "Clim" : "Sans clim"}
                        </span>
                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-none border border-gray-200">
                          <DoorClosed className="w-3.5 h-3.5 text-gray-400" />
                          {car.doors} portes
                        </span>
                      </div>
                    </div>

                    {/* Right: Price & CTA */}
                    <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center items-center sm:items-end border-t sm:border-t-0 sm:border-l border-gray-100 pt-3 sm:pt-0 sm:pl-5 gap-3 shrink-0">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tarif</span>
                        <div className="flex items-baseline gap-0.5 mt-0.5">
                          <span className="text-base font-extrabold text-gray-900">{car.price} DH</span>
                          <span className="text-[10px] text-gray-400 font-semibold">/jour</span>
                        </div>
                        {rentalDays > 1 && (
                          <span className="text-[10px] font-bold text-primary block mt-0.5">
                            {totalPrice} DH total ({rentalDays} j)
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="z-20">
                        <Link href={`/marketplace/voitures/${car.id}`} className="py-1.5 px-3 bg-primary hover:bg-blue-600 active:scale-95 text-white font-bold text-xs rounded-none inline-block text-center transition-all">
                          Voir l'offre
                        </Link>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

          {/* Pagination */}
          {Math.ceil(totalCars / 8) > 1 && (
            <div className="flex items-center justify-between pt-5 border-t border-gray-200 mt-5 select-none">
              <span className="text-[11px] font-semibold text-gray-400">
                Page <span className="text-gray-800 font-bold">{currentPage}</span> sur{" "}
                <span className="text-gray-800 font-bold">{Math.ceil(totalCars / 8)}</span>
              </span>
              
              <div className="flex items-center gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:border-primary text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed bg-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                
                {Array.from({ length: Math.ceil(totalCars / 8) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`h-7 min-w-7 px-2 rounded-lg border text-[11px] font-bold transition-all flex items-center justify-center cursor-pointer ${
                      currentPage === p
                        ? "bg-primary border-primary text-white"
                        : "border-gray-200 hover:border-primary text-gray-650 bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={currentPage === Math.ceil(totalCars / 8)}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-gray-200 hover:border-primary text-gray-550 disabled:opacity-40 disabled:cursor-not-allowed bg-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </section>

        {/* Right pane: Sticky map */}
        <section className="hidden lg:block w-[400px] xl:w-[460px] shrink-0 border-l border-gray-200 bg-white z-10 relative sticky top-[152px] h-[calc(100vh-152px)]">
          <MoroccoMap
            cars={cars}
            hoveredCarId={hoveredCarId}
          />
        </section>

      </div>

      {/* Mobile filters drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 p-0 flex justify-end backdrop-blur-sm">
          <div className="bg-white h-full w-[300px] shadow-2xl flex flex-col relative border-l border-gray-200 p-5 custom-scrollbar">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200 mb-4">
              <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
                Filtrer les véhicules
              </span>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto space-y-4 pr-1 custom-scrollbar">
              <div className="space-y-1">
                <label className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Nom</label>
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Ex: Clio..."
                  className="w-full h-8 px-2.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Boîte</span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-lg border border-gray-200">
                  {(["all", "manuelle", "automatique"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTransmissionDraft(t)}
                      className={`py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition-all ${
                        transmissionDraft === t ? "bg-white text-primary shadow-sm" : "text-gray-550"
                      }`}
                    >
                      {t === "all" ? "Tous" : t === "manuelle" ? "Manu" : "Auto"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 relative">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Carburant</span>
                <div
                  onClick={() => setIsFuelOpen(!isFuelOpen)}
                  className="flex items-center justify-between cursor-pointer w-full h-8 px-2.5 bg-white border border-gray-200 rounded-lg text-xs font-bold"
                >
                  <span>{fuelTypeDraft === "all" ? "Tous" : fuelTypeDraft}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
                {isFuelOpen && (
                  <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl z-50 p-1 flex flex-col gap-0.5">
                    {([
                      { value: "all", label: "Tous" },
                      { value: "Diesel", label: "Diesel" },
                      { value: "Essence", label: "Essence" },
                      { value: "Hybride", label: "Hybride" },
                      { value: "Électrique", label: "Électrique" },
                    ] as const).map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setFuelTypeDraft(opt.value);
                          setIsFuelOpen(false);
                        }}
                        className={`w-full px-2 py-1 rounded-md text-[10px] font-bold text-left cursor-pointer ${
                          fuelTypeDraft === opt.value ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/10"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Climatisation</span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-lg border border-gray-200">
                  {(["all", "yes", "no"] as const).map((ac) => (
                    <button
                      key={ac}
                      type="button"
                      onClick={() => setAirConditioningDraft(ac)}
                      className={`py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition-all ${
                        airConditioningDraft === ac ? "bg-white text-primary" : "text-gray-550"
                      }`}
                    >
                      {ac === "all" ? "Tous" : ac === "yes" ? "Oui" : "Non"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Portes</span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-gray-50 rounded-lg border border-gray-200">
                  {([0, 3, 5] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDoorsDraft(d)}
                      className={`py-1 text-[9px] font-extrabold rounded-md cursor-pointer transition-all ${
                        doorsDraft === d ? "bg-white text-primary" : "text-gray-550"
                      }`}
                    >
                      {d === 0 ? "Tous" : `${d} p.`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-gray-700">
                  <span>Budget Max</span>
                  <span className="text-primary">{maxPriceDraft} DH</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1500}
                  step={50}
                  value={maxPriceDraft}
                  onChange={(e) => setMaxPriceDraft(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 flex items-center gap-2 mt-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="py-2 px-3 border border-gray-200 text-gray-500 font-bold text-xs rounded-xl flex-1 cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => {
                  applyAllFilters();
                  setIsMobileFiltersOpen(false);
                }}
                className="py-2 px-3 bg-primary text-white font-bold text-xs rounded-xl flex-1 cursor-pointer"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS to style search widgets, scrollbars, and DatePicker dynamically */}
      <style jsx global>{`
        /* DatePicker side-by-side alignment on desktop */
        @media (min-width: 768px) {
          .rentcar-range-calendar.react-datepicker {
            display: flex !important;
          }
          .rentcar-range-calendar .react-datepicker__month-container {
            float: none !important;
          }
          .rentcar-range-calendar .react-datepicker__month-container + .react-datepicker__month-container {
            border-left: 1px solid #f3f4f6;
          }
        }

        /* Custom premium scrollbar styles */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
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
      `}</style>

    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500 mt-4 text-sm font-medium">Chargement du marketplace...</p>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
