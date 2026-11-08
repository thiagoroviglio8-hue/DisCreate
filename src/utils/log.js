const { EmbedBuilder } = require("discord.js");

async function sendLog(guild, title, description, color = 0x3498DB) {
  const channel = guild.channels.cache.find(c => c.name === "📋・logs" && c.isTextBased());
  if (!channel) return;
  const embed = new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
  await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { sendLog };
