# Tic-Tac-Toe Web App

A beautiful, modern Tic-Tac-Toe game playable in the browser. Play against a friend or the built-in AI!

## Features
- Human vs Human or Human vs AI
- Player stats and win counters
- Responsive Tailwind CSS UI
- Animated turn/win indicators
- Change Player Names dialog
- Smart AI using Minimax
- Easy unit testing

## Getting Started

### 1. Install [Bun](https://bun.sh/)
### 2. Install dependencies
```sh
bun install
```
### 3. Run the local development server
```sh
bunx serve
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Unit Tests

```sh
bun test
```
Runs Bun's built-in test runner on core game and AI logic in `game.test.js`.

## Project Structure
- `index.html` – Main web UI
- `game.js` – UI logic (ES modules)
- `tic-tac-toe-core.js` – Game and AI logic (browser & tests)
- `game.test.js` – Unit tests for logic (Bun test)

## License
MIT
