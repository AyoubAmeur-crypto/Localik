"use server";

import { connectToDatabase } from "./db";
import Car from "@/models/car";
import User from "@/models/user";
import Booking from "@/models/booking";
import { getSession, destroySession, createSession } from "./session";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { v2 as cloudinary } from "cloudinary";

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to upload base64 image strings to Cloudinary
async function uploadToCloudinary(imageInput: string): Promise<string> {
  if (!imageInput) return "";
  
  // If it's already a URL, just return it
  if (imageInput.startsWith("http://") || imageInput.startsWith("https://") || imageInput.startsWith("/")) {
    return imageInput;
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(imageInput, {
      folder: "rentcar",
    });
    return uploadResponse.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw new Error("Failed to upload image to Cloudinary.");
  }
}

const defaultCars = [
  {
    name: "Dacia Sandero Stepway",
    rating: 4.5,
    reviews: 120,
    passengers: 5,
    transmission: "Manuelle",
    airConditioning: true,
    doors: 5,
    price: 250,
    imageSrc: "/images/1.png",
    isAvailable: true,
    description: "La Dacia Sandero Stepway est une berline robuste au look baroudeur. Parfaite pour explorer les villes marocaines comme Casablanca ou Rabat.",
    images: [],
    fuelType: "Diesel",
    fiscalPower: 6,
    location: "Casablanca",
  },
  {
    name: "Renault Clio",
    rating: 4.7,
    reviews: 340,
    passengers: 5,
    transmission: "Manuelle",
    airConditioning: true,
    doors: 5,
    price: 300,
    imageSrc: "/images/2.png",
    isAvailable: true,
    description: "Une icône moderne. La Renault Clio allie confort et dynamisme pour vous accompagner dans tous vos déplacements.",
    images: [],
    fuelType: "Diesel",
    fiscalPower: 6,
    location: "Casablanca",
  },
  {
    name: "Volkswagen T-Roc",
    rating: 4.8,
    reviews: 210,
    passengers: 5,
    transmission: "Automatique",
    airConditioning: true,
    doors: 5,
    price: 450,
    imageSrc: "/images/3.png",
    isAvailable: true,
    description: "Le Volkswagen T-Roc est un SUV compact premium avec une conduite dynamique et des technologies d'aide à la conduite avancées.",
    images: [],
    fuelType: "Diesel",
    fiscalPower: 8,
    location: "Marrakech",
  },
  {
    name: "Renault Clio Esprit Alpine",
    rating: 4.8,
    reviews: 95,
    passengers: 5,
    transmission: "Automatique",
    airConditioning: true,
    doors: 5,
    price: 380,
    imageSrc: "/images/4.png",
    isAvailable: false,
    description: "Finition sportive Esprit Alpine avec boite automatique. Un véhicule chic au style affirmé, disponible à Marrakech.",
    images: [],
    fuelType: "Hybride",
    fiscalPower: 7,
    location: "Marrakech",
  },
  {
    name: "Hyundai Tucson",
    rating: 4.9,
    reviews: 410,
    passengers: 5,
    transmission: "Automatique",
    airConditioning: true,
    doors: 5,
    price: 550,
    imageSrc: "/images/5.png",
    isAvailable: true,
    description: "Grand SUV familial spacieux et ultra moderne. Parfait pour les longs trajets à travers le Maroc entre amis ou en famille.",
    images: [],
    fuelType: "Diesel",
    fiscalPower: 8,
    location: "Agadir",
  },
];

let isSeeded = false;

// Helper to seed database if empty
export async function seedDatabase() {
  if (isSeeded) return;
  await connectToDatabase();

  // 1. Seed admin user if no users exist in the database, or reset if old schema admin exists
  const hasOldSchema = await User.findOne({
    $or: [
      { username: { $exists: false } },
      { username: "" },
      { firstName: { $exists: false } },
      { firstName: "" }
    ]
  });

  if (hasOldSchema) {
    console.log("Old schema users detected. Wiping users to reset with new schema...");
    await User.deleteMany({});
  }

  const userCount = await User.countDocuments();
  if (userCount === 0) {
    const hashedPassword = await bcrypt.hash("admin", 10);
    await User.create({
      email: "admin",
      username: "admin",
      password: hashedPassword,
      firstName: "Admin",
      lastName: "Localik",
      phone: "0600000000"
    });
    console.log("Admin user seeded.");
  }

  // 2. Seed default cars if empty
  const carCount = await Car.countDocuments();
  if (carCount === 0) {
    await Car.insertMany(defaultCars);
    console.log("Default cars seeded.");
  }
  isSeeded = true;
}

