const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("lock").setDescription("Cierra el canal actual para @everyone.")
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
 async execute(interaction) {
  await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{SendMessages:false},{reason:"Canal cerrado por "+interaction.user.tag});
  await interaction.reply({content:"🔒 Canal cerrado para @everyone."});
 }
};