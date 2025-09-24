import mongoose from "mongoose";

const userInviteSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // the person invited
    password: { type: String, required: true },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" }, // usually member
    token: { type: String, required: true }, // unique invite code (UUID or random string)
    accepted: { type: Boolean, default: false }, // mark once user accepts
  },
  { timestamps: true }
);

const UserInvite = mongoose.model("UserInvite", userInviteSchema);
export default UserInvite;
