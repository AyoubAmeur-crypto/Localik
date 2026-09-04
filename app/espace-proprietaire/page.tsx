"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import {
  Car,
  Users,
  Settings,
  Plus,
  Trash2,
  Edit,
  Globe,
  Star,
  Snowflake,
  DoorClosed,
  Key,
  LogOut,
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  SlidersHorizontal,
  ShieldCheck,
  UserCheck,
  Home as HomeIcon,
  Lock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Menu,
  SearchX,
  Calendar,
  Bell,
  Phone,
  MapPin,
  Clock,
  Check,
  X,
  DollarSign,
  TrendingUp,
  User,
  Mail,
  Fuel,
  Zap,
} from "lucide-react";

import {
  checkAuth,
  logoutAction,
  getCars,
  getCarsPaginated,
  deleteCar,
  toggleCarAvailability,
  createUserAction,
  getUsersAction,
  deleteUserAction,
  getCurrentUserEmail,
  updateSelfAction,
  getCurrentUserAction,
  getBookingsAction,
  confirmBookingAction,
  returnCarAction,
  deleteBookingAction,
  getBookingsPaginatedAction,
} from "@/lib/db-actions";

import DeleteCarModal from "@/components/admin/DeleteCarModal";
import DeleteUserModal from "@/components/admin/DeleteUserModal";
import ReturnCarModal from "@/components/admin/ReturnCarModal";
import VehicleFilters from "@/components/admin/VehicleFilters";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

interface CarType {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  passengers: number;
  transmission: string;
  airConditioning: boolean;
  doors: number;
  price: number;
  imageSrc: string;
  isAvailable: boolean;
  location: string;
  fuelType?: string;
}

interface UserType {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  username?: string;
  createdAt?: string | null;
}

interface CustomFilterSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
}

