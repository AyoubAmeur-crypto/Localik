"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  UploadCloud,
  Globe,
  Settings,
  Image as ImageIcon,
  Plus,
  Trash2,
  ChevronDown,
  Star,
  Users,
  Snowflake,
  DoorClosed,
  X
} from "lucide-react";

import { checkAuth, createCar } from "@/lib/db-actions";
import UnsavedChangesModal from "@/components/admin/UnsavedChangesModal";

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

const PASSENGER_OPTIONS = ["2", "4", "5", "7", "9"];
const DOOR_OPTIONS = ["3", "5"];
const TRANSMISSION_OPTIONS = ["Manuelle", "Automatique"];
const FUEL_OPTIONS = ["Diesel", "Essence", "Hybride", "Électrique"];

export default function AjouterVoiturePage() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingTarget, setPendingTarget] = useState("/espace-proprietaire?tab=vehicles");

  // Dynamic isDirty check comparing current state to initial default values
  const checkIsDirty = () => {
    if (name !== "") return true;
    if (price !== "") return true;
    if (location !== "Casablanca") return true;
    if (description !== "") return true;
    if (passengers !== "5") return true;
    if (doors !== "5") return true;
    if (transmission !== "Manuelle") return true;
    if (fuelType !== "Diesel") return true;
    if (fiscalPower !== "6") return true;
    if (airConditioning !== true) return true;
    if (isAvailable !== true) return true;
    if (images.length > 0) return true;
    return false;
  };

  const handleTryLeave = (target: string = "/espace-proprietaire?tab=vehicles") => {
    if (checkIsDirty()) {
      setPendingTarget(target);
      setShowUnsavedModal(true);
    } else {
      router.push(target);
    }
  };

  const handleDiscardAndLeave = () => {
    setShowUnsavedModal(false);
    router.push(pendingTarget);
  };

  // Form State
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("Casablanca");
  const [description, setDescription] = useState("");
  const [passengers, setPassengers] = useState("5");
  const [doors, setDoors] = useState("5");
  const [transmission, setTransmission] = useState("Manuelle");
  const [fuelType, setFuelType] = useState("Diesel");
  const [fiscalPower, setFiscalPower] = useState("6");
  const [airConditioning, setAirConditioning] = useState(true);
  const [isAvailable, setIsAvailable] = useState(true);

  // Dropdown Open States
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isPassengersOpen, setIsPassengersOpen] = useState(false);
  const [isDoorsOpen, setIsDoorsOpen] = useState(false);
  const [isTransmissionOpen, setIsTransmissionOpen] = useState(false);
  const [isFuelOpen, setIsFuelOpen] = useState(false);

  // Unified Gallery Images State (Base64 strings)
  const [images, setImages] = useState<string[]>([]);

  // The first image is the main card preview image
  const finalMainImage = images[0] || "";

  useEffect(() => {
    async function verifyAuth() {
      const isAuth = await checkAuth();
      if (!isAuth) {
        toast.error("Veuillez vous connecter d'abord.");
        router.push("/espace-proprietaire/login");
      } else {
        setCheckingAuth(false);
      }
    }
    verifyAuth();
  }, [router]);

  // Process selected file uploads
  // Process selected file uploads with client-side compression
  const handleFileUploads = async (files: FileList | null) => {
    if (!files) return;
    
    const toastId = toast.loading("Optimisation des images...");
    try {
      const compressPromises = Array.from(files).map(async (file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} n'est pas une image.`);
          return null;
        }
        if (file.size > 12 * 1024 * 1024) {
          toast.error(`${file.name} dépasse la limite de 12 Mo.`);
          return null;
        }
        
        const compressedBase64 = await compressImage(file);
        return compressedBase64;
      });

      const results = await Promise.all(compressPromises);
      const validImages = results.filter(Boolean) as string[];

      if (validImages.length > 0) {
        setImages((prev) => [...prev, ...validImages]);
        toast.success("Images importées !", { id: toastId });
      } else {
        toast.dismiss(toastId);
      }
    } catch (error) {
      console.error("Compression error:", error);
      toast.error("Erreur lors de l'optimisation des images.", { id: toastId });
    }
  };

  // Remove Gallery Item
  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    toast.success("Image retirée.");
  };

  // Drag and Drop state for reordering images
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const reorderedImages = [...images];
    const [draggedItem] = reorderedImages.splice(draggedIndex, 1);
    reorderedImages.splice(targetIndex, 0, draggedItem);
    setImages(reorderedImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async (e: React.FormEvent | null, thenNavigate = false) => {
    if (e && (e as React.FormEvent).preventDefault) (e as React.FormEvent).preventDefault();

    if (!name.trim()) {
      toast.error("Veuillez entrer le nom du véhicule.");
      return false;
    }
    if (!price || Number(price) <= 0) {
      toast.error("Veuillez entrer un prix valide.");
      return false;
    }
    if (images.length === 0) {
      toast.error("Veuillez ajouter au moins une image pour le véhicule.");
      return false;
    }

    setSubmitting(true);

    const uploadImage = async (base64Str: string): Promise<string> => {
      if (!base64Str.startsWith("data:image/")) return base64Str;
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Str }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to upload image.");
      }
      const data = await res.json();
      return data.url;
    };

    try {
      toast.loading("Upload des images en cours...", { id: "upload-toast" });

      // Upload main image
      const finalMainImageUrl = await uploadImage(finalMainImage);

      // Upload gallery images
      const finalGalleryUrls: string[] = [];
      const galleryImages = images.slice(1);
      for (const img of galleryImages) {
        const url = await uploadImage(img);
        finalGalleryUrls.push(url);
      }

      toast.loading("Création du véhicule en cours...", { id: "upload-toast" });

      const carData = {
        name,
        price: Number(price),
        passengers: Number(passengers),
        transmission,
        airConditioning,
        doors: Number(doors),
        imageSrc: finalMainImageUrl,
        description,
        images: finalGalleryUrls,
        fuelType,
        fiscalPower: Number(fiscalPower),
        location,
        rating: 4.8,
        reviews: Math.floor(Math.random() * 50) + 10,
        isAvailable,
      };

      const res = await createCar(carData);
      if (res.success) {
        toast.success("Véhicule ajouté avec succès!", { id: "upload-toast" });
        router.push(thenNavigate ? pendingTarget : "/espace-proprietaire?tab=vehicles");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur lors de l'ajout.", { id: "upload-toast" });
        setSubmitting(false);
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur inattendue est survenue.", { id: "upload-toast" });
      setSubmitting(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="owner-dashboard-root min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 pb-12">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#fff",
            borderRadius: "8px",
            fontSize: "14px"
          }
        }}
      />

      {/* Unsaved changes guard modal */}
      {showUnsavedModal && (
        <UnsavedChangesModal
          isSaving={submitting}
          onStay={() => setShowUnsavedModal(false)}
          onDiscard={handleDiscardAndLeave}
          onSave={async () => {
            await handleSubmit(null, true);
          }}
        />
      )}

      {/* Header */}
      <header className="bg-white border-b border-gray-100 py-5 sticky top-0 z-30 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleTryLeave()}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 transition-colors text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button type="button" onClick={() => handleTryLeave("/")} className="cursor-pointer flex items-center">
              <Image
                src="/images/localik.png"
                alt="Localik Logo"
                width={82}
                height={26}
                className="object-contain"
                priority
              />
            </button>
            <span className="text-gray-300">|</span>
            <div>
              <h1 className="text-base font-bold text-gray-900">Ajouter un véhicule</h1>
            </div>
          </div>
          <div className="hidden sm:block text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Propriétaire
          </div>
        </div>
      </header>

      {/* Grid Content Container */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 mt-8 w-full font-sans animate-none">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 xl:col-span-8 order-2 lg:order-1">
            <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-8">
              
              {/* Card 1: Informations Générales */}
              <div className="bg-white rounded-2xl border border-gray-100 py-10 px-6 md:p-8 shadow-sm space-y-6">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Informations Générales</span>
                </h2>

                {/* Name & Price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Nom du véhicule *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Dacia Sandero Stepway"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200/60 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-gray-800 bg-white placeholder-gray-400 shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Prix par jour (DH) *
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Ex: 250"
                      className="w-full h-11 px-4 rounded-xl border border-gray-200/60 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-gray-800 bg-white placeholder-gray-400 shadow-sm"
                    />
                  </div>
                </div>

                {/* Custom Location Dropdown */}
                <div className="relative">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Ville de disponibilité *
                  </label>
                  <div
                    onClick={() => {
                      setIsLocationOpen(!isLocationOpen);
                      setIsPassengersOpen(false);
                      setIsDoorsOpen(false);
                      setIsTransmissionOpen(false);
                      setIsFuelOpen(false);
                    }}
                    className={`flex items-center justify-between cursor-pointer w-full h-11 px-4 bg-white rounded-xl border border-gray-200/60 text-sm font-semibold text-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all select-none shadow-sm ${
                      isLocationOpen ? "border-primary ring-2 ring-primary/10" : ""
                    }`}
                  >
                    <span>{location}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isLocationOpen ? "rotate-180" : ""}`} />
                  </div>

                  {isLocationOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsLocationOpen(false)} />
                      <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-widget z-50 max-h-60 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                        {MOROCCAN_CITIES.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => {
                              setLocation(city);
                              setIsLocationOpen(false);
                            }}
                            className={`w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                              location === city
                                ? "bg-primary text-white"
                                : "text-gray-700 hover:bg-primary-light/40"
                            }`}
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Description (Under Location) */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Présentez le véhicule, son état, ses options additionnelles..."
                    rows={5}
                    className="w-full p-4 rounded-xl border border-gray-200/60 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-gray-800 resize-none bg-white placeholder-gray-400 shadow-sm"
                  />
                </div>
              </div>

              {/* Card 2: Spécifications Techniques */}
              <div className="bg-white rounded-2xl border border-gray-100 py-10 px-6 md:p-8 shadow-sm space-y-6">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <span>Spécifications Techniques</span>
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  
                  {/* Custom Passengers Select */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Passagers
                    </label>
                    <div
                      onClick={() => {
                        setIsPassengersOpen(!isPassengersOpen);
                        setIsLocationOpen(false);
                        setIsDoorsOpen(false);
                        setIsTransmissionOpen(false);
                        setIsFuelOpen(false);
                      }}
                      className={`flex items-center justify-between cursor-pointer w-full h-11 px-4 bg-white rounded-xl border border-gray-200/60 text-sm font-semibold text-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all select-none shadow-sm ${
                        isPassengersOpen ? "border-primary ring-2 ring-primary/10" : ""
                      }`}
                    >
                      <span>{passengers} places</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isPassengersOpen ? "rotate-180" : ""}`} />
                    </div>

                    {isPassengersOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsPassengersOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-widget z-50 max-h-48 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                          {PASSENGER_OPTIONS.map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                setPassengers(val);
                                setIsPassengersOpen(false);
                              }}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                                passengers === val
                                  ? "bg-primary text-white"
                                  : "text-gray-700 hover:bg-primary-light/40"
                              }`}
                            >
                              {val} places
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Custom Doors Select */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Portes
                    </label>
                    <div
                      onClick={() => {
                        setIsDoorsOpen(!isDoorsOpen);
                        setIsLocationOpen(false);
                        setIsPassengersOpen(false);
                        setIsTransmissionOpen(false);
                        setIsFuelOpen(false);
                      }}
                      className={`flex items-center justify-between cursor-pointer w-full h-11 px-4 bg-white rounded-xl border border-gray-200/60 text-sm font-semibold text-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all select-none shadow-sm ${
                        isDoorsOpen ? "border-primary ring-2 ring-primary/10" : ""
                      }`}
                    >
                      <span>{doors} portes</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDoorsOpen ? "rotate-180" : ""}`} />
                    </div>

                    {isDoorsOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsDoorsOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-widget z-50 max-h-48 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                          {DOOR_OPTIONS.map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                setDoors(val);
                                setIsDoorsOpen(false);
                              }}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                                doors === val
                                  ? "bg-primary text-white"
                                  : "text-gray-700 hover:bg-primary-light/40"
                              }`}
                            >
                              {val} portes
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Custom Transmission Select */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Transmission
                    </label>
                    <div
                      onClick={() => {
                        setIsTransmissionOpen(!isTransmissionOpen);
                        setIsLocationOpen(false);
                        setIsPassengersOpen(false);
                        setIsDoorsOpen(false);
                        setIsFuelOpen(false);
                      }}
                      className={`flex items-center justify-between cursor-pointer w-full h-11 px-4 bg-white rounded-xl border border-gray-200/60 text-sm font-semibold text-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all select-none shadow-sm ${
                        isTransmissionOpen ? "border-primary ring-2 ring-primary/10" : ""
                      }`}
                    >
                      <span>{transmission}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isTransmissionOpen ? "rotate-180" : ""}`} />
                    </div>

                    {isTransmissionOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsTransmissionOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-widget z-50 max-h-48 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                          {TRANSMISSION_OPTIONS.map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                setTransmission(val);
                                setIsTransmissionOpen(false);
                              }}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                                transmission === val
                                  ? "bg-primary text-white"
                                  : "text-gray-700 hover:bg-primary-light/40"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Custom Fuel Select */}
                  <div className="relative">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Carburant
                    </label>
                    <div
                      onClick={() => {
                        setIsFuelOpen(!isFuelOpen);
                        setIsLocationOpen(false);
                        setIsPassengersOpen(false);
                        setIsDoorsOpen(false);
                        setIsTransmissionOpen(false);
                      }}
                      className={`flex items-center justify-between cursor-pointer w-full h-11 px-4 bg-white rounded-xl border border-gray-200/60 text-sm font-semibold text-gray-800 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 transition-all select-none shadow-sm ${
                        isFuelOpen ? "border-primary ring-2 ring-primary/10" : ""
                      }`}
                    >
                      <span>{fuelType}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isFuelOpen ? "rotate-180" : ""}`} />
                    </div>

                    {isFuelOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsFuelOpen(false)} />
                        <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-widget z-50 max-h-48 overflow-y-auto custom-scrollbar p-1.5 flex flex-col gap-0.5">
                          {FUEL_OPTIONS.map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => {
                                setFuelType(val);
                                setIsFuelOpen(false);
                              }}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-semibold text-left transition-colors cursor-pointer ${
                                fuelType === val
                                  ? "bg-primary text-white"
                                  : "text-gray-700 hover:bg-primary-light/40"
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Puissance (CV)
                    </label>
                    <input
                      type="number"
                      required
                      min="4"
                      max="30"
                      value={fiscalPower}
                      onChange={(e) => setFiscalPower(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-gray-200/60 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all font-semibold text-gray-800 bg-white placeholder-gray-400 shadow-sm"
                    />
                  </div>
                </div>

                {/* Clim & Availability Status togglers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block">Climatisation incluse</span>
                      <span className="text-xs text-gray-400 block mt-0.5">Le véhicule possède l'air conditionné actif.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={airConditioning}
                        onChange={(e) => setAirConditioning(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <span className="text-sm font-semibold text-gray-700 block">Statut Disponible</span>
                      <span className="text-xs text-gray-400 block mt-0.5">Badge en ligne activé.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Card 3: Unified Drag-and-Drop Image Gallery */}
              <div className="bg-white rounded-2xl border border-gray-100 py-10 px-6 md:p-8 shadow-sm space-y-6">
                <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <span>Gestion des Images *</span>
                </h2>

                <p className="text-xs text-gray-500">
                  Déposez vos images ci-dessous. <b>La première image</b> sera configurée automatiquement comme la photo principale pour la carte du catalogue. Les autres alimenteront la galerie de détails.
                </p>

                {/* If images uploaded, show the thumbnail grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                    {images.map((imgSrc, index) => (
                      <div 
                        key={index} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative aspect-square bg-white rounded-xl border overflow-hidden flex items-center justify-center p-1 group shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing select-none ${
                          draggedIndex === index 
                            ? "opacity-40 border-dashed border-primary scale-95" 
                            : index === 0
                              ? "border-primary/50 shadow-md ring-2 ring-primary/5"
                              : "border-gray-100 hover:border-primary/30"
                        }`}
                        title="Glissez-déposez pour réorganiser. La 1ère image est la principale."
                      >
                        <img 
                          src={imgSrc} 
                          alt={`Uploaded ${index}`} 
                          className="h-full w-full object-contain pointer-events-none" 
                          draggable={false}
                        />
                        
                        {/* Principal Badge for 1st Image */}
                        {index === 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-primary/95 text-white font-extrabold text-[8px] py-1 text-center uppercase tracking-widest animate-none">
                            Principale
                          </div>
                        )}

                        {/* Close button */}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-500 hover:bg-red-600 rounded-lg text-white shadow-md transition-opacity cursor-pointer flex items-center justify-center border border-transparent"
                          title="Retirer cette photo"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* "+" card at the end of the grid to add more */}
                    <div 
                      onClick={() => document.getElementById("galleryFileInput")?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-200/40 hover:border-primary/50 hover:bg-white transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer text-gray-400 hover:text-primary"
                    >
                      <Plus className="w-6 h-6" />
                      <span className="text-[10px] font-extrabold uppercase tracking-wider">Ajouter</span>
                    </div>
                  </div>
                )}

                {/* Large Drop Zone */}
                <div 
                  onClick={() => document.getElementById("galleryFileInput")?.click()}
                  className={`w-full min-h-[140px] border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-gray-50/50 hover:border-primary/50 relative overflow-hidden bg-gray-50/20 ${
                    images.length > 0 ? "border-gray-200/40 py-4 min-h-[100px]" : "border-gray-100"
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUploads(e.dataTransfer.files);
                  }}
                >
                  <input
                    id="galleryFileInput"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUploads(e.target.files)}
                    className="hidden"
                  />
                  <UploadCloud className="w-8 h-8 text-gray-400 animate-bounce" style={{ animationDuration: "3s" }} />
                  <div className="text-center">
                    <p className="text-xs font-bold text-gray-600">Glisser-déposer vos photos de véhicule, ou parcourir</p>
                    <p className="text-[10px] text-gray-400 mt-1">Obligatoire. Importez au moins 1 image principale. JPG ou PNG jusqu'à 4 Mo par fichier.</p>
                  </div>
                </div>

              </div>

              {/* Action Row */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Link
                  href="/espace-proprietaire?tab=vehicles"
                  className="py-3 px-6 bg-white border border-gray-200/40 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl transition-all cursor-pointer"
                >
                  Annuler
                </Link>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-3 px-8 bg-primary hover:bg-blue-600 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-primary/10 active:scale-[0.98] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Création en cours...</span>
                    </>
                  ) : (
                    <span>Ajouter le véhicule</span>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Sticky Live Preview Card */}
          <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-28 order-1 lg:order-2">
            
            {/* Live Card (Occupies full 1/3 layout) */}
            <div className="relative w-full max-w-[360px] h-[415px] rounded-2xl bg-white shadow-card border border-gray-100 flex flex-col overflow-hidden mx-auto transition-all">
              
              {/* Corner ribbon badge */}
              <div className={`absolute top-[16px] right-[-30px] w-[110px] py-0.5 text-[8px] font-sans font-extrabold uppercase tracking-widest text-center text-white rotate-45 z-20 border-b border-white/20 shadow-md ${
                isAvailable ? "bg-[#1572D3]" : "bg-red-500"
              }`}>
                {isAvailable ? "Disponible" : "Indisponible"}
              </div>

              {/* Main image preview */}
              <div className="relative w-full h-[155px] flex items-center justify-center bg-gray-50/50 p-4">
                {finalMainImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={finalMainImage}
                      alt={name || "Preview"}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-1 text-gray-300">
                    <ImageIcon className="w-8 h-8 animate-pulse" />
                    <span className="text-[9px] font-extrabold uppercase tracking-widest">Aucune Image</span>
                  </div>
                )}
              </div>

              {/* Specs and content */}
              <div className="flex flex-col justify-between p-5 mt-1 flex-1">
                <div className="space-y-1">
                  <h3 className="font-semibold text-sm leading-[17px] text-gray-800 truncate" title={name || "Nom du véhicule"}>
                    {name || "Nom du Véhicule"}
                  </h3>
                  
                  <div className="flex items-center gap-1 text-[10px] font-bold text-primary">
                    <Globe className="w-3.5 h-3.5" />
                    <span>Disponible à {location}</span>
                  </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[11px] text-gray-500 border-t border-b border-gray-100 py-3 mt-1.5">
                  <div className="flex items-center gap-1 truncate">
                    <Users className="w-3.5 h-3.5 text-gray-400" />
                    <span>{passengers} places</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Settings className="w-3.5 h-3.5 text-gray-400" />
                    <span>{transmission}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Snowflake className="w-3.5 h-3.5 text-gray-400" />
                    <span>{airConditioning ? "Climatisé" : "Non Clim"}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <DoorClosed className="w-3.5 h-3.5 text-gray-400" />
                    <span>{doors} portes</span>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="flex flex-col gap-2 pt-2">
                  <div className="flex justify-between items-center w-full text-xs">
                    <span className="text-gray-400 font-semibold uppercase text-[9px]">Tarif</span>
                    <div className="flex items-baseline">
                      <span className="font-bold text-sm text-gray-900">
                        {price ? Number(price).toLocaleString() : "0"} DH
                      </span>
                      <span className="text-[10px] text-gray-400">/jour</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-8 rounded-lg bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center pointer-events-none">
                    Louer ce véhicule
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// Client-side image compression using Canvas
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000; // Optimal width for web display
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Preserves transparency for PNG and WebP files, otherwise compress as JPEG at 70% quality
        let mimeType = "image/jpeg";
        let quality: number | undefined = 0.7;

        if (file.type === "image/png" || file.type === "image/webp") {
          mimeType = file.type;
          quality = file.type === "image/webp" ? 0.7 : undefined;
        }
        resolve(canvas.toDataURL(mimeType, quality));
      };
      img.onerror = () => resolve("");
    };
    reader.onerror = () => resolve("");
  });
};
