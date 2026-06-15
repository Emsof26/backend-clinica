import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import passport from "./passport";
import { errorHandler } from "./middlewares/errorHandler";
const app = express();


// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// Passport
app.use(passport.initialize());


// Routes
app.use(routes);


// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando");
});


// Error Handler
// ⚠️ SIEMPRE AL FINAL
app.use(errorHandler);
export default app;
