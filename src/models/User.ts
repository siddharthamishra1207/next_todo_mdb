// models/User.ts
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);

//Export the existing User model if it's already registered; otherwise, define it with userSchema and export that.