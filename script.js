
document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // 1. GAME STATE DEFINITION
    // ==========================================
    let gameState = {
        playerCount: 2,
        matchType: 3,    // 3 = Best of 3 (needs 2 round wins), 5 = Best of 5 (needs 3 round wins)
        targetWins: 2,
        players: [],     // Array of player objects: { id, name, roundsWon, currentRoundScore, lastRoll, color }
        currentRound: 1,
        matchWinner: null,
        isRoundOver: false
    };

    const PLAYER_COLORS = ['#3b82f6', '#ec4899', '#10b981'];

    // ==========================================
    // 2. DOM ELEMENTS SELECTORS
    // ==========================================
    // Screens
    const setupScreen = document.getElementById('setupScreen');
    const gameScreen = document.getElementById('gameScreen');
    const winnerScreen = document.getElementById('winnerScreen');
    const leaderboardScreen = document.getElementById('leaderboardScreen');

    // Setup Form Selectors
    const playerCountGroup = document.getElementById('playerCountGroup');
    const matchTypeGroup = document.getElementById('matchTypeGroup');
    const inputPlayer1 = document.getElementById('input-player1');
    const inputPlayer2 = document.getElementById('input-player2');
    const inputPlayer3 = document.getElementById('input-player3');
    const btnStart = document.getElementById('btnStart');
    const btnShowLeaderboard = document.getElementById('btnShowLeaderboard');

    // Game Interface Selectors
    const matchBadge = document.getElementById('matchBadge');
    const roundIndicator = document.getElementById('roundIndicator');
    const scoreboard = document.getElementById('scoreboard');
    const statusText = document.getElementById('statusText');
    const diceArea = document.getElementById('diceArea');
    const btnRoll = document.getElementById('btnRoll');
    const btnNextRound = document.getElementById('btnNextRound');

    // Victory Screen Selectors
    const winnerName = document.getElementById('winnerName');
    const finalScores = document.getElementById('finalScores');
    const btnRematch = document.getElementById('btnRematch');
    const btnNewGame = document.getElementById('btnNewGame');

    // Leaderboard Screen Selectors
    const leaderboardBody = document.getElementById('leaderboardBody');
    const emptyLeaderboard = document.getElementById('emptyLeaderboard');
    const btnBackFromLeaderboard = document.getElementById('btnBackFromLeaderboard');
    const btnClearLeaderboard = document.getElementById('btnClearLeaderboard');

    // ==========================================
    // 3. SETUP & NAVIGATION HANDLERS
    // ==========================================

    // Handle number of players toggle button selection
    playerCountGroup.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) return;
        
        // Remove active class from all buttons in the group
        const buttons = playerCountGroup.querySelectorAll('.btn');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        
        // Add active class to clicked button
        e.target.classList.add('active');

        // Set value in state
        const val = parseInt(e.target.dataset.value);
        gameState.playerCount = val;

        // Toggle Player 3 input field visibility
        if (val === 3) {
            inputPlayer3.classList.remove('hidden');
        } else {
            inputPlayer3.classList.add('hidden');
        }
    });

    // Handle match type (BO3/BO5) button selection
    matchTypeGroup.addEventListener('click', function(e) {
        if (!e.target.classList.contains('btn')) return;
        
        const buttons = matchTypeGroup.querySelectorAll('.btn');
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].classList.remove('active');
        }
        e.target.classList.add('active');

        const val = parseInt(e.target.dataset.value);
        gameState.matchType = val;
        gameState.targetWins = (val === 3) ? 2 : 3;
    });

    // Screen transition helper
    function showScreen(screen) {
        setupScreen.classList.remove('active');
        gameScreen.classList.remove('active');
        winnerScreen.classList.remove('active');
        leaderboardScreen.classList.remove('active');
        screen.classList.add('active');
    }

    // Go to Leaderboard
    btnShowLeaderboard.addEventListener('click', function() {
        renderLeaderboard();
        showScreen(leaderboardScreen);
    });

    // Go back to Main Menu
    btnBackFromLeaderboard.addEventListener('click', function() {
        showScreen(setupScreen);
    });

    // Start Battle Click
    btnStart.addEventListener('click', function() {
        // Retrieve values and fallback to defaults if empty
        const p1Name = inputPlayer1.value.trim() || 'Player 1';
        const p2Name = inputPlayer2.value.trim() || 'Player 2';
        const p3Name = inputPlayer3.value.trim() || 'Player 3';

        // Initialize players array in game state
        gameState.players = [
            { id: 1, name: p1Name, roundsWon: 0, currentRoundScore: 0, lastRoll: null, color: PLAYER_COLORS[0] },
            { id: 2, name: p2Name, roundsWon: 0, currentRoundScore: 0, lastRoll: null, color: PLAYER_COLORS[1] }
        ];

        // Add 3rd player if selected
        if (gameState.playerCount === 3) {
            gameState.players.push({
                id: 3, name: p3Name, roundsWon: 0, currentRoundScore: 0, lastRoll: null, color: PLAYER_COLORS[2]
            });
        }

        startMatch();
    });

    // ==========================================
    // 4. GAME PLAY ENGINE & CORE LOGIC
    // ==========================================

    // Start the overall match
    function startMatch() {
        gameState.currentRound = 1;
        for (let i = 0; i < gameState.players.length; i++) {
            gameState.players[i].roundsWon = 0;
        }
        
        matchBadge.textContent = (gameState.matchType === 3) ? "Best of 3" : "Best of 5";
        initRound();
        showScreen(gameScreen);
    }

    // Initialize state for a new round
    function initRound() {
        gameState.isRoundOver = false;
        
        // Reset scores and rolls for the round
        for (let i = 0; i < gameState.players.length; i++) {
            gameState.players[i].currentRoundScore = 0;
            gameState.players[i].lastRoll = null;
        }

        roundIndicator.textContent = 'Round ' + gameState.currentRound;
        btnRoll.classList.remove('hidden');
        btnNextRound.classList.add('hidden');

        renderScoreboard();
        renderDiceArea();

        statusText.innerHTML = 'Round ' + gameState.currentRound + ' has started! Click Roll to accumulate points towards 25.';
    }

    // Render scoreboard cards dynamically
    function renderScoreboard() {
        scoreboard.innerHTML = '';
        for (let i = 0; i < gameState.players.length; i++) {
            let player = gameState.players[i];
            const card = document.createElement('div');
            card.className = 'score-card';
            
            card.innerHTML = `
                <div class="player-title" style="color: ${player.color}">${escapeHtml(player.name)}</div>
                <div>
                    <span class="player-score-lbl">Round Score: </span>
                    <span class="player-score-val">${player.currentRoundScore}</span>
                </div>
                <div class="player-wins-lbl">Rounds Won: <strong>${player.roundsWon} / ${gameState.targetWins}</strong></div>
            `;
            scoreboard.appendChild(card);
        }
    }

    // Render 2D flat dice representation
    function renderDiceArea() {
        diceArea.innerHTML = '';
        for (let i = 0; i < gameState.players.length; i++) {
            let player = gameState.players[i];
            
            const container = document.createElement('div');
            container.className = 'dice-container';

            const ownerLabel = document.createElement('div');
            ownerLabel.className = 'dice-owner';
            ownerLabel.textContent = player.name;

            const diceBox = document.createElement('div');
            diceBox.className = 'dice-box';
            diceBox.style.borderColor = player.color;
            diceBox.style.color = player.color;
            
            if (player.lastRoll !== null) {
                diceBox.textContent = player.lastRoll;
            } else {
                diceBox.textContent = '-';
            }

            container.appendChild(ownerLabel);
            container.appendChild(diceBox);
            diceArea.appendChild(container);
        }
    }

    // Roll Dice click handler
    btnRoll.addEventListener('click', function() {
        if (gameState.isRoundOver) return;

        // 1. Roll values (1-6) and accumulate round score for each player
        for (let i = 0; i < gameState.players.length; i++) {
            let player = gameState.players[i];
            let roll = Math.floor(Math.random() * 6) + 1;
            player.lastRoll = roll;
            player.currentRoundScore += roll;
        }

        // 2. Re-render GUI
        renderScoreboard();
        renderDiceArea();

        // 3. Find candidates who reached score >= 25
        let candidates = [];
        for (let i = 0; i < gameState.players.length; i++) {
            if (gameState.players[i].currentRoundScore >= 25) {
                candidates.push(gameState.players[i]);
            }
        }

        // 4. Decide round end or tie breaker
        if (candidates.length > 0) {
            // Find maximum score among candidates
            let maxScore = 0;
            for (let i = 0; i < candidates.length; i++) {
                if (candidates[i].currentRoundScore > maxScore) {
                    maxScore = candidates[i].currentRoundScore;
                }
            }

            // Find all players with the maximum score
            let winners = [];
            for (let i = 0; i < candidates.length; i++) {
                if (candidates[i].currentRoundScore === maxScore) {
                    winners.push(candidates[i]);
                }
            }

            if (winners.length === 1) {
                // Single winner found!
                let roundWinner = winners[0];
                roundWinner.roundsWon += 1;
                gameState.isRoundOver = true;

                statusText.innerHTML = '🎉 <strong style="color: ' + roundWinner.color + '">' + escapeHtml(roundWinner.name) + '</strong> wins Round ' + gameState.currentRound + ' with ' + roundWinner.currentRoundScore + ' points!';
                btnRoll.classList.add('hidden');

                // Check if overall match target is met
                if (roundWinner.roundsWon === gameState.targetWins) {
                    setTimeout(function() {
                        endMatch(roundWinner);
                    }, 1800);
                } else {
                    btnNextRound.classList.remove('hidden');
                }
            } else {
                // Exact tie for the maximum score. Keep rolling!
                let tiedNames = '';
                for (let i = 0; i < winners.length; i++) {
                    tiedNames += winners[i].name;
                    if (i < winners.length - 1) {
                        tiedNames += ' & ';
                    }
                }
                statusText.innerHTML = '🤝 Tie! <strong style="color: #64748b">' + escapeHtml(tiedNames) + '</strong> are tied at ' + maxScore + ' points! Keep rolling to break the tie!';
            }
        } else {
            // Standard roll feedback (no one reached 25 yet)
            let rollDetails = '';
            for (let i = 0; i < gameState.players.length; i++) {
                let player = gameState.players[i];
                rollDetails += escapeHtml(player.name) + ' rolled ' + player.lastRoll;
                if (i < gameState.players.length - 1) {
                    rollDetails += ', ';
                }
            }
            statusText.textContent = 'Rolls: ' + rollDetails + '. Keep rolling!';
        }
    });

    // Go to Next Round click handler
    btnNextRound.addEventListener('click', function() {
        gameState.currentRound += 1;
        initRound();
    });

    // ==========================================
    // 5. VICTORY & PERSISTENT LEADERBOARD LOGIC
    // ==========================================

    // Transition to victory screen
    function endMatch(winner) {
        gameState.matchWinner = winner;
        winnerName.textContent = winner.name + ' wins the Match!';
        winnerName.style.color = winner.color;

        // Render final round wins breakdown
        finalScores.innerHTML = '';
        for (let i = 0; i < gameState.players.length; i++) {
            let p = gameState.players[i];
            const row = document.createElement('div');
            row.style.fontSize = '1.1rem';
            row.style.margin = '5px 0';
            row.innerHTML = escapeHtml(p.name) + ': <strong>' + p.roundsWon + ' rounds won</strong>';
            finalScores.appendChild(row);
        }

        saveResultsToLeaderboard(winner);
        showScreen(winnerScreen);
    }

    btnRematch.addEventListener('click', function() {
        startMatch();
    });

    btnNewGame.addEventListener('click', function() {
        showScreen(setupScreen);
    });

    // Save statistics in LocalStorage
    function saveResultsToLeaderboard(winner) {
        let stats = {};
        const savedData = localStorage.getItem('diceBattleLeaderboard');
        if (savedData) {
            stats = JSON.parse(savedData);
        }

        for (let i = 0; i < gameState.players.length; i++) {
            let player = gameState.players[i];
            let nameKey = player.name.trim();
            
            if (!stats[nameKey]) {
                stats[nameKey] = { name: player.name, wins: 0, losses: 0 };
            }

            if (player.id === winner.id) {
                stats[nameKey].wins += 1;
            } else {
                stats[nameKey].losses += 1;
            }
        }

        localStorage.setItem('diceBattleLeaderboard', JSON.stringify(stats));
    }

    // Retrieve stats and render them sorted in the table
    function renderLeaderboard() {
        leaderboardBody.innerHTML = '';
        
        let stats = {};
        const savedData = localStorage.getItem('diceBattleLeaderboard');
        if (savedData) {
            stats = JSON.parse(savedData);
        }

        // Convert stats object into an array and calculate win rates
        let entries = [];
        for (let nameKey in stats) {
            if (stats.hasOwnProperty(nameKey)) {
                let entry = stats[nameKey];
                let total = entry.wins + entry.losses;
                let rate = "0.0";
                
                if (total > 0) {
                    rate = ((entry.wins / total) * 100).toFixed(1);
                }

                entries.push({
                    name: entry.name,
                    wins: entry.wins,
                    losses: entry.losses,
                    rate: parseFloat(rate),
                    total: total
                });
            }
        }

        // --- SORTING ALGORITHM (Selection Sort) ---
        // Classic academic sort: Descending by wins, ascending by losses on tie.
        for (let i = 0; i < entries.length - 1; i++) {
            let maxIndex = i;
            for (let j = i + 1; j < entries.length; j++) {
                if (entries[j].wins > entries[maxIndex].wins) {
                    maxIndex = j;
                } else if (entries[j].wins === entries[maxIndex].wins) {
                    if (entries[j].losses < entries[maxIndex].losses) {
                        maxIndex = j;
                    }
                }
            }
            if (maxIndex !== i) {
                let temp = entries[i];
                entries[i] = entries[maxIndex];
                entries[maxIndex] = temp;
            }
        }

        // Show empty message if leaderboard is blank
        if (entries.length === 0) {
            emptyLeaderboard.classList.remove('hidden');
            return;
        }

        emptyLeaderboard.classList.add('hidden');

        // Create table row elements
        for (let i = 0; i < entries.length; i++) {
            let entry = entries[i];
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>#${i + 1}</strong></td>
                <td>${escapeHtml(entry.name)}</td>
                <td style="color: var(--success-color); font-weight: bold;">${entry.wins}</td>
                <td style="color: var(--danger-color);">${entry.losses}</td>
                <td><strong>${entry.rate}%</strong></td>
            `;
            leaderboardBody.appendChild(tr);
        }
    }

    // Clear leaderboard database helper
    btnClearLeaderboard.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete all leaderboard data?')) {
            localStorage.removeItem('diceBattleLeaderboard');
            renderLeaderboard();
        }
    });

    // Basic HTML escaping logic to protect against XSS
    function escapeHtml(str) {
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
