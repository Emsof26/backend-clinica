export default class UsuarioResource {
  private usuario: any;

  constructor(usuario: any) {
    this.usuario = usuario;
  }

  item() {
    return {
      id: this.usuario._id,

      nombres: this.usuario.nombres,
      apellidos: this.usuario.apellidos,
      email: this.usuario.email,
      telefono: this.usuario.telefono,

      rol: this.usuario.rol,
      activo: this.usuario.activo,

      clinica: this.usuario.clinica,
      fechaRegistro: this.usuario.fechaRegistro,

      createdAt: this.usuario.createdAt,
      updatedAt: this.usuario.updatedAt,
    };
  }
}