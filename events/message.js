/**
 * This event runs every time a message is received by the bot.
 */
const Settings = require("../models/settings");
const Commands = require("../models/commands");
const isAuthorized = require("../utils/isAuthorized");
const { i18n: t } = require("../utils/locale");

module.exports = async (client, message) => {
  if (message.author.bot) return;

  const settings = await Settings.build(message.guild.id);
  const prefix = settings.get("prefix") || "!";

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

      if (
        !isAuthorized(
          command.conf.permLevel,
          message.guild.id,
          message.author.id,
          message.guild.ownerID,
          message.member.roles
        )
      ) {
        return message.channel.send(
          await t(message.guild.id, "events.message.errors.lacking-perms")
        );
      }

      try {
        await command.run({ client, message, args });
      } catch (e) {
        console.log(e);
        return message.channel.send(
          await t(message.guild.id, "events.message.errors.generic")
        );
      }
    } else {
      const commands = await Commands.build(message.guild.id);

      if (!commands.get(name)) return;

      message.channel.send(commands.get(name));
    }
  }
};
