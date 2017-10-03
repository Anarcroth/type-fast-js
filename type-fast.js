const term = require('terminal-kit').terminal;
const termkit = require('./node_modules/terminal-kit/lib/termkit.js');

const screenBuffer = termkit.ScreenBuffer;

const wordList = ['business', 'left', 'vague', 'shock', 'loaf', 'reply', 'bell',
  'dapper', 'escape', 'heavenly', 'abashed', 'fair', 'scandalous', 'needless',
  'momentous', 'puffy', 'wave', 'vanish', 'bath', 'hospitable', 'humor', 'crack',
  'board', 'race', 'breath', 'minute', 'deer', 'draconian', 'next', 'perform',
  'daffy', 'square', 'highfalutin', 'spiky', 'entertain', 'attract', 'heat',
  'harsh', 'fumbling', 'jealous'];

const screenText = {};

let viewport = {};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

function addWords() {
  let wordAtX;
  let wordAtY;

  for (let i = 0; i < wordList.length; i += 1) {
    wordAtX = getRandomInt(500, 816);
    wordAtY = Math.floor(Math.random() * screenText.background.height);

    screenText.background.put({
      x: wordAtX,
      y: wordAtY,
    }, wordList[getRandomInt(0, wordList.length)]);
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
      color: 'white', bgColor: 'pink',
    },
  });

  addWords();
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

function input(key) {
  switch (key) {
    case 'q':
    case 'CTRL_C':
      terminate();
      break;

    default:
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

    createTextBackground();

    term.moveTo.eraseLine.bgWhite.blue(0, term.height + 5, 'Type here and type fast!');

    term.moveTo(25, term.height + 5);

    term.inputField({
      echo: true,
    }, (error2, userInput) => {
      if (userInput === wordList.find(input)) {
        term.blue('Good Job!');
      }
    });

    term.hideCursor();
    term.grabInput();
    term.on('key', input);

    callback();
  });
}

function moveBackground() {
  screenText.background.x -= 0.3;
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
