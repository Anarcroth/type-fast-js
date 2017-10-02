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

function createTextBackground() {
  screenText.background = screenBuffer.create({
    width: term.width,
    height: term.height,
    noFill: true,
  });

  screenText.background.fill({
    attr: {
      color: 'white', bgColor: 'blue',
    },
  });
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
      width: term.width,
      height: term.height - 1,
    });

    createTextBackground();

    term.moveTo.eraseLine.bgWhite.blue(term.width - 50, term.height, 'Type here and type fast!');

    term.hideCursor();
    term.grabInput();
    term.on('key', input);

    callback();
  });
}

function draw() {
  screenText.background.x += 1;

  screenText.background.draw({
    dst: viewport,
    tile: true,
  });

  screenText.background.put({
    x: 0,
    y: getRandomInt(0, term.height),
  }, wordList[getRandomInt(0, wordList.length)]);

  viewport.draw();
}

function animate() {
  draw();
  setTimeout(animate, 500);
}

init(() => {
  animate();
});
