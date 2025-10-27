// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SnakeGameScore
 * @dev Ultra-simple on-chain score tracker for Snake game on Base Mainnet
 * Players can register and submit their high scores
 * Optimized for low gas costs on Base L2
 */
contract SnakeGameScore {
    // Player data structure
    struct Player {
        string username;
        uint256 highScore;
        uint256 lastPlayed;
        bool exists;
    }

    // Storage
    mapping(address => Player) public players;
    address[] private playerList;

    // Events for indexing and notifications
    event PlayerRegistered(address indexed player, string username);
    event ScoreSubmitted(address indexed player, uint256 score, uint256 highScore);

    /**
     * @dev Register as a player with a username
     * @param _username Player's chosen username (3-20 chars)
     */
    function register(string calldata _username) external {
        require(!players[msg.sender].exists, "Already registered");
        require(bytes(_username).length >= 3 && bytes(_username).length <= 20, "Invalid username length");

        players[msg.sender] = Player({
            username: _username,
            highScore: 0,
            lastPlayed: block.timestamp,
            exists: true
        });

        playerList.push(msg.sender);
        emit PlayerRegistered(msg.sender, _username);
    }

    /**
     * @dev Submit your game score
     * @param _score Your score from the game
     */
    function submitScore(uint256 _score) external {
        require(players[msg.sender].exists, "Not registered");
        require(_score > 0, "Score must be positive");

        Player storage player = players[msg.sender];
        
        // Update high score if new score is better
        if (_score > player.highScore) {
            player.highScore = _score;
        }
        
        player.lastPlayed = block.timestamp;
        emit ScoreSubmitted(msg.sender, _score, player.highScore);
    }

    /**
     * @dev Get player information
     * @param _player Address of the player
     */
    function getPlayer(address _player) external view returns (
        string memory username,
        uint256 highScore,
        uint256 lastPlayed,
        bool isRegistered
    ) {
        Player memory p = players[_player];
        return (p.username, p.highScore, p.lastPlayed, p.exists);
    }

    /**
     * @dev Check if an address is registered
     * @param _player Address to check
     */
    function isRegistered(address _player) external view returns (bool) {
        return players[_player].exists;
    }

    /**
     * @dev Get total number of registered players
     */
    function getTotalPlayers() external view returns (uint256) {
        return playerList.length;
    }

    /**
     * @dev Get top N players by high score
     * @param _limit Maximum number of players to return
     * Note: This is gas-intensive for large player counts
     * Consider using off-chain indexing for production
     */
    function getTopPlayers(uint256 _limit) external view returns (
        address[] memory addresses,
        string[] memory usernames,
        uint256[] memory scores
    ) {
        uint256 total = playerList.length;
        uint256 limit = _limit > total ? total : _limit;
        
        if (limit == 0) {
            return (new address[](0), new string[](0), new uint256[](0));
        }

        // Create arrays for sorting
        address[] memory tempAddresses = new address[](total);
        uint256[] memory tempScores = new uint256[](total);
        
        for (uint256 i = 0; i < total; i++) {
            tempAddresses[i] = playerList[i];
            tempScores[i] = players[playerList[i]].highScore;
        }

        // Simple bubble sort (fine for small lists on L2)
        for (uint256 i = 0; i < total; i++) {
            for (uint256 j = i + 1; j < total; j++) {
                if (tempScores[j] > tempScores[i]) {
                    // Swap scores
                    uint256 tempScore = tempScores[i];
                    tempScores[i] = tempScores[j];
                    tempScores[j] = tempScore;
                    
                    // Swap addresses
                    address tempAddr = tempAddresses[i];
                    tempAddresses[i] = tempAddresses[j];
                    tempAddresses[j] = tempAddr;
                }
            }
        }

        // Return top N
        addresses = new address[](limit);
        usernames = new string[](limit);
        scores = new uint256[](limit);
        
        for (uint256 i = 0; i < limit; i++) {
            addresses[i] = tempAddresses[i];
            usernames[i] = players[tempAddresses[i]].username;
            scores[i] = tempScores[i];
        }
        
        return (addresses, usernames, scores);
    }
}
