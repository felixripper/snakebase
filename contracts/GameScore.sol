// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SnakeGameLeaderboard
 * @dev Advanced leaderboard contract with player registration, score tracking, and rankings
 */
contract SnakeGameLeaderboard {
    struct Player {
        address playerAddress;
        string username;
        uint256 highScore;
        uint256 totalGames;
        uint256 totalScore;
        uint256 firstPlayedAt;
        uint256 lastPlayedAt;
        bool isRegistered;
    }

    struct LeaderboardEntry {
        address playerAddress;
        string username;
        uint256 score;
        uint256 rank;
    }

    // Mappings
    mapping(address => Player) public players;
    mapping(string => address) public usernameToAddress;
    
    // Arrays for leaderboard
    address[] public playerAddresses;
    
    // Events
    event PlayerRegistered(address indexed player, string username, uint256 timestamp);
    event ScoreSubmitted(address indexed player, uint256 score, uint256 newHighScore, uint256 timestamp);
    event UsernameUpdated(address indexed player, string oldUsername, string newUsername);

    // Modifiers
    modifier onlyRegistered() {
        require(players[msg.sender].isRegistered, "Player not registered");
        _;
    }

    /**
     * @dev Register a new player with a username
     * @param _username Unique username for the player (3-20 characters)
     */
    function registerPlayer(string memory _username) public {
        require(!players[msg.sender].isRegistered, "Player already registered");
        require(bytes(_username).length >= 3 && bytes(_username).length <= 20, "Username must be 3-20 characters");
        require(usernameToAddress[_username] == address(0), "Username already taken");

        players[msg.sender] = Player({
            playerAddress: msg.sender,
            username: _username,
            highScore: 0,
            totalGames: 0,
            totalScore: 0,
            firstPlayedAt: block.timestamp,
            lastPlayedAt: block.timestamp,
            isRegistered: true
        });

        usernameToAddress[_username] = msg.sender;
        playerAddresses.push(msg.sender);

        emit PlayerRegistered(msg.sender, _username, block.timestamp);
    }

    /**
     * @dev Submit a new game score
     * @param _score The score achieved in the game
     */
    function submitScore(uint256 _score) public onlyRegistered {
        Player storage player = players[msg.sender];
        
        uint256 oldHighScore = player.highScore;
        if (_score > player.highScore) {
            player.highScore = _score;
        }
        
        player.totalGames += 1;
        player.totalScore += _score;
        player.lastPlayedAt = block.timestamp;

        emit ScoreSubmitted(msg.sender, _score, player.highScore, block.timestamp);
    }

    /**
     * @dev Update player username
     * @param _newUsername New username
     */
    function updateUsername(string memory _newUsername) public onlyRegistered {
        require(bytes(_newUsername).length >= 3 && bytes(_newUsername).length <= 20, "Username must be 3-20 characters");
        require(usernameToAddress[_newUsername] == address(0), "Username already taken");

        Player storage player = players[msg.sender];
        string memory oldUsername = player.username;
        
        // Remove old username mapping
        delete usernameToAddress[oldUsername];
        
        // Update to new username
        player.username = _newUsername;
        usernameToAddress[_newUsername] = msg.sender;

        emit UsernameUpdated(msg.sender, oldUsername, _newUsername);
    }

    /**
     * @dev Get top N players by high score
     * @param _limit Number of top players to return
     * @return Top players with their scores
     */
    function getTopPlayers(uint256 _limit) public view returns (LeaderboardEntry[] memory) {
        uint256 limit = _limit > playerAddresses.length ? playerAddresses.length : _limit;
        if (limit == 0) {
            return new LeaderboardEntry[](0);
        }

        // Create a temporary array of all players with scores
        LeaderboardEntry[] memory allPlayers = new LeaderboardEntry[](playerAddresses.length);
        
        for (uint256 i = 0; i < playerAddresses.length; i++) {
            Player memory player = players[playerAddresses[i]];
            allPlayers[i] = LeaderboardEntry({
                playerAddress: player.playerAddress,
                username: player.username,
                score: player.highScore,
                rank: 0
            });
        }

        // Sort players by score (bubble sort - simple but gas intensive for large arrays)
        for (uint256 i = 0; i < allPlayers.length; i++) {
            for (uint256 j = i + 1; j < allPlayers.length; j++) {
                if (allPlayers[j].score > allPlayers[i].score) {
                    LeaderboardEntry memory temp = allPlayers[i];
                    allPlayers[i] = allPlayers[j];
                    allPlayers[j] = temp;
                }
            }
        }

        // Create result array with top N players
        LeaderboardEntry[] memory topPlayers = new LeaderboardEntry[](limit);
        for (uint256 i = 0; i < limit; i++) {
            topPlayers[i] = allPlayers[i];
            topPlayers[i].rank = i + 1;
        }

        return topPlayers;
    }

    /**
     * @dev Get player details by address
     * @param _player Player address
     * @return Player details
     */
    function getPlayer(address _player) public view returns (Player memory) {
        return players[_player];
    }

    /**
     * @dev Get player rank
     * @param _player Player address
     * @return Player's rank (1-based, 0 if not ranked)
     */
    function getPlayerRank(address _player) public view returns (uint256) {
        if (!players[_player].isRegistered) {
            return 0;
        }

        uint256 playerScore = players[_player].highScore;
        uint256 rank = 1;

        for (uint256 i = 0; i < playerAddresses.length; i++) {
            if (playerAddresses[i] != _player && players[playerAddresses[i]].highScore > playerScore) {
                rank++;
            }
        }

        return rank;
    }

    /**
     * @dev Get total number of registered players
     * @return Total player count
     */
    function getTotalPlayers() public view returns (uint256) {
        return playerAddresses.length;
    }

    /**
     * @dev Check if a username is available
     * @param _username Username to check
     * @return True if available, false if taken
     */
    function isUsernameAvailable(string memory _username) public view returns (bool) {
        return usernameToAddress[_username] == address(0);
    }

    /**
     * @dev Check if a player is registered
     * @param _player Player address
     * @return True if registered, false otherwise
     */
    function isPlayerRegistered(address _player) public view returns (bool) {
        return players[_player].isRegistered;
    }
}