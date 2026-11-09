const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("ayuda").setDescription("Muestra todos los comandos disponibles."),
  async execute(interaction, client) {
    const names = [...client.commands.values()].map(c => ({name:c.data.name,description:c.data.description || "Sin descripción"})).sort((a,b)=>a.name.localeCompare(b.name));
    const embed = new EmbedBuilder().setColor(0x3498DB).setTitle("📚 DisCreate | Comandos").setDescription(names.map(c => "`/"+c.name+"` — "+c.description).join("\n").slice(0,4000)).setFooter({text:"Los comandos administrativos requieren permisos adecuados."});
    await interaction.reply({embeds:[embed],ephemeral:true});
  }
};