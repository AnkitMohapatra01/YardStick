import express from "express";
import { getMe, Login, Logout, Register } from "../controllers/User.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const userRouter = express.Router();

userRouter.post("/register", Register);
userRouter.post("/login", Login);
userRouter.post("/logout", Logout);
userRouter.get('/getMe',authMiddleware,getMe);