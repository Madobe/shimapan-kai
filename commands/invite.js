/**
 * Returns the invite link for this bot.
 */
exports.run = async ({ message }) => {
  message.channel.send(
    "https://discordapp.com/oauth2/authorize?&client_id=293636546211610625&scope=bot&permissions=268446726"
  );
};

exports.conf = {
  guildOnly: false,
  permLevel: "none"
};
