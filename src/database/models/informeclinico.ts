import { Schema, model, Document, Types } from "mongoose";

export interface IInformeClinico extends Document {
  paciente: Types.ObjectId;
  usuario: Types.ObjectId;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  fechaConsulta: Date;
}

const InformeClinicoSchema =
  new Schema<IInformeClinico>(
    {
      paciente: {
        type: Schema.Types.ObjectId,
        ref: "Paciente",
        required: true,
      },

      usuario: {
        type: Schema.Types.ObjectId,
        ref: "Usuario",
        required: true,
      },

      diagnostico: {
        type: String,
        required: true,
      },

      tratamiento: {
        type: String,
        required: true,
      },

      observaciones: {
        type: String,
      },

      fechaConsulta: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

export default model<IInformeClinico>(
  "InformeClinico",
  InformeClinicoSchema
);