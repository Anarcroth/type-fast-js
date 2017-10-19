const player = require('./player.js');
const termkit = require('terminal-kit');
const screen = require('./screen-text.js');
const cloptions = require('./cl-options.js');

const term = termkit.terminal;

const encouragement = ['Good!', 'Nice!', 'Doing great!', 'Awesome!', 'Keep it up!'];

let timeCounter = 0;

let viewport = {};

function terminate() {
  term.hideCursor(false);
  term.grabInput(false);

  setTimeout(() => {
    term.moveTo(1, term.height, '\n\n');
    term.clear();
    term.moveTo.eraseLine.brightCyan(0, term.height - 2, `Game stats -> ${player.name} :: Score: ${player.currScore},    Hits: ${player.currHits},    Best Score: ${player.bestScore},    Best Number of Hits: ${player.bestNumHits}\n`);
    process.exit();
  }, 100);
}

function regHitOnScreen() {
  term.nextLine(1).eraseLine();
  term.nextLine(1).brightMagenta(`${encouragement[screen.getRandomInt(0, encouragement.length)]}`).eraseLineAfter();
}

function inpWord(key) {
  switch (key) {
    case 'BACKSPACE':
      // Remove the last char from the screen.
      term.nextLine(1).right(player.inpWord.length - 1).brightBlue(' ');

      // Remove the last char at the first positon of the player inpWord string.
      if (player.inpWord.length === 1) {
        term.left(2).brightBlue(' ');
      }

      player.inpWord = player.inpWord.slice(0, player.inpWord.length - 1);
      break;

    case 'CTRL_C':
      player.save();
      terminate();
      break;

    case 'ENTER':
    case ' ':
      // All of the words from the list are at least 5 chars long,
      // this avoids premature checking.
      if (player.inpWord.length > 4 && screen.foundMatchOnScreen(viewport)) {
        regHitOnScreen();
      }
      break;

    default:
      player.inpWord += key;
      term.brightBlue(player.inpWord);

      break;
  }
}

function init(callback) {
  termkit.getDetectedTerminal((error) => {
    if (error) {
      throw new Error('Cannot detect terminal!');
    }

    viewport = screen.screenBuffer.create({
      dst: term,
      width: Math.min(term.width) * 4,
      height: Math.min(term.height - 5),
      y: 2,
    });

    screen.createScreenText(viewport);
    screen.putWordsOffScreen();

    // Remove any text from the terminal before starting the game.
    term.clear();
    term.hideCursor();
    term.grabInput();
    term.on('key', inpWord);

    callback();
  });
}

function drawFullScreen() {
  timeCounter += 10;
  term.moveTo.eraseLine.brightCyan(0, term.height - 1, `${player.name} -> Current Score: ${player.currScore},    Current Hits: ${player.currHits},    Best Score: ${player.bestScore},    Best Number of Hits: ${player.bestNumHits},    Time: ${timeCounter / 1000}`);
  term.moveTo.eraseLine.red(0, term.height, 'Press Ctrl + C to Quit the game at anytime!');
  screen.draw(viewport);
  viewport.draw();
  if (timeCounter > 60000) {
    terminate();
  }
}

function animate() {
  drawFullScreen();
  screen.moveScreenTextLeft();
  setTimeout(animate, 10);
}

init(() => {
  animate();
});
