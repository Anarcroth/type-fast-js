const fs = require('fs');
const players = require('./playersInfo.json');

const playersInfoAtPath = './playersInfo.json';

const Player = {
  inpWord: '',
  currScore: 0,
  currHits: 0,
  currPlayerIndx: 0,

  foundIndexOf(currPlayer) {
    for (let plIndx = 0; plIndx < players.infoAt.length; plIndx += 1) {
      const names = Object.values(players.infoAt[plIndx]);

      for (let valName = 0; valName < names.length; valName += 1) {
        if (names[valName] === currPlayer) {
          this.currPlayerIndx = plIndx;
          return true;
        }
      }
    }
    return false;
  },

  save() {
    fs.writeFile(playersInfoAtPath, JSON.stringify(players), null, '\t');
  },

  addNew(name) {
    players.infoAt.push({
      playerName: name,
      bestScore: 0,
      bestNumHits: 0,
    });
    this.save();

    if (!this.foundIndexOf(name)) {
      throw new Error('Could not save new player!');
    }
  },

  updateStats() {
    if (this.currScore > players.infoAt[this.currPlayerIndx].bestScore) {
      players.infoAt[this.currPlayerIndx].bestScore = this.currScore;
    }

    if (this.currHits > players.infoAt[this.currPlayerIndx].bestNumHits) {
      players.infoAt[this.currPlayerIndx].bestNumHits = this.currHits;
    }
  },

  incrHitStats() {
    this.currHits += 1;
    this.currScore += 5;
  },
};

module.exports = Player;
