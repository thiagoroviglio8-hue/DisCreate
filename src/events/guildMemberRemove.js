const { EmbedBuilder } = require("discord.js");
const config = require("../config");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const channel = member.guild.channels.cache.find(c =>
      c.name === config.welcomeChannel && c.isTextBased()
    );
    if (!channel) return;

    const embed = new EmbedBuilder()
      .setColor(0x95A5A6)
      .setTitle("👋 Hasta pronto")
      .setDescription("**" + member.user.tag + "** salió del servidor.")
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch(error =>
      console.error("No se pudo enviar el mensaje de despedida:", error)
    );
  }
};