// 1. Auth Actions
export async function loginAction(emailOrUsername: string, password: string) {
  try {
    await connectToDatabase();
    
    // Seed DB in case it hasn't run yet
    await seedDatabase();

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    });
    if (!user) {
      return { success: false, error: "Identifiants invalides." };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, error: "Identifiants invalides." };
    }

    // Create session (expires in 24 hours)
    await createSession(user._id.toString(), user.email);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur de connexion." };
  }
}

export async function logoutAction() {
  await destroySession();
  return { success: true };
}

export async function checkAuth() {
  const session = await getSession();
  return session !== null;
}

export async function getCurrentUserEmail() {
  const session = await getSession();
  return session ? session.email : null;
}

export async function getCurrentUserAction() {
  try {
    const session = await getSession();
    if (!session) return null;

    await connectToDatabase();
    const user = await User.findById(session.userId, { password: 0 }).lean();
    if (!user) return null;
    return {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      username: user.username ?? "",
    };
  } catch (error) {
    return null;
  }
}

export async function updateSelfAction(
  email: string,
  password?: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  username?: string
) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();

    if (email !== session.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return { success: false, error: "Cet email est déjà utilisé." };
      }
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    user.email = email;
    user.firstName = firstName ?? "";
    user.lastName = lastName ?? "";
    user.phone = phone ?? "";
    user.username = username ?? "";

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    // Re-create the session with the new email
    await createSession(user._id.toString(), user.email);

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la mise à jour." };
  }
}

// 2. User/Collaborator Management (Admin only)
export async function createUserAction(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  phone?: string,
  username?: string
) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();
    
    const userExists = await User.findOne({ email });
    if (userExists) {
      return { success: false, error: "Cet utilisateur existe déjà." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      firstName: firstName ?? "",
      lastName: lastName ?? "",
      phone: phone ?? "",
      username: username ?? "",
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la création." };
  }
}

export async function getUsersAction() {
  try {
    const session = await getSession();
    if (!session) {
      throw new Error("Non autorisé.");
    }

    await connectToDatabase();
    const users = await User.find({}, { password: 0 }).lean();
    return users.map((u: any) => ({
      id: u._id.toString(),
      email: u.email,
      firstName: u.firstName ?? "",
      lastName: u.lastName ?? "",
      phone: u.phone ?? "",
      username: u.username ?? "",
      createdAt: u.createdAt ? u.createdAt.toISOString() : null,
    }));
  } catch (error) {
    return [];
  }
}

export async function deleteUserAction(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    if (session.userId === id) {
      return { success: false, error: "Vous ne pouvez pas supprimer votre propre compte." };
    }

    await connectToDatabase();
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la suppression." };
  }
}

// 3. Car CRUD Operations
export async function getCars() {
  try {
    await connectToDatabase();
    await seedDatabase();

    const cars = await Car.find({}).lean();
    return cars.map((c: any) => ({
      id: c._id.toString(),
      name: c.name,
      rating: c.rating,
      reviews: c.reviews,
      passengers: c.passengers,
      transmission: c.transmission,
      airConditioning: c.airConditioning,
      doors: c.doors,
      price: c.price,
      imageSrc: c.imageSrc,
      isAvailable: c.isAvailable ?? true,
      description: c.description ?? "",
      images: c.images ?? [],
      fuelType: c.fuelType ?? "Diesel",
      fiscalPower: c.fiscalPower ?? 6,
      location: c.location ?? "Casablanca",
    }));
  } catch (error) {
    console.error("Error in getCars:", error);
    return [];
  }
}

export async function getCarById(id: string) {
  try {
    await connectToDatabase();
    const car = await Car.findById(id).lean();
    if (!car) return null;
    return {
      id: car._id.toString(),
      name: car.name,
      rating: car.rating,
      reviews: car.reviews,
      passengers: car.passengers,
      transmission: car.transmission,
      airConditioning: car.airConditioning,
      doors: car.doors,
      price: car.price,
      imageSrc: car.imageSrc,
      isAvailable: car.isAvailable ?? true,
      description: car.description ?? "",
      images: car.images ?? [],
      fuelType: car.fuelType ?? "Diesel",
      fiscalPower: car.fiscalPower ?? 6,
      location: car.location ?? "Casablanca",
    };
  } catch (error) {
    console.error("Error in getCarById:", error);
    return null;
  }
}

