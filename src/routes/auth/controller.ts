import { Request, Response, NextFunction } from "express";


import passport from "passport";
import jwt from "jsonwebtoken";


import UsuarioResource from "../../resources/UsuarioResource";
import ApiError from "../../errors/ApiError";


import { env } from "../../config/env";


// ===============================
// LOGIN /auth/signin
// ===============================


export const authUsuario = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {


  passport.authenticate(
    "local",
    { session: false },


    async (error: any, usuario: any) => {


      if (error) return next(error);


      try {


        if (!usuario) {


          throw new ApiError({
            name: "UNAUTHORIZED_ERROR",
            message: "Usuario o contraseña incorrectos.",
            code: "ERR_UNAUTH",
            status: 401,
          });


        }


        // ===============================
        // Payload JWT
        // ===============================


        const payload = {
          sub: usuario.id,
          rol: usuario.rol,
        };


        // ===============================
        // Crear JWT
        // ===============================


        const token = jwt.sign(
          payload,
          env.authJwtSecret as jwt.Secret,
          {
            expiresIn:
              env.authJwtTime as jwt.SignOptions["expiresIn"],
          }
        );


        // ===============================
        // Guardar JWT en cookie
        // ===============================


        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 60 * 60 * 1000, // 1 hora
        });


        // ===============================
        // Respuesta final
        // ===============================


        return res.status(200).json({
          message: "signin successfully",
          usuario,
        });


      } catch (err) {
        return next(err);
      }


    }
  )(req, res, next);


};


// ===============================
// PERFIL /auth/me
// ===============================


export const getMe = [


  passport.authenticate("jwt", {
    session: false,
  }),


  async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {


    try {


      if (!req.user) {


        throw new ApiError({
          name: "UNAUTHORIZED_ERROR",
          message: "No autenticado.",
          code: "ERR_UNAUTH",
          status: 401,
        });


      }


      const usuarioResource = new UsuarioResource(
        req.user as any
      );


      return res.json({
        usuario: usuarioResource.item(),
      });


    } catch (err) {
      next(err);
    }


  },
];


// ===============================
// LOGOUT /auth/logout
// ===============================


export const logout = (
  req: Request,
  res: Response,
) => {


  // eliminar cookie token
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });


  return res.status(200).json({
    message: "logout successfully",
  });


};
