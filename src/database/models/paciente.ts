import { Schema, model } from "mongoose";

// ===============================
// Grupos etarios permitidos
// ===============================
export const GRUPOS_ETARIOS = [
  "neonato",
  "lactante",
  "infancia",
  "adolescencia",
  "adultez",
  "adulto_mayor",
] as const;

// ===============================
// Estados clínicos permitidos
// ===============================
export const ESTADOS_CLINICOS = [
  "normal",
  "seguimiento",
  "alerta",
] as const;

// ===============================
// Esquema de Paciente
// ===============================
const PacienteSchema = new Schema(
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

    fecha_nacimiento: {
      type: Date,
      required: true,
    },

    sexo: {
      type: String,
      required: true,
      trim: true,
    },

    correo: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    grupo_etario: {
      type: String,
      enum: GRUPOS_ETARIOS,
      required: true,
    },

    estado_clinico: {
      type: String,
      enum: ESTADOS_CLINICOS,
      required: true,
      default: "normal",
    },

    fecha_registro: {
      type: Date,
      default: Date.now,
    },

    clinica: {
      type: Schema.Types.ObjectId,
      ref: "Clinica",
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

export default model("Paciente", PacienteSchema);