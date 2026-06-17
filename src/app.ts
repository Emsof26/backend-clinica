import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import passport from "./passport";
import { errorHandler } from "./middlewares/errorHandler";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use(routes);

app.get("/", (req, res) => {
  res.send("API funcionando");
});


app.use(errorHandler);
export default app;
