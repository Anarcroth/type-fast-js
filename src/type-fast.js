const fs = require('fs');
const player = require('./player.js');
const termkit = require('terminal-kit');
const cloptions = require('./cl-options.js');

const term = termkit.terminal;
const screenBuffer = termkit.ScreenBuffer;

const wordList = fs.readFileSync('wordList.txt').toString().split('\n');
const encouragement = ['Good!', 'Nice!', 'Doing great!', 'Awesome!', 'Keep it up!'];

const wordsYPos = [];
const screen = {};

let viewport = {};

let searchedWord = '';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

/* Put all of the words from the list on the right side of the screen
so that they do not jump immediately on the screen after the game satrts */
function putWordsOffScreen() {
  let xPos;
  let yPos;

  for (let word = 0; word < wordList.length; word += 1) {
    xPos = getRandomInt(220, 816);
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

function regHitOnScreen() {
  term.nextLine(1).eraseLine();
  term.nextLine(2).cyan(`${encouragement[getRandomInt(0, encouragement.length)]}`).eraseLineAfter();
}

function destroyMatchedWordAt(xp, yp) {
  for (let ch = 0; ch < player.inpWord.length; ch += 1) {
    delete screen.text.get({ x: xp + ch, y: yp });
    screen.text.put({
      x: xp + ch,
      y: yp,
    }, ' ');
  }
}

function optimizeOutterLoop(yp) {
  // By splicing the index of the found Y position of the element, the
  // number of iterrations is reduced each time a check for a amtch is made.
  wordsYPos.splice(yp, 1);

  // In order to break of the outter loop as well,
  // make `yp` break its condition.
  return wordsYPos.length;
}

function isAPerfectMatch() {
  return player.inpWord === searchedWord && player.inpWord.length === searchedWord.length;
}

function searchScreenForMatch() {
  for (let yp = screen.text.x > 0 ? screen.text.x - 10 : 0;
    yp < wordsYPos.length; yp += 1) {
    for (let xp = 0; xp < viewport.width; xp += 1) {
      for (let ch = 0; ch < player.inpWord.length; ch += 1) {
        // Optimized variant of the match: if the current box is null and the
        // box, that is the length of the searched word away, also empty, jump
        // with the length of the searched word forwad. Otherwise do a normal
        // shift to the right.
        if (screen.text.get({ x: xp + ch, y: yp }) === null &&
            screen.text.get({ x: xp + player.inpWord.length, y: yp }) === null) {
          xp += player.inpWord.length - 1;
        } else {
          searchedWord += screen.text.get({ x: xp + ch, y: yp }).char;
        }
      }

      if (isAPerfectMatch()) {
        player.incrHitStats();

        regHitOnScreen();

        destroyMatchedWordAt(xp, yp);

        player.inpWord = '';

        yp = optimizeOutterLoop(yp);

        // Break inner loop.
        // After tat breaks outter lopp automatically.
        break;
      }

      searchedWord = '';
    }
  }
}

function inpWord(key) {
  switch (key) {
    case 'BACKSPACE':
      // Remove the last char from the screen.
      term.nextLine(1).right(player.inpWord.length - 1).cyan(' ');

      // Remove the last char at the first positon of the player inpWord string.
      if (player.inpWord.length === 1) {
        term.left(2).cyan(' ');
      }

      player.inpWord = player.inpWord.slice(0, player.inpWord.length - 1);
      break;

    case 'CTRL_C':
      player.updateStats();
      player.save();
      terminate();
      break;

    case 'ENTER':
    case ' ':
      // All of the words from the list are at least 5 chars long,
      // this avoids premature checking.
      if (player.inpWord.length > 4) {
        searchScreenForMatch();
      }
      break;

    default:
      player.inpWord += key;
      term.cyan(player.inpWord);
      break;
  }
}

function init(callback) {
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

    term.hideCursor();
    term.grabInput();
    term.on('key', inpWord);

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
