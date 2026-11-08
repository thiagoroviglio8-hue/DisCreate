# DisCreate

Bot de Discord para preparar un servidor existente con una estructura completa: roles, categorías, canales, bienvenida, despedida, tickets, sorteos y moderación.

> **Importante:** Discord no permite que un bot cree un servidor nuevo desde cero. Invita el bot a un servidor que ya hayas creado y ejecuta `/setup`. El comando no borra canales ni roles existentes.

## Requisitos
- Node.js 20.11.0 o superior
- Una aplicación y bot creados en [Discord Developer Portal](https://discord.com/developers/applications)
- Permisos del bot: Manage Channels, Manage Roles, View Channels, Send Messages, Read Message History, Moderate Members, Ban Members y Manage Messages
- Activar **Server Members Intent** en Bot > Privileged Gateway Intents

## Instalación
1. Descarga o clona este repositorio.
2. Ejecuta `npm install`.
3. Copia `.env.example` a `.env` y completa `DISCORD_TOKEN`, `CLIENT_ID` y `GUILD_ID`.
4. Ejecuta `npm run deploy` para registrar los comandos en tu servidor.
5. Ejecuta `npm start` para iniciar el bot.
6. En Discord, usa `/setup`.

## Comandos
- `/setup`: crea la estructura básica sin borrar lo que ya existe.
- `/ticket-panel`: publica el panel para abrir tickets.
- `/clear cantidad`: elimina mensajes recientes.
- `/timeout usuario duración motivo`: aplica timeout.
- `/ban usuario motivo`: banea un miembro.
- `/sorteo duración premio`: inicia un sorteo sencillo.

## Configuración
Edita `src/config.js` para cambiar nombres, colores y textos. El rol de soporte se llama `🎫・Soporte`; el bot lo crea con ese mismo nombre para que los permisos de tickets coincidan.

## Seguridad
- Nunca publiques tu token ni lo compartas.
- Si el token se filtra, regénéralo desde Discord Developer Portal.
- Usa permisos mínimos y revisa los permisos del rol del bot.
- Los comandos de moderación deben usarse respetando las reglas de tu comunidad.

## Licencia
MIT
