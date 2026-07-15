import { Schema, model } from "mongoose";

export const ROLES = [
  "ADMINISTRADOR",
  "DOCTOR"
] as const;

const UsuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    apellido_paterno: {
      type: String,
      required: true,
      trim: true,
    },

    apellido_materno: {
      type: String,
      required: true,
      trim: true,
    },

    carnet_identidad: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    rol: {
      type: String,
      enum: ROLES,
      required: true,
      default: "DOCTOR",
    },

    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Usuario", UsuarioSchema);