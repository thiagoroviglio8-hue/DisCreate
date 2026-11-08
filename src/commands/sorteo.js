const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sorteo")
    .setDescription("Publica un sorteo y elige un ganador al terminar.")
    .addIntegerOption(o => o.setName("minutos").setDescription("Duración (1 a 10080)").setMinValue(1).setMaxValue(10080).setRequired(true))
    .addStringOption(o => o.setName("premio").setDescription("Premio del sorteo").setMaxLength(200).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    const minutes = interaction.options.getInteger("minutos");
    const prize = interaction.options.getString("premio");
    const endsAt = Math.floor((Date.now() + minutes * 60_000) / 1000);

    const embed = new EmbedBuilder()
      .setColor(0xF1C40F)
      .setTitle("🎉 Sorteo")
      .setDescription("**Premio:** " + prize + "\nReacciona con 🎉 para participar.\nFinaliza: <t:" + endsAt + ":R>")
      .setTimestamp();

    const message = await interaction.channel.send({
      embeds: [embed],
      allowedMentions: { parse: [] }
    });
    await message.react("🎉");
    await interaction.reply({ content: "✅ Sorteo publicado. El bot debe permanecer encendido hasta que termine.", ephemeral: true });

    setTimeout(async () => {
      try {
        const freshMessage = await interaction.channel.messages.fetch(message.id);
        const reaction = freshMessage.reactions.cache.get("🎉");
        const users = reaction ? await reaction.users.fetch({ limit: 100 }) : null;
        const entrants = users ? users.filter(user => !user.bot) : [];
        const winner = entrants.size ? entrants.random() : null;

        if (winner) {
          await interaction.channel.send({
            content: "🏆 ¡Felicidades, <@" + winner.id + ">! Ganaste **" + prize + "**.",
            allowedMentions: { users: [winner.id] }
          });
        } else {
          await interaction.channel.send({
            content: "El sorteo de **" + prize + "** terminó sin participantes.",
            allowedMentions: { parse: [] }
          });
        }
      } catch (error) {
        console.error("No se pudo finalizar el sorteo:", error);
      }
    }, minutes * 60_000);
  }
};
