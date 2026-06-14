import { Schema, model, Document, Types } from "mongoose";

export interface IUsuario extends Document {
  nombres: string;
  apellidos: string;
  email: string;
  password: string;
  telefono?: string;
  rol: "Administrador" | "Doctor" | "Recepcionista";
  activo: boolean;
  clinica: Types.ObjectId;
  fechaRegistro: Date;
}

const UsuarioSchema = new Schema<IUsuario>(
  {
    nombres: {
      type: String,
      required: true,
      trim: true,
    },

    apellidos: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    telefono: {
      type: String,
    },

    rol: {
      type: String,
      enum: ["Administrador", "Doctor", "Recepcionista"],
      default: "Recepcionista",
    },

    activo: {
      type: Boolean,
      default: true,
    },

    clinica: {
      type: Schema.Types.ObjectId,
      ref: "Clinica",
      required: true,
    },

    fechaRegistro: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IUsuario>("Usuario", UsuarioSchema);