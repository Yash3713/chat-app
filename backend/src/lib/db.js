import dns from "dns";
import mongoose from "mongoose";
import dotenv from "dotenv";

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB :  ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};
