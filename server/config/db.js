import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("DB Connected");
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/YardStick`);
  } catch (error) {
    console.log(error);
    throw new Error("Database Connection Error");
  }
};
