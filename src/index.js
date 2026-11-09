require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require("discord.js");

if (!process.env.DISCORD_TOKEN) {
  console.error("Falta DISCORD_TOKEN. Copia .env.example a .env y completa tus datos.");
  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.commands = new Collection();

try {
  const commandsPath = path.join(__dirname, "commands");
  for (const file of fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"))) {
    const command = require(path.join(commandsPath, file));
    if (!command.data?.toJSON || typeof command.execute !== "function") {
      throw new Error("Comando inválido: " + file);
    }
    client.commands.set(command.data.name, command);
  }

  const eventsPath = path.join(__dirname, "events");
  for (const file of fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))) {
    const event = require(path.join(eventsPath, file));
    if (!event.name || typeof event.execute !== "function") {
      throw new Error("Evento inválido: " + file);
    }
    const handler = (...args) => Promise.resolve(event.execute(...args, client)).catch(error => {
      console.error("Error en evento " + event.name + ":", error);
    });
    if (event.once) client.once(event.name, handler);
    else client.on(event.name, handler);
  }
} catch (error) {
  console.error("No se pudo cargar el bot:", error);
  process.exit(1);
}

// Registro automático de comandos slash al iniciar sesión.
// Los comandos de servidor se actualizan casi inmediatamente.
client.once("clientReady", async () => {
  console.log("🤖 Conectado como " + client.user.tag);
  const autoDeploy = (process.env.AUTO_DEPLOY_COMMANDS || "true").toLowerCase() !== "false";

  if (!autoDeploy) {
    console.log("ℹ️ Registro automático desactivado. Usa npm run deploy para registrar comandos.");
    return;
  }

  const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN } = process.env;
  const snowflakePattern = /^\d{17,20}$/;
  if (!CLIENT_ID || !GUILD_ID || !snowflakePattern.test(CLIENT_ID) || !snowflakePattern.test(GUILD_ID)) {
    console.warn("⚠️ No se registraron comandos automáticamente: CLIENT_ID o GUILD_ID faltan o no son válidos.");
    console.warn("Completa esos valores en .env y reinicia el bot.");
    return;
  }

  try {
    const body = [...client.commands.values()].map(command => command.data.toJSON());
    const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body });
    console.log("✅ Registro automático completado: " + body.length + " comandos slash.");
  } catch (error) {
    console.error("❌ Falló el registro automático de comandos:", error);
    console.error("Puedes intentar manualmente con: npm run deploy");
  }
});

client.on("error", error => console.error("Error del cliente Discord:", error));
client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error("No se pudo iniciar sesión. Comprueba DISCORD_TOKEN:", error.message);
  process.exit(1);
});
