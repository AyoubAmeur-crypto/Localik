"use client";

import { AlertTriangle } from "lucide-react";

interface UnsavedChangesModalProps {
  onDiscard: () => void;
  onStay: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function UnsavedChangesModal({
  onDiscard,
  onStay,
  onSave,
  isSaving = false,
}: UnsavedChangesModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-none">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100 overflow-hidden font-sans flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Modifications non enregistrées</h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Cette action annulera vos modifications</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <p className="text-sm text-gray-600 leading-relaxed">
            Vous avez des modifications en cours. Que souhaitez-vous faire avant de quitter la page ?
          </p>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onDiscard}
            className="py-2 px-3 border border-gray-200 hover:border-red-200 text-red-500 hover:bg-red-50 font-semibold text-xs rounded-lg cursor-pointer transition-colors"
          >
            Ignorer
          </button>
          <button
            type="button"
            onClick={onStay}
            className="py-2 px-3 border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-xs rounded-lg cursor-pointer transition-colors"
          >
            Rester
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="py-2 px-4 bg-primary hover:bg-blue-600 text-white font-semibold text-xs rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-primary/10 active:scale-[0.98] transition-all"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                <span>Enregistrement...</span>
              </>
            ) : (
              <span>Enregistrer et quitter</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
