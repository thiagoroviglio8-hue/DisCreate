const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("warn").setDescription("Envía una advertencia privada a un miembro.")
 .addUserOption(o=>o.setName("usuario").setDescription("Miembro").setRequired(true))
 .addStringOption(o=>o.setName("motivo").setDescription("Motivo de la advertencia").setMaxLength(500).setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
 async execute(interaction) {
  const user=interaction.options.getUser("usuario"), reason=interaction.options.getString("motivo");
  if(user.bot) return interaction.reply({content:"No se puede advertir a un bot.",ephemeral:true});
  if(user.id===interaction.user.id) return interaction.reply({content:"No puedes advertirte a ti mismo.",ephemeral:true});
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  if(!member) return interaction.reply({content:"Ese usuario no está en el servidor.",ephemeral:true});
  if(member.roles.highest.position>=interaction.member.roles.highest.position&&interaction.guild.ownerId!==interaction.user.id) return interaction.reply({content:"No puedes advertir a alguien con un rol igual o superior al tuyo.",ephemeral:true});
  await user.send("⚠️ Has recibido una advertencia en **"+interaction.guild.name+"**.\nMotivo: "+reason).catch(()=>null);
  await interaction.reply({content:"⚠️ Advertencia enviada a **"+user.tag+"**. Nota: esta versión no guarda un historial permanente.",ephemeral:true,allowedMentions:{parse:[]}});
 }
};