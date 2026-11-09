const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("slowmode").setDescription("Configura el modo lento del canal actual.")
 .addIntegerOption(o=>o.setName("segundos").setDescription("0 para desactivarlo (máximo 21600)").setMinValue(0).setMaxValue(21600).setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
 async execute(interaction) {
  const seconds=interaction.options.getInteger("segundos");
  await interaction.channel.setRateLimitPerUser(seconds,"Modo lento configurado por "+interaction.user.tag);
  await interaction.reply({content:seconds===0?"⏱️ Modo lento desactivado.":"⏱️ Modo lento configurado en **"+seconds+" segundos**."});
 }
};