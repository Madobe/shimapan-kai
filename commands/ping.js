const { i18n } = require("../utils/locale");

/**
 * Returns a pong. Just for testing.
 */
exports.run = async ({ message }) => {
  message.channel.send(i18n(message.guild.id, "commands.ping"));
};

exports.conf = {
  guildOnly: false,
  permLevel: "none"
};
