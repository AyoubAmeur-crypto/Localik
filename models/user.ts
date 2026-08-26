import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string; // Can be a standard email or the default "admin" string
  password?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
