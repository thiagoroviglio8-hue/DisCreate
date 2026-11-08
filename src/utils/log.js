const { EmbedBuilder } = require("discord.js");
const config = require("../config");

async function sendLog(guild, title, description, color = 0x3498DB) {
  const channel = guild.channels.cache.find(c =>
    c.name === config.logChannel && c.isTextBased()
  );
  if (!channel) return;

  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(String(title).slice(0, 256))
    .setDescription(String(description).slice(0, 4000))
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(error => {
    console.error("No se pudo enviar el registro:", error);
  });
}

module.exports = { sendLog };
