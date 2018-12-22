/**
 * This function returns the localized string for the given path (based on traversal through the localization JSON).
 */
const storage = require("node-persist");

const format = (template, ...args) => {
  return template.replace(/{(\d+)}/g, (match, number) => {
    return typeof args[number] !== "undefined" ? args[number] : match;
  });
};
exports.format = format;

exports.i18n = async (id, path, ...inserts) => {
  await storage.init();

  const locale = (await storage.getItem("locale")) || "en";
  const keys = path.split(".");
  let response = require(`../locales/${locale}.json`);

  for (let i = 0; i < keys.length; i++) {
    response = response[keys[i]];
  }

  if (typeof response === "object") response = response.join("\n");

  return format(response, ...inserts);
};
