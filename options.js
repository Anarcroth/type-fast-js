const program = require('commander');

const fs = require('fs');

const playersInfoAtPath = './playersInfo.json';
const players = require('./playersInfo.json');

program
  .version('0.1.0')
  .option('-n, --new [value]', 'Add new user')
  .option('-p, --player [value]', 'Provide player name')
  .parse(process.argv);

function serializeNewPlayer() {
  if (program.new !== null && program.player) {
    fs.writeFile(playersInfoAtPath, JSON.stringify(players), null, '\t');
  }
}
