const Settings = require("../models/settings");
const { i18n } = require("../utils/locale");

const pad = (str, amount) => {
  if (!str) return " ".repeat(amount);
  return `${str}${" ".repeat(amount - str.length)}`;
};

exports.run = async ({ message, args }) => {
  const settings = await Settings.build(message.guild.id);
  const [key, value] = args;

  if (!key) {
    return message.channel.send(
      i18n(message.guild.id, "commands.set.errors.no-key")
    );
  } else if (key !== "list" && !value) {
    return message.channel.send(
      i18n(message.guild.id, "commands.set.errors.no-value")
    );
  }

  if (key === "list") {
    const separator = `+${"-".repeat(27)}+${"-".repeat(27)}+\n`;
    let output = "```haskell\n";

    output += separator;
    output += `| ${pad("Option", 25)} | ${pad("Value", 25)} |\n`;
    output += separator;

    const allowedSettings = await settings.allowedSettings();

    allowedSettings.forEach(name => {
      output += `| ${pad(name, 26)}| ${pad(settings.get(name), 26)}|\n`;
    });

    output += separator;
    output += "```";

    return message.channel.send(output);
  }

  settings.set(key, value);
  message.channel.send(
    await i18n(message.guild.id, "commands.set.success", key, value)
  );
};

exports.conf = {
  guildOnly: true,
  permLevel: "Admin"
};
