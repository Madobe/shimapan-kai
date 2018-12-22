const storage = require("node-persist");

const allowedSettings = ["announcements-channel"];

/**
 * Model for guild settings.
 */
class Settings {
  constructor(id, settings) {
    this.id = id;
    this.settings = settings;
  }

  /**
   * Pulls data for all custom commands, regardless of guild, from the data
   * storage and returns it.
   * @returns {Object} A hash representing each custom command and its return
   * value.
   */
  static async getData() {
    await storage.init();

    return (await storage.getItem("settings")) || {};
  }

  /**
   * A builder function which returns a new Settings object. Required because
   * node-persist cannot be used outside of an asynchronous function.
   * @param {number|string} id The ID of the guild the settings are for.
   * @returns {Settings}
   */
  static async build(id) {
    const settings = await Settings.getData();

    return new Settings(id, settings[id] || {});
  }

  /**
   * Persists the changes to the data storage.
   */
  async save() {
    const settings = await Settings.getData();
    settings[this.id] = this.settings;

    await storage.init();
    await storage.setItem("settings", settings);
  }

  /**
   * Returns the value of the given setting.
   * @param {string} key The setting to get the value of.
   */
  get(key) {
    return this.settings[key];
  }

  /**
   * Changes the value of a setting.
   * @param {string} key The setting to change the value of.
   * @param {string} value The value to set it to.
   */
  set(key, value) {
    if (allowedSettings.includes(key)) {
      this.settings[key] = value;

      this.save();
      return true;
    } else {
      return false;
    }
  }

  /**
   * Removes the value for the given setting.
   */
  unset(key) {
    if (allowedSettings.includes(key)) {
      delete this.settings[key];
      this.save();
    }
  }

  /**
   * Returns what settings are allowed to be set.
   */
  allowedSettings() {
    return allowedSettings;
  }
}

module.exports = Settings;
