const fs = require('fs');

const termkit = require('terminal-kit');

const term = termkit.terminal;

const screenBuffer = termkit.ScreenBuffer;

const Player = require('./player.js');

const playersData = require('./playersData.json');

const wordList = fs.readFileSync('wordList.txt').toString().split('\n');

const encouragement = ['Good!', 'Nice!', 'Doing great!', 'Awesome!', 'Keep it up!'];

const wordsYPosition = [];

const screenText = {};

let player1 = {};

let viewport = {};

let userInput = '';

let tempWord = '';

function loadPlayer(players, currentPlayerName) {
  for (let j = 0; j < players.data.length; j += 1) {
    const values = Object.values(players.data[j]);
    for (let i = 0; i < values.length; i += 1) {
      if (values[i] === currentPlayerName) {
        player1 = new Player(players.data[i]);
      }
    }
  }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

function addWordsToScreen() {
  let wordAtX;
  let wordAtY;

  for (let i = 0; i < wordList.length; i += 1) {
    wordAtX = getRandomInt(250, 816);
    wordAtY = Math.floor(Math.random() * screenText.background.height);

    screenText.background.put({
      x: wordAtX,
      y: wordAtY,
    }, wordList[i]);

    wordsYPosition.push(wordAtY);
  }
}

function createTextBackground() {
  screenText.background = screenBuffer.create({
    width: viewport.width,
    height: viewport.height,
    noFill: true,
  });

  screenText.background.fill({
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

function checkForHit(playerWord) {
  for (let j = 0; j < wordsYPosition.length; j += 1) {
    for (let i = 0; i < viewport.width; i += 1) {
      for (let z = 0; z < playerWord.length; z += 1) {
        if (screenText.background.get({ x: i + z, y: j }) !== null &&
            screenText.background.get({ x: i + z, y: j }) !== ' ') {
          tempWord += screenText.background.get({ x: i + z, y: j }).char;
        }
      }

      if (playerWord === tempWord && playerWord.length === tempWord.length) {
        term.nextLine(1).eraseLine();
        term.red(player1.get());
        term.nextLine(2).cyan(`${encouragement[getRandomInt(0, encouragement.length)]}`).eraseLineAfter();
        userInput = '';

        for (let z = 0; z < playerWord.length; z += 1) {
          delete screenText.background.get({ x: i + z, y: j });
          screenText.background.put({
            x: i + z,
            y: j,
          }, ' ');
        }
        break;
      }

      tempWord = '';
    }
  }
}

function input(key) {
  switch (key) {
    case 'BACKSPACE':
      term.nextLine(1).right(userInput.length - 1).cyan(' ');

      if (userInput.length === 1) {
        term.left(2).cyan(' ');
      }

      userInput = userInput.slice(0, userInput.length - 1);
      break;

    case 'CTRL_C':
      terminate();
      break;

    case 'ENTER':
    case ' ':
      if (userInput.length > 1) {
        checkForHit(userInput);
      }
      break;

    default:
      userInput += key;

      term.cyan(userInput);
      break;
  }
}

function init(callback) {
  loadPlayer(playersData, 'Martin');

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

    createTextBackground();
    addWordsToScreen();

    term.moveTo.eraseLine.bgWhite.cyan(0, term.height, 'Type here and type fast!');

    term.hideCursor();
    term.grabInput();
    term.on('key', input);

    callback();
  });
}

function moveBackground() {
  screenText.background.x -= 0.03;
}

function draw() {
  screenText.background.draw({
    dst: viewport,
    tile: true,
  });

  viewport.draw();
}

function animate() {
  draw();
  moveBackground();
  setTimeout(animate, 10);
}

init(() => {
  animate();
});
