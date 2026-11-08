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
    const embed = new EmbedBuilder().setColor(0xF1C40F).setTitle("🎉 Sorteo").setDescription("**Premio:** " + prize + "\nReacciona con 🎉 para participar.\nFinaliza en " + minutes + " minuto(s).").setTimestamp(Date.now() + minutes * 60_000);
    const message = await interaction.channel.send({ embeds: [embed] });
    await message.react("🎉");
    await interaction.reply({ content: "✅ Sorteo publicado.", ephemeral: true });
    setTimeout(async () => {
      try {
        const fresh = await interaction.channel.messages.fetch(message.id);
        const reaction = fresh.reactions.cache.get("🎉");
        const users = reaction ? await reaction.users.fetch() : null;
        const entrants = users ? users.filter(u => !u.bot) : [];
        const winner = entrants.size ? entrants.random() : null;
        await interaction.channel.send(winner ? "🏆 ¡Felicidades, <@" + winner.id + ">! Ganaste **" + prize + "**." : "El sorteo de **" + prize + "** terminó sin participantes.");
      } catch (error) {
        console.error("No se pudo finalizar el sorteo:", error);
      }
    }, minutes * 60_000);
  }
};
