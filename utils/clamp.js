module.exports = (num, min, max) => {
  return num <= min ? min : num >= max ? max : num;
};
