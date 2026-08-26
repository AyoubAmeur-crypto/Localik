import Link from "next/link";
import { ArrowLeft, AlertTriangle, Home, User } from "lucide-react";
import Footer from "@/components/Footer";
import { getCarById, getCars } from "@/lib/db-actions";
import CarDetailsClient from "./details-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
        {/* Custom Header */}
        <header className="h-14 bg-[#051C34] flex items-center justify-between px-6 border-b border-white/5 flex-shrink-0 w-full">
          <Link href="/" className="flex items-center">
            <img
              src="/images/localik.png"
              alt="Localik Logo"
              className="h-6 w-auto brightness-0 invert object-contain"
            />
          </Link>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-300">
            <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Home className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
              <span>Visiter le site</span>
            </Link>
            <Link href="/espace-proprietaire" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <User className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
              <span>Espace Propriétaire</span>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
          <div className="max-w-md mx-auto text-center flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
            <div className="p-4 rounded-full bg-red-50 text-red-650">
              <AlertTriangle className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Véhicule non trouvé</h2>
            <p className="text-gray-550 text-sm">
              Le véhicule demandé est introuvable ou n'est plus disponible pour la location.
            </p>
            <Link
              href="/marketplace"
              className="mt-2 py-2.5 px-5 bg-primary hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition-colors inline-block"
            >
              Retour au marketplace
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Fetch similar suggestions (all other available cars)
  const allCars = await getCars();
  const suggestedCars = allCars.filter((c) => c.id !== id && c.isAvailable).slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800">
      {/* Header / Navbar (Same as Marketplace) */}
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
            <Home className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
            <span>Visiter le site</span>
          </Link>
          <Link href="/espace-proprietaire" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <User className="w-3.5 h-3.5 text-gray-400 hover:text-white" />
            <span>Espace Pro</span>
          </Link>
        </div>
      </header>
 
      <main className="flex-grow">
        <CarDetailsClient car={car} suggestedCars={suggestedCars} />
      </main>

      <Footer />
    </div>
  );
}
