"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";

interface VehicleFiltersProps {
  transmissionVal: "all" | "manuelle" | "automatique";
  setTransmissionVal: (v: any) => void;
  fuelTypeVal: "all" | "Diesel" | "Essence" | "Hybride" | "Électrique";
  setFuelTypeVal: (v: any) => void;
  airConditioningVal: "all" | "yes" | "no";
  setAirConditioningVal: (v: any) => void;
  doorsVal: 0 | 3 | 5;
  setDoorsVal: (v: any) => void;
  isAvailableVal?: "all" | "yes" | "no";
  setIsAvailableVal?: (v: any) => void;
  minPriceVal?: number;
  setMinPriceVal?: (v: number) => void;
  maxPriceVal?: number;
  setMaxPriceVal?: (v: number) => void;
  showAvailability?: boolean;
  showPrice?: boolean;
}

const MIN = 0;
const MAX = 1500;
const SVG_W = 520;
const SVG_H = 72;

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
}: {
  min: number;
  max: number;
  setMin: (v: number) => void;
  setMax: (v: number) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"min" | "max" | null>(null);

  const xMin = ((min - MIN) / (MAX - MIN)) * SVG_W;
  const xMax = ((max - MIN) / (MAX - MIN)) * SVG_W;
  const curvePath = bellCurvePath();
  const fillPath = bellFillPath(xMin, xMax);

  const snap = (raw: number) => Math.round(raw / 50) * 50;

  const valueFromClientX = useCallback((clientX: number) => {
    if (!trackRef.current) return MIN;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return snap(MIN + pct * (MAX - MIN));
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const val = valueFromClientX(e.clientX);
    const distMin = Math.abs(val - min);
    const distMax = Math.abs(val - max);
    // If equal distance, prefer the thumb that makes sense based on direction
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

  const handlePointerUp = () => { draggingRef.current = null; };

  const minPct = ((min - MIN) / (MAX - MIN)) * 100;
  const maxPct = ((max - MIN) / (MAX - MIN)) * 100;

  if (!mounted) {
    return <div className="h-[120px]" />;
  }

  return (
    <div className="space-y-0">
      {/* SVG Bell Curve Canvas */}
      <div className="relative w-full overflow-hidden rounded-t-xl">
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          preserveAspectRatio="none"
          className="w-full"
          style={{ height: 72 }}
        >
          {/* Grey background curve fill */}
          <path
            d={`M0,${SVG_H - 4} ${bellCurvePath().replace(`M0,${SVG_H - 4} `, "")} Z`}
            fill="#f1f5f9"
          />
          {/* Blue selected range fill */}
          {fillPath && <path d={fillPath} fill="rgba(59,130,246,0.18)" />}
          {/* Dimmed zones outside selection */}
          <rect x={0} y={0} width={xMin} height={SVG_H - 4} fill="rgba(241,245,249,0.72)" />
          <rect x={xMax} y={0} width={SVG_W - xMax} height={SVG_H - 4} fill="rgba(241,245,249,0.72)" />
          {/* Grey curve */}
          <path d={curvePath} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
          {/* Blue active segment on top */}
          <clipPath id="active-clip">
            <rect x={xMin} y={0} width={xMax - xMin} height={SVG_H} />
          </clipPath>
          <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round" clipPath="url(#active-clip)" />
          {/* Dashed vertical cut lines */}
          <line x1={xMin} y1={0} x2={xMin} y2={SVG_H - 4} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
          <line x1={xMax} y1={0} x2={xMax} y2={SVG_H - 4} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.6" />
          {/* Bottom baseline */}
          <line x1={0} y1={SVG_H - 4} x2={SVG_W} y2={SVG_H - 4} stroke="#e2e8f0" strokeWidth="1" />
        </svg>
      </div>

      {/* Custom Dual Thumb Track — pointer-capture based, both thumbs draggable */}
      <div
        ref={trackRef}
        className="relative h-8 cursor-pointer touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
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
      <div className="flex items-center justify-between pt-3 gap-3">
        {/* Min box */}
        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center justify-between gap-1">
          <span className="text-[9px] uppercase font-extrabold text-blue-400 tracking-wider whitespace-nowrap">Min</span>
          <div className="flex items-baseline gap-0.5">
            <input
              type="number"
              min={MIN}
              max={MAX}
              value={min}
              onChange={(e) => {
                const v = Math.min(max, Math.max(MIN, Number(e.target.value)));
                setMin(v);
              }}
              className="w-14 bg-transparent text-right text-base font-extrabold text-primary outline-none border-none p-0"
            />
            <span className="text-[10px] font-extrabold text-primary">DH</span>
          </div>
        </div>

        {/* Connector dot */}
        <div className="w-5 h-px bg-blue-200 flex-shrink-0" />

        {/* Max box */}
        <div className="flex-1 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 flex items-center justify-between gap-1">
          <span className="text-[9px] uppercase font-extrabold text-blue-400 tracking-wider whitespace-nowrap">Max</span>
          <div className="flex items-baseline gap-0.5">
            <input
              type="number"
              min={MIN}
              max={MAX}
              value={max}
              onChange={(e) => {
                const v = Math.min(MAX, Math.max(min, Number(e.target.value)));
                setMax(v);
              }}
              className="w-14 bg-transparent text-right text-base font-extrabold text-primary outline-none border-none p-0"
            />
            <span className="text-[10px] font-extrabold text-primary">DH</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehicleFilters({
  transmissionVal, setTransmissionVal,
  fuelTypeVal, setFuelTypeVal,
  airConditioningVal, setAirConditioningVal,
  doorsVal, setDoorsVal,
  isAvailableVal, setIsAvailableVal,
  minPriceVal, setMinPriceVal,
  maxPriceVal, setMaxPriceVal,
  showAvailability = true,
  showPrice = true,
}: VehicleFiltersProps) {
  const [isFuelOpen, setIsFuelOpen] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-7 select-none text-gray-800">

      {/* LEFT COLUMN: Transmission, Fuel, Availability */}
      <div className="space-y-6">

        {/* Transmission */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Transmission</span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-200">
            {(["all", "manuelle", "automatique"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTransmissionVal(t)}
                className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${transmissionVal === t ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                {t === "all" ? "Tous" : t === "manuelle" ? "Manu." : "Auto."}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel dropdown */}
        <div className="space-y-2.5 relative">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Carburant</span>
          <div onClick={() => setIsFuelOpen(!isFuelOpen)}
            className={`flex items-center justify-between cursor-pointer w-full h-9 px-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 text-xs font-bold text-gray-700 transition-all ${isFuelOpen ? "border-primary ring-2 ring-primary/10" : ""}`}>
            <span>{fuelTypeVal === "all" ? "Tous les carburants" : fuelTypeVal}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${isFuelOpen ? "rotate-180" : ""}`} />
          </div>
          {isFuelOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsFuelOpen(false)} />
              <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-lg border border-gray-100 shadow-xl z-50 p-1 flex flex-col gap-0.5">
                {([
                  { value: "all", label: "Tous les carburants" },
                  { value: "Diesel", label: "Diesel" },
                  { value: "Essence", label: "Essence" },
                  { value: "Hybride", label: "Hybride" },
                  { value: "Électrique", label: "Électrique" },
                ] as const).map((opt) => (
                  <button key={opt.value} type="button"
                    onClick={() => { setFuelTypeVal(opt.value); setIsFuelOpen(false); }}
                    className={`w-full px-3 py-1.5 rounded-md text-xs font-bold text-left transition-colors cursor-pointer ${fuelTypeVal === opt.value ? "bg-primary text-white" : "text-gray-700 hover:bg-primary/10"}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Availability */}
        {showAvailability && setIsAvailableVal && (
          <div className="space-y-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Disponibilité</span>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-200">
              {(["all", "yes", "no"] as const).map((av) => (
                <button key={av} type="button" onClick={() => setIsAvailableVal(av)}
                  className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${isAvailableVal === av ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                  {av === "all" ? "Tous" : av === "yes" ? "Dispo" : "Indispo"}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN: Air Cond, Doors */}
      <div className="space-y-6">

        {/* Air Conditioning */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Climatisation</span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-200">
            {(["all", "yes", "no"] as const).map((ac) => (
              <button key={ac} type="button" onClick={() => setAirConditioningVal(ac)}
                className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${airConditioningVal === ac ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                {ac === "all" ? "Tous" : ac === "yes" ? "Clim" : "Non Clim"}
              </button>
            ))}
          </div>
        </div>

        {/* Doors */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Portes</span>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-50 rounded-lg border border-gray-200">
            {([0, 3, 5] as const).map((d) => (
              <button key={d} type="button" onClick={() => setDoorsVal(d)}
                className={`py-1.5 text-xs font-bold rounded-md transition-all cursor-pointer ${doorsVal === d ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-800"}`}>
                {d === 0 ? "Tous" : `${d} p.`}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* FULL-WIDTH ROW: Price Range with Bell Curve Visualizer */}
      {showPrice && minPriceVal !== undefined && maxPriceVal !== undefined && setMinPriceVal && setMaxPriceVal && (
        <div className="md:col-span-2 space-y-3 pt-5 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Tarif journalier (DH)</span>
            <span className="text-xs font-bold text-primary">
              {minPriceVal} – {maxPriceVal} DH
            </span>
          </div>
          <PriceCurveVisualizer
            min={minPriceVal}
            max={maxPriceVal}
            setMin={setMinPriceVal}
            setMax={setMaxPriceVal}
          />
        </div>
      )}

    </div>
  );
}
