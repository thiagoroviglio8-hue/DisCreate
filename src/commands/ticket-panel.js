const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Publica el panel para abrir tickets.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),

  async execute(interaction) {
    if (!interaction.channel?.isTextBased()) {
      return interaction.reply({ content: "Este comando debe usarse en un canal de texto.", ephemeral: true });
    }

    const embed = new EmbedBuilder()
      .setColor(0x3498DB)
      .setTitle("🎫 Centro de soporte")
      .setDescription("Pulsa el botón para abrir un canal privado con el equipo de soporte.");

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket_open")
        .setLabel("Abrir ticket")
        .setEmoji("🎫")
        .setStyle(ButtonStyle.Primary)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
