import { Schema, model, Document, Types } from "mongoose";

export interface IPaciente extends Document {
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date;
  sexo: string;
  telefono: string;
  direccion: string;
  clinica: Types.ObjectId;
}

const PacienteSchema = new Schema<IPaciente>(
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

    fechaNacimiento: {
      type: Date,
      required: true,
    },

    sexo: {
      type: String,
      enum: ["Masculino", "Femenino"],
      required: true,
    },

    telefono: {
      type: String,
    },

    direccion: {
      type: String,
    },

    clinica: {
      type: Schema.Types.ObjectId,
      ref: "Clinica",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model<IPaciente>(
  "Paciente",
  PacienteSchema
);