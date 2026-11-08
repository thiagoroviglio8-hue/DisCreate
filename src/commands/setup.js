const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Crea roles, categorías y canales básicos sin borrar los existentes.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    const guild = interaction.guild;
    let createdRoles = 0, createdChannels = 0;

    for (const roleData of config.roles) {
      if (guild.roles.cache.some(r => r.name === roleData.name)) continue;
      await guild.roles.create({
        name: roleData.name,
        color: roleData.color,
        permissions: roleData.permissions,
        reason: "Configuración inicial de DisCreate"
      });
      createdRoles++;
    }

    for (const categoryData of config.categories) {
      let category = guild.channels.cache.find(c =>
        c.type === ChannelType.GuildCategory && c.name === categoryData.name
      );
      if (!category) {
        category = await guild.channels.create({
          name: categoryData.name,
          type: ChannelType.GuildCategory,
          reason: "Configuración inicial de DisCreate"
        });
        createdChannels++;
      }
      for (const channelData of categoryData.channels) {
        if (guild.channels.cache.some(c => c.name === channelData.name)) continue;
        await guild.channels.create({
          name: channelData.name,
          type: ChannelType.GuildText,
          parent: category.id,
          reason: "Configuración inicial de DisCreate"
        });
        createdChannels++;
      }
    }

    await interaction.editReply(
      "✅ Configuración terminada.\n" +
      "Roles creados: **" + createdRoles + "**\n" +
      "Canales/categorías creados: **" + createdChannels + "**\n" +
      "No se eliminó ningún elemento existente."
    );
  }
};
