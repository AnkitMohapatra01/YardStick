import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g. Acme, Globex
  plan: { type: String, enum: ["Free", "Pro"], default: "Free" }, // Free/Pro
});

const Tenant = mongoose.model("Tenant", tenantSchema);
export default Tenant;
