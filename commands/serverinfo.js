const { i18n: t } = require("../utils/locale");

/**
 * Returns info about the current guild.
 */
exports.run = async ({ message }) => {
  const onlineMembers = message.guild.members.filter(
    m => m.presence.status !== "offline"
  ).size;

  message.channel.send(
    await t(
      message.guild.id,
      "commands.serverinfo.output",
      message.guild.name,
      message.guild.id,
      message.guild.owner.user.tag,
      message.guild.region,
      onlineMembers,
      message.guild.memberCount,
      message.guild.channels.size,
      message.guild.verificationLevel,
      message.guild.iconURL
    )
  );
};

exports.conf = {
  guildOnly: true,
  permLevel: "none"
};
