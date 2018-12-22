const searchMembers = require("../utils/searchMembers");
const isAuthorized = require("../utils/isAuthorized");

exports.run = async ({ message, args }) => {
  const [level, search] = args;
  const userId = searchMembers(message.guild.members, search)[0];
  const member = message.guild.members.get(userId);

  if (
    await isAuthorized(
      level,
      message.guild.id,
      userId,
      message.guild.ownerID,
      member.roles
    )
  ) {
    message.channel.send(
      "`" + member.displayName + "` can access `" + level + "` resources."
    );
  } else {
    message.channel.send(
      "`" + member.displayName + "` can't access `" + level + "` resources."
    );
  }
};

exports.conf = {
  guildOnly: true,
  permLevel: "Owner"
};
