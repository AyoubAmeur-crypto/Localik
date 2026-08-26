"use client";

import { Trash2 } from "lucide-react";

interface DeleteCarModalProps {
  isOpen: boolean;
  carName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

export default function DeleteCarModal({
  isOpen,
  carName,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteCarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-none">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100 overflow-hidden font-sans scale-100 transition-all flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Supprimer le véhicule</h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Cette action est définitive</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Êtes-vous sûr de vouloir supprimer définitivement le véhicule <span className="font-bold text-gray-900">"{carName}"</span> ? Il sera retiré immédiatement du catalogue et de la base de données.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-sm rounded-lg cursor-pointer transition-colors"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="py-2.5 px-5 bg-red-600 hover:bg-red-750 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-red-500/10 active:scale-[0.98] transition-all"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Suppression...</span>
              </>
            ) : (
              <span>Supprimer</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
