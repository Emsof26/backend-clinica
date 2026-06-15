import Usuario from "../database/models/usuario";
import bcrypt from "bcrypt";

export default class UsuarioRepository {

  // 🔍 Obtener por ID
  async getById(id: string) {
    return await Usuario.findById(id);
  }

  // 🔐 Obtener usuario para login
  async getAuthByEmail(email: string) {
    return await Usuario.findOne({ email });
  }

  // 🔑 Comparar contraseña
  async comparePassword(plain: string, hash: string) {
    return await bcrypt.compare(plain, hash);
  }

  // 🆕 Crear usuario
  async create(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await Usuario.create({
      ...data,
      password: hashedPassword,
    });
  }
}