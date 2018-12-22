/**
 * Returns the IDs of all members in the collection that have a matching
 * username, tag or nickname.
 * @param {Collection<GuildMember>} members Discord.js Collection of GuildMember objects.
 * @param {string} search The query string.
 * @returns {Array<Snowflake>} An array of all the user IDs that matched.
 */
module.exports = (members, search) => {
  const matchingUsernames = members
    .filter(m => m.user.username.indexOf(search) !== -1)
    .map(m => m.id);
  const matchingTags = members
    .filter(m => m.user.tag.indexOf(search) !== -1)
    .map(m => m.id);
  const matchingNicks = members
    .filter(m => m.displayName.indexOf(search))
    .map(m => m.id);

  return [
    ...new Set([].concat(matchingUsernames, matchingTags, matchingNicks))
  ];
};
