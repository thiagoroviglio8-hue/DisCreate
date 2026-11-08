const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Aplica una pausa temporal a un miembro.")
    .addUserOption(option => option.setName("usuario").setDescription("Miembro").setRequired(true))
    .addIntegerOption(option => option.setName("minutos").setDescription("Duración en minutos (1 a 40320)").setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(option => option.setName("motivo").setDescription("Motivo").setMaxLength(400).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const minutes = interaction.options.getInteger("minutos");
    const reason = interaction.options.getString("motivo") || "Sin motivo indicado";

    if (user.id === interaction.user.id) {
      return interaction.reply({ content: "No puedes aplicarte un timeout a ti mismo con este comando.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.editReply("Ese usuario no es miembro de este servidor.");
    if (!member.moderatable) {
      return interaction.editReply("No puedo moderar a ese miembro. Comprueba mis permisos y la jerarquía de roles.");
    }

    await member.timeout(minutes * 60_000, reason);
    await interaction.editReply("⏳ " + user.tag + " recibió timeout durante **" + minutes + " minutos**. Motivo: " + reason);
  }
};
