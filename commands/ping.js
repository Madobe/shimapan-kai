exports.run = async ({ message }) => {
  message.channel.send("Pong.");
};

exports.conf = {
  guildOnly: false,
  permLevel: "none"
};
