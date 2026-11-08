# DisCreate

Bot de Discord.js v14 para configurar un servidor que ya existe. Incluye estructura inicial, bienvenida/despedida, tickets, moderación, registros y sorteos.

> Discord no permite que un bot cree un servidor nuevo desde cero. Primero crea el servidor manualmente, invita el bot y ejecuta `/setup`. El instalador no elimina canales ni roles.

## Requisitos
- Node.js 20.11 o superior.
- Una aplicación/bot en [Discord Developer Portal](https://discord.com/developers/applications).
- Permisos: Manage Channels, Manage Roles, View Channels, Send Messages, Read Message History, Embed Links, Attach Files, Add Reactions, Moderate Members, Ban Members, Manage Messages y View Audit Log.
- En Developer Portal > Bot, activa **Server Members Intent**.
- El rol del bot debe estar por encima de los roles que tenga que administrar.

## Instalación
1. Clona o descarga el repositorio.
2. Ejecuta `npm install`.
3. Copia `.env.example` como `.env`.
4. Completa `DISCORD_TOKEN`, `CLIENT_ID` y `GUILD_ID` en `.env`.
5. Ejecuta `npm run deploy`.
6. Ejecuta `npm start`.
7. En tu servidor, ejecuta `/setup` y después `/ticket-panel` en el canal donde quieras mostrar el panel.

## Comandos
- `/setup`: crea los roles, categorías y canales que faltan. No borra elementos existentes.
- `/ticket-panel`: publica el panel de soporte.
- `/clear cantidad`: elimina hasta 100 mensajes recientes. Discord no permite borrar en bloque mensajes de más de 14 días.
- `/timeout usuario minutos motivo`: aplica una pausa temporal.
- `/ban usuario motivo`: banea a un usuario.
- `/sorteo minutos premio`: publica un sorteo con reacción.

## Permisos y seguridad
- La categoría STAFF se crea privada para @everyone y visible para Admin/Moderador. Si ya existía, el bot no modifica sus permisos: revísalos manualmente.
- El rol Owner se crea sin Administrator para evitar conceder permisos máximos automáticamente. Asigna permisos manualmente solo a personas de confianza.
- Nunca subas `.env` a GitHub ni compartas tu token. Si se filtra, regénéralo inmediatamente.
- No asignes Administrator al bot si no es necesario.
- El bot no puede mover su rol por encima de roles que estén fuera de su jerarquía.

## Limitaciones conocidas
- Los sorteos usan un temporizador en memoria: si el bot se reinicia o se apaga antes de terminar, no publicará automáticamente el ganador.
- El sorteo recoge hasta 100 usuarios de la reacción en esta versión.
- La categoría STAFF que ya exista no se modifica para evitar alterar permisos de un servidor que ya esté configurado.

## Licencia
MIT
