const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un miembro del servidor.")
    .addUserOption(o => o.setName("usuario").setDescription("Miembro").setRequired(true))
    .addStringOption(o => o.setName("motivo").setDescription("Motivo").setMaxLength(400).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const reason = interaction.options.getString("motivo") || "Sin motivo indicado";
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);
    if (member && !member.bannable) return interaction.reply({ content: "No puedo banear a ese miembro. Revisa la jerarquía de roles y mis permisos.", ephemeral: true });
    await interaction.guild.members.ban(user.id, { reason });
    await interaction.reply({ content: "🔨 " + user.tag + " fue baneado. Motivo: " + reason, ephemeral: true });
  }
};
