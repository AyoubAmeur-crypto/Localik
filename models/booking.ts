import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  carId: mongoose.Types.ObjectId;
  clientName: string;
  clientPhone: string;
  pickupLocation: string;
  startDate: Date;
  endDate: Date;
  status: "pending" | "confirmed" | "rejected";
  isReturned: boolean;
  totalPrice: number;
}

const BookingSchema: Schema = new Schema(
  {
    carId: { type: Schema.Types.ObjectId, ref: "Car", required: true },
    clientName: { type: String, required: true },
    clientPhone: { type: String, required: true },
    pickupLocation: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ["pending", "confirmed", "rejected"], default: "pending" },
    isReturned: { type: Boolean, default: false },
    totalPrice: { type: Number, required: true },
  },
  {
    collection: "bookings",
    timestamps: true,
  }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
