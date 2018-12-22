/**
 * Returns the user ID for the given user.
 * @param {string} name The username to look up. Exact match.
 */
exports.run = async ({ message, args }) => {
  const [name] = args;

  if (!name) return message.channel.send("No user to look up specified.");

  const userID = message.guild.members.find(
    member => member.user.username == name
  ).id;

  message.channel.send(userID);
};

exports.conf = {
  guildOnly: true,
  permLevel: "Moderator"
};
