const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("encuesta").setDescription("Crea una encuesta sencilla con reacciones.")
 .addStringOption(o=>o.setName("pregunta").setDescription("Pregunta de la encuesta").setMaxLength(250).setRequired(true))
 .addStringOption(o=>o.setName("opcion1").setDescription("Primera opción").setMaxLength(80).setRequired(true))
 .addStringOption(o=>o.setName("opcion2").setDescription("Segunda opción").setMaxLength(80).setRequired(true))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
 async execute(interaction) {
  const a=interaction.options.getString("opcion1"), b=interaction.options.getString("opcion2");
  const embed=new EmbedBuilder().setColor(0x5865F2).setTitle("📊 "+interaction.options.getString("pregunta")).setDescription("🇦 **"+a+"**\n🇧 **"+b+"**").setFooter({text:"Encuesta creada por "+interaction.user.username});
  const msg=await interaction.reply({embeds:[embed],fetchReply:true,allowedMentions:{parse:[]}});
  await msg.react("🇦"); await msg.react("🇧");
 }
};