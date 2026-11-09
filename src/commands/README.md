# Carpeta de comandos

Todos los archivos JavaScript de esta carpeta se cargan automáticamente al iniciar el bot y se registran con `npm run deploy`.

## Comandos incluidos

- **Estructura:** `setup`, `crear-rol`, `crear-categoria`, `crear-canal`, `rol`.
- **Tickets:** `ticket-panel`.
- **Moderación:** `clear`, `timeout`, `ban`, `kick`, `unban`, `warn`, `lock`, `unlock`, `slowmode`.
- **Comunidad:** `anuncio`, `encuesta`, `sorteo`.
- **Información:** `usuario`, `servidor`, `avatar`, `ping`, `ayuda`.

## Añadir otro comando

1. Crea un archivo `.js` dentro de esta carpeta.
2. Exporta `data` (un `SlashCommandBuilder`) y `execute(interaction, client)`.
3. Ejecuta `npm run deploy` para registrar los comandos.
4. Reinicia el bot.

No guardes tokens, claves ni contraseñas en los archivos de comandos.
