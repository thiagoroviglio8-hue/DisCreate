const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("crear-rol").setDescription("Crea un rol nuevo sin permisos peligrosos.")
 .addStringOption(o=>o.setName("nombre").setDescription("Nombre del rol").setMaxLength(90).setRequired(true))
 .addStringOption(o=>o.setName("color").setDescription("Color hexadecimal, por ejemplo #3498DB").setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),
 async execute(interaction) {
  const name=interaction.options.getString("nombre").trim();
  const raw=interaction.options.getString("color");
  let color;
  if(raw){if(!/^#?[0-9a-fA-F]{6}$/.test(raw)) return interaction.reply({content:"Color inválido. Usa #3498DB.",ephemeral:true}); color=parseInt(raw.replace("#",""),16);}
  const role=await interaction.guild.roles.create({name,...(color!==undefined?{color}:{}),permissions:[],reason:"Creado por "+interaction.user.tag});
  await interaction.reply({content:"✅ Rol creado: "+role,ephemeral:true});
 }
};