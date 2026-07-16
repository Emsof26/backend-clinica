import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

import Paciente, {
  GRUPOS_ETARIOS,
  ESTADOS_CLINICOS,
} from "../../database/models/paciente";

import Clinica from "../../database/models/clinica";
import ApiError from "../../errors/ApiError";

// ===============================
// Tipos obtenidos desde el modelo
// ===============================
type GrupoEtario =
  (typeof GRUPOS_ETARIOS)[number];

type EstadoClinico =
  (typeof ESTADOS_CLINICOS)[number];

// ===============================
// Validar estado clínico
// ===============================
const esEstadoClinico = (
  valor: unknown
): valor is EstadoClinico => {
  return ESTADOS_CLINICOS.includes(
    valor as EstadoClinico
  );
};

// ===============================
// Calcular grupo etario
// ===============================
const calcularGrupoEtario = (
  fechaNacimiento: Date
): GrupoEtario => {
  const hoy = new Date();

  const diferenciaMilisegundos =
    hoy.getTime() - fechaNacimiento.getTime();

  const dias = Math.floor(
    diferenciaMilisegundos /
      (1000 * 60 * 60 * 24)
  );

  // Desde el nacimiento hasta 28 días
  if (dias <= 28) {
    return "neonato";
  }

  let edad =
    hoy.getFullYear() -
    fechaNacimiento.getFullYear();

  const diferenciaMeses =
    hoy.getMonth() -
    fechaNacimiento.getMonth();

  if (
    diferenciaMeses < 0 ||
    (diferenciaMeses === 0 &&
      hoy.getDate() <
        fechaNacimiento.getDate())
  ) {
    edad--;
  }

  if (edad < 2) {
    return "lactante";
  }

  if (edad < 12) {
    return "infancia";
  }

  if (edad < 18) {
    return "adolescencia";
  }

  if (edad < 60) {
    return "adultez";
  }

  return "adulto_mayor";
};

// ===============================
// Registrar paciente
// ===============================
export const registrarPaciente = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      nombre,
      apellido_paterno,
      apellido_materno,
      carnet_identidad,
      fecha_nacimiento,
      sexo,
      correo,
      estado_clinico,
      clinica,
    } = req.body;

    // ===============================
    // Validar campos obligatorios
    // ===============================
    if (
      !nombre ||
      !apellido_paterno ||
      !apellido_materno ||
      !carnet_identidad ||
      !fecha_nacimiento ||
      !sexo ||
      !correo ||
      !clinica
    ) {
      throw new ApiError({
        name: "VALIDATION_ERROR",
        message:
          "Todos los campos obligatorios deben ser enviados.",
        code: "ERR_REQUIRED_FIELDS",
        status: 400,
      });
    }

    // ===============================
    // Validar fecha de nacimiento
    // ===============================
    const fechaNacimiento = new Date(
      fecha_nacimiento
    );

    if (
      Number.isNaN(fechaNacimiento.getTime())
    ) {
      throw new ApiError({
        name: "VALIDATION_ERROR",
        message:
          "La fecha de nacimiento no es válida.",
        code: "ERR_INVALID_BIRTH_DATE",
        status: 400,
      });
    }

    if (fechaNacimiento > new Date()) {
      throw new ApiError({
        name: "VALIDATION_ERROR",
        message:
          "La fecha de nacimiento no puede ser futura.",
        code: "ERR_FUTURE_BIRTH_DATE",
        status: 400,
      });
    }

    // ===============================
    // Validar ID de clínica
    // ===============================
    if (!mongoose.isValidObjectId(clinica)) {
      throw new ApiError({
        name: "VALIDATION_ERROR",
        message:
          "El identificador de la clínica no es válido.",
        code: "ERR_INVALID_CLINIC_ID",
        status: 400,
      });
    }

    const clinicaId =
      new mongoose.Types.ObjectId(clinica);

    // ===============================
    // Verificar que exista la clínica
    // ===============================
    const clinicaExistente =
      await Clinica.exists({
        _id: clinicaId,
      });

    if (!clinicaExistente) {
      throw new ApiError({
        name: "NOT_FOUND_ERROR",
        message:
          "La clínica seleccionada no existe.",
        code: "ERR_CLINIC_NOT_FOUND",
        status: 404,
      });
    }

    // ===============================
    // Normalizar datos
    // ===============================
    const carnetNormalizado =
      String(carnet_identidad).trim();

    const correoNormalizado =
      String(correo).trim().toLowerCase();

    // ===============================
    // Verificar carnet duplicado
    // ===============================
    const pacienteExistente =
      await Paciente.findOne({
        carnet_identidad:
          carnetNormalizado,
      });

    if (pacienteExistente) {
      throw new ApiError({
        name: "CONFLICT_ERROR",
        message:
          "Ya existe un paciente con ese carnet de identidad.",
        code: "ERR_PATIENT_ALREADY_EXISTS",
        status: 409,
      });
    }

    // ===============================
    // Validar estado clínico
    // ===============================
    const estadoClinico: EstadoClinico =
      estado_clinico ?? "normal";

    if (!esEstadoClinico(estadoClinico)) {
      throw new ApiError({
        name: "VALIDATION_ERROR",
        message:
          "El estado clínico no es válido.",
        code: "ERR_INVALID_CLINICAL_STATUS",
        status: 400,
      });
    }

    // ===============================
    // Calcular grupo etario
    // ===============================
    const grupoEtario: GrupoEtario =
      calcularGrupoEtario(fechaNacimiento);

    // ===============================
    // Crear paciente
    // ===============================
    const paciente = await Paciente.create({
      nombre: String(nombre).trim(),

      apellido_paterno: String(
        apellido_paterno
      ).trim(),

      apellido_materno: String(
        apellido_materno
      ).trim(),

      carnet_identidad:
        carnetNormalizado,

      fecha_nacimiento:
        fechaNacimiento,

      sexo: String(sexo).trim(),

      correo: correoNormalizado,

      grupo_etario: grupoEtario,

      estado_clinico:
        estadoClinico,

      clinica: clinicaId,
    });

    // ===============================
    // Obtener datos de la clínica
    // ===============================
    await paciente.populate(
      "clinica",
      "nombre_clinica direccion telefono horarios"
    );

    return res.status(201).json({
      message:
        "Paciente registrado correctamente.",
      paciente,
    });
  } catch (error: any) {
    // Error de índice unique de MongoDB
    if (error?.code === 11000) {
      return next(
        new ApiError({
          name: "CONFLICT_ERROR",
          message:
            "Ya existe un paciente con ese carnet de identidad.",
          code: "ERR_PATIENT_ALREADY_EXISTS",
          status: 409,
        })
      );
    }

    return next(error);
  }
};