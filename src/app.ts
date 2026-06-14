import express from "express";
import cors from "cors";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();


// middlewares
app.use(cors());
app.use(express.json());


// ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando ");
});

app.use(errorHandler);

export default app;
