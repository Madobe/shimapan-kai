const searchMembers = require("../utils/searchMembers");
const { i18n: t } = require("../utils/locale");

/**
 * Returns the user ID for the given user.
 * @param {string} name The username to look up. Exact match.
 */
exports.run = async ({ message, args }) => {
  const [search] = args;

  if (!search)
    return message.channel.send(
      await t(message.guild.id, "commands.user.errors.no-search")
    );

  const userID = searchMembers(message.guild.members, search)[0];

  if (!userID)
    return message.channel.send(
      await t(message.guild.id, "commands.user.errors.no-matches")
    );

  message.channel.send(userID);
};

exports.conf = {
  guildOnly: true,
  permLevel: "Moderator"
};
