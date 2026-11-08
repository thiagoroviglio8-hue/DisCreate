const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config");
const { sendLog } = require("../utils/log");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        await command.execute(interaction, client);
        return;
      }

      if (!interaction.isButton() || !interaction.guild) return;

      if (interaction.customId === "ticket_open") {
        await interaction.deferReply({ ephemeral: true });

        const existing = interaction.guild.channels.cache.find(channel =>
          channel.type === ChannelType.GuildText &&
          channel.topic === "ticket-owner:" + interaction.user.id
        );
        if (existing) return interaction.editReply("Ya tienes un ticket abierto: " + existing);

        const supportRole = interaction.guild.roles.cache.find(role => role.name === config.supportRole);
        if (!supportRole) {
          return interaction.editReply("No encuentro el rol de soporte. Ejecuta /setup o crea el rol " + config.supportRole + ".");
        }

        const category = interaction.guild.channels.cache.find(channel =>
          channel.type === ChannelType.GuildCategory && channel.name === "🛠️・SOPORTE"
        );
        const safeUsername = interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 18) || "usuario";
        const channel = await interaction.guild.channels.create({
          name: "ticket-" + safeUsername,
          type: ChannelType.GuildText,
          ...(category ? { parent: category.id } : {}),
          topic: "ticket-owner:" + interaction.user.id,
          permissionOverwrites: [
            { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
            { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks] },
            { id: supportRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.EmbedLinks] }
          ],
          reason: "Ticket abierto por " + interaction.user.tag
        });

        const embed = new EmbedBuilder()
          .setColor(0x3498DB)
          .setTitle("🎫 Ticket abierto")
          .setDescription("Hola " + interaction.user + ". Explica tu consulta y el equipo de soporte te atenderá pronto.");

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("ticket_close")
            .setLabel("Cerrar ticket")
            .setEmoji("🔒")
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
          content: interaction.user.toString(),
          embeds: [embed],
          components: [row],
          allowedMentions: { users: [interaction.user.id] }
        });
        await interaction.editReply("✅ Tu ticket está listo: " + channel);
        await sendLog(interaction.guild, "Ticket abierto", interaction.user.tag + " creó " + channel);
        return;
      }

      if (interaction.customId === "ticket_close") {
        await interaction.deferReply({ ephemeral: true });
        const ticketChannel = interaction.channel;
        if (!ticketChannel || ticketChannel.type !== ChannelType.GuildText || !ticketChannel.topic?.startsWith("ticket-owner:")) {
          return interaction.editReply("Este botón no pertenece a un ticket válido.");
        }

        const ownerId = ticketChannel.topic.slice("ticket-owner:".length);
        const member = await interaction.guild.members.fetch(interaction.user.id);
        const isOwner = ownerId === interaction.user.id;
        const isStaff = member.permissions.has(PermissionFlagsBits.ManageChannels) ||
          member.roles.cache.some(role => role.name === config.supportRole);

        if (!isOwner && !isStaff) return interaction.editReply("No tienes permiso para cerrar este ticket.");

        await interaction.editReply("🔒 Ticket cerrado. El canal se eliminará en unos segundos.");
        await sendLog(interaction.guild, "Ticket cerrado", interaction.user.tag + " cerró #" + ticketChannel.name);
        setTimeout(() => {
          ticketChannel.delete("Ticket cerrado por " + interaction.user.tag).catch(error =>
            console.error("No se pudo eliminar el ticket:", error)
          );
        }, 5000);
      }
    } catch (error) {
      console.error("Error procesando interacción:", error);
      const payload = { content: "❌ Ocurrió un error. Comprueba los permisos del bot y vuelve a intentarlo.", ephemeral: true };
      if (interaction.deferred || interaction.replied) await interaction.followUp(payload).catch(() => {});
      else await interaction.reply(payload).catch(() => {});
    }
  }
};
