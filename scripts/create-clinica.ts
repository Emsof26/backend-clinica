import "dotenv/config";

import inquirer from "inquirer";
import chalk from "chalk";
import mongoose from "mongoose";

import { connectDB } from "../src/database/connection";
import Clinica from "../src/database/models/clinica";

// ===============================
// Crear Clínica
// ===============================
async function createClinica() {
  try {
    // Conectar a MongoDB
    await connectDB();

    console.log(chalk.yellow("\n=== Crear Clínica ===\n"));

    // ===============================
    // Preguntas
    // ===============================
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "nombre_clinica",
        message: "Nombre de la clínica:",
        validate: (value: string) => {
          return value.trim().length > 0 || "El nombre es obligatorio.";
        },
      },
      {
        type: "input",
        name: "direccion",
        message: "Dirección:",
        validate: (value: string) => {
          return value.trim().length > 0 || "La dirección es obligatoria.";
        },
      },
      {
        type: "input",
        name: "telefono",
        message: "Teléfono:",
        validate: (value: string) => {
          return value.trim().length > 0 || "El teléfono es obligatorio.";
        },
      },
      {
        type: "input",
        name: "horarios",
        message: "Horarios de atención:",
        default: "Lunes a viernes de 08:00 a 18:00",
        validate: (value: string) => {
          return value.trim().length > 0 || "El horario es obligatorio.";
        },
      },
    ]);

    // ===============================
    // Verificar clínica duplicada
    // ===============================
    const clinicaExistente = await Clinica.findOne({
      nombre_clinica: {
        $regex: new RegExp(`^${answers.nombre_clinica.trim()}$`, "i"),
      },
    });

    if (clinicaExistente) {
      console.log(
        chalk.red(
          `\n❌ Ya existe una clínica con el nombre "${answers.nombre_clinica}".`
        )
      );

      return;
    }

    // ===============================
    // Crear clínica
    // ===============================
    const clinica = await Clinica.create({
      nombre_clinica: answers.nombre_clinica.trim(),
      direccion: answers.direccion.trim(),
      telefono: answers.telefono.trim(),
      horarios: answers.horarios.trim(),
    });

    console.log(chalk.green("\n✅ Clínica creada correctamente."));
    console.log(chalk.cyan(`Nombre: ${clinica.nombre_clinica}`));
    console.log(chalk.cyan(`Dirección: ${clinica.direccion}`));
    console.log(chalk.cyan(`Teléfono: ${clinica.telefono}`));
    console.log(chalk.cyan(`Horarios: ${clinica.horarios}`));
    console.log(chalk.gray(`ID: ${clinica._id}`));
  } catch (error) {
    console.error(chalk.red("\n❌ Error creando la clínica:"), error);
  } finally {
    // Cerrar la conexión correctamente
    await mongoose.disconnect();
  }
}

createClinica();