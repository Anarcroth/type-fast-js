const fs = require('fs');

const termkit = require('terminal-kit');

const player = require('./player.js');

const term = termkit.terminal;

let username = '';

function inpWord(key) {
  switch (key) {
    case 'BACKSPACE':
      // Remove the last char from the screen.
      term.nextLine(1).right(username.length - 1).cyan(' ');

      // Remove the last char at the first positon of the player inpWord string.
      if (username.length === 1) {
        term.left(2).cyan(' ');
      }

      username = username.slice(0, username.length - 1);
      break;

    case 'ENTER':
      player.setUsername(username);
      fs.writeFile('./player.js', JSON.stringify(player), null, '\t');
      term.moveTo(1, term.height, '\n\n');
      term.clear();
      // process.exit();
      break;

    default:
      username += key;
      term.cyan(username);
      break;
  }
}

function chooseDifficulty() {
  term.cyan('Choose difficulty.');

  const difficulty = [
    'a. Easy',
    'b. Medium',
    'c. Lol...',
  ];

  term.singleColumnMenu(difficulty, (error, response) => {
    term('\n').eraseLineAfter.green(
      '#%s selected: %s (%s,%s)\n',
      response.selectedIndex,
      response.selectedText,
      response.x,
      response.y,
    );
    process.exit();
  });
}

function initMainMenu() {
  termkit.getDetectedTerminal((error) => {
    if (error) {
      throw new Error('Cannot detect terminal!');
    }

    term.moveTo.eraseLine.cyan(
      15, term.height - 3,
      'Enter your username or create a new profile ',
    );

    chooseDifficulty();

    term.nextLine(1).cyan('Enter: ');
    term.grabInput();
    term.on('key', inpWord);
  });
}

module.exports.initMainMenu = initMainMenu;
module.exports.chooseDifficulty = chooseDifficulty;
