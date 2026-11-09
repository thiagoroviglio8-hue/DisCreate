const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  OverwriteType
} = require("discord.js");

const API_BASE = "https://discord.com/api/v10";

function getTemplateCode(input) {
  const value = input.trim();
  if (/^[a-zA-Z0-9_-]{5,100}$/.test(value)) return value;

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error("Pega un enlace válido de discord.new o discord.com.");
  }

  const allowedHosts = ["discord.new", "www.discord.new", "discord.com", "www.discord.com", "discordapp.com", "www.discordapp.com"];
  if (!allowedHosts.includes(url.hostname.toLowerCase())) {
    throw new Error("El enlace debe pertenecer a discord.new o discord.com.");
  }

  const code = url.pathname.split("/").filter(Boolean).pop();
  if (!code || !/^[a-zA-Z0-9_-]{5,100}$/.test(code)) {
    throw new Error("No pude reconocer el código de la plantilla en ese enlace.");
  }
  return code;
}

function mapOverwrites(sourceOverwrites, roleMap) {
  if (!Array.isArray(sourceOverwrites)) return [];
  const mapped = [];

  for (const overwrite of sourceOverwrites) {
    // Las sobrescrituras de miembros no se pueden trasladar de forma segura
    // a otro servidor. Solo copiamos las asociadas a roles.
    if (overwrite.type !== OverwriteType.Role) continue;
    const targetId = roleMap.get(String(overwrite.id));
    if (!targetId) continue;

    mapped.push({
      id: targetId,
      type: OverwriteType.Role,
      allow: BigInt(overwrite.allow || "0"),
      deny: BigInt(overwrite.deny || "0")
    });
  }
  return mapped;
}

