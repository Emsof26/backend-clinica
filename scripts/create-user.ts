import "dotenv/config";

import inquirer from "inquirer";
import chalk from "chalk";
import bcrypt from "bcrypt";

import { connectDB } from "../src/database/connection";
import Usuario, { ROLES } from "../src/database/models/usuario";

// ===============================
// Crear Usuario
// ===============================
async function createUser() {
  try {
    // Conectar a MongoDB
    await connectDB();

    console.log(chalk.yellow("=== Crear Usuario ==="));

    // ===============================
    // Preguntas
    // ===============================
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "nombre",
        message: "Nombre:",
      },
      {
        type: "input",
        name: "apellido_paterno",
        message: "Apellido paterno:",
      },
      {
        type: "input",
        name: "apellido_materno",
        message: "Apellido materno:",
      },
      {
        type: "input",
        name: "carnet_identidad",
        message: "Carnet de identidad:",
      },
      {
        type: "password",
        name: "password",
        message: "Contraseña:",
        mask: "*",
      },
      {
        type: "list",
        name: "rol",
        message: "Rol:",
        choices: [...ROLES],
      },
    ]);

    // ===============================
    // Verificar duplicado
    // ===============================
    const existe = await Usuario.findOne({
      carnet_identidad: answers.carnet_identidad,
    });

    if (existe) {
      console.log(
        chalk.red("❌ Ya existe un usuario con ese carnet de identidad.")
      );
      process.exit(1);
    }

    // ===============================
    // Encriptar contraseña
    // ===============================
    const hashedPassword = await bcrypt.hash(
      answers.password,
      10
    );

    // ===============================
    // Crear usuario
    // ===============================
    const usuario = await Usuario.create({
      nombre: answers.nombre,
      apellido_paterno: answers.apellido_paterno,
      apellido_materno: answers.apellido_materno,
      carnet_identidad: answers.carnet_identidad,
      rol: answers.rol,
      password: hashedPassword,
    });

    console.log(
      chalk.green(`✅ Usuario creado correctamente: ${usuario.nombre}`)
    );

    process.exit(0);

  } catch (error) {
    console.error(
      chalk.red("❌ Error creando usuario"),
      error
    );

    process.exit(1);
  }
}

createUser();