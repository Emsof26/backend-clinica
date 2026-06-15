import { Schema, model, Document } from "mongoose";

export interface IClinica extends Document {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  activo: boolean;
}

const ClinicaSchema = new Schema<IClinica>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    direccion: {
      type: String,
      required: true,
    },

    telefono: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IClinica>("Clinica", ClinicaSchema, "clinica");