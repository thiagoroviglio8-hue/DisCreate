const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("crear-canal").setDescription("Crea un canal de texto, opcionalmente dentro de una categoría.")
 .addStringOption(o=>o.setName("nombre").setDescription("Nombre del canal, sin espacios").setMaxLength(90).setRequired(true))
 .addChannelOption(o=>o.setName("categoria").setDescription("Categoría donde se creará").addChannelTypes(ChannelType.GuildCategory).setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
 async execute(interaction) {
  const name=interaction.options.getString("nombre").trim().toLowerCase().replace(/\s+/g,"-");
  const parent=interaction.options.getChannel("categoria");
  if(interaction.guild.channels.cache.some(c=>c.name.toLowerCase()===name)) return interaction.reply({content:"Ya existe un canal con ese nombre.",ephemeral:true});
  const channel=await interaction.guild.channels.create({name,type:ChannelType.GuildText,...(parent?{parent:parent.id}:{}),reason:"Creado por "+interaction.user.tag});
  await interaction.reply({content:"✅ Canal creado: "+channel,ephemeral:true});
 }
};