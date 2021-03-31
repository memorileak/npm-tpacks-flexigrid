module.exports = {
  zeroOrientedFloor(number) {
    if (number >= 0) {
      return Math.floor(number);
    } else {
      return -Math.floor(-number);
    }
  },
}