export async function createCar(data: {
  name: string;
  price: number;
  passengers: number;
  transmission: string;
  airConditioning: boolean;
  doors: number;
  imageSrc: string;
  rating?: number;
  reviews?: number;
  isAvailable?: boolean;
  description?: string;
  images?: string[];
  fuelType?: string;
  fiscalPower?: number;
  location?: string;
}) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();
    
    // Upload main image to Cloudinary if it is a base64 string
    let uploadedImageSrc = data.imageSrc;
    if (data.imageSrc && data.imageSrc.startsWith("data:image/")) {
      uploadedImageSrc = await uploadToCloudinary(data.imageSrc);
    }

    // Upload gallery images to Cloudinary if they are base64 strings
    const uploadedImages: string[] = [];
    if (data.images && data.images.length > 0) {
      for (const img of data.images) {
        if (img && img.startsWith("data:image/")) {
          const url = await uploadToCloudinary(img);
          uploadedImages.push(url);
        } else if (img) {
          uploadedImages.push(img);
        }
      }
    }

    const newCar = await Car.create({
      ...data,
      imageSrc: uploadedImageSrc,
      images: uploadedImages,
      rating: data.rating ?? 5.0,
      reviews: data.reviews ?? 0,
      isAvailable: data.isAvailable ?? true,
      description: data.description ?? "",
      fuelType: data.fuelType ?? "Diesel",
      fiscalPower: data.fiscalPower ?? 6,
      location: data.location ?? "Casablanca",
    });

    revalidatePath("/");
    return { success: true, carId: newCar._id.toString() };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la création du véhicule." };
  }
}

export async function updateCar(
  id: string,
  data: {
    name?: string;
    price?: number;
    passengers?: number;
    transmission?: string;
    airConditioning?: boolean;
    doors?: number;
    imageSrc?: string;
    rating?: number;
    reviews?: number;
    isAvailable?: boolean;
    description?: string;
    images?: string[];
    fuelType?: string;
    fiscalPower?: number;
    location?: string;
  }
) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();

    // Upload main image to Cloudinary if it is a base64 string
    let uploadedImageSrc = data.imageSrc;
    if (data.imageSrc && data.imageSrc.startsWith("data:image/")) {
      uploadedImageSrc = await uploadToCloudinary(data.imageSrc);
    }

    // Upload gallery images to Cloudinary if they are base64 strings
    let uploadedImages = data.images;
    if (data.images && data.images.length > 0) {
      const list: string[] = [];
      for (const img of data.images) {
        if (img && img.startsWith("data:image/")) {
          const url = await uploadToCloudinary(img);
          list.push(url);
        } else if (img) {
          list.push(img);
        }
      }
      uploadedImages = list;
    }

    const updatePayload = {
      ...data,
      ...(uploadedImageSrc ? { imageSrc: uploadedImageSrc } : {}),
      ...(uploadedImages ? { images: uploadedImages } : {}),
    };

    const updated = await Car.findByIdAndUpdate(id, updatePayload, { new: true });
    if (!updated) {
      return { success: false, error: "Véhicule non trouvé." };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la modification." };
  }
}

export async function toggleCarAvailability(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();
    const car = await Car.findById(id);
    if (!car) {
      return { success: false, error: "Véhicule non trouvé." };
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    revalidatePath("/");
    return { success: true, isAvailable: car.isAvailable };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la modification." };
  }
}

export async function deleteCar(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();
    const deleted = await Car.findByIdAndDelete(id);
    if (!deleted) {
      return { success: false, error: "Véhicule non trouvé." };
    }

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Erreur lors de la suppression." };
  }
}

