const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("anuncio").setDescription("Publica un anuncio con formato.")
 .addStringOption(o=>o.setName("titulo").setDescription("Título").setMaxLength(200).setRequired(true))
 .addStringOption(o=>o.setName("mensaje").setDescription("Contenido del anuncio").setMaxLength(3500).setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
 async execute(interaction) {
  const embed=new EmbedBuilder().setColor(0x3498DB).setTitle("📢 "+interaction.options.getString("titulo")).setDescription(interaction.options.getString("mensaje")).setFooter({text:"Anuncio de "+interaction.guild.name}).setTimestamp();
  await interaction.reply({embeds:[embed],allowedMentions:{parse:[]}});
 }
};