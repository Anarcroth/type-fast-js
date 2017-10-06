function Player(playerObj) {
  this.playerName = playerObj.playerName;
  this.currentScore = playerObj.currentScore;
  this.bestScore = playerObj.bestScore;
  this.currentNumHits = playerObj.currentNumHits;
  this.bestNumHits = playerObj.bestNumHits;

  this.get = () => this.bestScore;

  this.setNewBestScore = (newBestScore) => {
    this.bestScore = newBestScore;
  };

  this.setnewBestHits = (newBestNumHits) => {
    this.bestNumHits = newBestNumHits;
  };
}

module.exports = Player;
