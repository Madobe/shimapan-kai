const searchMembers = require("../utils/searchMembers");
const clamp = require("../utils/clamp");
const clean = require("../utils/clean");
const { i18n: t } = require("../utils/locale");

/**
 * Returns the GuildMember object that matches the search query.
 * @param {Message} message A Discord.js Message object.
 * @param {string} search The search query.
 */
const getMember = (message, search) => {
  if (!search) return message.member;

  const idMatch = message.guild.members.get(search);
  const matches = searchMembers(message.guild.members, search);

  if (idMatch) return idMatch;
  else if (matches.length > 0) return message.guild.members.get(matches[0]);
  else return null;
};

/**
 * Returns detailed information about a specific user.
 */
exports.run = async ({ message, args }) => {
  const search = args.join(" ");
  const member = getMember(message, search);

  if (member === null) {
    return message.channel.send(
      await t(message.guild.id, "commands.userinfo.errors.no-matches")
    );
  }

  const user = member.user;

  // Getting the join order is basically ordering the members and then taking 3 behind and 3 ahead,
  // if available
  const joinOrder = message.guild.members
    .sort((x, y) => x.joinedTimestamp > y.joinedTimestamp)
    .map(x => x.user.tag);
  const index = joinOrder.indexOf(user.tag);
  joinOrder[index] = `**${user.tag}**`;

  message.channel.send(
    clean(
      await t(
        message.guild.id,
        "commands.userinfo.output",
        user.username,
        user.discriminator,
        user.id,
        member.displayName,
        member.roles
          .filter(r => r.name !== "@everyone")
          .map(r => r.name)
          .join(", "),
        user.createdAt.toUTCString(),
        member.joinedAt.toUTCString(),
        joinOrder.slice(clamp(index - 3, 0, index), index + 3).join(" > "),
        user.avatarURL
      )
    )
  );
};

exports.conf = {
  guildOnly: true,
  permLevel: "none"
};
