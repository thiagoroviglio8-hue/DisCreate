const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("rol").setDescription("Añade o quita un rol a un miembro.")
 .addSubcommand(s=>s.setName("dar").setDescription("Añade un rol").addUserOption(o=>o.setName("usuario").setDescription("Miembro").setRequired(true)).addRoleOption(o=>o.setName("rol").setDescription("Rol que se añadirá").setRequired(true)))
 .addSubcommand(s=>s.setName("quitar").setDescription("Quita un rol").addUserOption(o=>o.setName("usuario").setDescription("Miembro").setRequired(true)).addRoleOption(o=>o.setName("rol").setDescription("Rol que se quitará").setRequired(true)))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
 async execute(interaction) {
  const user=interaction.options.getUser("usuario"), role=interaction.options.getRole("rol"), action=interaction.options.getSubcommand();
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  if(!member) return interaction.reply({content:"Ese usuario no está en el servidor.",ephemeral:true});
  if(role.managed||role.id===interaction.guild.id) return interaction.reply({content:"Ese rol no se puede administrar manualmente.",ephemeral:true});
  if(role.position>=interaction.guild.members.me.roles.highest.position) return interaction.reply({content:"El rol está por encima o al mismo nivel que el rol del bot.",ephemeral:true});
  if(action==="dar"){await member.roles.add(role,"Asignado por "+interaction.user.tag);return interaction.reply({content:"✅ Se asignó "+role+" a "+user.tag,ephemeral:true});}
  await member.roles.remove(role,"Retirado por "+interaction.user.tag);
  await interaction.reply({content:"✅ Se retiró "+role+" de "+user.tag,ephemeral:true});
 }
};