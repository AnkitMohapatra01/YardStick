import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import { getToken } from "../services/getToken.service.js";

// Auth middleware
export const authMiddleware = async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
    const refresh_token = req.cookies.refresh_token;

    if (!access_token && !refresh_token) {
      return res.status(401).json({ message: "No token provided" });
    }

    let user;

    // If access token exists
    if (access_token) {
      try {
        const decoded = jwt.verify(access_token, process.env.ACCESS_SECRET);
        user = await User.findById(decoded.id).populate("tenant");
      } catch (err) {
        // If access token expired but refresh exists, fallback to refresh flow
        if (refresh_token) {
          const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET);
          user = await User.findById(decoded.id);
          if (!user) return res.status(404).json({ message: "User not found" });

          // Issue new tokens
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            getToken({ id: user._id, email: user.email, role: user.role });

          res.cookie("access_token", newAccessToken, {
            maxAge: 15 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
          });

          res.cookie("refresh_token", newRefreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
          });
        } else {
          return res.status(401).json({ message: "Invalid access token" });
        }
      }
    }

    // If only refresh token exists (first case when no access token)
    if (!access_token && refresh_token && !user) {
      const decoded = jwt.verify(refresh_token, process.env.REFRESH_SECRET);
      user = await User.findById(decoded.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
        getToken({ id: user._id, email: user.email, role: user.role });

      res.cookie("access_token", newAccessToken, {
        maxAge: 15 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      });

      res.cookie("refresh_token", newRefreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
      });
    }

    if (!user) return res.status(401).json({ message: "Unauthorized" });

    // Attach user info
    req.user = {
      id: user._id,
      email: user.email,
      role: user.role,
      tenant: user.tenant?.name, // safe optional chaining
    };

    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
