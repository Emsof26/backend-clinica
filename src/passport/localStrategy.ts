import { Strategy } from "passport-local";
import UsuarioRepository from "../repositories/UsuarioRepository";
import ApiError from "../errors/ApiError";
import UsuarioResource from "../resources/UsuarioResource";

const localStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
    session: false,
  },
  async (email: string, password: string, done) => {
    try {
      const repository = new UsuarioRepository();

      const usuario = await repository.getAuthByEmail(email);

      if (!usuario || !usuario.password) {
        throw new ApiError({
          name: "UNAUTHORIZED_ERROR",
          message: "Credenciales incorrectas",
          code: "ERR_UNAUTH",
          status: 401,
        });
      }

      const match = await repository.comparePassword(
        password,
        usuario.password
      );

      if (!match) {
        throw new ApiError({
          name: "UNAUTHORIZED_ERROR",
          message: "Credenciales incorrectas",
          code: "ERR_UNAUTH",
          status: 401,
        });
      }

      const resource = new UsuarioResource(usuario);

      return done(null, resource.item());
    } catch (error) {
      return done(error);
    }
  }
);

export default localStrategy;