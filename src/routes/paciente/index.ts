import express, { Router } from "express";
import passport from "passport";

import {
  registrarPaciente,
} from "./controller";

const pacientes: Router = express.Router();

// ===============================
// Registrar paciente
// POST /pacientes
// ===============================
pacientes.post(
  "/registrar",
  passport.authenticate("jwt", {
    session: false,
  }),
  registrarPaciente
);

export default pacientes;