import User from "../models/User.model.js";
import argon2 from "argon2";
import { getTenant } from "../services/getTenant.service.js";
import Tenant from "../models/Tenant.model.js";
import { getToken } from "../services/getToken.service.js";
//? User Register Controller
export const Register = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(401)
        .json({ success: false, message: "User Already exist" });
    }
    const hash = await argon2.hash(password);
    const tenant = getTenant(email);
    let tenantDoc = await Tenant.findOne({ name: tenant });
    if (!tenantDoc) {
      tenantDoc = new Tenant({ name: tenant });
      await tenantDoc.save();
    }
    const newUser = new User({
      email,
      password: hash,
      role,
      tenant: tenantDoc._id,
    });
    await newUser.save();
    const { accessToken, refreshToken } = await getToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });
    if (!accessToken || !refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Error While generating tokens" });
    }
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    });
    res.cookie("refresh_token", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    });
    return res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//? User Login Controller
export const Login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User do not exist" });
    }
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const tenant = getTenant(email);
    let tenantDoc = await Tenant.findOne({ name: tenant });
    if (!tenantDoc) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }
    const { accessToken, refreshToken } = await getToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    if (!accessToken || !refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Error While generating tokens" });
    }
    res.cookie("access_token", accessToken, {
      maxAge: 15 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    });
    res.cookie("refresh_token", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "lax",
    });
    return res.status(200).json({
      success: true,
      message: "User LoggedIn Successfully",
      userId: user._id,
      role:user.role,
      tenant: tenantDoc,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//? User Logout Controller
export const Logout = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res
      .status(200)
      .json({ success: true, message: "User Logged Out Successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

//? User Information
export const getMe=async(req,res)=>{
  try {
    const userId=req.user.id;
    const user=await User.findById(userId);
    if(!user) return res.status(401).json({message:'User not Found'});
    const userData=await user.populate('tenant');
    return res.status(200).json({userData});
  } catch (error) {
        console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });

  }
}