import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { createNote, getAllNotes, getNote, updateNote, deleteNote, getIndvNote } from "../controllers/Note.controller.js";

const noteRouter = express.Router();

noteRouter.post("/notes", authMiddleware, createNote);
noteRouter.get("/notes", authMiddleware, getAllNotes);
noteRouter.get("/my-notes", authMiddleware, getIndvNote);
noteRouter.get("/notes/:id", authMiddleware, getNote);
noteRouter.put("/notes/:id", authMiddleware, updateNote);
noteRouter.delete("/notes/:id", authMiddleware, deleteNote);

export default noteRouter;
