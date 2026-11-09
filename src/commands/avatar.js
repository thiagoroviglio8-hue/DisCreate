const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("avatar").setDescription("Muestra el avatar de un usuario.")
 .addUserOption(o=>o.setName("usuario").setDescription("Usuario").setRequired(false)),
 async execute(interaction) {
  const user=interaction.options.getUser("usuario")||interaction.user;
  const url=user.displayAvatarURL({size:1024,extension:"png"});
  const embed=new EmbedBuilder().setColor(0x3498DB).setTitle("Avatar de "+user.username).setImage(url).setURL(url);
  await interaction.reply({embeds:[embed],ephemeral:true});
 }
};