function channelTypeFromTemplate(type) {
  const supported = new Map([
    [ChannelType.GuildText, ChannelType.GuildText],
    [ChannelType.GuildVoice, ChannelType.GuildVoice],
    [ChannelType.GuildCategory, ChannelType.GuildCategory],
    [ChannelType.GuildAnnouncement, ChannelType.GuildAnnouncement],
    [ChannelType.GuildStageVoice, ChannelType.GuildStageVoice],
    [ChannelType.GuildForum, ChannelType.GuildForum]
  ]);
  return supported.get(type) ?? null;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("plantilla")
    .setDescription("Importa roles, categorías, canales y permisos desde una plantilla pública de Discord.")
    .addSubcommand(sub =>
      sub.setName("importar")
        .setDescription("Importa una plantilla pública en este servidor sin borrar lo existente.")
        .addStringOption(option =>
          option.setName("url")
            .setDescription("Enlace discord.new o código de la plantilla")
            .setMaxLength(200)
            .setRequired(true)
        )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild) {
      return interaction.editReply("Este comando solo funciona dentro de un servidor.");
    }

    const me = await interaction.guild.members.fetchMe();
    if (!me.permissions.has(PermissionFlagsBits.ManageRoles) ||
        !me.permissions.has(PermissionFlagsBits.ManageChannels)) {
      return interaction.editReply("❌ Necesito los permisos **Gestionar roles** y **Gestionar canales**. Comprueba también que mi rol esté por encima de los roles que debo crear.");
    }

    let code;
    try {
      code = getTemplateCode(interaction.options.getString("url", true));
    } catch (error) {
      return interaction.editReply("❌ " + error.message);
    }

    let response;
    try {
      response = await fetch(API_BASE + "/guilds/templates/" + encodeURIComponent(code), {
        headers: { "User-Agent": "DisCreate/1.0 (Discord template importer)" }
      });
    } catch (error) {
      console.error("Error consultando la plantilla:", error);
      return interaction.editReply("❌ No pude conectar con Discord para consultar la plantilla. Inténtalo de nuevo.");
    }

    if (response.status === 404) {
      return interaction.editReply("❌ Discord no encontró esa plantilla. Comprueba que el enlace sea público y que esté completo.");
    }
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Discord template API:", response.status, detail);
      return interaction.editReply("❌ Discord rechazó la consulta de la plantilla (HTTP " + response.status + "). Comprueba el enlace e inténtalo más tarde.");
    }

    const template = await response.json();
    const source = template.serialized_source;
    if (!source || !Array.isArray(source.channels) || !Array.isArray(source.roles)) {
      return interaction.editReply("❌ La plantilla no contiene una estructura compatible para importar.");
    }

    const guild = interaction.guild;
    const roleMap = new Map();
    const channelMap = new Map();
    const existingRoles = await guild.roles.fetch();
    const existingChannels = await guild.channels.fetch();

    // Discord crea automáticamente @everyone; se vincula al rol del servidor.
    for (const role of source.roles) {
      if (role.name === "@everyone") {
        roleMap.set(String(role.id), guild.id);
        continue;
      }
      const existing = existingRoles.find(item => item.name === role.name);
      if (existing) {
        roleMap.set(String(role.id), existing.id);
        continue;
      }

      try {
        const created = await guild.roles.create({
          name: String(role.name || "Rol importado").slice(0, 100),
          color: Number.isInteger(role.color) ? role.color : 0,
          hoist: Boolean(role.hoist),
          mentionable: Boolean(role.mentionable),
          permissions: BigInt(role.permissions || "0"),
          reason: "Importación de plantilla pública mediante DisCreate"
        });
        roleMap.set(String(role.id), created.id);
      } catch (error) {
        console.error("No se pudo importar el rol " + role.name + ":", error);
      }
    }

    const categories = source.channels
      .filter(channel => channel.type === ChannelType.GuildCategory)
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    const otherChannels = source.channels
      .filter(channel => channel.type !== ChannelType.GuildCategory)
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    let createdCategories = 0;
    let createdChannels = 0;
    let skippedChannels = 0;
    let failedItems = 0;

    for (const channel of categories) {
      const existing = existingChannels.find(item =>
        item.type === ChannelType.GuildCategory && item.name === channel.name
      );
      if (existing) {
        channelMap.set(String(channel.id), existing.id);
        skippedChannels++;
        continue;
      }

      try {
        const created = await guild.channels.create({
          name: String(channel.name || "categoría-importada").slice(0, 100),
          type: ChannelType.GuildCategory,
          permissionOverwrites: mapOverwrites(channel.permission_overwrites, roleMap),
          reason: "Importación de plantilla mediante DisCreate"
        });
        channelMap.set(String(channel.id), created.id);
        createdCategories++;
      } catch (error) {
        failedItems++;
        console.error("No se pudo crear la categoría " + channel.name + ":", error);
      }
    }

    for (const channel of otherChannels) {
      const type = channelTypeFromTemplate(channel.type);
      if (!type) {
        skippedChannels++;
        continue;
      }

      const existing = existingChannels.find(item =>
        item.name === channel.name && item.type === type
      );
      if (existing) {
        skippedChannels++;
        continue;
      }

      const parentId = channel.parent_id ? channelMap.get(String(channel.parent_id)) : undefined;
      try {
        const created = await guild.channels.create({
          name: String(channel.name || "canal-importado").slice(0, 100),
          type,
          ...(parentId ? { parent: parentId } : {}),
          permissionOverwrites: mapOverwrites(channel.permission_overwrites, roleMap),
          ...(typeof channel.topic === "string" && type === ChannelType.GuildText ? { topic: channel.topic.slice(0, 1024) } : {}),
          ...(Number.isInteger(channel.bitrate) && type === ChannelType.GuildVoice ? { bitrate: Math.min(channel.bitrate, guild.maximumBitrate) } : {}),
          ...(Number.isInteger(channel.user_limit) && type === ChannelType.GuildVoice ? { userLimit: channel.user_limit } : {}),
          reason: "Importación de plantilla mediante DisCreate"
        });
        channelMap.set(String(channel.id), created.id);
        createdChannels++;
      } catch (error) {
        failedItems++;
        console.error("No se pudo crear el canal " + channel.name + ":", error);
      }
    }

    const templateName = template.name || "Plantilla de Discord";
    return interaction.editReply(
      "✅ **Importación finalizada: " + templateName + "**\n\n" +
      "Roles procesados: **" + roleMap.size + "**\n" +
      "Categorías creadas: **" + createdCategories + "**\n" +
      "Canales creados: **" + createdChannels + "**\n" +
      "Elementos omitidos (ya existentes o no compatibles): **" + skippedChannels + "**\n" +
      "Elementos con errores: **" + failedItems + "**\n\n" +
      "No eliminé canales ni roles existentes. Las sobrescrituras de permisos de miembros individuales no se copian; solo las de roles. Revisa los permisos al terminar."
    );
  }
};
