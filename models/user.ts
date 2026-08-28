import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string; // Can be a standard email or the default "admin" string
  password?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  username?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    phone: { type: String, default: "" },
    username: { type: String, default: "" },
  },
  {
    collection: "users",
    timestamps: true,
  }
);

if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>("User", UserSchema);
