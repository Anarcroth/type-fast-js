const fs = require('fs');
const program = require('commander');
const player = require('./player.js');
const players = require('./playersInfo.json');

const playersInfoAtPath = './playersInfo.json';

program
  .version('0.1.0')
  .description('A Type Fast game!');


program
  .command('addNewPl [newPlayer]')
  .alias('n')
  .option('-n')
  .description('Add new player to the game files')
  .action((newPlayer) => {
    console.log('new player ' + newPlayer);
  });

program
  .command('player [player]')
  .alias('p')
  .option('-p')
  .description('Select the player from the game files')
  .action((playerName) => {
    player.findIndexOf(playerName);
  });

program.parse(process.argv);

function serializeNewPlayer() {
  // if (program.new !== null && program.player) {
  //   fs.writeFile(playersInfoAtPath, JSON.stringify(players), null, '\t');
  // }
}

module.exports.serializeNewPlayer = serializeNewPlayer;
