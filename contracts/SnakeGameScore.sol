// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SnakeGameScore
 * @dev Snake game score submission and leaderboard contract for Base Mainnet
 * @author Snakebase Team
 */
contract SnakeGameScore {
    // Events
    event ScoreSubmitted(address indexed player, uint256 score, uint256 timestamp);
    event HighScoreUpdated(address indexed player, uint256 oldScore, uint256 newScore);

    // State variables
    mapping(address => uint256) public highScores;
    mapping(address => uint256[]) public playerScores;
    address[] public players;

    // Contract owner
    address public owner;

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier validScore(uint256 score) {
        require(score > 0, "Score must be greater than 0");
        require(score <= 1000000, "Score cannot exceed 1,000,000");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Submit a score for the calling player
     * @param score The score to submit
     */
    function submitScore(uint256 score) external validScore(score) {
        address player = msg.sender;

        // Update high score if this is better
        uint256 currentHighScore = highScores[player];
        if (score > currentHighScore) {
            highScores[player] = score;
            emit HighScoreUpdated(player, currentHighScore, score);
        }

        // Store the score
        playerScores[player].push(score);

        // Add player to players array if new
        if (currentHighScore == 0) {
            players.push(player);
        }

        emit ScoreSubmitted(player, score, block.timestamp);
    }

    /**
     * @dev Get high score for a specific player
     * @param player The player address
     * @return The player's high score
     */
    function getHighScore(address player) external view returns (uint256) {
        return highScores[player];
    }

    /**
     * @dev Get all scores for a specific player
     * @param player The player address
     * @return Array of all scores submitted by the player
     */
    function getPlayerScores(address player) external view returns (uint256[] memory) {
        return playerScores[player];
    }

    /**
     * @dev Get top scores (leaderboard)
     * @param limit Maximum number of results to return
     * @return players Array of player addresses
     * @return scores Array of corresponding high scores
     */
    function getTopScores(uint256 limit) external view returns (address[] memory, uint256[] memory) {
        // Create a copy of players array to sort
        address[] memory sortedPlayers = new address[](players.length);
        for (uint256 i = 0; i < players.length; i++) {
            sortedPlayers[i] = players[i];
        }

        // Simple bubble sort by high score (descending)
        for (uint256 i = 0; i < sortedPlayers.length; i++) {
            for (uint256 j = i + 1; j < sortedPlayers.length; j++) {
                if (highScores[sortedPlayers[i]] < highScores[sortedPlayers[j]]) {
                    address temp = sortedPlayers[i];
                    sortedPlayers[i] = sortedPlayers[j];
                    sortedPlayers[j] = temp;
                }
            }
        }

        // Limit results
        uint256 resultLength = limit < sortedPlayers.length ? limit : sortedPlayers.length;
        address[] memory resultPlayers = new address[](resultLength);
        uint256[] memory resultScores = new uint256[](resultLength);

        for (uint256 i = 0; i < resultLength; i++) {
            resultPlayers[i] = sortedPlayers[i];
            resultScores[i] = highScores[sortedPlayers[i]];
        }

        return (resultPlayers, resultScores);
    }

    /**
     * @dev Get total number of players
     * @return Number of players who have submitted scores
     */
    function getPlayerCount() external view returns (uint256) {
        return players.length;
    }

    /**
     * @dev Emergency function to transfer ownership
     * @param newOwner The new owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }

    /**
     * @dev Emergency function to withdraw any accidentally sent ETH
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}