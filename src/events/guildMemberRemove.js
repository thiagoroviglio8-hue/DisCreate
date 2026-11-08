const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    const channel = member.guild.channels.cache.find(c => c.name === "👋・bienvenidas" && c.isTextBased());
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setColor(0x95A5A6)
      .setTitle("👋 Hasta pronto")
      .setDescription("**" + member.user.tag + "** salió del servidor.")
      .setTimestamp();
    await channel.send({ embeds: [embed] });
  }
};