export async function getCarsPaginated(
  page: number = 1, 
  limit: number = 8,
  filters?: {
    search?: string;
    transmission?: string;
    fuelType?: string;
    airConditioning?: boolean;
    doors?: number;
    isAvailable?: boolean;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
  }
) {
  try {
    await connectToDatabase();
    await seedDatabase();

    const query: any = {};

    if (filters) {
      if (filters.search && filters.search.trim() !== "") {
        query.name = { $regex: filters.search.trim(), $options: "i" };
      }
      if (filters.location && filters.location !== "all" && filters.location.trim() !== "") {
        query.location = { $regex: filters.location.trim(), $options: "i" };
      }
      if (filters.transmission && filters.transmission !== "all") {
        // Matches exact value or case-insensitive representation
        query.transmission = { $regex: `^${filters.transmission}$`, $options: "i" };
      }
      if (filters.fuelType && filters.fuelType !== "all") {
        query.fuelType = { $regex: `^${filters.fuelType}$`, $options: "i" };
      }
      if (filters.airConditioning !== undefined) {
        query.airConditioning = filters.airConditioning;
      }
      if (filters.doors && filters.doors !== 0) {
        query.doors = filters.doors;
      }
      if (filters.isAvailable !== undefined) {
        query.isAvailable = filters.isAvailable;
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) {
          query.price.$gte = filters.minPrice;
        }
        if (filters.maxPrice !== undefined) {
          query.price.$lte = filters.maxPrice;
        }
      }
    }

    const skip = (page - 1) * limit;
    const [cars, totalCount] = await Promise.all([
      Car.find(query).skip(skip).limit(limit).lean(),
      Car.countDocuments(query),
    ]);
    
    return {
      success: true,
      cars: cars.map((c: any) => ({
        id: c._id.toString(),
        name: c.name,
        rating: c.rating,
        reviews: c.reviews,
        passengers: c.passengers,
        transmission: c.transmission,
        airConditioning: c.airConditioning,
        doors: c.doors,
        price: c.price,
        imageSrc: c.imageSrc,
        isAvailable: c.isAvailable ?? true,
        description: c.description ?? "",
        images: c.images ?? [],
        fuelType: c.fuelType ?? "Diesel",
        fiscalPower: c.fiscalPower ?? 6,
        location: c.location ?? "Casablanca",
      })),
      hasMore: skip + cars.length < totalCount,
      totalCount,
    };
  } catch (error) {
    console.error("Error in getCarsPaginated:", error);
    return { success: false, cars: [], hasMore: false, totalCount: 0 };
  }
}

// 4. Booking Request Actions
export async function createBookingAction(data: {
  carId: string;
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
}) {
  try {
    await connectToDatabase();
    
    const newBooking = await Booking.create({
      carId: data.carId,
      clientName: data.clientName,
      clientPhone: data.clientPhone,
      pickupLocation: data.pickupLocation,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      totalPrice: data.totalPrice,
      status: "pending",
      isReturned: false,
    });

    return { success: true, bookingId: newBooking._id.toString() };
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return { success: false, error: error.message || "Erreur lors de la création de la réservation." };
  }
}

