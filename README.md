# dice-battle-game
# 🎲 Dice Battle Game
 [🎮 Play Dice Battle Online Here](https://fatima-m-mustapha.github.io/dice-battle-game/)

An interactive, browser-based dice game built with **HTML, CSS, and JavaScript**, where 2 or 3 players compete to win rounds and become the overall champion.

## 📌 About the Project

Dice Battle is a multiplayer dice game with customizable match settings. With a single click, all players roll their dice simultaneously and receive independent random results. Players accumulate points across multiple rolls and compete to win rounds until one becomes the overall champion.

The project also includes a leaderboard that records players' wins and losses, calculates win rates, and ranks players based on their match results.

This project was developed as a learning project to practice front-end web development and JavaScript programming concepts.

## 🎮 Features

- **Flexible Player Selection:** Choose between 2 or 3 players.
- **Custom Player Names:** Enter names for players before starting a match.
- **Customizable Match Modes:** Choose between Best of 3 and Best of 5.
- **Simultaneous Dice Rolls:** Roll the dice for all players with a single click, generating a separate random result from 1 to 6 for each player.
- **Score Tracking:** Automatically updates each player's score after every roll.
- **Round-Based Gameplay:** Players accumulate points until one or more reach 25 or more points.
- **Tie Handling:** Detects tied highest scores among players who reach the scoring threshold and allows play to continue until the tie is broken.
- **Match Progression:** The first player to win 2 rounds in Best of 3 or 3 rounds in Best of 5 wins the match.
- **Winner Announcement:** Displays the overall winner and the number of rounds won by each player.
- **Leaderboard and Statistics:** Records wins and losses, calculates win rates, and ranks players by match performance.
- **Persistent Leaderboard:** Saves leaderboard data in the browser using `localStorage`, keeping it available between visits in the same browser unless the data is cleared.
- **Clear Data Option:** Allows players to reset leaderboard records.
- **Rematch Option:** Start another match using the same player names and match settings.

## 🕹️ How to Play

1. Choose the number of players: 2 or 3.
2. Select the match mode: Best of 3 or Best of 5.
3. Enter player names or use the default names.
4. Click **Start Match**.
5. Click **Roll Dice**. All players roll simultaneously, and each receives an independently generated random result from 1 to 6.
6. Continue rolling to accumulate points. Players' scores increase after every roll.
7. When one or more players reach 25 or more points, the player with the highest qualifying score wins the round. If the highest scores are tied, continue rolling for all players until the tie is broken.
8. Win the required number of rounds to become the overall champion.
9. Start a rematch or return to the main menu.
10. Visit the leaderboard to view player statistics and rankings.

## 🛠️ Technologies Used

- **HTML5** — Structures the game interface, setup screen, gameplay area, winner screen, and leaderboard.
- **CSS3** — Styles the interface, player panels, buttons, dice displays, and leaderboard.
- **JavaScript** — Implements game logic, random dice rolls, score tracking, tie handling, match progression, and user interactions.
- **DOM Manipulation** — Updates game screens, scores, dice displays, and leaderboard content dynamically.
- **Browser `localStorage`** — Stores leaderboard statistics between visits in the same browser.

## 🚀 Getting Started

No additional libraries or frameworks are required.

1. Clone or download this repository.
2. Open `index.html` in your web browser.
3. Choose your game settings, enter player names, and start playing.

## 🤝 Collaboration

This project was co-authored with **Google Gemini**, which contributed AI assistance during the development process.

## 📚 Learning Objectives

This project provides practical experience with:

- Variables and data types
- Arrays and objects
- Functions and reusable code
- Loops and conditional statements
- Random number generation
- Event listeners and event handling
- DOM manipulation and dynamic HTML rendering
- Game state and score management
- Browser storage with `localStorage`
- Sorting algorithms, including selection sort
- Basic input handling and HTML escaping
