const { EmbedBuilder } = require("discord.js");
module.exports = {
  name: "guildMemberAdd",
  async execute(member) {
    const channel = member.guild.channels.cache.find(c => c.name === "👋・bienvenidas" && c.isTextBased());
    if (!channel) return;
    const embed = new EmbedBuilder()
      .setColor(0x2ECC71)
      .setTitle("👋 ¡Bienvenido/a!")
      .setDescription("Hola " + member + ", bienvenido/a a **" + member.guild.name + "**. ¡Esperamos que disfrutes la comunidad!")
      .setThumbnail(member.user.displayAvatarURL())
      .setFooter({ text: "Miembro #" + member.guild.memberCount })
      .setTimestamp();
    await channel.send({ embeds: [embed] });
  }
};