export async function getBookingsAction() {
  try {
    await connectToDatabase();
    // Populate the car field
    const bookings = await Booking.find({}).populate("carId").sort({ createdAt: -1 }).lean();
    
    return bookings.map((b: any) => ({
      id: b._id.toString(),
      car: b.carId ? {
        id: b.carId._id.toString(),
        name: b.carId.name,
        price: b.carId.price,
        imageSrc: b.carId.imageSrc,
        isAvailable: b.carId.isAvailable,
      } : null,
      carId: b.carId ? b.carId._id.toString() : "",
      clientName: b.clientName,
      clientPhone: b.clientPhone,
      pickupLocation: b.pickupLocation,
      startDate: b.startDate.toISOString(),
      endDate: b.endDate.toISOString(),
      status: b.status,
      isReturned: b.isReturned,
      totalPrice: b.totalPrice,
      createdAt: b.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("Error in getBookingsAction:", error);
    return [];
  }
}

export async function getBookingsPaginatedAction(
  page: number = 1,
  limit: number = 8,
  filters?: {
    search?: string;
    status?: string;
    isReturned?: boolean;
    location?: string;
    transmission?: string;
    fuelType?: string;
    startDate?: string;
    endDate?: string;
  }
) {
  try {
    await connectToDatabase();
    
    const query: any = {};
    
    if (filters) {
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.isReturned !== undefined) {
        query.isReturned = filters.isReturned;
      }
      
      if (filters.location && filters.location !== "all" && filters.location.trim() !== "") {
        query.pickupLocation = { $regex: filters.location.trim(), $options: "i" };
      }
      
      if (filters.startDate || filters.endDate) {
        const dateQuery: any = {};
        if (filters.startDate) {
          dateQuery.$gte = new Date(filters.startDate);
        }
        if (filters.endDate) {
          dateQuery.$lte = new Date(filters.endDate);
        }
        query.startDate = dateQuery;
      }
    }

    let filterByCar = false;
    const carQuery: any = {};
    
    if (filters) {
      if (filters.transmission && filters.transmission !== "all") {
        carQuery.transmission = { $regex: `^${filters.transmission}$`, $options: "i" };
        filterByCar = true;
      }
      if (filters.fuelType && filters.fuelType !== "all") {
        carQuery.fuelType = { $regex: `^${filters.fuelType}$`, $options: "i" };
        filterByCar = true;
      }
    }
    
    if (filterByCar) {
      const matchingCars = await Car.find(carQuery).select("_id").lean();
      const carIds = matchingCars.map((c: any) => c._id);
      query.carId = { $in: carIds };
    }

    if (filters && filters.search && filters.search.trim() !== "") {
      const searchTerm = filters.search.trim();
      const matchingCars = await Car.find({ name: { $regex: searchTerm, $options: "i" } }).select("_id").lean();
      const carIds = matchingCars.map((c: any) => c._id);
      
      query.$or = [
        { clientName: { $regex: searchTerm, $options: "i" } },
        { clientPhone: { $regex: searchTerm, $options: "i" } },
        { carId: { $in: carIds } }
      ];
    }

    const skip = (page - 1) * limit;
    const [bookings, totalCount] = await Promise.all([
      Booking.find(query)
        .populate("carId")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query),
    ]);

    return {
      success: true,
      bookings: bookings.map((b: any) => ({
        id: b._id.toString(),
        car: b.carId ? {
          id: b.carId._id.toString(),
          name: b.carId.name,
          price: b.carId.price,
          imageSrc: b.carId.imageSrc,
          isAvailable: b.carId.isAvailable,
          transmission: b.carId.transmission,
          fuelType: b.carId.fuelType,
        } : null,
        carId: b.carId ? b.carId._id.toString() : "",
        clientName: b.clientName,
        clientPhone: b.clientPhone,
        pickupLocation: b.pickupLocation,
        startDate: b.startDate.toISOString(),
        endDate: b.endDate.toISOString(),
        status: b.status,
        isReturned: b.isReturned,
        totalPrice: b.totalPrice,
        createdAt: b.createdAt.toISOString(),
      })),
      hasMore: skip + bookings.length < totalCount,
      totalCount,
    };
  } catch (error) {
    console.error("Error in getBookingsPaginatedAction:", error);
    return { success: false, bookings: [], hasMore: false, totalCount: 0 };
  }
}

export async function confirmBookingAction(bookingId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return { success: false, error: "Réservation non trouvée." };
    }

    booking.status = "confirmed";
    await booking.save();

    // Mark the car as unavailable during the rental
    await Car.findByIdAndUpdate(booking.carId, { isAvailable: false });

    revalidatePath("/espace-proprietaire");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error confirming booking:", error);
    return { success: false, error: error.message || "Erreur lors de la confirmation." };
  }
}

export async function returnCarAction(bookingId: string, isReturned: boolean) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return { success: false, error: "Réservation non trouvée." };
    }

    booking.isReturned = isReturned;
    await booking.save();

    const carId = booking.carId;

    if (isReturned) {
      // Check if there are any other active confirmed bookings for the car
      const activeBookings = await Booking.find({
        carId,
        status: "confirmed",
        isReturned: false,
      });

      if (activeBookings.length === 0) {
        await Car.findByIdAndUpdate(carId, { isAvailable: true });
      }
    } else {
      // If marked as not returned, set the car as unavailable
      await Car.findByIdAndUpdate(carId, { isAvailable: false });
    }

    revalidatePath("/espace-proprietaire");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error in returnCarAction:", error);
    return { success: false, error: error.message || "Erreur lors de la mise à jour." };
  }
}

export async function deleteBookingAction(bookingId: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Non autorisé." };
    }

    await connectToDatabase();
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return { success: false, error: "Réservation non trouvée." };
    }

    const carId = booking.carId;
    const wasConfirmed = booking.status === "confirmed" && !booking.isReturned;

    await Booking.findByIdAndDelete(bookingId);

    // If it was confirmed and active, restore availability if no other active bookings remain
    if (wasConfirmed) {
      const activeBookings = await Booking.find({
        carId,
        status: "confirmed",
        isReturned: false,
      });

      if (activeBookings.length === 0) {
        await Car.findByIdAndUpdate(carId, { isAvailable: true });
      }
    }

    revalidatePath("/espace-proprietaire");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    return { success: false, error: error.message || "Erreur lors de la suppression." };
  }
}
