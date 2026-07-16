import express, { Router } from "express";
import paciente from "./paciente";

import auth from "./auth";


const v1: Router = express.Router();


v1.use("/auth", auth);
v1.use("/paciente", paciente);

export default v1;
