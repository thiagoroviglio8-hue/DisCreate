const { ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const config = require("../config");
const { sendLog } = require("../utils/log");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        const payload = { content: "❌ Ocurrió un error al ejecutar el comando.", ephemeral: true };
        if (interaction.deferred || interaction.replied) await interaction.followUp(payload).catch(() => {});
        else await interaction.reply(payload).catch(() => {});
      }
      return;
    }

    if (!interaction.isButton()) return;

    if (interaction.customId === "ticket_open") {
      const existing = interaction.guild.channels.cache.find(c =>
        c.type === ChannelType.GuildText && c.topic === "ticket-owner:" + interaction.user.id
      );
      if (existing) return interaction.reply({ content: "Ya tienes un ticket abierto: " + existing, ephemeral: true });

      const supportRole = interaction.guild.roles.cache.find(r => r.name === config.supportRole);
      const overwrites = [
        { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
        { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] }
      ];
      if (supportRole) overwrites.push({ id: supportRole.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory] });

      const channel = await interaction.guild.channels.create({
        name: "ticket-" + interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 18),
        type: ChannelType.GuildText,
        topic: "ticket-owner:" + interaction.user.id,
        permissionOverwrites: overwrites,
        reason: "Ticket abierto por " + interaction.user.tag
      });

      const embed = new EmbedBuilder()
        .setColor(0x3498DB)
        .setTitle("🎫 Ticket abierto")
        .setDescription("Hola " + interaction.user + ". Explica tu consulta y el equipo te atenderá pronto.");
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("ticket_close").setLabel("Cerrar ticket").setEmoji("🔒").setStyle(ButtonStyle.Danger)
      );
      await channel.send({ content: interaction.user.toString(), embeds: [embed], components: [row] });
      await interaction.reply({ content: "✅ Tu ticket está listo: " + channel, ephemeral: true });
      await sendLog(interaction.guild, "Ticket abierto", interaction.user.tag + " creó " + channel);
      return;
    }

    if (interaction.customId === "ticket_close") {
      const isOwner = interaction.channel.topic === "ticket-owner:" + interaction.user.id;
      const isStaff = interaction.memberPermissions?.has(PermissionFlagsBits.ManageChannels) ||
        interaction.member.roles?.cache?.some(r => r.name === config.supportRole);
      if (!isOwner && !isStaff) return interaction.reply({ content: "No tienes permiso para cerrar este ticket.", ephemeral: true });
      await interaction.reply({ content: "🔒 Ticket cerrado. Este canal se eliminará en unos segundos." });
      await sendLog(interaction.guild, "Ticket cerrado", interaction.user.tag + " cerró #" + interaction.channel.name);
      setTimeout(() => interaction.channel.delete("Ticket cerrado por " + interaction.user.tag).catch(() => {}), 5000);
    }
  }
};
