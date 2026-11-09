const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("unlock").setDescription("Vuelve a permitir mensajes a @everyone.")
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
 async execute(interaction) {
  await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone,{SendMessages:null},{reason:"Canal abierto por "+interaction.user.tag});
  await interaction.reply({content:"🔓 Canal abierto. Se restauró el permiso heredado de @everyone."});
 }
};