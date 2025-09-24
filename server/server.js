import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import stripe from "./config/stripe.js";
import Tenant from "./models/Tenant.model.js";
import { userRouter } from "./router/User.routes.js";
import noteRouter from "./router/Note.routes.js";
import { createCheckoutSession } from "./controllers/Payment.controller.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import { router } from "./router/webhook.routes.js";

//? PORT
const PORT = process.env.PORT || 3000;

//? App
const app = express();

//?DB Config
await connectDB();

app.use('/api',router)

//? App Config and Cors Config
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

//? Routes Config
app.use("/api/user", userRouter);
app.use("/api/note", noteRouter);
// Admin creates checkout session
app.post(
  "/tenants/:slug/upgrade",
  authMiddleware,
  createCheckoutSession
);

app.get("/health", (req, res) => {
  res.send({ status: "ok" });
});
app.use("/", (req, res) => {
  res.send("Server is Running");
});

//? App Start
app.listen(PORT, () => {
  console.log("Server is Running at PORT " + PORT);
});
