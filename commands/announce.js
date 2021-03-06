const Settings = require("../models/settings");

/**
 * Sends a message to every guild that has an announcements-channel set.
 * @param {string} text The text to send to each channel.
 */
exports.run = async ({ client, message, args }) => {
  client.guilds.forEach(async guild => {
    const settings = await Settings.build(guild.id);

    if (!settings.get("announcements-channel")) return;

    const channel = guild.channels
      .filter(c => c.type === "text")
      .get(settings.get("announcements-channel"));

    if (!channel) return;

    channel.send(args.join(" "));
  });

  message.channel.send(
    "The message was broadcasted to all servers with an announcements channel set."
  );
};

exports.conf = {
  guildOnly: false,
  permLevel: "Owner"
};
