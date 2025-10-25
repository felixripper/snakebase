// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GameScore
 * @dev A simple contract to store the high score for each player in a game.
 */
contract GameScore {
    // Maps a player's address to their highest score.
    mapping(address => uint256) public highScores;

    // Emitted when a new high score is set for a player.
    event NewHighScore(address indexed player, uint256 score);

    /**
     * @dev Submits a new score for the message sender.
     * The score is only updated if it's higher than the player's current high score.
     * @param _score The new score to submit.
     */
    function submitScore(uint256 _score) public {
        address player = msg.sender;

        // Only update if the new score is greater than the current high score.
        if (_score > highScores[player]) {
            highScores[player] = _score;
            emit NewHighScore(player, _score);
        }
    }
}