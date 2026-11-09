const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("unban").setDescription("Retira el bloqueo de un usuario usando su ID.")
 .addStringOption(o=>o.setName("id").setDescription("ID numérico del usuario").setRequired(true))
 .addStringOption(o=>o.setName("motivo").setDescription("Motivo").setMaxLength(400).setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
 async execute(interaction) {
  const id=interaction.options.getString("id").trim(), reason=interaction.options.getString("motivo")||"Sin motivo indicado";
  if(!/^\d{17,20}$/.test(id)) return interaction.reply({content:"El ID no tiene un formato válido.",ephemeral:true});
  await interaction.guild.members.unban(id,reason);
  await interaction.reply({content:"✅ Se retiró el bloqueo del usuario `"+id+"`. Motivo: "+reason,allowedMentions:{parse:[]}});
 }
};