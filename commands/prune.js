const { i18n } = require("../utils/locale");

/**
 * Removes the given amount of messages from the current channel.
 * @param {number|string} The amount of messages to delete.
 */
exports.run = async ({ message, args }) => {
  const [amount] = args;

  if (!amount) {
    return message.channel.send(
      i18n(message.guild.id, "commands.prune.errors.no-amount")
    );
  }
  message.channel.bulkDelete(amount);
};

exports.conf = {
  guildOnly: true,
  permLevel: "Admin"
};
