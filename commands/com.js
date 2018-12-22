const Commands = require("../models/commands");
const { i18n: t } = require("../utils/locale");

/**
 * Adds a command.
 * @param {Message} message A Discord.js Message object.
 * @param {Snowflake} id A Guild ID snowflake.
 * @param {Commands} commands A Commands model object.
 * @param {string} trigger The custom command name.
 * @param {string} text The response string.
 */
const addCommand = async (message, id, commands, trigger, text) => {
  if (commands.addCommand(trigger, text)) {
    message.channel.send(await t(id, "commands.com.trigger-added", trigger));
  } else {
    message.channel.send(
      await t(this.id, "commands.com.errors.trigger-exists")
    );
  }
};

/**
 * Removes an existing command.
 * @param {Message} message A Discord.js Message object.
 * @param {Snowflake} id A Guild ID snowflake.
 * @param {Commands} commands A Commands model object.
 * @param {string} trigger The custom command name.
 */
const removeCommand = async (message, id, commands, trigger) => {
  if (commands.removeCommand(trigger)) {
    message.channel.send(await t(id, "commands.com.trigger-removed", trigger));
  } else {
    message.channel.send(
      await t(this.id, "commands.com.errors.trigger-not-exists")
    );
  }
};

/**
 * Edits an existing command's response string.
 * @param {Message} message A Discord.js Message object.
 * @param {Snowflake} id A Guild ID snowflake.
 * @param {Commands} commands A Commands model object.
 * @param {string} trigger The custom command name.
 * @param {string} text The response string.
 */
const editCommand = async (message, id, commands, trigger, text) => {
  if (commands.editCommand(trigger, text)) {
    message.channel.send(await t(id, "commands.com.trigger-edited", trigger));
  } else {
    message.channel.send(
      await t(this.id, "commands.com.errors.trigger-not-exists")
    );
  }
};

/**
 * Lists all available custom commands.
 * @param {Message} message A Discord.js Message object.
 * @param {Snowflake} id A Guild ID snowflake.
 * @param {Commands} commands A Commands model object.
 */
const listCommands = async (message, id, commands) => {
  const keys = commands.toArray();
  let output = "";

  for (let i = 0; i < keys.length; i++) {
    output += "!" + keys[i] + " ".repeat(21 - keys[i].length);
    if (i % 4 == 3 && i !== keys.length - 1) output += "\n";
  }

  message.channel.send(await t(id, "commands.com.list", output));
};

/**
 * Performs CRUD operations for custom commands.
 * @param {string} action The type of action to perform.
 * @param {string} trigger The custom command name.
 * @param {string} text The response string.
 */
exports.run = async ({ message, args }) => {
  const [action, _trigger, ...text] = args;
  const trigger = (_trigger || "").toLowerCase();
  const allowedActions = ["add", "remove", "edit", "list"];
  const guildId = message.guild.id;

  if (!action)
    return message.channel.send(
      await t(guildId, "commands.com.errors.no-action")
    );
  else if (action !== "list" && !trigger)
    return message.channel.send(
      await t(guildId, "commands.com.errors.no-trigger")
    );
  else if (["add", "edit"].includes(action) && text.length < 1)
    return message.channel.send(
      await t(guildId, "commands.com.errors.no-text")
    );
  else if (!allowedActions.includes(action))
    return message.channel.send(
      await t(guildId, "commands.com.errors.invalid-action")
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
