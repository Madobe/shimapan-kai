const storage = require("node-persist");

module.exports = async (client, message) => {
  if (message.author.bot) return;

  await storage.init();

  const settings = storage.getItem("settings");

  // Prefixes can be set per server, otherwise use default
  if (message.content.startsWith(settings["prefix"] || "!")) {
    // Check regular commands first
    const args = message.content
      .slice(settings.prefix.length)
      .trim()
      .split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);
    if (cmd) {
      if (!message.guild && cmd.conf.guildOnly) {
        return message.channel.send(
          "This command cannot be run in a Direct Message (DM)."
        );
      }

      // There are only 5 levels of access: a normal user (1), a mod (2), an admin (3), a server owner (4) and the bot owner (5)
      if (client.permLevel(message) < client.levelCache[cmd.conf.permLevel]) {
        console.log(client.permLevel(message));
        console.log(client.levelCache[cmd.conf.permLevel]);
        return message.channel.send(
          "You do not have the necessary permission level to use this command."
        );
      }

      cmd.run(client, message, args);
    } else {
      const coms = client.customCommands.get(message.guild.id);
      if (!coms[command]) return;
      message.channel.send(coms[command]);
    }
  }
};
