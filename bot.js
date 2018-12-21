const Discord = require("discord.js");
const client = new Discord.Client();
const { promisify } = require("util");
const readdir = promisify(require("fs").readdir);

const init = async () => {
  client.commands = {};

  // Load commands
  const cmdFiles = await readdir("./commands/");

  cmdFiles.forEach(file => {
    if (!file.endsWith(".js")) return;

    try {
      const props = require(`./commands/${file}`);
      const name = file.split(".")[0];
      client.commands[name] = props;
    } catch (e) {
      console.log(`Failed to load ${file}: ${e}`);
    }
  });

  // Load events from the events folder
  const evtFiles = await readdir("./events/");

  evtFiles.forEach(file => {
    if (!file.endsWith(".js")) return;

    try {
      const event = require(`./events/${file}`);
      const name = file.split(".")[0];

      client.on(name, event.bind(null, client));
    } catch (e) {
      console.log(`Failed to load ${file}: ${e}`);
    }
  });

  client.login(process.env.DISCORD_TOKEN);
};

module.exports = init;
