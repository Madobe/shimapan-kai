const storage = require("node-persist");
const { i18n } = require("../utils/locale");

/**
 * Model for custom commands.
 * @param {number} id The ID of the guild the commands are for.
 * @param {Object} commands A hash of all the commands and their return values.
 */
class Commands {
  constructor(id, commands, message) {
    this.id = id;
    this.commands = commands;
    this.message = message;
  }

  /**
   * Pulls data for all custom commands, regardless of guild, from the data
   * storage and returns it.
   * @returns {Object} A hash representing each custom command and its return
   * value.
   */
  static async getData() {
    await storage.init();

    return (await storage.getItem("customCommands")) || {};
  }

  /**
   * A builder function which returns a new Commands object. Required because
   * node-persist cannot be used outside of an asynchronous function.
   * @param {number|string} id The ID of the guild the commands are for.
   * @param {Message} message A Discord.js Message object. Only for sending
   * responses.
   * @returns {Commands}
   */
  static async build(id, message) {
    const commands = await Commands.getData();

    return new Commands(id, commands[id] || {}, message);
  }

  /**
   * Adds a custom command for the guild. Fails if it already exists.
   * @param {string} trigger The command name to be used.
   * @param {string} text The response string.
   * @returns {boolean} Whether the addition succeeded or not.
   */
  addCommand(trigger, text) {
    if (this.commands[trigger]) return false;

    this.commands[trigger] = text;
    this.save();
    return true;
  }

  /**
   * Edits an existing custom command for the guild. Fails if it doesn't exist.
   * @param {string} trigger The command name to edit the response of.
   * @param {string} text The new response string.
   * @returns {boolean} Whether the modification succeeded or not.
   */
  editCommand(trigger, text) {
    if (!this.commands[trigger]) return false;

    this.commands[trigger] = text;
    this.save();
    return true;
  }

  /**
   * Removes an existing custom command for the guild. Fails if it doesn't
   * exist.
   * @param {string} trigger The command name to remove.
   * @returns {boolean} Whether the deletion succeeded or not.
   */
  removeCommand(trigger) {
    if (!this.commands[trigger]) return false;

    delete this.commands[trigger];
    this.save();
    return true;
  }

  /**
   * Persists the changes to the data storage.
   */
  async save() {
    const commands = await Commands.getData();
    commands[this.id] = this.commands;

    await storage.init();
    await storage.setItem("customCommands", commands);
  }

  /**
   * Returns the command if it exists.
   * @param {string} name The command name.
   */
  get(name) {
    return this.commands[name];
  }

  /**
   * Returns an array of all the commands available to the guild.
   */
  toArray() {
    return Object.keys(this.commands);
  }
}

module.exports = Commands;
