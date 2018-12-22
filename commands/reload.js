/**
 * Reloads all command files.
 */
exports.run = async ({ client, message }) => {
  const { promisify } = require("util");
  const readdir = promisify(require("fs").readdir);

  const cmdFiles = await readdir("./commands/");
  cmdFiles.forEach(file => {
    if (!file.endsWith(".js")) return;

    try {
      delete require.cache[require.resolve(`../commands/${file}`)];
      const props = require(`../commands/${file}`);
      const name = file.split(".")[0];
      client.commands[name] = props;
    } catch (e) {
      client.log(`Failed reload of ${file}: ${e}`);
    }
  });

  message.channel.send("All command definitions have been reloaded.");
};

exports.conf = {
  guildOnly: false,
  permLevel: "Owner"
};
