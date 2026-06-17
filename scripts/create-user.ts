import "dotenv/config";

import inquirer from "inquirer";
import chalk from "chalk";
import bcrypt from "bcrypt";

import { connectDB } from "../src/database/connection";

import Usuario from "../src/database/models/usuario";
import Clinica from "../src/database/models/clinica";

async function createUser() {
  try {
    // Conectar a MongoDB
    await connectDB();

    console.log(
      chalk.yellow("=== Crear Usuario ===")
    );

    // Buscar la clínica registrada
    const clinica = await Clinica.findOne();

    if (!clinica) {
      console.log(
        chalk.red(
          "❌ No existe ninguna clínica registrada."
        )
      );

      process.exit(1);
    }

    const questions: any[] = [
      {
        type: "input",
        name: "nombres",
        message: "Nombres:",
      },
      {
        type: "input",
        name: "apellidos",
        message: "Apellidos:",
      },
      {
        type: "input",
        name: "email",
        message: "Correo electrónico:",
      },
      {
        type: "input",
        name: "telefono",
        message: "Teléfono:",
      },
      {
        type: "password",
        name: "password",
        message: "Contraseña:",
      },
      {
        type: "select",
        name: "rol",
        message: "Rol:",
        choices: [
            {
            name: "Administrador",
            value: "Administrador",
            },
            {
            name: "Doctor",
            value: "Doctor",
            },
            {
            name: "Recepcionista",
            value: "Recepcionista",
            },
        ],
      },
    ];

    const answers: any =
      await inquirer.prompt(questions);

    const existe = await Usuario.findOne({
      email: answers.email,
    });

    if (existe) {
      console.log(
        chalk.red(
          "❌ Ya existe un usuario con ese email"
        )
      );

      process.exit(1);
    }


    const hashedPassword =
      await bcrypt.hash(
        answers.password,
        10
      );


    const usuario =
      await Usuario.create({
        nombres: answers.nombres,
        apellidos: answers.apellidos,
        email: answers.email,
        telefono: answers.telefono,
        password: hashedPassword,

        rol: answers.rol,

        activo: true,

        clinica: clinica._id,
      });

    console.log(
      chalk.green(
        `✅ Usuario creado: ${usuario.nombres} ${usuario.apellidos}`
      )
    );

    process.exit(0);

  } catch (error) {

    console.error(
      chalk.red(
        "❌ Error creando usuario"
      ),
      error
    );

    process.exit(1);

  }
}

createUser();