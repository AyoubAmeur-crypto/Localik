"use client";

import { CheckCircle2 } from "lucide-react";

interface ReturnCarModalProps {
  isOpen: boolean;
  clientName: string;
  carName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isConfirming: boolean;
}

export default function ReturnCarModal({
  isOpen,
  clientName,
  carName,
  onClose,
  onConfirm,
  isConfirming,
}: ReturnCarModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-none">
      <div className="bg-white rounded-none shadow-xl max-w-md w-full border border-gray-100 overflow-hidden font-sans scale-100 transition-all flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-none bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Confirmer la récupération</h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5 font-sans">Mise à jour du statut du véhicule</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-sm text-gray-650 leading-relaxed font-sans font-medium">
            Voulez-vous marquer le véhicule <span className="font-extrabold text-gray-950">"{carName}"</span> loué par <span className="font-extrabold text-gray-955">{clientName}</span> comme récupéré ? Le véhicule sera libéré et redeviendra disponible pour de nouvelles réservations.
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3 font-sans">
          <button
            type="button"
            onClick={onClose}
            disabled={isConfirming}
            className="py-2.5 px-4 bg-white border border-gray-250 hover:border-gray-300 text-gray-700 font-bold text-xs rounded-none cursor-pointer transition-colors uppercase tracking-wider"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isConfirming}
            className="py-2.5 px-5 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-none flex items-center gap-2 cursor-pointer shadow-md shadow-green-500/10 active:scale-[0.98] transition-all uppercase tracking-wider"
          >
            {isConfirming ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Mise à jour...</span>
              </>
            ) : (
              <span>Confirmer</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
