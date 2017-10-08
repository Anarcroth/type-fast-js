const fs = require('fs');
const players = require('./playersInfo.json');

const playersInfoAtPath = './playersInfo.json';
const inpWord = '';
const username = '';
const currScore = 0;
const currHits = 0;
const currPlayerIndx = 0;

const findIndexOf = (currPlayer) => {
  for (let plIndx = 0; plIndx < players.infoAt.length; plIndx += 1) {
    const names = Object.values(players.infoAt[plIndx]);

    for (let valName = 0; valName < names.length; valName += 1) {
      if (names[valName] === currPlayer) {
        this.currPlayerIndx = plIndx;
        break;
      }
    }
  }
};

const saveStats = () => {
  if (this.currScore > players.infoAt[this.currPlayerIndx].bestScore) {
    players.infoAt[this.currPlayerIndx].bestScore = this.currScore;
  }

  if (this.currHits > players.infoAt[this.currPlayerIndx].bestNumHits) {
    players.infoAt[this.currPlayerIndx].bestNumHits = this.currHits;
  }

  fs.writeFile(playersInfoAtPath, JSON.stringify(players), null, '\t');
};

const incrHitStats = () => {
  this.currHits += 1;
  this.currScore += 5;
};

const setUsername = (usern) => {
  this.username = usern;
};

module.exports.inpWord = inpWord;
module.exports.currHits = currHits;
module.exports.username = username;
module.exports.saveStats = saveStats;
module.exports.currScore = currScore;
module.exports.setUsername = setUsername;
module.exports.findIndexOf = findIndexOf;
module.exports.incrHitStats = incrHitStats;
module.exports.currPlayerIndx = currPlayerIndx;
