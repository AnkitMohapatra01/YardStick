import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getTenantUsers,
  upgradeTenant,
} from "../controllers/Admin.controller.js";

const adminRouter = express.Router();

adminRouter.get("/users", authMiddleware, getTenantUsers);
adminRouter.post("/tenants/:slug/upgrade", authMiddleware, upgradeTenant);
adminRouter.post("/add-user", authMiddleware, upgradeTenant);

export default adminRouter;
