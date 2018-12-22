const storage = require("node-persist");

/**
 * Model for guild settings.
 */
class Settings {
  constructor(settings) {
    this.settings = settings;
  }

  /**
   * A builder function which returns a new Settings object. Required because
   * node-persist cannot be used outside of an asynchronous function.
   * @param {number|string} id The ID of the guild the settings are for.
   * @returns {Settings}
   */
  static async build(id) {
    await storage.init();

    const settings = (await storage.getItem("settings")) || {};

    return new Settings(settings[id] || {});
  }
}

module.exports = Settings;
