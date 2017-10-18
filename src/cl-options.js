const program = require('commander');
const player = require('./player.js');

program
  .version('0.1.0')
  .description('A Type Fast game!');

program
  .command('Player [player]')
  .alias('p')
  .description('Enter your player name, then play the game.')
  .action((plr) => {
    if (!player.loadedPlayer(plr)) {
      player.addNew(plr);
    }
  });

program.parse(process.argv);
