import Note from "../models/Note.model.js";
import Tenant from "../models/Tenant.model.js";
import User from "../models/User.model.js";

// Helper to check note limit for Free plan
const checkNoteLimit = async (tenantId) => {
  const tenant = await Tenant.findById(tenantId);
  if (!tenant) throw new Error("Tenant not found");
  if (tenant.plan === "Free") {
    const count = await Note.countDocuments({ tenant: tenantId });
    if (count >= 3) return false; // Free plan limit reached
  }
  return true;
};

// Create Note
export const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const allowed = await checkNoteLimit(user.tenant);
    if (!allowed) {
      return res
        .status(403)
        .json({ message: "Free plan limit reached. Upgrade to Pro." });
    }

    const note = await Note.create({
      title,
      content,
      tenant: user.tenant,
      createdBy: user._id,
    });

    res.status(201).json({ message: "Note created successfully", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get All Notes (for tenant)
export const getAllNotes = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const notes = await Note.find({ tenant: user.tenant }).populate(
      "createdBy",
      "email role"
    );
    res.json({ notes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Single Note
export const getNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const note = await Note.findOne({ _id: id, tenant: user.tenant });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Individual Note
export const getIndvNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    const note = await Note.find({ createdBy: user._id }).populate('createdBy tenant');
    res.json({ note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update Note
export const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const note = await Note.findOneAndUpdate(
      { _id: id, tenant: user.tenant },
      { title, content },
      { new: true }
    );

    if (!note) return res.status(404).json({ message: "Note not found" });
    res.json({ message: "Note updated", note });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete Note
export const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const user = await User.findById(userId);

    const note = await Note.findOneAndDelete({ _id: id, tenant: user.tenant });
    if (!note) return res.status(404).json({ message: "Note not found" });

    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
