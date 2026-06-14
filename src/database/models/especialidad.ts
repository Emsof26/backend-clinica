import { Schema, model, Document, Types } from "mongoose";

export interface IEspecialidad extends Document {
  nombre: string;
  descripcion?: string;
  clinica: Types.ObjectId;
}

const EspecialidadSchema = new Schema<IEspecialidad>(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
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

export default model<IEspecialidad>(
  "Especialidad",
  EspecialidadSchema
);