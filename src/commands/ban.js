const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un miembro del servidor.")
    .addUserOption(option => option.setName("usuario").setDescription("Miembro").setRequired(true))
    .addStringOption(option => option.setName("motivo").setDescription("Motivo").setMaxLength(400).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("motivo") || "Sin motivo indicado";

    if (user.id === interaction.user.id) {
      return interaction.reply({ content: "No puedes banearte a ti mismo con este comando.", ephemeral: true });
    }

    await interaction.deferReply({ ephemeral: true });
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (!member) return interaction.editReply("Ese usuario no es miembro de este servidor.");
    if (!member.bannable) {
      return interaction.editReply("No puedo banear a ese miembro. Comprueba mis permisos y la jerarquía de roles.");
    }

    await interaction.guild.members.ban(user.id, { reason });
    await interaction.editReply("🔨 " + user.tag + " fue baneado. Motivo: " + reason);
  }
};
