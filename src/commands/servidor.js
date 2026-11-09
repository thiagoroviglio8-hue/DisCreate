const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("servidor").setDescription("Muestra información del servidor."),
 async execute(interaction) {
  const g=interaction.guild;
  const owner=await g.fetchOwner().catch(()=>null);
  const embed=new EmbedBuilder().setColor(0x3498DB).setTitle("🏠 "+g.name).setThumbnail(g.iconURL({size:256})).addFields(
   {name:"Propietario",value:owner?owner.user.tag:"No disponible",inline:true},
   {name:"Miembros",value:String(g.memberCount),inline:true},
   {name:"Canales",value:String(g.channels.cache.size),inline:true},
   {name:"Roles",value:String(g.roles.cache.size),inline:true},
   {name:"Creado",value:"<t:"+Math.floor(g.createdTimestamp/1000)+":D>",inline:true},
   {name:"ID",value:g.id,inline:true}
  );
  await interaction.reply({embeds:[embed],ephemeral:true});
 }
};