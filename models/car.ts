import mongoose, { Schema, Document } from "mongoose";

export interface ICar extends Document {
  name: string;
  rating: number;
  reviews: number;
  passengers: number;
  transmission: string;
  airConditioning: boolean;
  doors: number;
  price: number;
  imageSrc: string; // Main image (obligatory)
  isAvailable: boolean;
  description: string;
  images: string[]; // Additional interior/exterior images
  fuelType: string; // Diesel, Essence, Hybride, Électrique
  fiscalPower: number; // Puissance fiscale: 6, 8, etc.
  location: string; // City of availability in Morocco
}

const CarSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, default: 5 },
    reviews: { type: Number, default: 0 },
    passengers: { type: Number, required: true },
    transmission: { type: String, required: true },
    airConditioning: { type: Boolean, required: true },
    doors: { type: Number, required: true },
    price: { type: Number, required: true },
    imageSrc: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    fuelType: { type: String, required: true, default: "Diesel" },
    fiscalPower: { type: Number, required: true, default: 6 },
    location: { type: String, required: true, default: "Casablanca" },
  },
  {
    collection: "localik", // Explicitly map to collection 'localik'
    timestamps: true,
  }
);

export default mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);
