import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { getSession } from "@/lib/session";
import { getCarById } from "@/lib/db-actions";
import EditCarForm from "./edit-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCarPage({ params }: PageProps) {
  // 1. Session verification
  const session = await getSession();
  if (!session) {
    redirect("/espace-proprietaire/login");
  }

  // 2. Fetch car details (params is a promise in Next.js 15+)
  const { id } = await params;
  const car = await getCarById(id);

  if (!car) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-800 pb-12">
        <header className="bg-white border-b border-gray-200 py-5 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 flex items-center gap-4">
            <Link
              href="/espace-proprietaire?tab=vehicles"
              className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-lg font-bold text-gray-900">Véhicule non trouvé</h1>
          </div>
        </header>

        <main className="max-w-md mx-auto px-4 mt-16 text-center flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
          <div className="p-4 rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Erreur 404</h2>
          <p className="text-gray-500 text-sm">
            Le véhicule avec l'identifiant <b>{id}</b> est introuvable ou a été supprimé.
          </p>
          <Link
            href="/espace-proprietaire?tab=vehicles"
            className="mt-2 py-2.5 px-5 bg-primary hover:bg-blue-600 text-white font-semibold text-sm rounded-lg transition-colors inline-block"
          >
            Retour au tableau de bord
          </Link>
        </main>
      </div>
    );
  }

  return <EditCarForm car={car} />;
}
