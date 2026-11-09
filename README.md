# DisCreate

Bot de Discord.js v14 para configurar y administrar un servidor de Discord que ya existe. Incluye creación de estructura, roles, canales, categorías, tickets, moderación, anuncios, encuestas, bienvenida/despedida, registros y sorteos.

> Discord no permite que un bot cree un servidor nuevo desde cero. Primero crea el servidor manualmente, invita el bot y ejecuta `/setup`. El instalador no elimina canales ni roles existentes.

## Requisitos
- Node.js 20.11 o superior.
- Una aplicación/bot en [Discord Developer Portal](https://discord.com/developers/applications).
- Permisos del bot: Manage Channels, Manage Roles, View Channels, Send Messages, Read Message History, Embed Links, Attach Files, Add Reactions, Moderate Members, Ban Members, Kick Members, Manage Messages y View Audit Log.
- En Developer Portal > Bot, activa **Server Members Intent** para los eventos de bienvenida y despedida.
- El rol del bot debe estar por encima de los roles que tenga que administrar.

## Instalación
1. Clona o descarga el repositorio.
2. Ejecuta `npm install`.
3. Copia `.env.example` como `.env`.
4. Completa `DISCORD_TOKEN`, `CLIENT_ID` y `GUILD_ID` en `.env`.
5. En Developer Portal > Bot, activa **Server Members Intent** y guarda los cambios.
6. Deja `AUTO_DEPLOY_COMMANDS=true` (valor predeterminado).
7. Ejecuta `npm start`. Cuando el bot se conecte, registrará automáticamente los comandos slash en el servidor indicado por `GUILD_ID`.
8. En el servidor, ejecuta `/setup` y después `/ticket-panel` donde quieras publicar el panel.

Si necesitas forzar el registro manual, ejecuta `npm run deploy`. Para desactivar el registro automático, configura `AUTO_DEPLOY_COMMANDS=false`.

## Comandos disponibles

### Configuración y creación
- `/setup`: crea los roles, categorías y canales iniciales que falten. No borra elementos existentes.
- `/crear-rol nombre color`: crea un rol sin permisos peligrosos.
- `/crear-categoria nombre`: crea una categoría.
- `/crear-canal nombre tipo categoria`: crea un canal de texto, voz o anuncios (anuncios requiere Comunidad), opcionalmente dentro de una categoría.
- `/rol dar` y `/rol quitar`: asigna o retira un rol a un miembro.
- `/ticket-panel`: publica el panel de tickets.

### Moderación
- `/clear cantidad`: elimina mensajes recientes (máximo 100; Discord no permite borrado masivo de mensajes de más de 14 días).
- `/timeout usuario minutos motivo`: aplica una pausa temporal.
- `/ban usuario motivo`: banea a un usuario.
- `/kick usuario motivo`: expulsa a un miembro.
- `/unban id motivo`: retira el bloqueo usando el ID.
- `/warn usuario motivo`: envía una advertencia privada; no mantiene historial permanente.
- `/lock` y `/unlock`: cierran o abren el canal actual para @everyone.
- `/slowmode segundos`: configura el modo lento del canal.

### Comunidad e información
- `/anuncio titulo mensaje`: publica un anuncio.
- `/encuesta pregunta opcion1 opcion2`: publica una encuesta con reacciones.
- `/sorteo minutos premio`: publica un sorteo.
- `/usuario miembro`: muestra información de un usuario.
- `/servidor`: muestra información del servidor.
- `/avatar usuario`: muestra el avatar.
- `/ping`: comprueba la latencia.
- `/ayuda`: lista los comandos registrados.

Los comandos se registran automáticamente al iniciar sesión cuando `AUTO_DEPLOY_COMMANDS=true` y `CLIENT_ID`/ `GUILD_ID` están completos. Si el registro automático falla, revisa el error de consola y prueba `npm run deploy`. Para desactivar el registro automático, configura `AUTO_DEPLOY_COMMANDS=false`. Los permisos de cada comando también se validan en Discord y en el código.

## Permisos y seguridad
- La categoría STAFF se crea privada para @everyone y visible para Owner/Admin/Moderador. Si ya existía, el bot no modifica sus permisos: revísalos manualmente.
- El rol Owner se crea sin Administrator para evitar conceder permisos máximos automáticamente. Asigna permisos manualmente solo a personas de confianza.
- Nunca subas `.env` a GitHub ni compartas tu token. Si se filtra, regénéralo inmediatamente.
- No asignes Administrator al bot si no es necesario.
- El bot no puede administrar roles que estén por encima o al mismo nivel que su rol más alto.

## Limitaciones conocidas
- Los sorteos usan un temporizador en memoria: si el bot se reinicia o se apaga antes de terminar, no publicará automáticamente el ganador.
- El sorteo recoge hasta 100 usuarios de la reacción en esta versión.
- `/warn` envía una advertencia, pero no guarda un registro permanente.
- La categoría STAFF que ya exista no se modifica para evitar alterar permisos de un servidor que ya esté configurado.

## Licencia
MIT
