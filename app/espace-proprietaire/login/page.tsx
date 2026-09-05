"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginAction, checkAuth } from "@/lib/db-actions";
import { Car, KeyRound, Calendar, MapPin, ShieldCheck, Users, TrendingUp, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    async function verifySession() {
      const isAuth = await checkAuth();
      if (isAuth) {
        router.push("/espace-proprietaire");
      } else {
        setCheckingAuth(false);
      }
    }
    verifySession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Veuillez remplir tous les champs.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await loginAction(username, password);
      if (result.success) {
        router.push("/espace-proprietaire");
        router.refresh();
      } else {
        setError(result.error || "Erreur de connexion.");
        setLoading(false);
      }
    } catch (err) {
      setError("Une erreur inattendue est survenue.");
      setLoading(false);
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
    <div className="owner-dashboard-root min-h-screen flex bg-white font-sans">
      
      {/* Left panel: Custom SaaS dashboard orbital graphic with blue gradient background */}
      <div className="hidden lg:flex flex-col justify-between relative flex-1 bg-gradient-to-br from-blue-950 via-blue-900 to-primary min-h-screen p-16 select-none animate-fade-in">
        
        <style>{`
          @keyframes fadeInCircle {
            0% { opacity: 0; }
            100% { opacity: 0.15; }
          }
          @keyframes scaleInCore {
            0% { opacity: 0; transform: scale(0.6); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes badgeEntry {
            0% { opacity: 0; transform: scale(0.6); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes badgeEntryWithTranslate {
            0% { opacity: 0; transform: translateY(-50%) scale(0.6); }
            100% { opacity: 1; transform: translateY(-50%) scale(1); }
          }

          .animate-circle {
            opacity: 0;
            animation: fadeInCircle 1.2s ease-out forwards;
          }
          .animate-core {
            opacity: 0;
            animation: scaleInCore 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
            animation-delay: 0.2s;
          }
          .badge-entry {
            opacity: 0;
            animation: badgeEntry 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .badge-entry-translate {
            opacity: 0;
            animation: badgeEntryWithTranslate 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
        `}</style>

        {/* Localik Logo in White on Top Left of Screen (Desktop only) */}
        <div className="absolute top-8 left-8 z-20">
          <Link href="/">
            <Image
              src="/images/localik.png"
              alt="Localik Logo White"
              width={95}
              height={30}
              className="object-contain hover:scale-105 transition-transform brightness-0 invert"
              priority
            />
          </Link>
        </div>

        {/* Center area with custom floating SaaS dashboard graphic */}
        <div className="flex-1 flex items-center justify-center relative">
          
          {/* Background glowing blobs */}
          <div className="absolute w-72 h-72 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute w-56 h-56 rounded-full bg-primary/20 blur-2xl translate-x-12 translate-y-12" />

          {/* Central Orbit Circle */}
          <div className="relative flex items-center justify-center w-72 h-72 rounded-full border border-white/10">
            
            {/* Outer Orbit Circle */}
            <div className="absolute w-[320px] h-[320px] rounded-full border border-dashed border-white/5 animate-circle" />
            
            {/* Inner Glowing Core */}
            <div className="relative flex items-center justify-center w-32 h-32 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] animate-core">
              <KeyRound className="w-14 h-14 text-white drop-shadow-[0_4px_12px_rgba(21,114,211,0.5)]" />
            </div>

            {/* Orbiting / Floating Badges */}
            {/* Badge 1: Car (Top Left) */}
            <div 
              className="absolute -top-4 -left-4 flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg badge-entry"
              style={{ animationDelay: "0.4s" }}
            >
              <Car className="w-5 h-5 text-blue-200" />
            </div>

            {/* Badge 2: Calendar (Top Right) */}
            <div 
              className="absolute -top-4 -right-4 flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg badge-entry"
              style={{ animationDelay: "0.5s" }}
            >
              <Calendar className="w-5 h-5 text-blue-200" />
            </div>

            {/* Badge 3: MapPin (Bottom Left) */}
            <div 
              className="absolute -bottom-4 -left-4 flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg badge-entry"
              style={{ animationDelay: "0.6s" }}
            >
              <MapPin className="w-5 h-5 text-blue-200" />
            </div>

            {/* Badge 4: ShieldCheck (Bottom Right) */}
            <div 
              className="absolute -bottom-4 -right-4 flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg badge-entry"
              style={{ animationDelay: "0.7s" }}
            >
              <ShieldCheck className="w-5 h-5 text-blue-200" />
            </div>

            {/* Badge 5: Users (Left) */}
            <div 
              className="absolute top-1/2 -left-8 flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg badge-entry-translate"
              style={{ animationDelay: "0.8s" }}
            >
              <Users className="w-5 h-5 text-blue-200" />
            </div>

            {/* Badge 6: TrendingUp (Right) */}
            <div 
              className="absolute top-1/2 -right-8 flex items-center justify-center w-11 h-11 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-white shadow-lg badge-entry-translate"
              style={{ animationDelay: "0.9s" }}
            >
              <TrendingUp className="w-5 h-5 text-blue-200" />
            </div>

          </div>

        </div>

        {/* Text / branding on the left panel */}
        <div className="relative z-20 text-left text-white max-w-lg">
          <h2 className="text-3xl font-extrabold tracking-tight text-white mb-4">
            Pilotez votre agence en toute simplicité
          </h2>
          <p className="text-base text-blue-100 font-medium leading-relaxed font-sans">
            Gérez vos réservations, suivez la disponibilité de votre flotte de véhicules et supervisez vos collaborateurs depuis un tableau de bord intuitif.
          </p>
        </div>
      </div>

      {/* Right panel: Login Form */}
      <div className="relative flex flex-1 flex-col justify-center py-12 px-6 sm:px-12 lg:flex-none lg:px-20 xl:px-24 bg-white z-10 w-full lg:w-1/2 xl:w-[45%]">
        
        {/* Floating Logo on Top Right (Mobile/Tablet only) */}
        <div className="absolute top-8 right-8 block lg:hidden">
          <Link href="/">
            <Image
              src="/images/localik.png"
              alt="Localik Logo"
              width={90}
              height={28}
              className="object-contain hover:scale-105 transition-transform"
              priority
            />
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm lg:w-96 text-left">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Espace Propriétaire
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Connectez-vous pour gérer vos véhicules et collaborateurs.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 border border-red-100 rounded-lg p-3.5 text-sm flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 flex-shrink-0"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label
                htmlFor="username"
                className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2"
              >
                Email ou Identifiant
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                placeholder="ex: admin"
                className="w-full h-11 px-4 rounded-lg border border-gray-200 outline-none text-sm text-gray-800 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full h-11 pl-4 pr-11 rounded-lg border border-gray-200 outline-none text-sm text-gray-800 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-450 hover:text-gray-700 focus:outline-none flex items-center justify-center p-1 cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4.5 h-4.5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="w-4.5 h-4.5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-primary hover:bg-blue-600 text-white font-medium text-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <span>Se connecter</span>
              )}
            </button>
          </form>

          {/* Footer inside Right Panel */}
          <div className="mt-12 text-xs text-gray-400 border-t border-gray-100 pt-6">
            <p>© {new Date().getFullYear()} locaLik. Espace Administrateur Sécurisé.</p>
          </div>
        </div>

      </div>

    </div>
  );
}
