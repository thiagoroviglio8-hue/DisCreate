require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");

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
    if (!command.data?.name || typeof command.execute !== "function") {
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

client.on("error", error => console.error("Error del cliente Discord:", error));
client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error("No se pudo iniciar sesión. Comprueba DISCORD_TOKEN:", error.message);
  process.exit(1);
});
