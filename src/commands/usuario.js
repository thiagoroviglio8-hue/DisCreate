const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("usuario").setDescription("Muestra información de un usuario.")
 .addUserOption(o=>o.setName("miembro").setDescription("Usuario a consultar").setRequired(false)),
 async execute(interaction) {
  const user=interaction.options.getUser("miembro")||interaction.user;
  const member=await interaction.guild.members.fetch(user.id).catch(()=>null);
  const embed=new EmbedBuilder().setColor(0x3498DB).setTitle("👤 "+user.tag).setThumbnail(user.displayAvatarURL({size:256})).addFields(
   {name:"ID",value:user.id,inline:true},
   {name:"Cuenta creada",value:"<t:"+Math.floor(user.createdTimestamp/1000)+":D>",inline:true},
   {name:"Entró al servidor",value:member?"<t:"+Math.floor(member.joinedTimestamp/1000)+":D>":"No disponible",inline:true}
  );
  await interaction.reply({embeds:[embed],ephemeral:true});
 }
};