const fs = require('fs');
const players = require('./playersInfo.json');

const playersInfoAtPath = './playersInfo.json';

const Player = {
  name: '',
  inpWord: '',
  netWPM: 0,
  playTime: 0,
  currHits: 0,
  currScore: 0,
  bestScore: 0,
  bestNumHits: 0,
  typedErrors: 0,
  typedEntities: 0,
  currPlayerIndx: 0,

  loadedPlayer(currPlayer) {
    for (let plIndx = 0; plIndx < players.infoAt.length; plIndx += 1) {
      const names = Object.values(players.infoAt[plIndx]);

      for (let valName = 0; valName < names.length; valName += 1) {
        if (names[valName] === currPlayer) {
          this.currPlayerIndx = plIndx;
          this.name = players.infoAt[plIndx].playerName;
          this.bestScore = players.infoAt[plIndx].bestScore;
          this.bestNumHits = players.infoAt[plIndx].bestNumHits;

          return true;
        }
      }
    }
    return false;
  },

  save() {
    players.infoAt[this.currPlayerIndx].netWPM = this.netWPM;
    players.infoAt[this.currPlayerIndx].bestScore = this.bestScore;
    players.infoAt[this.currPlayerIndx].bestNumHits = this.bestNumHits;
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
    this.currHits += 1;
    this.currScore += 5;

    if (this.currScore > this.bestScore) {
      this.bestScore = this.currScore;
    }

    if (this.currHits > this.bestNumHits) {
      this.bestNumHits = this.currHits;
    }
  },
};

module.exports = Player;
