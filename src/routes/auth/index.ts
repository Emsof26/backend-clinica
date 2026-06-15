import express, { Router } from "express";


import {
  authUsuario,
  getMe,
  logout,
} from "./controller";


const auth: Router = express.Router();


// ===============================
// LOGIN
// POST /auth/signin
// ===============================


auth.post("/signin", authUsuario);


// ===============================
// PERFIL
// GET /auth/me
// ===============================


auth.get("/me", ...getMe);


// ===============================
// LOGOUT
// POST /auth/logout
// ===============================


auth.post("/logout", logout);


export default auth;
