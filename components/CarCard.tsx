import Image from "next/image";

export interface CarCardProps {
  name: string;
  rating: number;
  reviews: number;
  passengers: number;
  transmission: string;
  airConditioning: boolean;
  doors: number;
  price: number;
  imageSrc: string;
  isAvailable?: boolean;
}

export default function CarCard({
  name,
  rating,
  reviews,
  passengers,
  transmission,
  airConditioning,
  doors,
  price,
  imageSrc,
  isAvailable = true,
}: CarCardProps) {
  return (
    <div className={`relative w-full max-w-[300px] h-[405px] rounded-card bg-white shadow-card flex flex-col overflow-hidden transition-all duration-300 border ${
      isAvailable 
        ? "hover:scale-[1.02] border-transparent hover:border-gray-200 cursor-pointer" 
        : "opacity-50 border-gray-150"
    }`}>
      {/* Diagonal Corner Ribbon Badge */}
      <div className={`absolute top-[16px] right-[-30px] w-[110px] py-0.5 text-[8px] font-sans font-extrabold uppercase tracking-widest text-center text-white rotate-45 z-20 border-b border-white/20 shadow-md ${
        isAvailable 
          ? "bg-[#1572D3]" 
          : "bg-[#E53E3E]"
      }`}>
        {isAvailable ? "Disponible" : "Indisponible"}
      </div>

      {/* Top Image area */}
      <div className="relative w-full h-[155px] flex items-center justify-center bg-gray-50/50 p-4">
        <div className="relative w-full h-full">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="256px"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="flex flex-col gap-6 px-6 pb-6 pt-0 mt-3 flex-1 justify-between">
        
        {/* Name & rating */}
        <div className="flex flex-col gap-3">
          <h3 className="font-sans font-medium text-base leading-[17px] text-black/70 text-left truncate">
            {name}
          </h3>
          <div className="flex flex-row items-center gap-1.5 text-left">
            {/* Star Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#EFBF14"
              stroke="#EFBF14"
              className="w-4 h-4 flex-shrink-0"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="font-sans font-medium text-xs leading-[17px] text-black">
              {rating.toFixed(1)}
            </span>
            <span className="font-sans font-normal text-xs leading-[17px] text-gray-400">
              ({reviews.toLocaleString()} avis)
            </span>
          </div>
        </div>

        {/* Specifications Grid */}
        <div className="flex flex-col gap-2 w-full">
          {/* Row 1 */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-light w-5 h-5 flex-shrink-0"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="font-sans font-normal text-xs leading-[17px] text-gray-light">
                {passengers} passagers
              </span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-light w-5 h-5 flex-shrink-0"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span className="font-sans font-normal text-xs leading-[17px] text-gray-light">
                {transmission}
              </span>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-row items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-light w-5 h-5 flex-shrink-0"
              >
                <line x1="2" x2="22" y1="12" y2="12" />
                <line x1="12" x2="12" y1="2" y2="22" />
                <path d="m20 8-4 4 4 4" />
                <path d="m4 16 4-4-4-4" />
                <path d="m8 20 4-4 4 4" />
                <path d="m16 4-4 4-4 4" />
              </svg>
              <span className="font-sans font-normal text-xs leading-[17px] text-gray-light truncate max-w-[95px]">
                {airConditioning ? "Climatisation" : "Sans clim"}
              </span>
            </div>
            <div className="flex flex-row items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-light w-5 h-5 flex-shrink-0"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M9 3v18" />
                <path d="M9 12h.01" />
              </svg>
              <span className="font-sans font-normal text-xs leading-[17px] text-gray-light">
                {doors} portes
              </span>
            </div>
          </div>
        </div>

        {/* Divider & Pricing & CTA Column */}
        <div className="flex flex-col gap-4 w-full">
          <hr className="w-full border-t border-border-card" />
          
          <div className="flex flex-row justify-between items-center w-full">
            <span className="font-sans font-normal text-sm leading-[17px] text-[#595959]">
              Prix
            </span>
            <div className="flex flex-row items-baseline gap-0.5">
              <span className="font-sans font-semibold text-base leading-[17px] text-text-price">
                {price.toLocaleString()} DH
              </span>
              <span className="font-sans font-normal text-sm leading-[17px] text-text-per-day">
                /jour
              </span>
            </div>
          </div>

          <button 
            disabled={!isAvailable}
            className={`w-full h-10 transition-all font-sans font-medium text-sm leading-[17px] rounded-lg flex items-center justify-center gap-2 ${
              isAvailable 
                ? "bg-primary hover:bg-blue-600 active:scale-95 text-white cursor-pointer" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span>{isAvailable ? "Louer" : "Indisponible"}</span>
            {isAvailable && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white w-4 h-4"
              >
                <line x1="5" x2="19" y1="12" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
