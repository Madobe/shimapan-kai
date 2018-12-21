const { getGuildCommands, setGuildCommands } = require("../utils/storage");
const { i18n } = require("../utils/locale");

const addCommand = async (message, id, commands, trigger, text) => {
  if (commands[trigger])
    return message.channel.send(
      await i18n(id, "commands.com.errors.trigger-exists")
    );

  commands[trigger] = text.join(" ");
  message.channel.send(await i18n(id, "commands.com.trigger-added", trigger));

  return setGuildCommands(id, commands);
};

const removeCommand = async (message, id, commands, trigger) => {
  if (!commands[trigger])
    return message.channel.send(
      await i18n(id, "commands.com.errors.trigger-not-exists")
    );

  delete commands[trigger];
  message.channel.send(await i18n(id, "commands.com.trigger-removed", trigger));

  return setGuildCommands(id, commands);
};

const editCommand = async (message, id, commands, trigger, text) => {
  if (!commands[trigger])
    return message.channel.send(
      await i18n(id, "commands.com.errors.trigger-not-exists")
    );

  commands[trigger] = text.join(" ");
  message.channel.send(await i18n(id, "commands.com.trigger-edited", trigger));

  return setGuildCommands(id, commands);
};

const listCommands = async (message, id, commands) => {
  const keys = Object.keys(commands);
  let output = "";

  for (let i = 0; i < keys.length; i++) {
    output += "!" + keys[i] + " ".repeat(21 - keys[i].length);
    if (i % 4 == 3 && i !== keys.length - 1) output += "\n";
  }

  message.channel.send(await i18n(id, "commands.com.list", output));
};

exports.run = async ({ message, args }) => {
  const [action, _trigger, ...text] = args;
  const trigger = (_trigger || "").toLowerCase();
  const allowedActions = ["add", "remove", "edit", "list"];
  const guildId = message.guild.id;

  if (!action)
    return message.channel.send(
      await i18n(guildId, "commands.com.errors.no-action")
    );
  else if (action !== "list" && !trigger)
    return message.channel.send(
      await i18n(guildId, "commands.com.errors.no-trigger")
    );
  else if (["add", "edit"].includes(action) && text.length < 1)
    return message.channel.send(
      await i18n(guildId, "commands.com.errors.no-text")
    );
  else if (!allowedActions.includes(action))
    return message.channel.send(
      await i18n(guildId, "commands.com.errors.invalid-action")
    );

  const commands = (await getGuildCommands(message.guild.id)) || {};

  switch (action) {
  case "add":
    return addCommand(message, guildId, commands, trigger, text);
  case "remove":
    return removeCommand(message, guildId, commands, trigger);
  case "edit":
    return editCommand(message, guildId, commands, trigger, text);
  case "list":
    return listCommands(message, guildId, commands);
  }
};

exports.conf = {
  guildOnly: true,
  permLevel: "Moderator"
};
