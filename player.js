const fs = require('fs');

const playersInfoAtPath = './playersInfo.json';
const players = require('./playersInfo.json');

const Player = {

  input: '',

  currScore: 0,
  currHits: 0,
  currPlayerIndx: 0,

  findIndexOf: (currPlayer) => {
    for (let plIndx = 0; plIndx < players.infoAt.length; plIndx += 1) {
      const names = Object.values(players.infoAt[plIndx]);

      for (let valName = 0; valName < names.length; valName += 1) {
        if (names[valName] === currPlayer) {
          this.currPlayerIndx = plIndx;
          break;
        }
      }
    }
  },

  saveStats: () => {
    if (this.currScore > players.infoAt[this.currPlayerIndx].bestScore) {
      players.infoAt[this.currPlayerIndx].bestScore = this.currScore;
    }

    if (this.currHits > players.infoAt[this.currPlayerIndx].bestNumHits) {
      players.infoAt[this.currPlayerIndx].bestNumHits = this.currHits;
    }

    fs.writeFile(playersInfoAtPath, JSON.stringify(players), null, '\t');
  },
};

module.exports = Player;
