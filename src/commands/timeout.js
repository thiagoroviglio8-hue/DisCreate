const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Aplica una pausa temporal a un miembro.")
    .addUserOption(o => o.setName("usuario").setDescription("Miembro").setRequired(true))
    .addIntegerOption(o => o.setName("minutos").setDescription("Duración en minutos (1 a 40320)").setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(o => o.setName("motivo").setDescription("Motivo").setMaxLength(400).setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  async execute(interaction) {
    const user = interaction.options.getUser("usuario");
    const minutes = interaction.options.getInteger("minutos");
    const reason = interaction.options.getString("motivo") || "Sin motivo indicado";
    const member = await interaction.guild.members.fetch(user.id);
    if (!member.moderatable) return interaction.reply({ content: "No puedo moderar a ese miembro. Revisa la jerarquía de roles y mis permisos.", ephemeral: true });
    await member.timeout(minutes * 60_000, reason);
    await interaction.reply({ content: "⏳ " + user.tag + " recibió timeout durante " + minutes + " minutos. Motivo: " + reason, ephemeral: true });
  }
};
