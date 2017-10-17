const fs = require('fs');
const player = require('./player.js');
const termkit = require('terminal-kit');

const wordList = fs.readFileSync('wordList.txt').toString().split('\n');

const ScreenText = {
  screenBuffer: termkit.ScreenBuffer,
  searchedWord: '',
  wordsYPos: [],
  screen: {},

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - (min + 1))) + min;
  },

  /* Put all of the words from the list on the right side of the screen
  so that they do not jump immediately on the screen after the game satrts */
  putWordsOffScreen() {
    let xPos;
    let yPos;

    for (let word = 0; word < wordList.length; word += 1) {
      xPos = this.getRandomInt(220, 816);
      yPos = Math.floor(Math.random() * this.screen.text.height);

      this.screen.text.put({
        x: xPos,
        y: yPos,
      }, wordList[word]);

      this.wordsYPos.push(yPos);
    }
  },

  createScreenText(viewport) {
    this.screen.text = this.screenBuffer.create({
      width: viewport.width,
      height: viewport.height,
      noFill: true,
    });

    this.screen.text.fill({
      attr: {
        color: 'white', bgDefaultColor: true,
      },
    });
  },

  destroyMatchedWordAt(xp, yp) {
    for (let ch = 0; ch < player.inpWord.length; ch += 1) {
      delete this.screen.text.get({ x: xp + ch, y: yp });
      this.screen.text.put({
        x: xp + ch,
        y: yp,
      }, ' ');
    }
  },

  isAPerfectMatch() {
    return player.inpWord === this.searchedWord
    && player.inpWord.length === this.searchedWord.length;
  },

  foundMatchOnScreen(viewport) {
    for (let yp = this.screen.text.x > 0 ? this.screen.text.x - 10 : 0;
      yp < this.wordsYPos.length; yp += 1) {
      for (let xp = 0; xp < viewport.width; xp += 1) {
        for (let ch = 0; ch < player.inpWord.length; ch += 1) {
          // Optimized variant of the match: if the current box is null and the
          // box, that is the length of the searched word away, also null, jump
          // with the length of the searched word forward. Otherwise do a normal
          // shift to the right.
          if (this.screen.text.get({ x: xp + ch, y: yp }) === null &&
              this.screen.text.get({ x: xp + player.inpWord.length, y: yp }) === null) {
            xp += player.inpWord.length - 1;
          } else {
            this.searchedWord += this.screen.text.get({ x: xp + ch, y: yp }).char;
          }
        }

        if (this.isAPerfectMatch()) {
          player.incrHitStats();

          this.destroyMatchedWordAt(xp, yp);

          player.inpWord = '';
          this.searchedWord = '';

          // By splicing the index of the found Y position of the element, the
          // number of iterrations is reduced each time a check for a match is made.
          this.wordsYPos.splice(yp, 1);

          return true;
        }

        this.searchedWord = '';
      }
    }
    return false;
  },

  moveScreenTextLeft() {
    this.screen.text.x -= 0.05;
  },

  draw(viewport) {
    this.screen.text.draw({
      dst: viewport,
      tile: true,
    });
  },
};

module.exports = ScreenText;
