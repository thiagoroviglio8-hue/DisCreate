const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Elimina mensajes recientes del canal.")
    .addIntegerOption(o => o.setName("cantidad").setDescription("Cantidad entre 1 y 100").setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  async execute(interaction) {
    const amount = interaction.options.getInteger("cantidad");
    const deleted = await interaction.channel.bulkDelete(amount, true);
    await interaction.reply({ content: "🧹 Se eliminaron " + deleted.size + " mensajes recientes.", ephemeral: true });
  }
};
