const term = require('terminal-kit').terminal;
const termkit = require('./node_modules/terminal-kit/lib/termkit.js');

const screenBuffer = termkit.ScreenBuffer;
const textBuffer = termkit.TextBuffer;

const wordList = ['business', 'left', 'vague', 'shock', 'loaf', 'reply', 'bell',
  'dapper', 'escape', 'heavenly', 'abashed', 'fair', 'scandalous', 'needless',
  'momentous', 'puffy', 'wave', 'vanish', 'bath', 'hospitable', 'humor', 'crack',
  'board', 'race', 'breath', 'minute', 'deer', 'draconian', 'next', 'perform',
  'daffy', 'square', 'highfalutin', 'spiky', 'entertain', 'attract', 'heat',
  'harsh', 'fumbling', 'jealous'];

let screenText = {};
let screen = {};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - (min + 1))) + min;
}

function init() {
  termkit.getDetectedTerminal((error) => {
    if (error) {
      throw new Error('Cannot detect terminal!');
    }

    screen = screenBuffer.create({
      dst: term,
      width: Math.min(term.width),
      height: Math.min(term.height),
    });

    screenText = textBuffer.create({
      dst: screen,
      width: Math.min(term.width),
      height: Math.min(term.height),
      y: 2,
      forceInBound: true,
    });
  });
}

function fillScreen() {
  screenText.moveTo(0, getRandomInt(0, term.height));
  screenText.insert(wordList[getRandomInt(0, wordList.length)]);

  screenText.draw({
    dst: screen,
  });

  screen.draw();
}

init();

function animate() {
  fillScreen();
  setTimeout(animate, 1000);
}

animate();
