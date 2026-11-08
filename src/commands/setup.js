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
    if (!guild) return interaction.editReply("Este comando solo funciona dentro de un servidor.");

    let createdRoles = 0;
    let createdChannels = 0;
    const rolesByName = new Map(guild.roles.cache.map(role => [role.name, role]));

    for (const roleData of config.roles) {
      if (rolesByName.has(roleData.name)) continue;
      const role = await guild.roles.create({
        name: roleData.name,
        color: roleData.color,
        permissions: roleData.permissions,
        reason: "Configuración inicial de DisCreate"
      });
      rolesByName.set(role.name, role);
      createdRoles++;
    }

    const staffOverwrites = [
      { id: guild.roles.everyone.id, deny: [PermissionFlagsBits.ViewChannel] }
    ];
    for (const roleName of ["👑・Owner", "🛡️・Admin", "🔨・Moderador"]) {
      const role = rolesByName.get(roleName);
      if (role) staffOverwrites.push({
        id: role.id,
        allow: [
          PermissionFlagsBits.ViewChannel,
          PermissionFlagsBits.SendMessages,
          PermissionFlagsBits.ReadMessageHistory
        ]
      });
    }

    for (const categoryData of config.categories) {
      let category = guild.channels.cache.find(channel =>
        channel.type === ChannelType.GuildCategory && channel.name === categoryData.name
      );

      if (!category) {
        const isStaff = categoryData.name === config.staffCategory;
        category = await guild.channels.create({
          name: categoryData.name,
          type: ChannelType.GuildCategory,
          ...(isStaff ? { permissionOverwrites: staffOverwrites } : {}),
          reason: "Configuración inicial de DisCreate"
        });
        createdChannels++;
      }

      for (const channelData of categoryData.channels) {
        const alreadyExists = guild.channels.cache.some(channel => channel.name === channelData.name);
        if (alreadyExists) continue;

        await guild.channels.create({
          name: channelData.name,
          type: ChannelType.GuildText,
          parent: category.id,
          ...(categoryData.name === config.staffCategory ? { permissionOverwrites: staffOverwrites } : {}),
          reason: "Configuración inicial de DisCreate"
        });
        createdChannels++;
      }
    }

    await interaction.editReply(
      "✅ Configuración terminada.\n" +
      "Roles creados: **" + createdRoles + "**\n" +
      "Canales/categorías creados: **" + createdChannels + "**\n" +
      "La categoría STAFF nueva queda privada para @everyone y visible para Owner/Admin/Moderador.\n" +
      "No se eliminó ningún elemento existente.\n\n" +
      "Nota: si la categoría STAFF ya existía, revisa manualmente sus permisos."
    );
  }
};
