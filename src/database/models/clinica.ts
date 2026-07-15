import { Schema, model } from "mongoose";

const ClinicaSchema = new Schema(
  {
    nombre_clinica: {
      type: String,
      required: true,
      trim: true,
    },

    direccion: {
      type: String,
      required: true,
      trim: true,
    },

    telefono: {
      type: String,
      required: true,
      trim: true,
    },

    horarios: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Clinica", ClinicaSchema);