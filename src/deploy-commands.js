require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const snowflakePattern = /^\d{17,20}$/;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error("Faltan datos: completa DISCORD_TOKEN, CLIENT_ID y GUILD_ID en .env.");
  process.exit(1);
}
if (!snowflakePattern.test(CLIENT_ID) || !snowflakePattern.test(GUILD_ID)) {
  console.error("CLIENT_ID y GUILD_ID deben ser IDs numéricos válidos de Discord.");
  process.exit(1);
}

async function deploy() {
  const commands = [];
  const commandsPath = path.join(__dirname, "commands");
  const files = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

  for (const file of files) {
    const command = require(path.join(commandsPath, file));
    if (!command.data?.toJSON || typeof command.execute !== "function") {
      throw new Error("El archivo " + file + " no exporta un comando válido.");
    }
    commands.push(command.data.toJSON());
  }

  const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
  await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
  console.log("✅ " + commands.length + " comandos registrados correctamente.");
}

deploy().catch(error => {
  console.error("❌ No se pudieron registrar los comandos:", error);
  process.exitCode = 1;
});
