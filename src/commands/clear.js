const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Elimina mensajes recientes del canal.")
    .addIntegerOption(option =>
      option.setName("cantidad")
        .setDescription("Cantidad entre 1 y 100")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    if (!interaction.channel?.bulkDelete) {
      return interaction.reply({ content: "Este comando solo funciona en canales de texto compatibles.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    const amount = interaction.options.getInteger("cantidad");
    const deleted = await interaction.channel.bulkDelete(amount, true);
    await interaction.editReply("🧹 Se eliminaron **" + deleted.size + "** mensajes. Discord omite los mensajes de más de 14 días.");
  }
};
