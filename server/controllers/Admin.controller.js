import UserInvite from "../models/UserInvite.model.js";
import User from "../models/User.model.js";
import Tenant from "../models/Tenant.model.js";
import argon2 from 'argon2';

// Invite User Controller
export const inviteUser = async (req, res) => {
  try {
    const { email,password, role } = req.body;
    const { id, role: userRole, tenant } = req.user;

    // Only Admin can invite
    if (userRole !== "Admin") {
      return res.status(403).json({ message: "Only Admin can invite users" });
    }

    if (!email || !password || !role) {
      return res.status(400).json({ message: "Email and role are required" });
    }

    if (!["Admin", "Member"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hash=await argon2.hash(password);
    // Create invitation
    const invite = await UserInvite.create({
      email,
      role,
      password:hash,
      tenant, // admin's tenant
      invitedBy: id,
    });

    res.status(201).json({ message: "User Created successfully", invite });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Upgrade Tenant Plan
export const upgradeTenant = async (req, res) => {
  try {
    const { slug } = req.params;
    const { role, tenant: userTenant } = req.user;

    // Only Admin can upgrade
    if (role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can upgrade tenant" });
    }

    // Admin can only upgrade their own tenant
    if (slug !== userTenant) {
      return res.status(403).json({ message: "Cannot upgrade other tenants" });
    }

    const tenantDoc = await Tenant.findOne({ name: slug });
    if (!tenantDoc) return res.status(404).json({ message: "Tenant not found" });

    tenantDoc.plan = "Pro";
    await tenantDoc.save();

    res.json({ message: "Tenant upgraded to Pro plan successfully", tenant: tenantDoc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all users in the admin's tenant
export const getTenantUsers = async (req, res) => {
  try {
    const { role, tenant } = req.user;

    // Only Admin can fetch users
    if (role !== "Admin") {
      return res.status(403).json({ message: "Only Admin can view users" });
    }

    // Fetch all users in the same tenant
    const users = await User.find({ tenant }).select("email role createdAt");

    res.json({ users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};