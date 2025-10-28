// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SnakeGameScore
 * @dev Advanced leaderboard contract with player registration, score tracking, and rankings
 */
contract SnakeGameScore {
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
    
    struct Achievement {
        uint256 id;
        string name;
        string description;
        uint256 rewardTokens;
        bool active;
    }

    struct Tournament {
        uint256 id;
        string name;
        uint256 startTime;
        uint256 endTime;
        uint256 entryFee;
        uint256 prizePool;
        uint256 maxParticipants;
        uint256 currentParticipants;
        uint8 status; // 0: Active, 1: Completed, 2: Cancelled
        address winner;
        bool active;
        mapping(address => bool) participants;
        address[] participantList;
    }

    // Token contract address (BLAST or other reward token)
    address public rewardToken;
    
    // Achievements
    mapping(uint256 => Achievement) public achievements;
    mapping(address => mapping(uint256 => bool)) public playerAchievements;
    uint256 public achievementCount;
    
    // Tournaments
    mapping(uint256 => Tournament) public tournaments;
    uint256 public tournamentCount;
    
    // Daily quests
    mapping(address => uint256) public lastQuestCompletion;
    mapping(address => uint256) public dailyQuestStreak;

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

    // Events
    event AchievementUnlocked(address indexed player, uint256 achievementId, uint256 rewardTokens);
    event TournamentCreated(uint256 indexed tournamentId, string name, uint256 prizePool);
    event TournamentJoined(uint256 indexed tournamentId, address indexed player);
    event DailyQuestCompleted(address indexed player, uint256 streak, uint256 rewardTokens);

    /**
     * @dev Set reward token contract address
     * @param _tokenAddress Address of the reward token contract
     */
    function setRewardToken(address _tokenAddress) public {
        // Only owner can set this - in production, add access control
        rewardToken = _tokenAddress;
    }

    /**
     * @dev Create a new achievement
     * @param _name Achievement name
     * @param _description Achievement description
     * @param _rewardTokens Token reward amount
     */
    function createAchievement(string memory _name, string memory _description, uint256 _rewardTokens) public {
        achievementCount++;
        achievements[achievementCount] = Achievement({
            id: achievementCount,
            name: _name,
            description: _description,
            rewardTokens: _rewardTokens,
            active: true
        });
    }

    /**
     * @dev Unlock achievement for player
     * @param _player Player address
     * @param _achievementId Achievement ID
     */
    function unlockAchievement(address _player, uint256 _achievementId) public {
        require(achievements[_achievementId].active, "Achievement not active");
        require(!playerAchievements[_player][_achievementId], "Achievement already unlocked");
        
        playerAchievements[_player][_achievementId] = true;
        
        // Transfer reward tokens if token contract is set
        if (rewardToken != address(0) && achievements[_achievementId].rewardTokens > 0) {
            // ERC20 transfer logic would go here
            // IERC20(rewardToken).transfer(_player, achievements[_achievementId].rewardTokens);
        }
        
        emit AchievementUnlocked(_player, _achievementId, achievements[_achievementId].rewardTokens);
    }

    /**
     * @dev Create a new tournament
     * @param _name Tournament name
     * @param _duration Duration in seconds
     * @param _entryFee Entry fee in wei
     */
    function createTournament(string memory _name, uint256 _duration, uint256 _entryFee, uint256 _maxParticipants) public payable {
        tournamentCount++;
        Tournament storage newTournament = tournaments[tournamentCount];
        newTournament.id = tournamentCount;
        newTournament.name = _name;
        newTournament.startTime = block.timestamp;
        newTournament.endTime = block.timestamp + _duration;
        newTournament.entryFee = _entryFee;
        newTournament.prizePool = msg.value;
        newTournament.maxParticipants = _maxParticipants;
        newTournament.currentParticipants = 0;
        newTournament.status = 0; // Active
        newTournament.active = true;
        
        emit TournamentCreated(tournamentCount, _name, msg.value);
    }

    /**
     * @dev Join a tournament
     * @param _tournamentId Tournament ID
     */
    function joinTournament(uint256 _tournamentId) public payable {
        Tournament storage tournament = tournaments[_tournamentId];
        require(tournament.active, "Tournament not active");
        require(tournament.status == 0, "Tournament not active");
        require(block.timestamp >= tournament.startTime && block.timestamp < tournament.endTime, "Tournament not in active period");
        require(tournament.currentParticipants < tournament.maxParticipants, "Tournament full");
        require(!tournament.participants[msg.sender], "Already joined");
        require(msg.value >= tournament.entryFee, "Insufficient entry fee");
        
        tournament.participants[msg.sender] = true;
        tournament.participantList.push(msg.sender);
        tournament.currentParticipants++;
        tournament.prizePool += msg.value;
        
        emit TournamentJoined(_tournamentId, msg.sender);
    }
        
        emit TournamentJoined(_tournamentId, msg.sender);
    }

    /**
     * @dev Complete daily quest
     */
    function completeDailyQuest() public onlyRegistered {
        uint256 today = block.timestamp / 86400; // Days since epoch
        uint256 lastCompletion = lastQuestCompletion[msg.sender] / 86400;
        
        if (today > lastCompletion) {
            if (today == lastCompletion + 1) {
                dailyQuestStreak[msg.sender]++;
            } else {
                dailyQuestStreak[msg.sender] = 1;
            }
            lastQuestCompletion[msg.sender] = block.timestamp;
            
            uint256 reward = dailyQuestStreak[msg.sender] * 10; // 10 tokens per day streak
            emit DailyQuestCompleted(msg.sender, dailyQuestStreak[msg.sender], reward);
        }
    }

    /**
     * @dev Get player achievements
     * @param _player Player address
     * @return Array of unlocked achievement IDs
     */
    function getPlayerAchievements(address _player) public view returns (uint256[] memory) {
        uint256[] memory unlockedAchievements = new uint256[](achievementCount);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= achievementCount; i++) {
            if (playerAchievements[_player][i]) {
                unlockedAchievements[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = unlockedAchievements[i];
        }
        
        return result;
    }

    /**
     * @dev Get active tournaments
     * @return Array of active tournament IDs
     */
    function getActiveTournaments() public view returns (uint256[] memory) {
        uint256[] memory activeTournaments = new uint256[](tournamentCount);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= tournamentCount; i++) {
            if (tournaments[i].active && tournaments[i].status == 0) {
                activeTournaments[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeTournaments[i];
        }
        
        return result;
    }

    /**
     * @dev Get player's tournaments
     * @param _player Player address
     * @return Array of tournament IDs the player joined
     */
    function getPlayerTournaments(address _player) public view returns (uint256[] memory) {
        uint256[] memory playerTournaments = new uint256[](tournamentCount);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= tournamentCount; i++) {
            if (tournaments[i].participants[_player]) {
                playerTournaments[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = playerTournaments[i];
        }
        
        return result;
    }

    /**
     * @dev Get player daily quests
     * @param _player Player address
     * @return Array of completed daily quest IDs
     */
    function getPlayerDailyQuests(address _player) public view returns (uint256[] memory) {
        uint256[] memory completedQuests = new uint256[](dailyQuestCount);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= dailyQuestCount; i++) {
            if (playerDailyQuests[_player][i]) {
                completedQuests[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = completedQuests[i];
        }
        
        return result;
    }

    /**
     * @dev Get player streak
     * @param _player Player address
     * @return Current daily streak
     */
    function getPlayerStreak(address _player) public view returns (uint256) {
        return playerStreaks[_player];
    }
}