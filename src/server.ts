import "dotenv/config";
import app from "./app";
import { connectDB } from "./database/connection";
import { env } from "./config/env";


const startServer = async () => {
  await connectDB();


  const PORT = env.port;


  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};


startServer();
