import express, { Router } from "express";


import {
  authUsuario,
  getMe,
  logout,
} from "./controller";


const auth: Router = express.Router();

auth.post("/signin", authUsuario);
auth.get("/me", ...getMe);
auth.post("/logout", logout);


export default auth;
