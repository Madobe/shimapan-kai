/**
 * Returns info about the current guild.
 */
exports.run = async ({ message }) => {
  const guild = message.guild;
  const onlineMembers = guild.members.filter(
    m => m.presence.status !== "offline"
  ).size;

  message.channel.send(`**${guild.name}** (ID:${guild.id}
» **Server Owner**: ${guild.owner.user.tag}
» **Region**: ${guild.region}
» **Member Count**: ${onlineMembers} online out of ${guild.memberCount}
» **Channel Count**: ${guild.channels.size}
» **Verification Level**: ${guild.verificationLevel}
» **Server Icon**: ${guild.iconURL}`);
};

exports.conf = {
  guildOnly: true,
  permLevel: "none"
};
