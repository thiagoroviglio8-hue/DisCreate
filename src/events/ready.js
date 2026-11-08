module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log("DisCreate conectado como " + client.user.tag);
  }
};
