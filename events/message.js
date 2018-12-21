/**
 * This event runs every time a message is received by the bot.
 */
const { getGuildSettings, getCustomCommands } = require("../utils/storage");

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const settings = getGuildSettings(message.guild.id);
  const prefix = settings["prefix"] || "!";

  if (message.content.startsWith(prefix)) {
    const args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const name = args.shift().toLowerCase();

    const command = client.commands[name];
    if (command) {
      if (!message.guild && command.conf.guildOnly) {
        return message.channel.send(
          "This command cannot be run in a Direct Message (DM)."
        );
      }

      try {
        await command.run({ client, message, args });
      } catch (e) {
        console.log(e);
        return message.channel.send("Something went wrong.");
      }
    } else {
      const commands = getCustomCommands(message.guild.id);

      if (!commands[name]) return;

      message.channel.send(commands[name]);
    }
  }
};