function CustomFilterSelect({ label, value, options, onChange }: CustomFilterSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const activeLabel = options.find((opt) => opt.value === value)?.label || value;

  return (
    <div ref={dropdownRef} className="space-y-1 relative flex-grow min-w-[140px] text-left">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">{label}</span>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-10 px-3.5 bg-gray-50 border border-gray-250 hover:border-gray-300 rounded-xl text-xs font-bold text-gray-700 transition-all text-left ${
          isOpen ? "border-primary ring-2 ring-primary/10 bg-white" : ""
        }`}
      >
        <span className="truncate">{activeLabel}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 shrink-0 ml-1.5 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white rounded-xl border border-gray-150 shadow-xl z-50 p-1 flex flex-col gap-0.5 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold text-left transition-colors cursor-pointer ${
                value === opt.value
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DashboardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "vehicles" | "collaborators" | "requests" | "rented" | "settings">("dashboard");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [currentUserDetails, setCurrentUserDetails] = useState<{
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    username: string;
  } | null>(null);
  const [allCars, setAllCars] = useState<CarType[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [clearedWarningIds, setClearedWarningIds] = useState<string[]>([]);
  const [clearedOverdueIds, setClearedOverdueIds] = useState<string[]>([]);
  const [relancedBookingIds, setRelancedBookingIds] = useState<string[]>([]);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [selectedReturnRental, setSelectedReturnRental] = useState<any | null>(null);
  const [isConfirmingReturn, setIsConfirmingReturn] = useState(false);

  const handleClearWarning = (id: string) => {
    const next = [...clearedWarningIds, id];
    setClearedWarningIds(next);
    localStorage.setItem("cleared-warning-bookings", JSON.stringify(next));
  };

  const handleClearOverdue = (id: string) => {
    const next = [...clearedOverdueIds, id];
    setClearedOverdueIds(next);
    localStorage.setItem("cleared-overdue-bookings", JSON.stringify(next));
  };

  const handleToggleRelance = (id: string) => {
    let next: string[];
    if (relancedBookingIds.includes(id)) {
      next = relancedBookingIds.filter((bId) => bId !== id);
      toast.success("Véhicule marqué comme disponible au garage !");
    } else {
      next = [...relancedBookingIds, id];
      toast.success("Véhicule laissé indisponible et relance envoyée !");
    }
    setRelancedBookingIds(next);
    localStorage.setItem("relanced-bookings", JSON.stringify(next));
  };

  const openReturnModal = (rental: any) => {
    setSelectedReturnRental(rental);
    setIsReturnModalOpen(true);
  };

  const handleConfirmReturn = async () => {
    if (!selectedReturnRental) return;
    setIsConfirmingReturn(true);
    try {
      const res = await returnCarAction(selectedReturnRental.id, true);
      if (res.success) {
        toast.success("Véhicule marqué comme retourné et disponible au garage !");
        if (relancedBookingIds.includes(selectedReturnRental.id)) {
          const next = relancedBookingIds.filter((id) => id !== selectedReturnRental.id);
          setRelancedBookingIds(next);
          localStorage.setItem("relanced-bookings", JSON.stringify(next));
        }
        loadBookings();
        loadRented();
        loadData();
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour.");
      }
    } catch (err: any) {
      toast.error(err.message || "Une erreur est survenue.");
    } finally {
      setIsConfirmingReturn(false);
      setIsReturnModalOpen(false);
      setSelectedReturnRental(null);
    }
  };

  // Settings Form States
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPassword, setSettingsPassword] = useState("");
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState("");
  const [settingsFirstName, setSettingsFirstName] = useState("");
  const [settingsLastName, setSettingsLastName] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsUsername, setSettingsUsername] = useState("");
  const [submittingSettings, setSubmittingSettings] = useState(false);

  // Slide-in drawer requests details inspect state
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);

  // Top header bell notification popover open state
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Requests Paginated list & Applied filter states
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [requestsTotal, setRequestsTotal] = useState(0);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsPage, setRequestsPage] = useState(1);
  const [requestsSearch, setRequestsSearch] = useState("");
  const [requestsSearchQuery, setRequestsSearchQuery] = useState("");
  const [requestsLocation, setRequestsLocation] = useState("all");
  const [requestsTransmission, setRequestsTransmission] = useState("all");
  const [requestsFuel, setRequestsFuel] = useState("all");
  const [requestsAirCond, setRequestsAirCond] = useState("all");
  const [requestsDoors, setRequestsDoors] = useState(0);
  const [requestsMinPrice, setRequestsMinPrice] = useState(0);
  const [requestsMaxPrice, setRequestsMaxPrice] = useState(1500);
  const [requestsStartDate, setRequestsStartDate] = useState<Date | null>(null);
  const [requestsEndDate, setRequestsEndDate] = useState<Date | null>(null);

  // Rented Paginated list & Applied filter states
  const [rentedList, setRentedList] = useState<any[]>([]);
  const [rentedTotal, setRentedTotal] = useState(0);
  const [rentedLoading, setRentedLoading] = useState(false);
  const [rentedPage, setRentedPage] = useState(1);
  const [rentedSearch, setRentedSearch] = useState("");
  const [rentedSearchQuery, setRentedSearchQuery] = useState("");
  const [rentedLocation, setRentedLocation] = useState("all");
  const [rentedTransmission, setRentedTransmission] = useState("all");
  const [rentedFuel, setRentedFuel] = useState("all");
  const [rentedAirCond, setRentedAirCond] = useState("all");
  const [rentedDoors, setRentedDoors] = useState(0);
  const [rentedMinPrice, setRentedMinPrice] = useState(0);
  const [rentedMaxPrice, setRentedMaxPrice] = useState(1500);
  const [rentedStartDate, setRentedStartDate] = useState<Date | null>(null);
  const [rentedEndDate, setRentedEndDate] = useState<Date | null>(null);

  // Requests filter drawer states
  const [isRequestsFiltersOpen, setIsRequestsFiltersOpen] = useState(false);
  const [requestsTransmissionDraft, setRequestsTransmissionDraft] = useState<"all" | "manuelle" | "automatique">("all");
  const [requestsFuelDraft, setRequestsFuelDraft] = useState<"all" | "Diesel" | "Essence" | "Hybride" | "Électrique">("all");
  const [requestsAirCondDraft, setRequestsAirCondDraft] = useState<"all" | "yes" | "no">("all");
  const [requestsDoorsDraft, setRequestsDoorsDraft] = useState<0 | 3 | 5>(0);
  const [requestsMinPriceDraft, setRequestsMinPriceDraft] = useState(0);
  const [requestsMaxPriceDraft, setRequestsMaxPriceDraft] = useState(1500);
  const [requestsStartDateDraft, setRequestsStartDateDraft] = useState<Date | null>(null);
  const [requestsEndDateDraft, setRequestsEndDateDraft] = useState<Date | null>(null);

  // Rented filter drawer states
  const [isRentedFiltersOpen, setIsRentedFiltersOpen] = useState(false);
  const [rentedLocationDraft, setRentedLocationDraft] = useState("all");
  const [rentedTransmissionDraft, setRentedTransmissionDraft] = useState<"all" | "manuelle" | "automatique">("all");
  const [rentedFuelDraft, setRentedFuelDraft] = useState<"all" | "Diesel" | "Essence" | "Hybride" | "Électrique">("all");
  const [rentedAirCondDraft, setRentedAirCondDraft] = useState<"all" | "yes" | "no">("all");
  const [rentedDoorsDraft, setRentedDoorsDraft] = useState<0 | 3 | 5>(0);
  const [rentedMinPriceDraft, setRentedMinPriceDraft] = useState(0);
  const [rentedMaxPriceDraft, setRentedMaxPriceDraft] = useState(1500);
  const [rentedStartDateDraft, setRentedStartDateDraft] = useState<Date | null>(null);
  const [rentedEndDateDraft, setRentedEndDateDraft] = useState<Date | null>(null);

  // States to manage render timing for slide out animations
  const [requestsRendered, setRequestsRendered] = useState(false);
  const [rentedRendered, setRentedRendered] = useState(false);

  const formatDateDisplay = (date: Date | null, placeholder: string) => {
    if (!date) return placeholder;
    return new Date(date).toLocaleDateString("fr-FR", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  // Booking States
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Data State
  const [cars, setCars] = useState<CarType[]>([]);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCars, setTotalCars] = useState(0);
  const [carsLoading, setCarsLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSidebarDropdownOpen, setIsSidebarDropdownOpen] = useState(false);
  const [isNavbarDropdownOpen, setIsNavbarDropdownOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active query filters (sent to database)
  const [filterTransmission, setFilterTransmission] = useState<"all" | "manuelle" | "automatique">("all");
  const [filterFuelType, setFilterFuelType] = useState<"all" | "Diesel" | "Essence" | "Hybride" | "Électrique">("all");
  const [filterAirConditioning, setFilterAirConditioning] = useState<"all" | "yes" | "no">("all");
  const [filterDoors, setFilterDoors] = useState<0 | 3 | 5>(0); // 0 means any
  const [filterIsAvailable, setFilterIsAvailable] = useState<"all" | "yes" | "no">("all");
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(1500);

  // Draft filters (local user adjustments, applied on Search or Apply)
  const [transmissionDraft, setTransmissionDraft] = useState<"all" | "manuelle" | "automatique">("all");
  const [fuelTypeDraft, setFuelTypeDraft] = useState<"all" | "Diesel" | "Essence" | "Hybride" | "Électrique">("all");
  const [airConditioningDraft, setAirConditioningDraft] = useState<"all" | "yes" | "no">("all");
  const [doorsDraft, setDoorsDraft] = useState<0 | 3 | 5>(0);
  const [isAvailableDraft, setIsAvailableDraft] = useState<"all" | "yes" | "no">("all");
  const [minPriceDraft, setMinPriceDraft] = useState(0);
  const [maxPriceDraft, setMaxPriceDraft] = useState(1500);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Collaborator Form State
  const [collabEmail, setCollabEmail] = useState("");
  const [collabPassword, setCollabPassword] = useState("");
  const [collabFirstName, setCollabFirstName] = useState("");
  const [collabLastName, setCollabLastName] = useState("");
  const [collabPhone, setCollabPhone] = useState("");
  const [collabUsername, setCollabUsername] = useState("");
  const [submittingCollab, setSubmittingCollab] = useState(false);

  // Collaborator Deletion Captcha State
  const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);

  const isFiltered = !!searchQuery || 
    transmissionDraft !== "all" || 
    fuelTypeDraft !== "all" || 
    airConditioningDraft !== "all" || 
    doorsDraft !== 0 || 
    isAvailableDraft !== "all" || 
    minPriceDraft !== 0 || 
    maxPriceDraft !== 1500;

  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (searchVal) params.set("search", searchVal);
    if (transmissionDraft !== "all") params.set("transmission", transmissionDraft);
    if (fuelTypeDraft !== "all") params.set("fuelType", fuelTypeDraft);
    if (airConditioningDraft !== "all") params.set("airConditioning", airConditioningDraft);
    if (doorsDraft !== 0) params.set("doors", String(doorsDraft));
    if (isAvailableDraft !== "all") params.set("isAvailable", isAvailableDraft);
    if (minPriceDraft !== 0) params.set("minPrice", String(minPriceDraft));
    if (maxPriceDraft !== 1500) params.set("maxPrice", String(maxPriceDraft));
    params.set("page", "1"); // Reset page to 1 on new filter apply
    
    router.push(`${pathname}?${params.toString()}`);
    setIsMobileFiltersOpen(false);
  };

  const handleResetFilters = () => {
    router.push(pathname);
    setIsMobileFiltersOpen(false);
  };

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(p));
    router.push(`${pathname}?${params.toString()}`);
  };

  // Set isMounted for Recharts hydration safety
  useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("cleared-warning-bookings");
    if (saved) {
      try {
        setClearedWarningIds(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
    const savedOverdue = localStorage.getItem("cleared-overdue-bookings");
    if (savedOverdue) {
      try {
        setClearedOverdueIds(JSON.parse(savedOverdue));
      } catch (e) {
        console.error(e);
      }
    }
    const savedRelanced = localStorage.getItem("relanced-bookings");
    if (savedRelanced) {
      try {
        setRelancedBookingIds(JSON.parse(savedRelanced));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Scroll main container to top when page, filters, or tabs update
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [activeTab, currentPage, requestsPage, rentedPage]);

  // Sync active tab with URL query parameter
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["dashboard", "vehicles", "collaborators", "requests", "rented", "settings"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

  // Check auth and load initial collaborators, bookings & cars
  useEffect(() => {
    async function initDashboard() {
      const isAuth = await checkAuth();
      if (!isAuth) {
        router.push("/espace-proprietaire/login");
        return;
      }
      
      const userDetails = await getCurrentUserAction();
      if (userDetails) {
        const emailVal = userDetails.email || "admin";
        setCurrentUserEmail(emailVal);
        setCurrentUserDetails({
          email: emailVal,
          firstName: userDetails.firstName || "",
          lastName: userDetails.lastName || "",
          phone: userDetails.phone || "",
          username: userDetails.username || "",
        });
        setSettingsEmail(emailVal);
        setSettingsFirstName(userDetails.firstName || "");
        setSettingsLastName(userDetails.lastName || "");
        setSettingsPhone(userDetails.phone || "");
        setSettingsUsername(userDetails.username || "");
      } else {
        const email = await getCurrentUserEmail();
        setCurrentUserEmail(email || "admin");
        setSettingsEmail(email || "admin");
      }

      const fetchedUsers = await getUsersAction();
      setUsers(fetchedUsers);

      const resBookings = await getBookingsAction();
      setBookings(resBookings);

      const fetchedCars = await getCars();
      setAllCars(fetchedCars);

      setLoading(false);
    }
    initDashboard();
  }, [router]);

  // Load baseline bookings for notifications count on tab changes
  useEffect(() => {
    if (!loading) {
      loadBookings();
    }
  }, [activeTab, loading]);

  // Load paginated requests when requests filters or page changes
  useEffect(() => {
    if (!loading && activeTab === "requests") {
      loadRequests();
    }
  }, [
    activeTab,
    loading,
    requestsPage,
    requestsSearchQuery,
    requestsTransmission,
    requestsFuel,
    requestsAirCond,
    requestsDoors,
    requestsMinPrice,
    requestsMaxPrice,
    requestsLocation,
    requestsStartDate,
    requestsEndDate,
  ]);

  // Load paginated rented cars when rented filters or page changes
  useEffect(() => {
    if (!loading && activeTab === "rented") {
      loadRented();
    }
  }, [
    activeTab,
    loading,
    rentedPage,
    rentedSearchQuery,
    rentedTransmission,
    rentedFuel,
    rentedAirCond,
    rentedDoors,
    rentedMinPrice,
    rentedMaxPrice,
    rentedLocation,
    rentedStartDate,
    rentedEndDate,
  ]);

  // Animation delays for filter drawers (demandes and voitures louées)
  useEffect(() => {
    if (isRequestsFiltersOpen) {
      setRequestsRendered(true);
    } else {
      const timer = setTimeout(() => {
        setRequestsRendered(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRequestsFiltersOpen]);

  useEffect(() => {
    if (isRentedFiltersOpen) {
      setRentedRendered(true);
    } else {
      const timer = setTimeout(() => {
        setRentedRendered(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isRentedFiltersOpen]);

  // Synchronize URL search parameters to reactive states
  useEffect(() => {
    if (loading) return;
    
    const search = searchParams.get("search") || "";
    const transmission = searchParams.get("transmission") || "all";
    const fuelType = searchParams.get("fuelType") || "all";
    const airConditioning = searchParams.get("airConditioning") || "all";
    const doors = Number(searchParams.get("doors") || "0");
    const isAvailable = searchParams.get("isAvailable") || "all";
    const minPrice = Number(searchParams.get("minPrice") || "0");
    const maxPrice = Number(searchParams.get("maxPrice") || "1500");
    const page = Number(searchParams.get("page") || "1");

    setSearchQuery(search);
    setSearchVal(search);
    setFilterTransmission(transmission as any);
    setTransmissionDraft(transmission as any);
    setFilterFuelType(fuelType as any);
    setFuelTypeDraft(fuelType as any);
    setFilterAirConditioning(airConditioning as any);
    setAirConditioningDraft(airConditioning as any);
    setFilterDoors(doors as any);
    setDoorsDraft(doors as any);
    setFilterIsAvailable(isAvailable as any);
    setIsAvailableDraft(isAvailable as any);
    setFilterMinPrice(minPrice);
    setMinPriceDraft(minPrice);
    setFilterMaxPrice(maxPrice);
    setMaxPriceDraft(maxPrice);
    setCurrentPage(page);
  }, [searchParams, loading]);

  async function loadData(pageToLoad: number = currentPage) {
    const activeFilters = {
      search: searchQuery,
      transmission: filterTransmission,
      fuelType: filterFuelType,
      airConditioning: filterAirConditioning === "all" ? undefined : filterAirConditioning === "yes",
      doors: filterDoors === 0 ? undefined : filterDoors,
      isAvailable: filterIsAvailable === "all" ? undefined : filterIsAvailable === "yes",
      minPrice: filterMinPrice || undefined,
      maxPrice: filterMaxPrice || undefined,
    };
    const result = await getCarsPaginated(pageToLoad, 8, activeFilters);
    const fetchedUsers = await getUsersAction();
    const fetchedAllCars = await getCars();
    if (result.success && result.cars) {
      if (result.cars.length === 0 && result.totalCount > 0 && pageToLoad > 1) {
        handlePageChange(pageToLoad - 1);
        return;
      }
      setCars(result.cars);
      setTotalCars(result.totalCount);
    }
    setUsers(fetchedUsers);
    setAllCars(fetchedAllCars);

    const userDetails = await getCurrentUserAction();
    if (userDetails) {
      const emailVal = userDetails.email || "admin";
      setCurrentUserEmail(emailVal);
      setCurrentUserDetails({
        email: emailVal,
        firstName: userDetails.firstName || "",
        lastName: userDetails.lastName || "",
        phone: userDetails.phone || "",
        username: userDetails.username || "",
      });
      setSettingsEmail(emailVal);
      setSettingsFirstName(userDetails.firstName || "");
      setSettingsLastName(userDetails.lastName || "");
      setSettingsPhone(userDetails.phone || "");
      setSettingsUsername(userDetails.username || "");
    }
  }

  async function loadBookings() {
    setBookingsLoading(true);
    const res = await getBookingsAction();
    setBookings(res);
    setBookingsLoading(false);
  }

  async function loadRequests() {
    setRequestsLoading(true);
    const filters = {
      search: requestsSearchQuery,
      status: "pending",
      location: requestsLocation,
      transmission: requestsTransmission,
      fuelType: requestsFuel,
      airConditioning: requestsAirCond === "all" ? undefined : requestsAirCond === "yes",
      doors: requestsDoors === 0 ? undefined : requestsDoors,
      minPrice: requestsMinPrice || undefined,
      maxPrice: requestsMaxPrice < 1500 ? requestsMaxPrice : undefined,
      startDate: requestsStartDate ? requestsStartDate.toISOString() : undefined,
      endDate: requestsEndDate ? requestsEndDate.toISOString() : undefined,
    };
    const res = await getBookingsPaginatedAction(requestsPage, 8, filters);
    if (res.success) {
      setRequestsList(res.bookings);
      setRequestsTotal(res.totalCount);
    }
    setRequestsLoading(false);
  }

  async function loadRented() {
    setRentedLoading(true);
    const filters = {
      search: rentedSearchQuery,
      status: "confirmed",
      isReturned: false,
      location: rentedLocation,
      transmission: rentedTransmission,
      fuelType: rentedFuel,
      airConditioning: rentedAirCond === "all" ? undefined : rentedAirCond === "yes",
      doors: rentedDoors === 0 ? undefined : rentedDoors,
      minPrice: rentedMinPrice || undefined,
      maxPrice: rentedMaxPrice < 1500 ? rentedMaxPrice : undefined,
      startDate: rentedStartDate ? rentedStartDate.toISOString() : undefined,
      endDate: rentedEndDate ? rentedEndDate.toISOString() : undefined,
    };
    const res = await getBookingsPaginatedAction(rentedPage, 8, filters);
    if (res.success) {
      setRentedList(res.bookings);
      setRentedTotal(res.totalCount);
    }
    setRentedLoading(false);
  }

  // Apply/Reset helpers for Requests filters drawer
  const handleApplyRequestsFilters = () => {
    setRequestsTransmission(requestsTransmissionDraft);
    setRequestsFuel(requestsFuelDraft);
    setRequestsAirCond(requestsAirCondDraft);
    setRequestsDoors(requestsDoorsDraft);
    setRequestsMinPrice(requestsMinPriceDraft);
    setRequestsMaxPrice(requestsMaxPriceDraft);
    setRequestsStartDate(requestsStartDateDraft);
    setRequestsEndDate(requestsEndDateDraft);
    setRequestsPage(1);
    setIsRequestsFiltersOpen(false);
  };

  const handleResetRequestsFilters = () => {
    setRequestsTransmissionDraft("all");
    setRequestsFuelDraft("all");
    setRequestsAirCondDraft("all");
    setRequestsDoorsDraft(0);
    setRequestsMinPriceDraft(0);
    setRequestsMaxPriceDraft(1500);
    setRequestsStartDateDraft(null);
    setRequestsEndDateDraft(null);
    setRequestsTransmission("all");
    setRequestsFuel("all");
    setRequestsAirCond("all");
    setRequestsDoors(0);
    setRequestsMinPrice(0);
    setRequestsMaxPrice(1500);
    setRequestsSearch("");
    setRequestsSearchQuery("");
    setRequestsStartDate(null);
    setRequestsEndDate(null);
    setRequestsPage(1);
    setIsRequestsFiltersOpen(false);
  };

  // Apply/Reset helpers for Rented filters drawer
  const handleApplyRentedFilters = () => {
    setRentedLocation(rentedLocationDraft);
    setRentedTransmission(rentedTransmissionDraft);
    setRentedFuel(rentedFuelDraft);
    setRentedAirCond(rentedAirCondDraft);
    setRentedDoors(rentedDoorsDraft);
    setRentedMinPrice(rentedMinPriceDraft);
    setRentedMaxPrice(rentedMaxPriceDraft);
    setRentedStartDate(rentedStartDateDraft);
    setRentedEndDate(rentedEndDateDraft);
    setRentedPage(1);
    setIsRentedFiltersOpen(false);
  };

  const handleResetRentedFilters = () => {
    setRentedLocationDraft("all");
    setRentedTransmissionDraft("all");
    setRentedFuelDraft("all");
    setRentedAirCondDraft("all");
    setRentedDoorsDraft(0);
    setRentedMinPriceDraft(0);
    setRentedMaxPriceDraft(1500);
    setRentedStartDateDraft(null);
    setRentedEndDateDraft(null);
    setRentedLocation("all");
    setRentedTransmission("all");
    setRentedFuel("all");
    setRentedAirCond("all");
    setRentedDoors(0);
    setRentedMinPrice(0);
    setRentedMaxPrice(1500);
    setRentedSearch("");
    setRentedSearchQuery("");
    setRentedStartDate(null);
    setRentedEndDate(null);
    setRentedPage(1);
    setIsRentedFiltersOpen(false);
  };


  // Unified dynamic filtering effect with 300ms debounce for scalability
  useEffect(() => {
    if (loading) return;

    setCarsLoading(true);
    const delayDebounceFn = setTimeout(async () => {
      const activeFilters = {
        search: searchQuery,
        transmission: filterTransmission,
        fuelType: filterFuelType,
        airConditioning: filterAirConditioning === "all" ? undefined : filterAirConditioning === "yes",
        doors: filterDoors === 0 ? undefined : filterDoors,
        isAvailable: filterIsAvailable === "all" ? undefined : filterIsAvailable === "yes",
        minPrice: filterMinPrice || undefined,
        maxPrice: filterMaxPrice || undefined,
      };
      const result = await getCarsPaginated(currentPage, 8, activeFilters);
      if (result.success && result.cars) {
        if (result.cars.length === 0 && result.totalCount > 0 && currentPage > 1) {
          handlePageChange(currentPage - 1);
          setCarsLoading(false);
          return;
        }
        setCars(result.cars);
        setTotalCars(result.totalCount);
      }
      setCarsLoading(false);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    searchQuery,
    filterTransmission,
    filterFuelType,
    filterAirConditioning,
    filterDoors,
    filterIsAvailable,
    filterMinPrice,
    filterMaxPrice,
    currentPage,
    loading
  ]);



  // Auth Operations
  const handleLogout = async () => {
    const res = await logoutAction();
    if (res.success) {
      toast.success("Déconnexion réussie.");
      router.push("/espace-proprietaire/login");
      router.refresh();
    }
  };

  // Car Availability Toggle
  const handleToggleAvailability = async (id: string) => {
    setCars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isAvailable: !c.isAvailable } : c))
    );

    try {
      const res = await toggleCarAvailability(id);
      if (res.success) {
        toast.success(`Statut mis à jour : ${res.isAvailable ? "Disponible" : "Indisponible"}`);
      } else {
        toast.error(res.error || "Erreur lors de la modification.");
        await loadData();
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
      await loadData();
    }
  };

  // Car Delete Modal State
  const [isDeleteCarModalOpen, setIsDeleteCarModalOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deletingCar, setDeletingCar] = useState(false);

  const handleDeleteCar = (id: string, name: string) => {
    setCarToDelete({ id, name });
    setIsDeleteCarModalOpen(true);
  };

  const handleDeleteCarConfirm = async () => {
    if (!carToDelete) return;
    setDeletingCar(true);
    try {
      const res = await deleteCar(carToDelete.id);
      if (res.success) {
        toast.success(`Le véhicule "${carToDelete.name}" a été supprimé.`);
        await loadData();
        setIsDeleteCarModalOpen(false);
        setCarToDelete(null);
      } else {
        toast.error(res.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setDeletingCar(false);
    }
  };

  const closeDeleteCarModal = () => {
    setIsDeleteCarModalOpen(false);
    setCarToDelete(null);
  };

  // Settings Submit Handler
  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!settingsEmail || settingsEmail.trim() === "") {
      toast.error("L'adresse email ne peut pas être vide.");
      return;
    }

    if (settingsPassword && settingsPassword !== settingsConfirmPassword) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    if (settingsPassword && settingsPassword.length < 5) {
      toast.error("Le mot de passe doit contenir au moins 5 caractères.");
      return;
    }

    setSubmittingSettings(true);
    try {
      const res = await updateSelfAction(
        settingsEmail,
        settingsPassword || undefined,
        settingsFirstName,
        settingsLastName,
        settingsPhone,
        settingsUsername
      );
      if (res.success) {
        toast.success("Paramètres mis à jour avec succès!");
        setCurrentUserEmail(settingsEmail);
        setSettingsPassword("");
        setSettingsConfirmPassword("");
        await loadData();
      } else {
        toast.error(res.error || "Erreur lors de la mise à jour.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setSubmittingSettings(false);
    }
  };

  // Collaborator Submit
  const handleCollabSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!collabEmail || !collabPassword) {
      toast.error("Veuillez remplir tous les champs obligatoires (Email et Mot de passe).");
      return;
    }

    if (collabPassword.length < 5) {
      toast.error("Le mot de passe doit contenir au moins 5 caractères.");
      return;
    }

    setSubmittingCollab(true);

    try {
      const res = await createUserAction(
        collabEmail,
        collabPassword,
        collabFirstName,
        collabLastName,
        collabPhone,
        collabUsername
      );
      if (res.success) {
        toast.success("Nouveau collaborateur ajouté!");
        setCollabEmail("");
        setCollabPassword("");
        setCollabFirstName("");
        setCollabLastName("");
        setCollabPhone("");
        setCollabUsername("");
        await loadData();
      } else {
        toast.error(res.error || "Erreur lors de l'ajout.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    } finally {
      setSubmittingCollab(false);
    }
  };

  // Open / Close Delete User Modal
  const openDeleteUserModal = (user: UserType) => {
    if (currentUserEmail === user.email) {
      toast.error("Vous ne pouvez pas supprimer votre propre compte.");
      return;
    }
    setUserToDelete(user);
    setIsDeleteUserModalOpen(true);
  };

  const closeDeleteUserModal = () => {
    setIsDeleteUserModalOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteUserConfirm = async () => {
    if (!userToDelete) return;
    try {
      const res = await deleteUserAction(userToDelete.id);
      if (res.success) {
        toast.success(`Le compte "${userToDelete.email}" a été supprimé.`);
        closeDeleteUserModal();
        await loadData();
      } else {
        toast.error(res.error || "Erreur lors de la suppression.");
      }
    } catch (err) {
      toast.error("Une erreur est survenue.");
    }
  };

  const pendingRequests = bookings.filter((b) => b.status === "pending");
  const pendingRequestsCount = pendingRequests.length;
  const hasPendingBookings = pendingRequestsCount > 0;

  // Dashboard Calculations
  const totalVehiclesCount = allCars.length;
  const availableVehiclesCount = allCars.filter((c) => c.isAvailable).length;
  const rentedVehiclesCount = allCars.filter((c) => !c.isAvailable).length;
  
  const activeRentalsCount = bookings.filter(
    (b) => b.status === "confirmed" && !b.isReturned
  ).length;
  
  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const getRevenueChartData = () => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = months.map((month) => ({
      name: month,
      revenue: 0,
      bookingsCount: 0,
    }));
    
    bookings
      .filter((b) => b.status === "confirmed")
      .forEach((b) => {
        const date = new Date(b.startDate);
        if (date.getFullYear() === currentYear) {
          const monthIndex = date.getMonth();
          monthlyData[monthIndex].revenue += b.totalPrice || 0;
          monthlyData[monthIndex].bookingsCount += 1;
        }
      });
      
    return monthlyData;
  };

  const getActivityChartData = () => {
    const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Août", "Sep", "Oct", "Nov", "Déc"];
    const currentYear = new Date().getFullYear();
    
    const monthlyData = months.map((month) => ({
      name: month,
      "Demandes": 0,
      "Confirmées": 0,
    }));
    
    bookings.forEach((b) => {
      const date = new Date(b.createdAt || b.startDate);
      if (date.getFullYear() === currentYear) {
        const monthIndex = date.getMonth();
        if (b.status === "pending") {
          monthlyData[monthIndex]["Demandes"] += 1;
        } else if (b.status === "confirmed") {
          monthlyData[monthIndex]["Confirmées"] += 1;
          monthlyData[monthIndex]["Demandes"] += 1;
        }
      }
    });
    
    return monthlyData;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500 mt-4 text-sm font-medium">Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="owner-dashboard-root h-screen bg-gray-50 flex font-sans text-gray-800 w-full overflow-hidden">
      
      {/* Toaster */}
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            fontFamily: "var(--font-sans), sans-serif",
            fontSize: "14px",
            fontWeight: 500,
            borderRadius: "8px",
            boxShadow: "0px 10px 25px -5px rgba(0, 0, 0, 0.1)",
            background: "#1f2937",
            color: "#fff"
          }
        }} 
      />

      {/* Collapsible Left Navigation Sidebar (Desktop) */}
      <aside 
        className={`hidden md:flex flex-col bg-white border-r border-gray-200 h-screen sticky top-0 z-40 transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {!isSidebarCollapsed ? (
            <>
              <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center">
                <Image
                  src="/images/localik.png"
                  alt="Localik Logo"
                  width={82}
                  height={26}
                  className="object-contain"
                  priority
                />
              </Link>
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className="p-1.5 rounded-lg border border-gray-200 hover:border-primary text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
                title="Réduire le menu"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="mx-auto p-1.5 rounded-lg border border-gray-200 hover:border-primary text-gray-400 hover:text-primary hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center flex-shrink-0"
              title="Développer le menu"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {/* Dashboard Tab Link */}
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "text-gray-555 hover:text-gray-800 hover:bg-gray-50"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Tableau de Bord"
          >
            <HomeIcon className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Tableau de Bord</span>}
          </button>

          {/* Vehicules Tab Link */}
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === "vehicles"
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "text-gray-550 hover:text-gray-800 hover:bg-gray-50"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Gestion des Véhicules"
          >
            <Car className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Gestion Véhicules</span>}
          </button>

          {/* Collaborators Tab Link */}
          <button
            onClick={() => setActiveTab("collaborators")}
            className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === "collaborators"
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "text-gray-555 hover:text-gray-800 hover:bg-gray-50"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Collaborateurs"
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Collaborateurs</span>}
          </button>

          {/* Requests Tab Link */}
          <button
            onClick={() => setActiveTab("requests")}
            className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer relative ${
              activeTab === "requests"
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "text-gray-555 hover:text-gray-800 hover:bg-gray-50"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Demandes de Réservation"
          >
            <div className="relative flex items-center justify-center">
              <Calendar className="w-5 h-5 flex-shrink-0" />
              {hasPendingBookings && isSidebarCollapsed && (
                <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex items-center justify-between flex-1 min-w-0">
                <span className="truncate">Demandes</span>
                {hasPendingBookings && (
                  <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 ml-2"></span>
                )}
              </div>
            )}
          </button>

          {/* Rented Cars Tab Link */}
          <button
            onClick={() => setActiveTab("rented")}
            className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === "rented"
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "text-gray-555 hover:text-gray-800 hover:bg-gray-50"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Voitures Louées"
          >
            <Key className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Voitures Louées</span>}
          </button>

          {/* Settings Tab Link */}
          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3.5 px-3 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-primary text-white shadow-md shadow-primary/10"
                : "text-gray-555 hover:text-gray-800 hover:bg-gray-50"
            } ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Paramètres"
          >
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Paramètres</span>}
          </button>
        </nav>

        {/* Sidebar Footer - User details & dropup */}
        <div className="p-3 border-t border-gray-200 relative flex-shrink-0">
          <div 
            onClick={() => setIsSidebarDropdownOpen(!isSidebarDropdownOpen)}
            className={`flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-all cursor-pointer select-none ${isSidebarCollapsed ? "justify-center" : ""}`}
            title="Options utilisateur"
          >
            {/* User Avatar Circle */}
            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 uppercase border border-primary/20">
              {currentUserEmail.substring(0, 2)}
            </div>
            
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider leading-none mb-0.5">Propriétaire</p>
                <p className="text-xs font-bold text-gray-800 truncate leading-none" title={currentUserEmail}>{currentUserEmail}</p>
              </div>
            )}
          </div>

          {/* Dropup popup menu — pops outward when collapsed */}
          {isSidebarDropdownOpen && (
            <div className={`absolute bottom-16 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 font-sans min-w-[200px] ${
              isSidebarCollapsed
                ? "left-full ml-2"          /* collapsed: flies out to the right */
                : "left-3 right-3"          /* expanded: fills the sidebar footer width */
            }`}>
              <div className="px-4 py-2 border-b border-gray-100 text-left">
                <p className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wide">Connecté en tant que :</p>
                <p className="text-xs font-bold text-gray-700 truncate mt-0.5" title={currentUserEmail}>{currentUserEmail}</p>
              </div>
              
              <Link 
                href="/" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={() => setIsSidebarDropdownOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-650 hover:bg-gray-50 transition-colors w-full text-left"
              >
                <HomeIcon className="w-4 h-4 text-gray-400" />
                <span>Retour au site</span>
              </Link>
              
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setIsSidebarDropdownOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-650 hover:bg-gray-50 transition-colors w-full text-left cursor-pointer border-t border-gray-100"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span>Paramètres</span>
              </button>
              
              <button
                onClick={() => {
                  setIsSidebarDropdownOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer border-t border-gray-100"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Navigation Sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-start z-50 p-0 backdrop-blur-sm md:hidden font-sans fade-in-overlay">
          <div className="bg-white h-full w-[260px] shadow-2xl flex flex-col p-0 relative slide-in-drawer-left">
            
            {/* Sidebar Header */}
            <div className="h-16 px-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
              <Link href="/" target="_blank" rel="noopener noreferrer" className="flex items-center" onClick={() => setIsMobileSidebarOpen(false)}>
                <Image
                  src="/images/localik.png"
                  alt="Localik Logo"
                  width={82}
                  height={26}
                  className="object-contain"
                  priority
                />
              </Link>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-primary transition-colors cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Sidebar Links */}
            <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
              <button
                onClick={() => {
                  setActiveTab("dashboard");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === "dashboard"
                    ? "bg-primary text-white"
                    : "text-gray-550 hover:text-gray-800"
                }`}
              >
                <HomeIcon className="w-5 h-5 flex-shrink-0" />
                <span>Tableau de Bord</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("vehicles");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === "vehicles"
                    ? "bg-primary text-white"
                    : "text-gray-550 hover:text-gray-800"
                }`}
              >
                <Car className="w-5 h-5 flex-shrink-0" />
                <span>Gestion Véhicules</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("collaborators");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === "collaborators"
                    ? "bg-primary text-white"
                    : "text-gray-550 hover:text-gray-800"
                }`}
              >
                <Users className="w-5 h-5 flex-shrink-0" />
                <span>Collaborateurs</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("requests");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === "requests"
                    ? "bg-primary text-white"
                    : "text-gray-550 hover:text-gray-800"
                }`}
              >
                <Calendar className="w-5 h-5 flex-shrink-0" />
                <div className="flex items-center justify-between flex-1 min-w-0">
                  <span>Demandes</span>
                  {hasPendingBookings && (
                    <span className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 ml-2"></span>
                  )}
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab("rented");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === "rented"
                    ? "bg-primary text-white"
                    : "text-gray-550 hover:text-gray-800"
                }`}
              >
                <Key className="w-5 h-5 flex-shrink-0" />
                <span>Voitures Louées</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab("settings");
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4.5 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-primary text-white"
                    : "text-gray-550 hover:text-gray-800"
                }`}
              >
                <Settings className="w-5 h-5 flex-shrink-0" />
                <span>Paramètres</span>
              </button>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setIsMobileSidebarOpen(false);
                  handleLogout();
                }}
                className="w-full py-2.5 px-4 border border-red-200 hover:bg-red-50 text-red-650 font-semibold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-550" />
                <span>Déconnexion</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Main Content Area Wrapper */}
      <div ref={mainScrollRef} className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm flex items-center justify-between px-4 md:px-8 flex-shrink-0 font-sans">
          {/* Left: Mobile menu toggle + Context Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg border border-gray-200 text-gray-500 hover:text-primary transition-all cursor-pointer flex items-center justify-center"
              title="Menu de navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Title representing current selection */}
            <h2 className="text-base font-bold text-gray-800 md:text-lg">
              {activeTab === "dashboard"
                ? "Tableau de Bord"
                : activeTab === "vehicles"
                ? "Gestion des Véhicules"
                : activeTab === "collaborators"
                ? "Collaborateurs"
                : activeTab === "rented"
                ? "Voitures Louées"
                : activeTab === "settings"
                ? "Paramètres"
                : "Demandes de Réservation"}
            </h2>
          </div>

          {/* Right: Return to website + User profile */}
          <div className="flex items-center gap-4">
            <Link 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs md:text-sm text-gray-550 hover:text-primary transition-colors flex items-center gap-1.5 font-bold"
            >
              <HomeIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Retour au site</span>
            </Link>

            <span className="text-gray-300 hidden sm:inline">|</span>

            {/* Notifications Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotificationOpen(!isNotificationOpen);
                  setIsNavbarDropdownOpen(false);
                }}
                className="relative bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-primary rounded-xl p-2 transition-all cursor-pointer flex items-center justify-center shadow-sm"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                {hasPendingBookings && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-bold text-white leading-none">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border-none rounded-xl shadow-2xl py-1.5 z-50 font-sans text-left">
                  <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold text-gray-400 tracking-wider font-bold">Notifications ({pendingRequestsCount})</span>
                    {hasPendingBookings && (
                      <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                    )}
                  </div>
                  
                  <div className="max-h-64 overflow-y-auto py-1">
                    {pendingRequests.length > 0 ? (
                      pendingRequests.map((b) => (
                        <button
                          key={b.id}
                          onClick={() => {
                            setActiveTab("requests");
                            setSelectedRequest(b);
                            setIsNotificationOpen(false);
                          }}
                          className="w-full px-4 py-2.5 hover:bg-gray-50 transition-colors text-left flex items-start gap-3 border-b border-gray-50 last:border-b-0 cursor-pointer"
                        >
                          <div className="p-1.5 rounded-lg bg-blue-50 text-primary flex-shrink-0 mt-0.5">
                            <UserCheck className="w-3.5 h-3.5" />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="text-xs font-bold text-gray-800 leading-tight">
                              Nouveau dossier reçu !
                            </p>
                            <p className="text-[10px] text-gray-550 mt-0.5 leading-snug">
                              {b.clientName} souhaite louer la <strong className="text-gray-700 font-extrabold">{b.car?.name || "voiture"}</strong> ({b.totalPrice} DH).
                            </p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-xs text-gray-400 font-semibold">
                        Aucune nouvelle notification
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <span className="text-gray-300 hidden sm:inline">|</span>

            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsNavbarDropdownOpen(!isNavbarDropdownOpen)}
                className="h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-sm flex items-center justify-center uppercase border border-primary/20 cursor-pointer select-none"
              >
                {currentUserEmail.substring(0, 2)}
              </button>

              {isNavbarDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-1.5 z-50 font-sans">
                  <div className="px-4 py-2 border-b border-gray-100 text-left">
                    <p className="text-[9px] uppercase font-extrabold text-gray-400 tracking-wider">Identifiant :</p>
                    <p className="text-xs font-bold text-gray-700 truncate mt-0.5" title={currentUserEmail}>{currentUserEmail}</p>
                  </div>
                  
                  <Link 
                    href="/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsNavbarDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-gray-655 hover:bg-gray-50 transition-colors w-full text-left"
                  >
                    <HomeIcon className="w-4 h-4 text-gray-400" />
                    <span>Retour au site</span>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsNavbarDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors w-full text-left cursor-pointer border-t border-gray-100"
                  >
                    <LogOut className="w-4 h-4 text-red-500" />
                    <span>Déconnexion</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Pane */}
        <main className="max-w-[1440px] mx-auto px-3.5 md:px-6 py-6 flex-1 w-full">

        {/* ALERT / WARNING SYSTEM */}
        {(() => {
          const now = new Date();
          const overBookings = bookings.filter(
            (b) => b.status === "confirmed" && !b.isReturned && new Date(b.endDate).getTime() <= now.getTime() && !clearedOverdueIds.includes(b.id)
          );

          const warningBookings = bookings.filter((b) => {
            if (b.status !== "confirmed" || b.isReturned || clearedWarningIds.includes(b.id)) return false;
            const end = new Date(b.endDate).getTime();
            const diff = end - now.getTime();
            return diff > 0 && diff <= 24 * 60 * 60 * 1000;
          });

          const formatDateDisplay = (date: Date | null, placeholder: string) => {
            if (!date) return placeholder;
            return date.toLocaleDateString("fr-FR", {
              weekday: "short",
              day: "numeric",
              month: "short",
            });
          };

          if (overBookings.length === 0 && warningBookings.length === 0) return null;

          return (
            <div className="flex flex-col gap-3.5 mb-6 w-full font-sans text-left">
              {/* Over rentals prompts */}
              {overBookings.map((booking) => (
                <div key={booking.id} className="bg-red-50/30 border-t-4 border-t-red-400/50 rounded-none p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-none animate-none">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-none bg-red-100/40 text-red-500/80 flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-red-955">Avertissement : Retour de location requis</h4>
                      <p className="text-xs text-red-800 font-semibold mt-0.5">
                        La location pour <strong>{booking.car?.name || "Véhicule"}</strong> avec <strong>{booking.clientName}</strong> (Tél: {booking.clientPhone}) s'est terminée le {formatDateDisplay(new Date(booking.endDate), "")}.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 flex-shrink-0 w-full md:w-auto">
                    <button
                      onClick={() => openReturnModal(booking)}
                      className="flex-1 md:flex-initial py-1.5 px-3.5 bg-green-600 hover:bg-green-700 text-white rounded-none text-xs font-bold transition-all shadow-none cursor-pointer text-center"
                    >
                      Oui, récupéré & disponible
                    </button>
                    <button
                      onClick={() => handleToggleRelance(booking.id)}
                      className="flex-1 md:flex-initial py-1.5 px-3.5 bg-white border border-red-200 hover:bg-red-100/50 text-red-700 rounded-none text-xs font-bold transition-all cursor-pointer text-center"
                    >
                      Toujours loué
                    </button>
                    <button
                      onClick={() => handleClearOverdue(booking.id)}
                      className="p-1.5 hover:bg-red-100 text-red-900 rounded-none transition-colors cursor-pointer flex-shrink-0"
                      title="Effacer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 1 day warning alerts */}
              {warningBookings.map((booking) => (
                <div key={booking.id} className="bg-amber-100 rounded-none p-4 flex items-center justify-between gap-3 shadow-none animate-none">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-none bg-amber-200/50 text-amber-850 flex-shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-amber-955">Avertissement : Retour demain</h4>
                      <p className="text-xs text-amber-800 font-semibold mt-0.5">
                        Le véhicule <strong>{booking.car?.name}</strong> loué par <strong>{booking.clientName}</strong> (Tél: {booking.clientPhone}) doit revenir au garage demain ({formatDateDisplay(new Date(booking.endDate), "")}).
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleClearWarning(booking.id)}
                    className="p-1.5 hover:bg-amber-200/50 text-amber-900 rounded-none transition-colors cursor-pointer flex-shrink-0"
                    title="Effacer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          );
        })()}

        {activeTab === "dashboard" && (
          <div className="flex flex-col gap-5 w-full animate-none p-3 md:p-5">
            {/* Greeting Header */}
            <div className="flex flex-col gap-1 text-left mb-1">
              <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">
                Bonjour, {currentUserDetails?.firstName ? currentUserDetails.firstName.charAt(0).toUpperCase() + currentUserDetails.firstName.slice(1) : currentUserDetails?.username ? currentUserDetails.username.charAt(0).toUpperCase() + currentUserDetails.username.slice(1) : currentUserEmail ? currentUserEmail.split("@")[0].charAt(0).toUpperCase() + currentUserEmail.split("@")[0].slice(1) : "Propriétaire"} ! 👋
              </h1>
              <p className="text-gray-500 text-xs font-semibold">
                Ravi de vous revoir. Voici un aperçu de l'activité et des performances de votre parc automobile aujourd'hui.
              </p>
            </div>


            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              {/* Card 1: Revenue */}
              <div className="bg-white p-4 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Chiffre d'Affaires</span>
                  <div className="p-2 rounded-none bg-blue-50 text-primary">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-880 tracking-tight">
                    {totalRevenue.toLocaleString("fr-FR")} DH
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                    <span>Confirmé via les locations</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Vehicles */}
              <div className="bg-white p-4 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Véhicules</span>
                  <div className="p-2 rounded-none bg-indigo-50 text-indigo-550">
                    <Car className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-880 tracking-tight">
                    {totalVehiclesCount} {totalVehiclesCount > 1 ? "Voitures" : "Voiture"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-500 font-bold">
                    <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-none">{availableVehiclesCount} dispo</span>
                    <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-none">{rentedVehiclesCount} loué{rentedVehiclesCount > 1 ? "s" : ""}</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Pending Requests */}
              <div className="bg-white p-4 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Demandes de Réservation</span>
                  <div className={`p-2 rounded-none ${pendingRequestsCount > 0 ? "bg-amber-50 text-amber-550 animate-pulse" : "bg-gray-50 text-gray-400"}`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-880 tracking-tight">
                    {pendingRequestsCount} en attente
                  </h3>
                  <button
                    onClick={() => setActiveTab("requests")}
                    className="text-[11px] text-primary hover:underline font-bold mt-1 block text-left cursor-pointer"
                  >
                    Gérer les demandes &rarr;
                  </button>
                </div>
              </div>

              {/* Card 4: Active Rentals */}
              <div className="bg-white p-4 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Locations en Cours</span>
                  <div className="p-2 rounded-none bg-emerald-50 text-emerald-555">
                    <Key className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-880 tracking-tight">
                    {activeRentalsCount} active{activeRentalsCount > 1 ? "s" : ""}
                  </h3>
                  <button
                    onClick={() => setActiveTab("rented")}
                    className="text-[11px] text-primary hover:underline font-bold mt-1 block text-left cursor-pointer"
                  >
                    Suivre les véhicules loués &rarr;
                  </button>
                </div>
              </div>

              {/* Card 5: Team Collaborators */}
              <div className="bg-white p-4 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col justify-between gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Collaborateurs</span>
                  <div className="p-2 rounded-none bg-blue-50 text-primary">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-880 tracking-tight">
                    {users.length} {users.length > 1 ? "Comptes" : "Compte"}
                  </h3>
                  <button
                    onClick={() => setActiveTab("collaborators")}
                    className="text-[11px] text-primary hover:underline font-bold mt-1 block text-left cursor-pointer"
                  >
                    Gérer l'équipe &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Chart 1: Revenue Evolution */}
              <div className="bg-white p-4 md:p-5 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">Évolution du Chiffre d'Affaires ({new Date().getFullYear()})</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Somme mensuelle cumulée des locations confirmées.</p>
                </div>
                <div className="w-full h-80">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={getRevenueChartData()}
                        margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1572D3" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#1572D3" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#475569" 
                          fontSize={10} 
                          fontWeight={600}
                          tickLine={false} 
                          axisLine={false} 
                          dy={10}
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={10} 
                          fontWeight={600}
                          tickLine={false} 
                          axisLine={false} 
                          dx={-5}
                          tickFormatter={(value) => value >= 1000 ? `${parseFloat((value / 1000).toFixed(1))}k DH` : `${value} DH`}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: "#1e293b", 
                            border: "none", 
                            borderRadius: "0px", 
                            color: "#fff",
                            fontSize: "12px",
                            fontFamily: "var(--font-sans), sans-serif",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                          }}
                          formatter={(value) => [`${Number(value || 0).toLocaleString()} DH`, "Chiffre d'Affaires"]}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="#1572D3" 
                          strokeWidth={2.5} 
                          fillOpacity={1} 
                          fill="url(#colorRevenue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-none">
                      <span className="text-xs text-gray-400">Chargement de l'analyse...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Chart 2: Activity Comparison */}
              <div className="bg-white p-4 md:p-5 rounded-none shadow-[0_8px_30px_rgba(0,0,0,0.04)] flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">Demandes de Réservation vs Confirmations ({new Date().getFullYear()})</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Nombre total de demandes reçues comparé aux réservations validées.</p>
                </div>
                <div className="w-full h-80">
                  {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getActivityChartData()}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                        barGap={4}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#475569" 
                          fontSize={10} 
                          fontWeight={600}
                          tickLine={false} 
                          axisLine={false} 
                          dy={10}
                        />
                        <YAxis 
                          stroke="#475569" 
                          fontSize={10} 
                          fontWeight={600}
                          tickLine={false} 
                          axisLine={false} 
                          dx={-5}
                          allowDecimals={false}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            background: "#1e293b", 
                            border: "none", 
                            borderRadius: "0px", 
                            color: "#fff",
                            fontSize: "12px",
                            fontFamily: "var(--font-sans), sans-serif",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                          }}
                        />
                        <Legend 
                          verticalAlign="top" 
                          height={36} 
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ 
                            fontSize: "11px", 
                            fontWeight: 600,
                            color: "#475569",
                            paddingBottom: "10px"
                          }}
                        />
                        <Bar 
                          dataKey="Demandes" 
                          fill="#cbd5e1" 
                          radius={[0, 0, 0, 0]} 
                          maxBarSize={16}
                        />
                        <Bar 
                          dataKey="Confirmées" 
                          fill="#1572D3" 
                          radius={[0, 0, 0, 0]} 
                          maxBarSize={16}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-50/50 rounded-none">
                      <span className="text-xs text-gray-400">Chargement de l'analyse...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Redesigned Premium Bottom Quick Access Widget */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm w-full text-left mt-6">
              <div className="mb-6">
                <h3 className="text-base font-extrabold text-gray-900">Raccourcis & Accès Rapide</h3>
                <p className="text-xs text-gray-500 mt-1">Accédez directement aux différentes sections de gestion et configuration de votre espace.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Shortcut 1: Settings */}
                <button
                  onClick={() => setActiveTab("settings")}
                  className="bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-primary/40 hover:shadow-md rounded-2xl p-5 text-left transition-all group flex flex-col justify-between min-h-[160px] cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Settings className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-primary transition-colors">Paramètres du Compte</h4>
                      <p className="text-[11px] text-gray-400 font-semibold mt-1 leading-relaxed">
                        Mettre à jour vos coordonnées, mot de passe et identifiants de connexion.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
                    Aller aux paramètres &rarr;
                  </span>
                </button>

                {/* Shortcut 2: Collaborators */}
                <button
                  onClick={() => setActiveTab("collaborators")}
                  className="bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-primary/40 hover:shadow-md rounded-2xl p-5 text-left transition-all group flex flex-col justify-between min-h-[160px] cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-550 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-primary transition-colors">Gérer les Collaborateurs</h4>
                      <p className="text-[11px] text-gray-400 font-semibold mt-1 leading-relaxed">
                        Créer un nouveau compte d'accès administrateur pour vos collaborateurs.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
                    Gérer l'équipe &rarr;
                  </span>
                </button>

                {/* Shortcut 3: Vehicles */}
                <button
                  onClick={() => setActiveTab("vehicles")}
                  className="bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-primary/40 hover:shadow-md rounded-2xl p-5 text-left transition-all group flex flex-col justify-between min-h-[160px] cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Car className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-primary transition-colors">Flotte de Véhicules</h4>
                      <p className="text-[11px] text-gray-400 font-semibold mt-1 leading-relaxed">
                        Ajouter de nouveaux véhicules ou mettre à jour la disponibilité en ligne.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
                    Gérer la flotte &rarr;
                  </span>
                </button>

                {/* Shortcut 4: Requests */}
                <button
                  onClick={() => setActiveTab("requests")}
                  className="bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-primary/40 hover:shadow-md rounded-2xl p-5 text-left transition-all group flex flex-col justify-between min-h-[160px] cursor-pointer"
                >
                  <div className="flex flex-col gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-550 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-gray-900 group-hover:text-primary transition-colors">Demandes reçues</h4>
                      <p className="text-[11px] text-gray-400 font-semibold mt-1 leading-relaxed">
                        Consulter les dossiers de location en attente et valider les réservations.
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-primary font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-3">
                    Voir les demandes &rarr;
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "vehicles" && (
          <div className="flex flex-col gap-6 w-full animate-none">
            {/* Header section with Title and "Ajouter un véhicule" button */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Catalogue des véhicules</h2>
                <p className="text-sm text-gray-500 mt-1">Créez, modifiez, ou activez la disponibilité de vos voitures de location.</p>
              </div>
              <button
                onClick={() => router.push("/espace-proprietaire/voitures/ajouter")}
                className="px-5 py-2.5 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md shadow-primary/10 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un véhicule</span>
              </button>
            </div>

            {/* Search Input on Top (Not Real-time) */}
            <div className="flex gap-3 w-full items-center">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const params = new URLSearchParams(window.location.search);
                  if (searchVal) params.set("search", searchVal);
                  else params.delete("search");
                  params.set("page", "1");
                  router.push(`${pathname}?${params.toString()}`);
                }}
                className="relative flex-1 flex gap-3"
              >
                <div className="relative flex-1">
                  <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Rechercher par nom de véhicule..."
                    className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm font-semibold rounded-xl transition-all placeholder-gray-450 text-gray-800"
                  />
                </div>
                <button
                  type="submit"
                  className="h-11 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md shadow-primary/10 flex items-center justify-center cursor-pointer active:scale-[0.98] px-3 sm:px-6 gap-2 flex-shrink-0"
                  title="Rechercher"
                >
                  <Search className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Rechercher</span>
                </button>
              </form>
              
              {/* Mobile & Desktop Filters Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(true)}
                className="relative flex h-11 px-3 sm:px-4 items-center justify-center gap-2 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary rounded-xl font-semibold text-sm transition-colors cursor-pointer bg-white flex-shrink-0"
                title="Filtres"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtres</span>
                {isFiltered && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </button>
            </div>

            {/* Catalog Layout - Full Width Grid */}
            <div className="w-full flex flex-col gap-6">
              {carsLoading ? (
                /* Loading skeleton while search/filter request is in flight */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden animate-pulse">
                      <div className="h-[160px] bg-gray-100" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
                        <div className="h-3 bg-gray-100 rounded-lg w-1/2" />
                        <div className="h-3 bg-gray-100 rounded-lg w-2/3" />
                        <div className="flex gap-2 pt-1">
                          <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                          <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : cars.length === 0 ? (
                /* Empty / not-found state */
                <div className="bg-white rounded-2xl border border-gray-200 p-14 text-center flex flex-col items-center justify-center gap-4 shadow-sm w-full">
                  <div className="p-4 rounded-full bg-gray-50 text-gray-400">
                    <SearchX className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-800">
                      {searchQuery || isFiltered ? "Aucun résultat trouvé" : "Catalogue vide"}
                    </h3>
                    <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">
                      {searchQuery || isFiltered
                        ? "Aucun véhicule ne correspond à vos critères. Essayez de modifier les filtres."
                        : "Ajoutez votre premier véhicule pour commencer."}
                    </p>
                  </div>
                  {(searchQuery || isFiltered) && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="mt-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full select-none">
                    {cars.map((car) => (
                      <div
                        key={car.id}
                        className="bg-white rounded-2xl border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden relative group"
                      >
                        {/* Corner availability badge indicator */}
                        <div className={`absolute top-4 left-4 z-10 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white shadow-sm ${
                          car.isAvailable ? "bg-primary" : "bg-red-500"
                        }`}>
                          {car.isAvailable ? "Disponible" : "Indisponible"}
                        </div>

                        {/* Image Area */}
                        <div className="relative w-full h-[160px] bg-gray-50/50 flex items-center justify-center p-4">
                          {car.imageSrc ? (
                            <img
                              src={car.imageSrc}
                              alt={car.name}
                              className="w-full h-full object-contain group-hover:scale-103 transition-transform duration-300"
                            />
                          ) : (
                            <span className="text-xs text-gray-400">Aucune image</span>
                          )}
                        </div>

                        {/* Details Area */}
                        <div className="p-5 flex-1 flex flex-col justify-between">
                          <div className="mb-4">
                            <h3 className="font-extrabold text-base text-gray-900 truncate mb-1" title={car.name}>
                              {car.name}
                            </h3>
                            
                            {/* Location indicator */}
                            <div className="flex items-center gap-1.5 text-xs text-primary font-bold mb-3">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{car.location}</span>
                            </div>
                            
                            {/* Specs grid */}
                            <div className="grid grid-cols-2 gap-y-2.5 gap-x-1 text-xs text-gray-505 border-t border-b border-gray-100 py-3 font-semibold">
                              <div className="flex items-center gap-1.5 truncate">
                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                <span>{car.passengers} places</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <Settings className="w-3.5 h-3.5 text-gray-400" />
                                <span>{car.transmission}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <Fuel className="w-3.5 h-3.5 text-gray-400" />
                                <span>{car.fuelType}</span>
                              </div>
                              <div className="flex items-center gap-1.5 truncate">
                                <Snowflake className="w-3.5 h-3.5 text-gray-400" />
                                <span>{car.airConditioning ? "Clim" : "Non Clim"}</span>
                              </div>
                            </div>
                          </div>

                          {/* Pricing, Toggle, and Action Footer */}
                          <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Tarif journalier</span>
                                <div className="flex items-baseline">
                                  <span className="text-base font-black text-gray-900">{car.price} DH</span>
                                  <span className="text-xs text-gray-400 font-semibold">/jour</span>
                                </div>
                              </div>
                              
                              {/* Availability Toggle Switch */}
                              <div className="flex flex-col items-end">
                                <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Badge en ligne</span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={car.isAvailable} 
                                    onChange={() => handleToggleAvailability(car.id)}
                                    className="sr-only peer" 
                                  />
                                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
                              <button
                                onClick={() => router.push(`/espace-proprietaire/voitures/${car.id}`)}
                                className="py-2 px-3 border border-gray-200 hover:border-primary text-gray-600 hover:text-primary rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Modifier</span>
                              </button>
                              
                              <button
                                onClick={() => handleDeleteCar(car.id, car.name)}
                                className="py-2 px-3 border border-gray-200 text-primary hover:bg-primary hover:text-white hover:border-primary rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer bg-white"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Supprimer</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Custom Premium Pagination Controls */}
                  {Math.ceil(totalCars / 8) > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-gray-100 w-full font-sans select-none">
                      <div className="text-xs font-semibold text-gray-400">
                        Affichage de <span className="text-gray-800 font-bold">{Math.min(totalCars, (currentPage - 1) * 8 + 1)}</span> à{" "}
                        <span className="text-gray-800 font-bold">{Math.min(totalCars, currentPage * 8)}</span> sur{" "}
                        <span className="text-gray-800 font-bold">{totalCars}</span> véhicules
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        {/* Previous Button */}
                        <button
                          type="button"
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="p-2 rounded-lg border border-gray-200 hover:border-primary text-gray-500 hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white flex items-center justify-center"
                          title="Page précédente"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        </button>

                        {/* Page Numbers */}
                        {Array.from({ length: Math.ceil(totalCars / 8) }, (_, i) => i + 1).map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => handlePageChange(p)}
                            className={`h-9 min-w-9 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              currentPage === p
                                ? "bg-primary border-primary text-white shadow-sm shadow-primary/10"
                                : "border-gray-200 hover:border-primary text-gray-600 hover:text-primary bg-white"
                            }`}
                          >
                            {p}
                          </button>
                        ))}

                        {/* Next Button */}
                        <button
                          type="button"
                          disabled={currentPage === Math.ceil(totalCars / 8)}
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="p-2 rounded-lg border border-gray-200 hover:border-primary text-gray-505 hover:text-primary transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed bg-white flex items-center justify-center"
                          title="Page suivante"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sliding Drawer Filter Overlay (Desktop & Mobile) */}
            {isMobileFiltersOpen && (
              <div className="fixed inset-0 bg-black/60 z-50 p-0 backdrop-blur-sm flex justify-end font-sans transition-all duration-300 fade-in-overlay">
                <style>{`
                  @keyframes slideIn {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                  }
                  @keyframes slideInLeft {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(0); }
                  }
                  @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                  }
                  .slide-in-drawer {
                    animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                  .slide-in-drawer-left {
                    animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                  .fade-in-overlay {
                    animation: fadeIn 0.25s ease-out forwards;
                  }
                  .custom-drawer-scroll::-webkit-scrollbar {
                    width: 4px;
                  }
                  .custom-drawer-scroll::-webkit-scrollbar-track {
                    background: transparent;
                  }
                  .custom-drawer-scroll::-webkit-scrollbar-thumb {
                    background-color: #e2e8f0;
                    border-radius: 20px;
                  }
                  .custom-drawer-scroll::-webkit-scrollbar-thumb:hover {
                    background-color: #cbd5e1;
                  }
                `}</style>
                <div className="bg-white h-full w-[640px] max-w-full shadow-2xl flex flex-col relative border-l border-gray-100 slide-in-drawer">
                  
                  {/* Sticky Drawer Header */}
                  <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <span className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      Filtrer les véhicules
                    </span>
                    <button
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-605 transition-colors cursor-pointer"
                      title="Fermer les filtres"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>

                  {/* Scrollable Filters Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 pr-4 custom-drawer-scroll">
                    <VehicleFilters
                      transmissionVal={transmissionDraft}
                      setTransmissionVal={setTransmissionDraft}
                      fuelTypeVal={fuelTypeDraft}
                      setFuelTypeVal={setFuelTypeDraft}
                      airConditioningVal={airConditioningDraft}
                      setAirConditioningVal={setAirConditioningDraft}
                      doorsVal={doorsDraft}
                      setDoorsVal={setDoorsDraft}
                      isAvailableVal={isAvailableDraft}
                      setIsAvailableVal={setIsAvailableDraft}
                      minPriceVal={minPriceDraft}
                      setMinPriceVal={setMinPriceDraft}
                      maxPriceVal={maxPriceDraft}
                      setMaxPriceVal={setMaxPriceDraft}
                    />
                  </div>

                  {/* Sticky Drawer Footer */}
                  <div className="p-5 border-t border-gray-100 bg-white flex items-center gap-3 flex-shrink-0">
                    {isFiltered && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="py-2.5 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                      >
                        Réinitialiser
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleApplyFilters}
                      className="flex-1 py-2.5 px-5 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center active:scale-[0.98] transition-all shadow-md shadow-primary/10"
                    >
                      Appliquer les filtres
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* Tab 2: Collaborators */}
        {activeTab === "collaborators" && (
          <div className="flex flex-col gap-8 w-full text-left">
            
            {/* Form to Add User */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm w-full">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Ajouter un Collaborateur</h2>
              <p className="text-xs text-gray-500 mb-6 font-medium">Chaque collaborateur dispose de privilèges super-administrateur complets.</p>
              
              <form onSubmit={handleCollabSubmit} className="space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="collabFirstName" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Prénom
                    </label>
                    <input
                      id="collabFirstName"
                      type="text"
                      value={collabFirstName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCollabFirstName(val);
                        // Auto-generate username: remove accents and non-alphanumeric chars
                        const generated = (val + collabLastName)
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/[^a-z0-9]/g, "");
                        setCollabUsername(generated);
                      }}
                      placeholder="ex: Jean"
                      disabled={submittingCollab}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 placeholder-gray-400 font-semibold"
                    />
                  </div>
                  <div>
                    <label htmlFor="collabLastName" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Nom
                    </label>
                    <input
                      id="collabLastName"
                      type="text"
                      value={collabLastName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCollabLastName(val);
                        // Auto-generate username: remove accents and non-alphanumeric chars
                        const generated = (collabFirstName + val)
                          .toLowerCase()
                          .normalize("NFD")
                          .replace(/[\u0300-\u036f]/g, "")
                          .replace(/[^a-z0-9]/g, "");
                        setCollabUsername(generated);
                      }}
                      placeholder="ex: Dupont"
                      disabled={submittingCollab}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 placeholder-gray-400 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="collabUsername" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Pseudo / Identifiant (Généré)
                    </label>
                    <input
                      id="collabUsername"
                      type="text"
                      value={collabUsername}
                      onChange={(e) => setCollabUsername(e.target.value)}
                      placeholder="ex: jeandupont"
                      disabled={submittingCollab}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 placeholder-gray-400 font-semibold bg-gray-50"
                    />
                  </div>
                  <div>
                    <label htmlFor="collabPhone" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Téléphone
                    </label>
                    <input
                      id="collabPhone"
                      type="tel"
                      value={collabPhone}
                      onChange={(e) => setCollabPhone(e.target.value)}
                      placeholder="ex: 0612345678"
                      disabled={submittingCollab}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 placeholder-gray-400 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Adresse Email (Obligatoire)
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={collabEmail}
                    onChange={(e) => setCollabEmail(e.target.value)}
                    placeholder="email@localik.com"
                    disabled={submittingCollab}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 placeholder-gray-400 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="pass" className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Mot de passe (Obligatoire)
                  </label>
                  <input
                    id="pass"
                    type="password"
                    value={collabPassword}
                    onChange={(e) => setCollabPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={submittingCollab}
                    className="w-full h-10 px-3 rounded-lg border border-gray-200 outline-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all text-gray-800 placeholder-gray-400"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingCollab}
                  className="w-full h-10 rounded-lg bg-primary hover:bg-blue-600 text-white font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-primary/10"
                >
                  {submittingCollab ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Ajout en cours...</span>
                    </>
                  ) : (
                    <span>Ajouter le compte</span>
                  )}
                </button>
              </form>
            </div>

            {/* List to view Users (flex col cards) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 shadow-sm w-full">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Comptes d'accès</h2>
              <p className="text-xs text-gray-500 mb-6 font-medium">Liste des utilisateurs autorisés. Chaque utilisateur peut supprimer d'autres collaborateurs (sauf son propre compte en cours).</p>
              
              <div className="flex flex-col gap-4">
                {users.map((u) => {
                  const isSelf = currentUserEmail === u.email;
                  return (
                    <div
                      key={u.id}
                      className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5 transition-all hover:shadow-md hover:border-primary/45 group w-full"
                    >
                      {/* Profile & Initials Avatar */}
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="h-12 w-12 rounded-2xl bg-blue-50 text-primary flex items-center justify-center font-extrabold text-sm uppercase border border-blue-100 shrink-0 shadow-2xs group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                          {u.firstName && u.lastName ? `${u.firstName[0]}${u.lastName[0]}` : u.email.slice(0, 2)}
                        </div>
                        
                        <div className="flex flex-col min-w-0 text-left">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold text-base text-gray-900 truncate group-hover:text-primary transition-colors leading-tight">
                              {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : "Collaborateur"}
                            </span>
                            {u.username && (
                              <span className="text-[10px] text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200/50">@{u.username}</span>
                            )}
                            {isSelf && (
                              <span className="text-[10px] px-2 py-0.5 bg-primary/10 rounded-lg text-primary font-bold border border-primary/20 shrink-0">Moi</span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 font-semibold flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            <span>{u.email}</span>
                          </span>
                          {u.phone && (
                            <span className="text-xs text-gray-500 mt-1 font-semibold flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5 text-gray-400" />
                              <span>{u.phone}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle: Role, Created Date & Status */}
                      <div className="flex flex-row flex-wrap sm:flex-nowrap items-center gap-6 justify-between lg:justify-start border-t border-b lg:border-none border-gray-100 py-3 lg:py-0 w-full lg:w-auto">
                        {/* Role */}
                        <div className="flex flex-col justify-center min-w-[120px]">
                          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Rôle système</span>
                          <div className="mt-1">
                            {(u.username === "admin" || u.email === "admin") ? (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                                Propriétaire
                              </span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-blue-50 text-primary border border-blue-100">
                                Collaborateur
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Date Joined */}
                        <div className="flex flex-col justify-center min-w-[140px]">
                          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Date d'inscription</span>
                          <span className="text-xs font-semibold text-gray-700 mt-1.5">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" }) : "Non spécifiée"}
                          </span>
                        </div>

                        {/* Status */}
                        <div className="flex flex-col justify-center min-w-[80px]">
                          <span className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Statut</span>
                          <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold mt-1.5">
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> Actif
                          </span>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center justify-between sm:justify-end gap-2 w-full lg:w-auto lg:flex-shrink-0">
                        <a
                          href={`mailto:${u.email}`}
                          className="p-2 border border-gray-200 hover:border-primary text-gray-500 hover:text-primary rounded-xl transition-colors cursor-pointer bg-white"
                          title="Envoyer un email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        {u.phone && (
                          <a
                            href={`tel:${u.phone}`}
                            className="p-2 border border-gray-200 hover:border-primary text-gray-500 hover:text-primary rounded-xl transition-colors cursor-pointer bg-white"
                            title="Appeler"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                        )}
                        {!isSelf && (
                          <button
                            onClick={() => openDeleteUserModal(u)}
                            className="p-2 border border-gray-200 hover:border-red-250 text-gray-400 hover:text-red-600 rounded-xl transition-colors cursor-pointer bg-white"
                            title="Supprimer ce collaborateur"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* Tab 3: Booking Requests (Demandes) */}
        {activeTab === "requests" && (
          <div className="flex flex-col gap-6 w-full animate-none text-left">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Demandes de réservation</h2>
              <p className="text-sm text-gray-500 mt-1">Gérez les demandes de location client reçues. Filtrez et recherchez par client, voiture, dates ou localisation.</p>
            </div>


            {/* Search + Filters Toolbar — same as Gestion Véhicules */}
            <div className="flex gap-3 w-full items-center">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={requestsSearch}
                  onChange={(e) => setRequestsSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setRequestsSearchQuery(requestsSearch); setRequestsPage(1); } }}
                  placeholder="Rechercher par client, voiture..."
                  className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm font-semibold rounded-xl transition-all placeholder-gray-400 text-gray-800"
                />
              </div>
              <button
                type="button"
                onClick={() => { setRequestsSearchQuery(requestsSearch); setRequestsPage(1); }}
                className="h-11 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md shadow-primary/10 flex items-center justify-center cursor-pointer active:scale-[0.98] px-3 sm:px-6 gap-2 flex-shrink-0"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRequestsTransmissionDraft(requestsTransmission as any);
                  setRequestsFuelDraft(requestsFuel as any);
                  setRequestsAirCondDraft(requestsAirCond as any);
                  setRequestsDoorsDraft(requestsDoors as any);
                  setRequestsMinPriceDraft(requestsMinPrice);
                  setRequestsMaxPriceDraft(requestsMaxPrice);
                  setRequestsStartDateDraft(requestsStartDate);
                  setRequestsEndDateDraft(requestsEndDate);
                  setIsRequestsFiltersOpen(true);
                }}
                className="relative flex h-11 px-3 sm:px-4 items-center justify-center gap-2 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary rounded-xl font-semibold text-sm transition-colors cursor-pointer bg-white flex-shrink-0"
                title="Filtres"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtres</span>
                {(requestsTransmission !== "all" || requestsFuel !== "all" || requestsAirCond !== "all" || requestsDoors !== 0 || requestsMinPrice !== 0 || requestsMaxPrice !== 1500 || requestsStartDate || requestsEndDate) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </button>
            </div>

            {/* Right-to-left Filter Drawer — same style as Gestion Véhicules */}
            {requestsRendered && (
              <div
                className={`fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex justify-end font-sans ${
                  isRequestsFiltersOpen ? "fade-in-overlay" : "fade-out-overlay"
                }`}
                onClick={() => setIsRequestsFiltersOpen(false)}
              >
                <div
                  className={`bg-white h-full w-[640px] max-w-full shadow-2xl flex flex-col relative border-l border-gray-100 ${
                    isRequestsFiltersOpen ? "slide-in-drawer" : "slide-out-drawer"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <span className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      Filtrer les demandes
                    </span>
                    <button
                      onClick={() => setIsRequestsFiltersOpen(false)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Filters */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-drawer-scroll">
                    <VehicleFilters
                      transmissionVal={requestsTransmissionDraft}
                      setTransmissionVal={setRequestsTransmissionDraft}
                      fuelTypeVal={requestsFuelDraft}
                      setFuelTypeVal={setRequestsFuelDraft}
                      airConditioningVal={requestsAirCondDraft}
                      setAirConditioningVal={setRequestsAirCondDraft}
                      doorsVal={requestsDoorsDraft}
                      setDoorsVal={setRequestsDoorsDraft}
                      showAvailability={false}
                      showPrice={false}
                    />

                    {/* Date Range + Location */}
                    <div className="pt-5 border-t border-gray-100 space-y-5">
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Localisation</span>
                        <CustomFilterSelect
                          label=""
                          value={requestsLocation}
                          onChange={setRequestsLocation}
                          options={[
                            { value: "all", label: "Toutes les villes" },
                            { value: "Casablanca", label: "Casablanca" },
                            { value: "Rabat", label: "Rabat" },
                            { value: "Marrakech", label: "Marrakech" },
                            { value: "Tanger", label: "Tanger" },
                            { value: "Fès", label: "Fès" },
                            { value: "Agadir", label: "Agadir" },
                          ]}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Période de location</span>
                        <div className="relative flex items-center justify-between gap-2 bg-gray-50 border border-gray-250 hover:border-gray-300 rounded-xl px-3.5 py-1 text-xs font-bold text-gray-700 transition-all select-none">
                          <DatePicker
                            selectsRange
                            startDate={requestsStartDateDraft}
                            endDate={requestsEndDateDraft}
                            onChange={(dates) => {
                              const [start, end] = dates;
                              setRequestsStartDateDraft(start);
                              setRequestsEndDateDraft(end);
                            }}
                            className="w-full bg-transparent outline-none border-none py-1.5 cursor-pointer font-sans"
                            placeholderText="Choisir la période (Départ → Retour)"
                            dateFormat="dd/MM/yyyy"
                            isClearable
                            popperProps={{ strategy: "fixed" }}
                          />
                          <Calendar className="w-4 h-4 text-gray-400 shrink-0 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-5 border-t border-gray-100 bg-white flex items-center gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleResetRequestsFilters}
                      className="py-2.5 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                    >
                      Réinitialiser
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyRequestsFilters}
                      className="flex-1 py-2.5 px-5 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center active:scale-[0.98] transition-all shadow-md shadow-primary/10"
                    >
                      Appliquer les filtres
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Requests List */}
            {requestsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-gray-400 text-xs font-semibold mt-3">Chargement des demandes...</p>
              </div>
            ) : requestsList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm w-full">
                <div className="p-4 rounded-full bg-gray-50 text-gray-400">
                  <Calendar className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Aucune demande trouvée</h3>
                  <p className="text-gray-450 text-sm max-w-xs mx-auto mt-1">
                    {requestsSearchQuery || requestsLocation !== "all" || requestsTransmission !== "all" || requestsFuel !== "all" || requestsStartDate || requestsEndDate
                      ? "Aucun résultat ne correspond à vos filtres."
                      : "Les demandes créées par les clients apparaîtront ici."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 w-full">
                {requestsList.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedRequest(booking)}
                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-4 hover:border-primary/40 group text-left"
                  >
                    {/* Car icon badge + name */}
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                        <Car className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider truncate">
                          {booking.car?.name || "Véhicule supprimé"}
                        </span>
                        <h4 className="font-extrabold text-sm text-gray-800 mt-0.5">{booking.clientName}</h4>
                        <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-gray-500">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-gray-400" />
                            {booking.clientPhone}
                          </span>
                          <span className="hidden sm:flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {booking.pickupLocation}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="hidden md:flex flex-col text-right flex-shrink-0">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Période</span>
                      <span className="text-xs font-bold text-gray-700 mt-0.5">
                        {new Date(booking.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                        {" → "}
                        {new Date(booking.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                      </span>
                      <span className="text-xs font-extrabold text-primary mt-0.5">{booking.totalPrice} DH</span>
                    </div>

                    {/* Status + Arrow */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white bg-amber-500">
                        En attente
                      </span>
                      <div className="h-8 w-8 rounded-full border border-gray-200 group-hover:border-primary group-hover:bg-blue-50 flex items-center justify-center text-gray-400 group-hover:text-primary transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {requestsTotal > 8 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setRequestsPage((p) => Math.max(1, p - 1))}
                  disabled={requestsPage === 1}
                  className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Précédent
                </button>
                {Array.from({ length: Math.ceil(requestsTotal / 8) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setRequestsPage(p)}
                    className={`w-8 h-8 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      p === requestsPage ? "bg-primary text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setRequestsPage((p) => Math.min(Math.ceil(requestsTotal / 8), p + 1))}
                  disabled={requestsPage === Math.ceil(requestsTotal / 8)}
                  className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}

            {/* Right-to-Left Sliding Drawer for Request Details */}
            {selectedRequest && (
              <div
                className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex justify-end font-sans"
                onClick={() => setSelectedRequest(null)}
              >
                <style>{`
                  @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                  }
                  .slide-in-drawer-right {
                    animation: slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                  }
                `}</style>
                <div
                  className="bg-white h-full w-[460px] max-w-full shadow-2xl flex flex-col relative slide-in-drawer-right"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0 bg-gray-50/50">
                    <span className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Détails de la demande
                    </span>
                    <button
                      onClick={() => setSelectedRequest(null)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  {/* Drawer Body */}
                  <div className="flex-grow overflow-y-auto p-6 space-y-5">
                    {/* Vehicle Card */}
                    <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider">Véhicule</span>
                        <h4 className="font-extrabold text-sm text-gray-800 mt-0.5">{selectedRequest.car?.name || "Véhicule supprimé"}</h4>
                        <span className="text-[11px] font-bold text-gray-500 mt-0.5">{selectedRequest.car?.price} DH / jour</span>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-3 text-left">
                      <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">Informations Client</h5>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Nom complet</span>
                        <span className="text-sm font-bold text-gray-800 mt-0.5">{selectedRequest.clientName}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Téléphone</span>
                        <a href={`tel:${selectedRequest.clientPhone}`} className="text-sm font-bold text-primary hover:underline mt-0.5 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                          {selectedRequest.clientPhone}
                        </a>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Lieu de prise en charge</span>
                        <span className="text-sm font-bold text-gray-800 mt-0.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          {selectedRequest.pickupLocation} (Maroc)
                        </span>
                      </div>
                    </div>

                    {/* Dates - Separated Cards */}
                    <div className="space-y-3 text-left">
                      <h5 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-1.5">Période de location</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Départ</span>
                          <span className="text-sm font-extrabold text-gray-800">
                            {new Date(selectedRequest.startDate).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 flex flex-col gap-1">
                          <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider">Retour</span>
                          <span className="text-sm font-extrabold text-gray-800">
                            {new Date(selectedRequest.endDate).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex justify-between items-center bg-primary/5 border border-primary/10 rounded-2xl p-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-primary/70 font-bold uppercase">Montant total</span>
                        <span className="text-xs text-gray-400 font-semibold mt-0.5">Calculé sur la période</span>
                      </div>
                      <span className="text-xl font-black text-primary">{selectedRequest.totalPrice} DH</span>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-100 p-3.5 rounded-xl">
                      <span className="text-xs font-bold text-gray-600">Statut actuel :</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-white bg-amber-500">
                        En attente
                      </span>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-5 border-t border-gray-100 bg-white flex flex-col gap-2.5 flex-shrink-0">
                    <button
                      type="button"
                      onClick={async () => {
                        const res = await confirmBookingAction(selectedRequest.id);
                        if (res.success) {
                          toast.success("Réservation confirmée ! Le véhicule est maintenant indisponible.");
                          setSelectedRequest(null);
                          loadBookings();
                          loadRequests();
                          loadData();
                        } else {
                          toast.error(res.error || "Erreur.");
                        }
                      }}
                      className="w-full py-3 px-5 bg-primary hover:bg-blue-600 text-white font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md shadow-primary/20"
                    >
                      <Check className="w-4 h-4" />
                      <span>Approuver la demande</span>
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        if (confirm(`Supprimer la demande de ${selectedRequest.clientName} ?`)) {
                          const res = await deleteBookingAction(selectedRequest.id);
                          if (res.success) {
                            toast.success("Demande supprimée.");
                            setSelectedRequest(null);
                            loadBookings();
                            loadRequests();
                          } else {
                            toast.error(res.error || "Erreur.");
                          }
                        }
                      }}
                      className="w-full py-3 px-5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Rejeter / Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Rented Cars (Voitures Louées) */}
        {activeTab === "rented" && (
          <div className="flex flex-col gap-6 w-full animate-none text-left font-sans">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Suivi des voitures louées</h2>
              <p className="text-sm text-gray-500 mt-1">
                Visualisez les locations en cours, filtrez et suivez les durées restantes.
              </p>
            </div>


            {/* Search + Filters Toolbar — same as Gestion Véhicules */}
            <div className="flex gap-3 w-full items-center">
              <div className="relative flex-1">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={rentedSearch}
                  onChange={(e) => setRentedSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { setRentedSearchQuery(rentedSearch); setRentedPage(1); } }}
                  placeholder="Rechercher par client, voiture..."
                  className="w-full h-11 pl-11 pr-4 bg-white border border-gray-200 hover:border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm font-semibold rounded-xl transition-all placeholder-gray-400 text-gray-800"
                />
              </div>
              <button
                type="button"
                onClick={() => { setRentedSearchQuery(rentedSearch); setRentedPage(1); }}
                className="h-11 rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold text-sm transition-all shadow-md shadow-primary/10 flex items-center justify-center cursor-pointer active:scale-[0.98] px-3 sm:px-6 gap-2 flex-shrink-0"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span className="hidden sm:inline">Rechercher</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRentedLocationDraft(rentedLocation);
                  setRentedTransmissionDraft(rentedTransmission as any);
                  setRentedFuelDraft(rentedFuel as any);
                  setRentedAirCondDraft(rentedAirCond as any);
                  setRentedDoorsDraft(rentedDoors as any);
                  setRentedMinPriceDraft(rentedMinPrice);
                  setRentedMaxPriceDraft(rentedMaxPrice);
                  setRentedStartDateDraft(rentedStartDate);
                  setRentedEndDateDraft(rentedEndDate);
                  setIsRentedFiltersOpen(true);
                }}
                className="relative flex h-11 px-3 sm:px-4 items-center justify-center gap-2 border border-gray-200 hover:border-primary text-gray-700 hover:text-primary rounded-xl font-semibold text-sm transition-colors cursor-pointer bg-white flex-shrink-0"
                title="Filtres"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filtres</span>
                {(rentedLocation !== "all" || rentedTransmission !== "all" || rentedFuel !== "all" || rentedAirCond !== "all" || rentedDoors !== 0 || rentedMinPrice !== 0 || rentedMaxPrice !== 1500 || rentedStartDate || rentedEndDate) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500" />
                )}
              </button>
            </div>

            {/* Right-to-left Filter Drawer */}
            {rentedRendered && (
              <div
                className={`fixed inset-0 bg-black/60 z-50 backdrop-blur-sm flex justify-end font-sans ${
                  isRentedFiltersOpen ? "fade-in-overlay" : "fade-out-overlay"
                }`}
                onClick={() => setIsRentedFiltersOpen(false)}
              >
                <div
                  className={`bg-white h-full w-[640px] max-w-full shadow-2xl flex flex-col relative border-l border-gray-100 ${
                    isRentedFiltersOpen ? "slide-in-drawer" : "slide-out-drawer"
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Drawer Header */}
                  <div className="h-16 px-6 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                    <span className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      Filtrer les voitures louées
                    </span>
                    <button
                      onClick={() => setIsRentedFiltersOpen(false)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Scrollable Filters */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-drawer-scroll">
                    <VehicleFilters
                      transmissionVal={rentedTransmissionDraft}
                      setTransmissionVal={setRentedTransmissionDraft}
                      fuelTypeVal={rentedFuelDraft}
                      setFuelTypeVal={setRentedFuelDraft}
                      airConditioningVal={rentedAirCondDraft}
                      setAirConditioningVal={setRentedAirCondDraft}
                      doorsVal={rentedDoorsDraft}
                      setDoorsVal={setRentedDoorsDraft}
                      showAvailability={false}
                      showPrice={false}
                    />

                    {/* Date Range + Location */}
                    <div className="pt-5 border-t border-gray-150 space-y-5">
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400">Localisation</span>
                        <CustomFilterSelect
                          label=""
                          value={rentedLocationDraft}
                          onChange={setRentedLocationDraft}
                          options={[
                            { value: "all", label: "Toutes les villes" },
                            ...Array.from(
                              new Set(
                                bookings
                                  .filter((b) => b.status === "confirmed" && !b.isReturned && b.pickupLocation)
                                  .map((b) => b.pickupLocation)
                              )
                            )
                              .sort()
                              .map((city) => ({ value: city, label: city }))
                          ]}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block">Période de location</span>
                        <div className="relative flex items-center justify-between gap-2 bg-gray-50 border border-gray-250 hover:border-gray-300 rounded-xl px-3.5 py-1 text-xs font-bold text-gray-700 transition-all select-none">
                          <DatePicker
                            selectsRange
                            startDate={rentedStartDateDraft}
                            endDate={rentedEndDateDraft}
                            onChange={(dates) => {
                              const [start, end] = dates;
                              setRentedStartDateDraft(start);
                              setRentedEndDateDraft(end);
                            }}
                            className="w-full bg-transparent outline-none border-none py-1.5 cursor-pointer font-sans"
                            placeholderText="Choisir la période (Départ → Retour)"
                            dateFormat="dd/MM/yyyy"
                            isClearable
                            popperProps={{ strategy: "fixed" }}
                          />
                          <Calendar className="w-4 h-4 text-gray-400 shrink-0 pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Drawer Footer */}
                  <div className="p-5 border-t border-gray-100 bg-white flex items-center gap-3 flex-shrink-0">
                    <button
                      type="button"
                      onClick={handleResetRentedFilters}
                      className="py-2.5 px-5 border border-gray-200 hover:bg-gray-50 text-gray-600 font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer transition-colors active:scale-95"
                    >
                      Réinitialiser
                    </button>
                    <button
                      type="button"
                      onClick={handleApplyRentedFilters}
                      className="flex-1 py-2.5 px-5 bg-primary hover:bg-blue-600 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center active:scale-[0.98] transition-all shadow-md shadow-primary/10"
                    >
                      Appliquer les filtres
                    </button>
                  </div>
                </div>
              </div>
            )}
            {/* Rented Cars List */}
            {rentedLoading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm w-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-gray-400 text-xs font-semibold mt-3">Chargement des locations en cours...</p>
              </div>
            ) : rentedList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center flex flex-col items-center justify-center gap-4 shadow-sm w-full">
                <div className="p-4 rounded-full bg-gray-50 text-gray-400">
                  <Key className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800">Aucune location en cours</h3>
                  <p className="text-gray-450 text-sm max-w-xs mx-auto mt-1">
                    {rentedSearchQuery || rentedLocation !== "all" || rentedTransmission !== "all" || rentedFuel !== "all" || rentedStartDate || rentedEndDate
                      ? "Aucun résultat ne correspond à vos filtres."
                      : "Les véhicules dont la réservation a été confirmée apparaîtront ici."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                {rentedList.map((rental) => {
                  const now = new Date();
                  const endDate = new Date(rental.endDate);
                  const diffTime = endDate.getTime() - now.getTime();
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  const isCritical = diffDays <= 1;
                  const isRelanced = relancedBookingIds.includes(rental.id);

                  return (
                    <div
                      key={rental.id}
                      className={`bg-white border rounded-none p-5 flex flex-col justify-between gap-4 relative overflow-hidden transition-all group ${
                        isCritical
                          ? "bg-red-50/20 border-t-4 border-t-red-400/60 border-x-0 border-b-0 shadow-none hover:shadow-none"
                          : "border-gray-200 shadow-[0_8px_30px_rgba(0,0,0,0.02)] hover:shadow-md"
                      }`}
                    >
                      {/* Gray Overlay for Unavailable / Relanced Card */}
                      {isRelanced && (
                        <div className="absolute inset-0 bg-gray-900/75 z-30 flex flex-col items-center justify-center p-4 backdrop-blur-[2px] transition-all">
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-3">Relance Envoyée / Indisponible</span>
                          <button
                            type="button"
                            onClick={() => openReturnModal(rental)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 py-2.5 px-4 bg-primary hover:bg-blue-600 text-white rounded-none font-bold text-xs shadow-lg uppercase tracking-wider cursor-pointer"
                          >
                            Marquer comme disponible au garage
                          </button>
                        </div>
                      )}

                      {/* Critical Banner */}
                      {isCritical && (
                        <div className="absolute top-0 left-0 right-0 bg-red-100 text-red-850 text-[10px] font-black uppercase tracking-wider text-center py-2.5 flex items-center justify-center gap-1 border-b border-red-200/40">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                          <span>Retour requis sous 24h</span>
                        </div>
                      )}

                      {/* Vehicle + Client */}
                      <div className={`flex items-start gap-3 ${isCritical ? "mt-7" : ""}`}>
                        <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                          <Car className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col text-left min-w-0">
                          <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider truncate">
                            {rental.car?.name || "Véhicule supprimé"}
                          </span>
                          <h4 className="font-extrabold text-sm text-gray-800 mt-0.5">{rental.clientName}</h4>
                        </div>
                      </div>

                      {/* Contact + Pickup */}
                      <div className="space-y-2 text-xs text-gray-600 font-semibold border-t border-b border-gray-100 py-3 text-left">
                        <a
                          href={`tel:${rental.clientPhone}`}
                          className="flex items-center gap-2 hover:text-primary transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>{rental.clientPhone}</span>
                        </a>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span>Retrait à : {rental.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(rental.startDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                            {" → "}
                            {new Date(rental.endDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      </div>

                      {/* Remaining Time Badge */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Durée restante</span>
                        {isCritical ? (
                          <span className="px-2 py-0.5 rounded bg-red-100 border border-red-200 text-[10px] font-black text-red-700 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-red-500" />
                            Aujourd'hui / Demain
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-green-50 border border-green-200 text-[10px] font-black text-green-700 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-green-500" />
                            {diffDays} {diffDays === 1 ? "jour restant" : "jours restants"}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => openReturnModal(rental)}
                          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-none text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Marquer comme récupéré</span>
                        </button>

                        {isCritical && (
                          <button
                            type="button"
                            onClick={() => handleToggleRelance(rental.id)}
                            className="w-full py-2 bg-white border border-red-200 hover:bg-red-50 text-red-700 rounded-none text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Laisser indisponible / Relancer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Pagination */}
            {rentedTotal > 8 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setRentedPage((p) => Math.max(1, p - 1))}
                  disabled={rentedPage === 1}
                  className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Précédent
                </button>
                {Array.from({ length: Math.ceil(rentedTotal / 8) }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setRentedPage(p)}
                    className={`w-8 h-8 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                      p === rentedPage ? "bg-primary text-white" : "border border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setRentedPage((p) => Math.min(Math.ceil(rentedTotal / 8), p + 1))}
                  disabled={rentedPage === Math.ceil(rentedTotal / 8)}
                  className="px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  Suivant
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 6: Settings (Paramètres) */}
        {activeTab === "settings" && (
          <div className="flex flex-col gap-6 w-full animate-none text-left font-sans">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Paramètres du compte</h2>
              <p className="text-sm text-gray-500 mt-1">
                Gérez vos informations de connexion administrateur et mettez à jour votre mot de passe.
              </p>
            </div>

            {/* Aperçu du profil (Preview) */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                <span>Aperçu des informations actuelles</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nom Complet */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                    <User className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Nom Complet</span>
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {currentUserDetails?.firstName || currentUserDetails?.lastName
                        ? `${currentUserDetails.firstName} ${currentUserDetails.lastName}`
                        : "Non renseigné"}
                    </span>
                  </div>
                </div>

                {/* Pseudo / Identifiant */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                    <UserCheck className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Identifiant / Pseudo</span>
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {currentUserDetails?.username ? `@${currentUserDetails.username}` : "Non renseigné"}
                    </span>
                  </div>
                </div>

                {/* Adresse Email */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Adresse Email</span>
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {currentUserDetails?.email || "Non renseigné"}
                    </span>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Téléphone</span>
                    <span className="text-sm font-bold text-gray-800 truncate">
                      {currentUserDetails?.phone || "Non renseigné"}
                    </span>
                  </div>
                </div>

                {/* Mot de passe (Masqué) */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 md:col-span-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center text-primary flex-shrink-0">
                    <Lock className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Mot de passe</span>
                    <span className="text-sm font-bold text-gray-800 tracking-widest font-mono">••••••••</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Separator / Subtitle for edits */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-1">Modifier vos informations</h3>
              <p className="text-xs text-gray-500">Remplissez les champs ci-dessous pour mettre à jour vos coordonnées.</p>
            </div>

            <form onSubmit={handleUpdateSettings} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-5">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Prénom</label>
                  <input
                    type="text"
                    value={settingsFirstName}
                    onChange={(e) => setSettingsFirstName(e.target.value)}
                    placeholder="Prénom"
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 text-gray-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nom</label>
                  <input
                    type="text"
                    value={settingsLastName}
                    onChange={(e) => setSettingsLastName(e.target.value)}
                    placeholder="Nom"
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Identifiant / Pseudo</label>
                  <input
                    type="text"
                    value={settingsUsername}
                    onChange={(e) => setSettingsUsername(e.target.value)}
                    placeholder="ex: admin"
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 text-gray-800"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Téléphone</label>
                  <input
                    type="tel"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    placeholder="ex: 0612345678"
                    className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 text-gray-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Adresse Email</label>
                <input
                  type="email"
                  value={settingsEmail}
                  onChange={(e) => setSettingsEmail(e.target.value)}
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 text-gray-800"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Nouveau Mot de Passe</label>
                <input
                  type="password"
                  value={settingsPassword}
                  onChange={(e) => setSettingsPassword(e.target.value)}
                  placeholder="Laisser vide pour ne pas changer"
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 text-gray-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Confirmer le Nouveau Mot de Passe</label>
                <input
                  type="password"
                  value={settingsConfirmPassword}
                  onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                  placeholder="Confirmer le nouveau mot de passe"
                  className="w-full h-11 px-4 border border-gray-200 rounded-xl text-sm font-semibold focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder-gray-400 text-gray-800"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={submittingSettings}
                  className="px-6 h-11 bg-primary hover:bg-blue-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] shadow-md shadow-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingSettings ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <span>Sauvegarder les modifications</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* Delete User Captcha Modal */}
      <DeleteUserModal
        isOpen={isDeleteUserModalOpen}
        userEmail={userToDelete?.email || ""}
        onClose={closeDeleteUserModal}
        onConfirm={handleDeleteUserConfirm}
      />

      {/* Delete Car Modal */}
      <DeleteCarModal
        isOpen={isDeleteCarModalOpen}
        carName={carToDelete?.name || ""}
        onClose={closeDeleteCarModal}
        onConfirm={handleDeleteCarConfirm}
        isDeleting={deletingCar}
      />

      {/* Return Car Modal */}
      <ReturnCarModal
        isOpen={isReturnModalOpen}
        clientName={selectedReturnRental?.clientName || ""}
        carName={selectedReturnRental?.car?.name || "le véhicule"}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedReturnRental(null);
        }}
        onConfirm={handleConfirmReturn}
        isConfirming={isConfirmingReturn}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-400 mt-12">
        <p>© {new Date().getFullYear()} locaLik. Espace Administrateur Sécurisé. Conçu avec excellence.</p>
      </footer>

      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-sans">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-gray-500 mt-4 text-sm font-medium">Chargement du tableau de bord...</p>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  );
}
