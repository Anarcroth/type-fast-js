const fs = require('fs');

const termkit = require('terminal-kit');

const players = require('./playersData.json');

const term = termkit.terminal;
const screenBuffer = termkit.ScreenBuffer;

const wordList = fs.readFileSync('wordList.txt').toString().split('\n');
const encouragement = ['Good!', 'Nice!', 'Doing great!', 'Awesome!', 'Keep it up!'];

const wordsYPos = [];
const screen = {};

let viewport = {};

let playerInput = '';
let screenWord = '';

let currPlayerIndx = 0;
let currScore = 0;
let currHits = 0;

function findIndexOf(currPlayer) {
  for (let j = 0; j < players.data.length; j += 1) {
    const values = Object.values(players.data[j]);

    for (let plName = 0; plName < values.length; plName += 1) {
      if (values[plName] === currPlayer) {
        currPlayerIndx = plName;
      }
    }
  }
}

function savePlayerStats() {
  if (currScore > players.data[currPlayerIndx].bestScore) {
    players.data[currPlayerIndx].bestScore = currScore;
  }

  if (currHits > players.data[currPlayerIndx].bestNumHits) {
    players.data[currPlayerIndx].bestNumHits = currHits;
  }

  fs.writeFile('./playersData.json', JSON.stringify(players), null, '\t');
}

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
  currHits += 1;
  currScore += 5;

  term.nextLine(1).eraseLine();
  term.nextLine(2).cyan(`${encouragement[getRandomInt(0, encouragement.length)]}`).eraseLineAfter();
}

function destroyMatchedWordAt(xp, yp) {
  for (let w = 0; w < playerInput.length; w += 1) {
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
      for (let w = 0; w < playerInput.length; w += 1) {
        // Optimized variant of the match: if the current box is null and the
        // box, that is the length of the searched word away, also empty, jump
        // with the length of the searched word forwad. Otherwise do a normal
        // shift to the right.
        if (screen.text.get({ x: xp + w, y: yp }) === null &&
            screen.text.get({ x: xp + playerInput.length, y: yp }) === null) {
          xp += playerInput.length - 1;
        } else if (screen.text.get({ x: xp + w, y: yp }) !== null) {
          screenWord += screen.text.get({ x: xp + w, y: yp }).char;
        }
      }

      if (playerInput === screenWord && playerInput.length === screenWord.length) {
        registerHit();
        destroyMatchedWordAt(xp, yp);
        playerInput = '';

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
      term.nextLine(1).right(playerInput.length - 1).cyan(' ');
      if (playerInput.length === 1) {
        term.left(2).cyan(' ');
      }

      // Clear the last char from the players word.
      playerInput = playerInput.slice(0, playerInput.length - 1);
      break;

    case 'CTRL_C':
      savePlayerStats();
      terminate();
      break;

    case 'ENTER':
    case ' ':
      // All of the words from the list are at least 5 chars long,
      // this avoids premature checking.
      if (playerInput.length > 4) {
        searchScreenForMatch();
      }
      break;

    default:
      playerInput += key;
      term.cyan(playerInput);
      break;
  }
}

function init(callback) {
  findIndexOf('Martin');

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
