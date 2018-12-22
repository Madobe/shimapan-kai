const Commands = require("../models/commands");
const { i18n } = require("../utils/locale");

const addCommand = async (message, id, commands, trigger, text) => {
  commands.addCommand(trigger, text, async () => {
    message.channel.send(await i18n(id, "commands.com.trigger-added", trigger));
  });
};

const removeCommand = async (message, id, commands, trigger) => {
  commands.removeCommand(trigger, async () => {
    message.channel.send(
      await i18n(id, "commands.com.trigger-removed", trigger)
    );
  });
};

const editCommand = async (message, id, commands, trigger, text) => {
  commands.editCommand(trigger, text, async () => {
    message.channel.send(
      await i18n(id, "commands.com.trigger-edited", trigger)
    );
  });
};

const listCommands = async (message, id, commands) => {
  const keys = commands.toArray();
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

  const commands = await Commands.build(message.guild.id, message);

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
