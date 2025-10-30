const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SnakeGameScore", function () {
  let snakeGameScore;
  let owner;
  let player1;
  let player2;

  beforeEach(async function () {
    // Get signers
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy contract
    const SnakeGameScore = await ethers.getContractFactory("SnakeGameScore");
    snakeGameScore = await SnakeGameScore.deploy();
    await snakeGameScore.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await snakeGameScore.owner()).to.equal(owner.address);
    });
  });

  describe("Score Submission", function () {
    it("Should submit a score successfully", async function () {
      const score = 100;

      const tx = await snakeGameScore.connect(player1).submitScore(score);
      const receipt = await tx.wait();

      // Find ScoreSubmitted event
      const scoreSubmittedEvent = receipt.logs.find(log => {
        try {
          const event = snakeGameScore.interface.parseLog(log);
          return event.name === "ScoreSubmitted";
        } catch {
          return false;
        }
      });

      expect(scoreSubmittedEvent).to.not.be.undefined;
      const event = snakeGameScore.interface.parseLog(scoreSubmittedEvent);
      expect(event.args.player).to.equal(player1.address);
      expect(event.args.score).to.equal(score);

      expect(await snakeGameScore.getHighScore(player1.address)).to.equal(score);
    });

    it("Should update high score when better score is submitted", async function () {
      const score1 = 100;
      const score2 = 200;

      await snakeGameScore.connect(player1).submitScore(score1);
      expect(await snakeGameScore.getHighScore(player1.address)).to.equal(score1);

      await expect(snakeGameScore.connect(player1).submitScore(score2))
        .to.emit(snakeGameScore, "HighScoreUpdated")
        .withArgs(player1.address, score1, score2);

      expect(await snakeGameScore.getHighScore(player1.address)).to.equal(score2);
    });

    it("Should not update high score when worse score is submitted", async function () {
      const score1 = 200;
      const score2 = 100;

      await snakeGameScore.connect(player1).submitScore(score1);
      expect(await snakeGameScore.getHighScore(player1.address)).to.equal(score1);

      await snakeGameScore.connect(player1).submitScore(score2);
      expect(await snakeGameScore.getHighScore(player1.address)).to.equal(score1);
    });

    it("Should reject invalid scores", async function () {
      await expect(snakeGameScore.connect(player1).submitScore(0)).to.be.revertedWith("Score must be greater than 0");
      await expect(snakeGameScore.connect(player1).submitScore(1000001)).to.be.revertedWith("Score cannot exceed 1,000,000");
    });
  });

  describe("Leaderboard", function () {
    beforeEach(async function () {
      // Submit scores for multiple players
      await snakeGameScore.connect(player1).submitScore(100);
      await snakeGameScore.connect(player2).submitScore(200);
      await snakeGameScore.connect(owner).submitScore(50);
    });

    it("Should return top scores in correct order", async function () {
      const [players, scores] = await snakeGameScore.getTopScores(3);

      expect(players[0]).to.equal(player2.address);
      expect(scores[0]).to.equal(200);
      expect(players[1]).to.equal(player1.address);
      expect(scores[1]).to.equal(100);
      expect(players[2]).to.equal(owner.address);
      expect(scores[2]).to.equal(50);
    });

    it("Should limit results when requested", async function () {
      const [players, scores] = await snakeGameScore.getTopScores(2);

      expect(players.length).to.equal(2);
      expect(scores.length).to.equal(2);
      expect(players[0]).to.equal(player2.address);
      expect(scores[0]).to.equal(200);
      expect(players[1]).to.equal(player1.address);
      expect(scores[1]).to.equal(100);
    });
  });

  describe("Player Scores", function () {
    it("Should store all player scores", async function () {
      await snakeGameScore.connect(player1).submitScore(100);
      await snakeGameScore.connect(player1).submitScore(150);
      await snakeGameScore.connect(player1).submitScore(120);

      const scores = await snakeGameScore.getPlayerScores(player1.address);
      expect(scores.length).to.equal(3);
      expect(scores[0]).to.equal(100);
      expect(scores[1]).to.equal(150);
      expect(scores[2]).to.equal(120);
    });
  });
});