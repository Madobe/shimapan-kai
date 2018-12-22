const Settings = require("../models/settings");
const { i18n: t } = require("../utils/locale");

/**
 * Removes the value of the given setting.
 * @param {string} key The setting to unset.
 */
exports.run = async ({ message, args }) => {
  const settings = await Settings.build(message.guild.id);
  const [key] = args;

  if (!key) {
    return message.channel.send(
      await t(message.guild.id, "commands.unset.errors.no-key")
    );
  }

  settings.unset(key);
  message.channel.send(
    await t(message.guild.id, "commands.unset.success", key)
  );
};

exports.conf = {
  guildOnly: true,
  permLevel: "Admin"
};
