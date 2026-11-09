const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("Comprueba si el bot responde."),
  async execute(interaction, client) {
    await interaction.reply({ content: "🏓 Pong. Latencia: **" + Math.round(client.ws.ping) + " ms**.", ephemeral: true });
  }
};