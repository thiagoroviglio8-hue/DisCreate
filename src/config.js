module.exports = {
  brand: "DisCreate",
  supportRole: "🎫・Soporte",
  categories: [
    { name: "📌・INFORMACIÓN", channels: [
      { name: "📜・reglas", type: "text" },
      { name: "📢・anuncios", type: "text" },
      { name: "👋・bienvenidas", type: "text" }
    ]},
    { name: "💬・COMUNIDAD", channels: [
      { name: "💬・general", type: "text" },
      { name: "📸・multimedia", type: "text" },
      { name: "🤖・comandos", type: "text" }
    ]},
    { name: "🛠️・SOPORTE", channels: [
      { name: "🎫・crear-ticket", type: "text" },
      { name: "📨・contacto", type: "text" }
    ]},
    { name: "🔒・STAFF", channels: [
      { name: "💼・chat-staff", type: "text" },
      { name: "📋・logs", type: "text" }
    ]}
  ],
  roles: [
    { name: "👑・Owner", color: 0xE74C3C, permissions: ["Administrator"] },
    { name: "🛡️・Admin", color: 0xE67E22, permissions: ["ManageGuild", "ManageChannels", "ManageRoles", "ModerateMembers", "BanMembers", "ManageMessages"] },
    { name: "🔨・Moderador", color: 0x3498DB, permissions: ["ManageMessages", "ModerateMembers", "KickMembers"] },
    { name: "🎫・Soporte", color: 0x2ECC71, permissions: ["ManageMessages"] },
    { name: "🤝・Partner", color: 0x9B59B6, permissions: [] },
    { name: "👤・Miembro", color: 0x95A5A6, permissions: [] }
  ],
  welcomeChannel: "👋・bienvenidas",
  logChannel: "📋・logs"
};
