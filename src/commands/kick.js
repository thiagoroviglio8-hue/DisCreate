const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("kick").setDescription("Expulsa a un miembro del servidor.")
 .addUserOption(o=>o.setName("usuario").setDescription("Miembro que será expulsado").setRequired(true))
 .addStringOption(o=>o.setName("motivo").setDescription("Motivo").setMaxLength(400).setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
 async execute(interaction) {
  const user=interaction.options.getUser("usuario"), reason=interaction.options.getString("motivo")||"Sin motivo indicado";
  if(user.id===interaction.user.id) return interaction.reply({content:"No puedes expulsarte a ti mismo.",ephemeral:true});
  if(user.id===interaction.client.user.id) return interaction.reply({content:"No puedo expulsarme a mí mismo.",ephemeral:true});
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  if(!member) return interaction.reply({content:"Ese usuario no está en el servidor.",ephemeral:true});
  if(member.roles.highest.position>=interaction.member.roles.highest.position&&interaction.guild.ownerId!==interaction.user.id) return interaction.reply({content:"No puedes moderar a alguien con un rol igual o superior al tuyo.",ephemeral:true});
  if(!member.kickable) return interaction.reply({content:"No puedo expulsar a ese miembro. Revisa la jerarquía de roles.",ephemeral:true});
  await member.kick(reason);
  await interaction.reply({content:"👢 **"+user.tag+"** fue expulsado. Motivo: "+reason,allowedMentions:{parse:[]}});
 }
};