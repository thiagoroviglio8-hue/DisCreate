module.exports = {
  brand: "DisCreate",
  supportRole: "🎫・Soporte",
  staffCategory: "🔒・STAFF",
  welcomeChannel: "👋・bienvenidas",
  logChannel: "📋・logs",
  categories: [
    { name: "📌・INFORMACIÓN", channels: [
      { name: "📜・reglas" },
      { name: "📢・anuncios" },
      { name: "👋・bienvenidas" }
    ]},
    { name: "💬・COMUNIDAD", channels: [
      { name: "💬・general" },
      { name: "📸・multimedia" },
      { name: "🤖・comandos" }
    ]},
    { name: "🛠️・SOPORTE", channels: [
      { name: "🎫・crear-ticket" },
      { name: "📨・contacto" }
    ]},
    { name: "🔒・STAFF", channels: [
      { name: "💼・chat-staff" },
      { name: "📋・logs" }
    ]}
  ],
  roles: [
    // El rol Owner no recibe Administrator automáticamente por seguridad.
    { name: "👑・Owner", color: 0xE74C3C, permissions: [] },
    { name: "🛡️・Admin", color: 0xE67E22, permissions: ["ManageGuild", "ManageChannels", "ManageRoles", "ModerateMembers", "BanMembers", "ManageMessages", "ViewAuditLog"] },
    { name: "🔨・Moderador", color: 0x3498DB, permissions: ["ManageMessages", "ModerateMembers", "KickMembers"] },
    { name: "🎫・Soporte", color: 0x2ECC71, permissions: ["ManageMessages"] },
    { name: "🤝・Partner", color: 0x9B59B6, permissions: [] },
    { name: "👤・Miembro", color: 0x95A5A6, permissions: [] }
  ]
};
