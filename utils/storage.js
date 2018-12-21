/**
 * A collection of functions to get specific data out of the storage system.
 */
const storage = require("node-persist");

exports.getGuildSettings = async id => {
  await storage.init();

  const settings = (await storage.getItem("settings")) || {};

  return settings[id];
};

exports.getGuildCommands = async id => {
  await storage.init();

  const commands = (await storage.getItem("customCommands")) || {};

  return commands[id];
};

exports.setGuildCommands = async (id, customCommands) => {
  await storage.init();

  const commands = (await storage.getItem("customCommands")) || {};
  commands[id] = customCommands;

  storage.setItem("customCommands", commands);
};
