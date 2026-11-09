const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("crear-categoria").setDescription("Crea una categoría de canales.")
 .addStringOption(o=>o.setName("nombre").setDescription("Nombre de la categoría").setMaxLength(90).setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
 async execute(interaction) {
  const name=interaction.options.getString("nombre").trim();
  if(interaction.guild.channels.cache.some(c=>c.type===ChannelType.GuildCategory&&c.name.toLowerCase()===name.toLowerCase())) return interaction.reply({content:"Ya existe una categoría con ese nombre.",ephemeral:true});
  const category=await interaction.guild.channels.create({name,type:ChannelType.GuildCategory,reason:"Creada por "+interaction.user.tag});
  await interaction.reply({content:"✅ Categoría creada: **"+category.name+"**",ephemeral:true});
 }
};