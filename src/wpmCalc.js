const player = require('./player.js');

const WPM = {
  grossWPM() {
    return (player.typedEntities / 5) / (player.playTime / 60000);
  },

  netWPM() {

  },
};
