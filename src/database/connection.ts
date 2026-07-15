import mongoose from "mongoose";
import { setServers } from "node:dns";
import { env } from "../config/env";

// Fuerza a Node.js a utilizar DNS compatibles con MongoDB Atlas
setServers(["8.8.8.8", "1.1.1.1"]);
export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri);


    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    process.exit(1);
  }
};
