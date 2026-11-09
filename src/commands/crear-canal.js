const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
module.exports = {
 data:new SlashCommandBuilder().setName("crear-canal").setDescription("Crea un canal de texto, voz o anuncios.")
 .addStringOption(o=>o.setName("nombre").setDescription("Nombre del canal, sin espacios").setMaxLength(90).setRequired(true))
 .addStringOption(o=>o.setName("tipo").setDescription("Tipo de canal").addChoices(
  {name:"Texto",value:"texto"},{name:"Voz",value:"voz"},{name:"Anuncios",value:"anuncios"}
 ).setRequired(true))
 .addChannelOption(o=>o.setName("categoria").setDescription("Categoría donde se creará").addChannelTypes(ChannelType.GuildCategory).setRequired(false))
 .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
 async execute(interaction) {
  const name=interaction.options.getString("nombre").trim().toLowerCase().replace(/\s+/g,"-");
  const kind=interaction.options.getString("tipo");
  const parent=interaction.options.getChannel("categoria");
  const type=kind==="voz"?ChannelType.GuildVoice:kind==="anuncios"?ChannelType.GuildAnnouncement:ChannelType.GuildText;
  if(interaction.guild.channels.cache.some(c=>c.name.toLowerCase()===name)) return interaction.reply({content:"Ya existe un canal con ese nombre.",ephemeral:true});
  if(kind==="anuncios"&&!interaction.guild.features.includes("COMMUNITY")) return interaction.reply({content:"Los canales de anuncios requieren que el servidor tenga activada la Comunidad.",ephemeral:true});
  const channel=await interaction.guild.channels.create({name,type,...(parent?{parent:parent.id}:{}),reason:"Creado por "+interaction.user.tag});
  await interaction.reply({content:"✅ Canal creado: "+channel,ephemeral:true});
 }
};