let asciiDecoder = null;

if (window.TextDecoder) {
  asciiDecoder = new window.TextDecoder('ascii');
} else {
  throw new Error('GenID: No Text decoder in this browser');
}

module.exports = {
  genid(length = 16) {
    if (asciiDecoder) {
      if (window.crypto) {
        let ui8 = new Uint8Array(length);
        ui8 = window.crypto.getRandomValues(ui8);
        return asciiDecoder.decode(ui8);
      } else {
        throw new Error('GenID: This browser does not support Crypto API');
      }
    }
  },
};
