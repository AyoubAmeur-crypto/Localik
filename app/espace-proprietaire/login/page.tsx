"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { loginAction, checkAuth } from "@/lib/db-actions";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    <div className="owner-dashboard-root min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-gray-50 to-blue-50/30 p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-gray-100 p-8 md:p-10 transition-all">
        {/* Logo and header */}
        <div className="flex flex-col items-center gap-6 mb-8 text-center">
          <Link href="/">
            <Image
              src="/images/localik.png"
              alt="Localik Logo"
              width={100}
              height={32}
              className="object-contain hover:scale-105 transition-transform"
              priority
            />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800 tracking-tight">
              Espace Propriétaire
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Connectez-vous pour gérer vos véhicules et collaborateurs
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-lg border border-gray-200 outline-none text-sm text-gray-800 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
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

        <div className="mt-8 text-center text-xs text-gray-400 border-t border-gray-100 pt-6">
          <p>© {new Date().getFullYear()} locaLik. Espace Administrateur Sécurisé.</p>
        </div>
      </div>
    </div>
  );
}
