import { TicTacToe, TicTacToeAI } from './tic-tac-toe-core.js';

// Game UI Controller
class GameUI {
    constructor() {
        this.game = null;
        this.gameMode = null;
        this.cells = document.querySelectorAll('.cell');
        this.gameStatus = document.getElementById('game-status');
        this.resetBtn = document.getElementById('reset-btn');
        this.playerNamesBtn = document.getElementById('player-names-btn');
        this.backToMenuBtn = document.getElementById('back-to-menu-btn');
        this.playerModal = document.getElementById('player-modal');
        this.playerXInput = document.getElementById('player-x-input');
        this.playerOInput = document.getElementById('player-o-input');
        this.saveNamesBtn = document.getElementById('save-names-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.startMenu = document.getElementById('start-menu');
        this.gameContent = document.getElementById('game-content');
        this.humanVsHumanBtn = document.getElementById('human-vs-human');
        this.humanVsAIBtn = document.getElementById('human-vs-ai');
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.showStartMenu();
    }

    bindEvents() {
        // Start menu buttons
        this.humanVsHumanBtn.addEventListener('click', () => {
            this.startGame('human-vs-human');
        });

        this.humanVsAIBtn.addEventListener('click', () => {
            this.startGame('human-vs-ai');
        });

        // Cell clicks
        this.cells.forEach(cell => {
            cell.addEventListener('click', (e) => {
                const row = parseInt(e.target.dataset.row);
                const col = parseInt(e.target.dataset.col);
                this.handleCellClick(row, col);
            });
        });

        // Control buttons
        this.resetBtn.addEventListener('click', () => {
            this.resetGame();
        });

        this.backToMenuBtn.addEventListener('click', () => {
            this.showStartMenu();
        });

        // Player names button
        this.playerNamesBtn.addEventListener('click', () => {
            this.showPlayerModal();
        });

        // Modal buttons
        this.saveNamesBtn.addEventListener('click', () => {
            this.savePlayerNames();
        });

        this.cancelBtn.addEventListener('click', () => {
            this.hidePlayerModal();
        });

        // Modal background click
        this.playerModal.addEventListener('click', (e) => {
            if (e.target === this.playerModal) {
                this.hidePlayerModal();
            }
        });
    }

    showStartMenu() {
        this.startMenu.classList.remove('hidden');
        this.gameContent.classList.add('hidden');
        this.game = null;
    }

    startGame(gameMode) {
        this.gameMode = gameMode;
        const playerXName = gameMode === 'human-vs-ai' ? 'You' : 'Player X';
        const playerOName = gameMode === 'human-vs-ai' ? 'AI' : 'Player O';
        
        this.game = new TicTacToe(playerXName, playerOName, gameMode);
        this.startMenu.classList.add('hidden');
        this.gameContent.classList.remove('hidden');
        this.resetGame();
    }

    handleCellClick(row, col) {
        if (!this.game || this.game.isCurrentPlayerAI()) {
            return; // Don't allow clicks when AI is thinking or game not started
        }

        const result = this.game.playMove(row, col);
        if (result !== null) {
            this.updateUI();
            if (result.winningLine) {
                this.highlightWinningLine(result.winningLine);
            }
            
            // If it's AI's turn and game isn't over, make AI move after a short delay
            if (!this.game.gameOver && this.game.isCurrentPlayerAI()) {
                setTimeout(() => {
                    const aiResult = this.game.makeAIMove();
                    if (aiResult) {
                        this.updateUI();
                        if (aiResult.winningLine) {
                            this.highlightWinningLine(aiResult.winningLine);
                        }
                    }
                }, 500); // Small delay to make AI move visible
            }
        }
    }

    updateUI() {
        if (!this.game) return;
        this.updateBoard();
        this.updateGameStatus();
        this.updatePlayerStats();
    }

    updateBoard() {
        const gameState = this.game.getGameState();
        this.cells.forEach(cell => {
            const row = parseInt(cell.dataset.row);
            const col = parseInt(cell.dataset.col);
            const cellValue = gameState.board[row][col];
            
            cell.textContent = cellValue || '';
            cell.classList.toggle('occupied', cellValue !== null);
            
            if (cellValue === 'X') {
                cell.style.color = '#2563eb'; // blue-600
            } else if (cellValue === 'O') {
                cell.style.color = '#dc2626'; // red-600
            }
        });
    }

    updateGameStatus() {
        const gameState = this.game.getGameState();
        const currentPlayer = this.game.getCurrentPlayer();
        
        if (gameState.gameOver) {
            if (gameState.winner) {
                const winnerInfo = this.game.getPlayerStats().find(p => p.symbol === gameState.winner);
                this.gameStatus.textContent = `🎉 ${winnerInfo.name} wins!`;
                this.gameStatus.className = 'text-xl font-semibold text-green-600 pulse';
            } else if (gameState.isDraw) {
                this.gameStatus.textContent = "🤝 It's a draw!";
                this.gameStatus.className = 'text-xl font-semibold text-yellow-600';
            }
        } else {
            const isAI = this.game.isCurrentPlayerAI();
            const statusText = isAI ? `${currentPlayer.name} is thinking...` : `${currentPlayer.name}'s turn (${currentPlayer.symbol})`;
            this.gameStatus.textContent = statusText;
            this.gameStatus.className = `text-xl font-semibold ${currentPlayer.symbol === 'X' ? 'text-blue-600' : 'text-red-600'}${isAI ? ' pulse' : ''}`;
        }
    }

    updatePlayerStats() {
        const stats = this.game.getPlayerStats();
        const playerX = stats.find(p => p.symbol === 'X');
        const playerO = stats.find(p => p.symbol === 'O');
        
        document.getElementById('player-x-name').textContent = playerX.name;
        document.getElementById('player-x-wins').textContent = playerX.wins;
        document.getElementById('player-o-name').textContent = playerO.name;
        document.getElementById('player-o-wins').textContent = playerO.wins;
    }

    highlightWinningLine(winningLine) {
        winningLine.forEach(pos => {
            const cell = document.querySelector(`[data-row="${pos.row}"][data-col="${pos.col}"]`);
            cell.classList.add('winning-cell');
        });
    }

    resetGame() {
        if (!this.game) return;
        
        this.game.resetGame();
        this.cells.forEach(cell => {
            cell.classList.remove('winning-cell', 'occupied');
            cell.style.color = '#374151'; // gray-700
        });
        this.updateUI();
    }

    showPlayerModal() {
        if (!this.game) return;
        
        const stats = this.game.getPlayerStats();
        const playerX = stats.find(p => p.symbol === 'X');
        const playerO = stats.find(p => p.symbol === 'O');
        
        this.playerXInput.value = playerX.name;
        this.playerOInput.value = playerO.name;
        
        // Disable AI player name input
        if (this.gameMode === 'human-vs-ai') {
            this.playerOInput.disabled = true;
            this.playerOInput.classList.add('bg-gray-100');
        } else {
            this.playerOInput.disabled = false;
            this.playerOInput.classList.remove('bg-gray-100');
        }
        
        this.playerModal.classList.remove('hidden');
        this.playerModal.classList.add('flex');
    }

    hidePlayerModal() {
        this.playerModal.classList.add('hidden');
        this.playerModal.classList.remove('flex');
    }

    savePlayerNames() {
        if (!this.game) return;
        
        const playerXName = this.playerXInput.value.trim() || 'Player X';
        let playerOName = this.playerOInput.value.trim() || 'Player O';
        
        // Keep AI name if in AI mode
        if (this.gameMode === 'human-vs-ai') {
            playerOName = 'AI';
        }
        
        this.game.setPlayerNames(playerXName, playerOName);
        this.updatePlayerStats();
        this.updateGameStatus();
        this.hidePlayerModal();
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GameUI();
});