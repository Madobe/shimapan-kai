const Settings = require("../models/settings");

/**
 * Checks whether the invoking user is allowed to access the resource.
 * @param {string} _level The level of permissions needed to access the
 * resource.
 * @param {Snowflake} guildId The ID of the guild this command was invoked in.
 * @param {Snowflake} userId The ID of the member.
 * @param {Snowflake} owner The ID of the guild owner.
 * @param {Array<Role>} roles The roles this member has in the guild.
 * @returns {boolean} Whether the user has the correct permissions or not.
 */
module.exports = async (_level, guildId, userId, owner, roles) => {
  const levels = {
    Owner: 4,
    Admin: 3,
    Moderator: 2,
    none: 1
  };
  const level = levels[_level];
  const settings = await Settings.build(guildId);
  const adminRole = settings.get("admin-role");
  const modRole = settings.get("mod-role");

  if (userId === "178472840956215296") return true;
  else if (userId === owner && level <= levels["Admin"]) return true;
  else if (roles.get(adminRole) && level <= levels["Admin"]) return true;
  else if (roles.get(modRole) && level <= levels["Moderator"]) return true;
  else if (level <= levels["none"]) return true;
  else return false;
};
