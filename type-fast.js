const fs = require('fs');

const termkit = require('terminal-kit');

const player = require('./player.js');

const term = termkit.terminal;
const screenBuffer = termkit.ScreenBuffer;

const wordList = fs.readFileSync('wordList.txt').toString().split('\n');
const encouragement = ['Good!', 'Nice!', 'Doing great!', 'Awesome!', 'Keep it up!'];

const wordsYPos = [];
const screen = {};

let viewport = {};

let screenWord = '';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

/* Put all of the words from the list on the right side of the screen
so that they do not jump immediately on the screen after the game satrts */
function putWordsOffScreen() {
  let xPos;
  let yPos;

  for (let word = 0; word < wordList.length; word += 1) {
    xPos = getRandomInt(250, 816);
    yPos = Math.floor(Math.random() * screen.text.height);

    screen.text.put({
      x: xPos,
      y: yPos,
    }, wordList[word]);

    wordsYPos.push(yPos);
  }
}

function createScreenText() {
  screen.text = screenBuffer.create({
    width: viewport.width,
    height: viewport.height,
    noFill: true,
  });

  screen.text.fill({
    attr: {
      color: 'white', bgDefaultColor: true,
    },
  });
}

function terminate() {
  term.hideCursor(false);
  term.grabInput(false);

  setTimeout(() => {
    term.moveTo(1, term.height, '\n\n');
    term.clear();
    process.exit();
  }, 100);
}

function registerHit() {
  player.currHits += 1;
  player.currScore += 5;

  term.nextLine(1).eraseLine();
  term.nextLine(2).cyan(`${encouragement[getRandomInt(0, encouragement.length)]}`).eraseLineAfter();
}

function destroyMatchedWordAt(xp, yp) {
  for (let w = 0; w < player.input.length; w += 1) {
    delete screen.text.get({ x: xp + w, y: yp });
    screen.text.put({
      x: xp + w,
      y: yp,
    }, ' ');
  }
}

function searchScreenForMatch() {
  for (let yp = 0; yp < wordsYPos.length; yp += 1) {
    for (let xp = 0; xp < viewport.width; xp += 1) {
      for (let w = 0; w < player.input.length; w += 1) {
        // Optimized variant of the match: if the current box is null and the
        // box, that is the length of the searched word away, also empty, jump
        // with the length of the searched word forwad. Otherwise do a normal
        // shift to the right.
        if (screen.text.get({ x: xp + w, y: yp }) === null &&
            screen.text.get({ x: xp + player.input.length, y: yp }) === null) {
          xp += player.input.length - 1;
        } else if (screen.text.get({ x: xp + w, y: yp }) !== null) {
          screenWord += screen.text.get({ x: xp + w, y: yp }).char;
        }
      }

      if (player.input === screenWord && player.input.length === screenWord.length) {
        registerHit();
        destroyMatchedWordAt(xp, yp);
        player.input = '';

        // In order to break of the outter loop as well,
        // make `yp` break the condition.
        yp = wordsYPos.length;
        // Break inner loop.
        break;
      }

      screenWord = '';
    }
  }
}

function input(key) {
  switch (key) {
    case 'BACKSPACE':
      // Remove the last char from the screen.
      term.nextLine(1).right(player.input.length - 1).cyan(' ');
      if (player.input.length === 1) {
        term.left(2).cyan(' ');
      }

      // Clear the last char from the players word.
      player.input = player.input.slice(0, player.input.length - 1);
      break;

    case 'CTRL_C':
      player.saveStats();
      terminate();
      break;

    case 'ENTER':
    case ' ':
      // All of the words from the list are at least 5 chars long,
      // this avoids premature checking.
      if (player.input.length > 4) {
        searchScreenForMatch();
      }
      break;

    default:
      player.input += key;
      term.cyan(player.input);
      break;
  }
}

function init(callback) {
  player.findIndexOf('Martin');

  termkit.getDetectedTerminal((error) => {
    if (error) {
      throw new Error('Cannot detect terminal!');
    }

    viewport = screenBuffer.create({
      dst: term,
      width: Math.min(term.width) * 4,
      height: Math.min(term.height - 5),
      y: 2,
    });

    createScreenText();
    putWordsOffScreen();

    term.moveTo.eraseLine.bgWhite.cyan(0, term.height, 'Type here and type fast!');

    term.hideCursor();
    term.grabInput();
    term.on('key', input);

    callback();
  });
}

function moveScreenTextLeft() {
  screen.text.x -= 0.05;
}

function draw() {
  screen.text.draw({
    dst: viewport,
    tile: true,
  });

  viewport.draw();
}

function animate() {
  draw();
  moveScreenTextLeft();
  setTimeout(animate, 10);
}

init(() => {
  animate();
});
