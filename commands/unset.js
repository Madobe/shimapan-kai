const Settings = require("../models/settings");
const { i18n } = require("../utils/locale");

exports.run = async ({ message, args }) => {
  const settings = await Settings.build(message.guild.id);
  const [key] = args;

  if (!key) {
    return message.channel.send(
      i18n(message.guild.id, "commands.unset.errors.no-key")
    );
  }

  settings.unset(key);
  message.channel.send(
    await i18n(message.guild.id, "commands.unset.success", key)
  );
};

exports.conf = {
  guildOnly: true,
  permLevel: "Admin"
};
