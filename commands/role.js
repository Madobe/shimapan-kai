/**
 * Returns the ID for the role name given.
 * @param {string} name The role name. Exact match.
 */
exports.run = async ({ message, args }) => {
  const [name] = args;

  if (!name) return message.channel.send("No role name to look up specified.");

  const roleID = message.guild.roles.find("name", name).id;

  message.channel.send(roleID);
};

exports.conf = {
  guildOnly: true,
  permLevel: "Moderator"
};
