module.exports = text => {
  return text.replace(/`/g, "`").replace(/@/g, "@" + String.fromCharCode(8203));
};
