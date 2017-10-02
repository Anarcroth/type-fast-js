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
    wordAtX = Math.floor(Math.random() * screenText.background.width);
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
      color: 'white',
    },
  });

  addWords();
}

function terminate() {
  term.hideCursor(false);
  term.grabInput(false);

  setTimeout(() => {
    term.moveTo(1, term.height, '\n\n');
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
      width: Math.min(term.width),
      height: Math.min(term.height - 1),
      y: 2,
    });

    createTextBackground();

    term.moveTo.eraseLine.bgWhite.blue(term.width - 50, term.height, 'Type here and type fast!');

    term.hideCursor();
    term.grabInput();
    term.on('key', input);

    callback();
  });
}

function moveBackground() {
  screenText.background.x += 1;
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
  setTimeout(animate, 50);
}

init(() => {
  animate();
});
