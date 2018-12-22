const { i18n: t } = require("../utils/locale");

/**
 * Returns the ID for the role name given.
 * @param {string} name The role name. Exact match.
 */
exports.run = async ({ message, args }) => {
  const [name] = args;

  if (!name)
    return message.channel.send(
      await t(message.guild.id, "commands.role.errors.no-name")
    );

  const roleID = message.guild.roles.find("name", name).id;

  message.channel.send(roleID);
};

exports.conf = {
  guildOnly: true,
  permLevel: "Moderator"
};
