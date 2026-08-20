"use client";

import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MapPin, Calendar, Search, ChevronDown, X } from "lucide-react";
import Button from "./Button";

// Popular Moroccan cities list
const MOROCCAN_CITIES = [
  "Casablanca",
  "Marrakech",
  "Fes",
  "Rabat",
  "Tangier",
  "Agadir",
  "Sefrou",
  "Chefchaouen",
  "Essaouira",
  "Ouarzazate",
  "Meknes",
  "Oujda",
];

export default function SearchWidget() {
  // State for dropdown visibility
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  // Search parameters state
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(Date.now() + 24 * 60 * 60 * 1000) // Default: +1 day
  );

  // Track responsive screen width for number of months to display
  const [monthsShown, setMonthsShown] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setMonthsShown(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
        setIsDateOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter cities based on search term
  const filteredCities = MOROCCAN_CITIES.filter((city) =>
    city.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Format dates for display in French
  const formatDateDisplay = (date: Date | null, placeholder: string) => {
    if (!date) return placeholder;
    return date.toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const closeAllDropdowns = () => {
    setIsLocationOpen(false);
    setIsDateOpen(false);
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    closeAllDropdowns();
    const searchData = {
      location: selectedLocation || "Non sélectionné",
      pickupDate: startDate ? startDate.toISOString() : null,
      returnDate: endDate ? endDate.toISOString() : null,
    };
    alert(
      `Recherche de locations à ${searchData.location}\nDépart : ${formatDateDisplay(
        startDate,
        "Aucun"
      )}\nRetour : ${formatDateDisplay(endDate, "Aucun")}`
    );
  };

  return (
    <div ref={widgetRef} className="relative flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-0 min-h-[72px] w-full">

      {/* Main interactive bar content */}
      <div className="flex flex-col lg:flex-row items-center flex-grow w-full gap-6 lg:gap-0 lg:mr-4">
        
        {/* 1. Location Selector Card Wrapper */}
        <div className="relative w-full lg:w-1/3">
          <div
            onClick={() => {
              setIsLocationOpen(!isLocationOpen);
              setIsDateOpen(false);
            }}
            className={`flex flex-row items-center gap-4 w-full cursor-pointer p-3 rounded-lg hover:bg-gray-50/80 transition-colors z-10 ${
              isLocationOpen ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary flex-shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-between h-[37px] flex-grow text-left">
              <span className="font-sans font-medium text-xs md:text-sm text-gray-500 uppercase tracking-wider">
                Lieu de prise en charge
              </span>
              <div className="flex items-center justify-between">
                <span
                  className={`font-sans font-medium text-sm md:text-base ${
                    selectedLocation ? "text-dark" : "text-placeholder-gray"
                  } truncate`}
                >
                  {selectedLocation || "Rechercher un lieu"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Location Dropdown Popover */}
          {isLocationOpen && (
            <div className="absolute left-0 mt-3 top-[100%] w-full sm:w-[350px] bg-white rounded-xl shadow-widget border border-gray-100 z-50 p-3 transform origin-top transition-all duration-200">
              {/* Search Input field */}
              <div className="relative p-2">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Rechercher des villes marocaines..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-dark placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-sans"
                  autoFocus
                />
                {locationSearch && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocationSearch("");
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Scrollable list of cities */}
              <div className="max-h-80 overflow-y-auto mt-1 py-1 custom-scrollbar">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLocation(city);
                        setLocationSearch("");
                      }}
                      className={`flex items-center gap-4 w-full text-left px-4 py-3 rounded-xl text-base font-sans font-medium transition-colors ${
                        selectedLocation === city
                          ? "bg-primary text-white"
                          : "text-dark hover:bg-primary-light/40"
                      }`}
                    >
                      <MapPin className={`w-4 h-4 ${selectedLocation === city ? "text-white" : "text-primary"}`} />
                      <div className="flex flex-col">
                        <span>{city}</span>
                        <span className={`text-[10px] ${selectedLocation === city ? "text-blue-100" : "text-gray-400"}`}>
                          Maroc
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-sm text-gray-400 font-sans">
                    Aucune ville trouvée
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dates Wrapper */}
        <div className="relative flex flex-col sm:flex-row lg:flex-row items-center w-full lg:w-2/3 gap-6 lg:gap-0">
          
          {/* 2. Pickup Date Selector Card */}
          <div
            onClick={() => {
              setIsDateOpen(!isDateOpen);
              setIsLocationOpen(false);
            }}
            className={`flex flex-row items-center gap-4 w-full lg:w-1/2 cursor-pointer p-3 rounded-lg hover:bg-gray-50/80 transition-colors z-10 lg:border-l lg:border-gray-200 lg:pl-6 ${
              isDateOpen ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-between h-[37px] flex-grow text-left">
              <span className="font-sans font-medium text-xs md:text-sm text-gray-500 uppercase tracking-wider">
                Date de départ
              </span>
              <div className="flex items-center justify-between">
                <span className="font-sans font-medium text-sm md:text-base text-dark">
                  {formatDateDisplay(startDate, "Choisir une date")}
                </span>
                <span className="text-[11px] font-sans text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded ml-2">
                  09:00
                </span>
              </div>
            </div>
          </div>

          {/* 3. Return Date Selector Card */}
          <div
            onClick={() => {
              setIsDateOpen(!isDateOpen);
              setIsLocationOpen(false);
            }}
            className={`flex flex-row items-center gap-4 w-full lg:w-1/2 cursor-pointer p-3 rounded-lg hover:bg-gray-50/80 transition-colors z-10 sm:border-l sm:border-gray-200 sm:pl-6 lg:border-l lg:border-gray-200 lg:pl-6 ${
              isDateOpen ? "bg-gray-50" : ""
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-light text-primary flex-shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="flex flex-col justify-between h-[37px] flex-grow text-left">
              <span className="font-sans font-medium text-xs md:text-sm text-gray-500 uppercase tracking-wider">
                Date de retour
              </span>
              <div className="flex items-center justify-between">
                <span className="font-sans font-medium text-sm md:text-base text-dark">
                  {formatDateDisplay(endDate, "Choisir une date")}
                </span>
                <span className="text-[11px] font-sans text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded ml-2">
                  18:00
                </span>
              </div>
            </div>
          </div>

          {/* Hotel-Style Date Range Picker Popover */}
          {isDateOpen && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute left-0 lg:left-auto lg:right-0 mt-3 top-[100%] bg-white rounded-xl border border-gray-200 z-50 p-4 transform origin-top transition-all duration-200 flex flex-col items-center animate-fadeIn w-full max-w-[calc(100vw-32px)] lg:max-w-none lg:w-[620px]"
            >
              <div className="flex items-center justify-between w-full border-b border-gray-100 pb-3 mb-3">
                <span className="font-sans font-semibold text-sm text-dark">
                  Sélectionner les dates de location
                </span>
                {(startDate || endDate) && (
                  <button
                    type="button"
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                    }}
                    className="font-sans text-xs text-primary font-medium hover:underline"
                  >
                    Effacer les dates
                  </button>
                )}
              </div>
              
              <DatePicker
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                inline
                monthsShown={monthsShown}
                minDate={new Date()}
                disabledKeyboardNavigation
                calendarClassName="rentcar-range-calendar"
              />
            </div>
          )}

        </div>

      </div>

      {/* 4. Search Button */}
      <Button
        label="Rechercher"
        variant="primary"
        onClick={handleSearchSubmit}
        className="w-full lg:w-[159px] h-12 py-0 text-base flex-shrink-0 z-10 transition-transform active:scale-95"
      />

      {/* Desktop-only fix: force the two datepicker months into an aligned flex row.
          Scoped to lg breakpoint so mobile (monthsShown=1) is untouched. */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .rentcar-range-calendar.react-datepicker {
            display: flex !important;
          }
          .rentcar-range-calendar .react-datepicker__month-container {
            float: none !important;
          }
          .rentcar-range-calendar .react-datepicker__month-container + .react-datepicker__month-container {
            border-left: 1px solid #f3f4f6;
          }
        }
      `}</style>
    </div> 
  );
}