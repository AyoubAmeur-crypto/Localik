"use client";

import { useState, useEffect, useRef } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface DeleteUserModalProps {
  isOpen: boolean;
  userEmail: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteUserModal({ isOpen, userEmail, onClose, onConfirm }: DeleteUserModalProps) {
  const [captchaCode, setCaptchaCode] = useState("");
  const [enteredCaptcha, setEnteredCaptcha] = useState("");
  const [deleting, setDeleting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setEnteredCaptcha("");

    setTimeout(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#f3f4f6");
      grad.addColorStop(1, "#e5e7eb");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.stroke();
      }

      ctx.fillStyle = "#111827";
      ctx.font = "bold 24px monospace";
      ctx.textBaseline = "middle";
      ctx.textAlign = "center";
      
      // Draw letters with slight rotation/distortion
      for (let i = 0; i < code.length; i++) {
        const char = code[i];
        ctx.save();
        const x = 30 + i * 24;
        const y = 25 + (Math.random() - 0.5) * 6;
        ctx.translate(x, y);
        ctx.rotate((Math.random() - 0.5) * 0.3);
        ctx.fillText(char, 0, 0);
        ctx.restore();
      }
    }, 50);
  };

  useEffect(() => {
    if (isOpen) {
      generateCaptcha();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (enteredCaptcha !== captchaCode) return;
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-none">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full border border-gray-100 overflow-hidden font-sans scale-100 transition-all flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-white border-b border-gray-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Confirmation de Suppression</h3>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">Vérification de sécurité requise</p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Vous êtes sur le point de supprimer définitivement l'accès du collaborateur <b>{userEmail}</b>.
          </p>

          <div className="rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recopier le code captcha :</span>
              <button 
                type="button" 
                onClick={generateCaptcha} 
                className="text-xs text-primary hover:underline font-bold flex items-center gap-1 cursor-pointer"
                title="Générer un nouveau code"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Nouveau code</span>
              </button>
            </div>

            {/* Canvas Drawing Area */}
            <div className="flex justify-center rounded-lg overflow-hidden h-[54px] bg-white border border-gray-200">
              <canvas 
                ref={canvasRef} 
                width="180" 
                height="50" 
                className="block"
              />
            </div>

            <div>
              <input
                type="text"
                value={enteredCaptcha}
                onChange={(e) => setEnteredCaptcha(e.target.value.toUpperCase())}
                placeholder="Saisir le code captcha"
                className="w-full h-10 px-3 bg-white rounded-lg border border-gray-200 outline-none text-center font-bold text-sm tracking-widest focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all uppercase placeholder-normal text-gray-800"
                disabled={deleting}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={deleting}
            className="py-2.5 px-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold text-sm rounded-lg cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={deleting || enteredCaptcha.length !== 6 || enteredCaptcha !== captchaCode}
            className="py-2.5 px-5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg flex items-center gap-2 cursor-pointer shadow-md shadow-red-650/10 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Suppression...</span>
              </>
            ) : (
              <span>Supprimer le compte</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
