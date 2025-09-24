import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed
  role: { type: String, enum: ["Admin", "Member"], default: "Member" },
  tenant: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
});

const User = mongoose.model("User", userSchema);
export default User;
