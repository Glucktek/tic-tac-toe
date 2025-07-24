// Core logic for TicTacToe, no DOM dependencies
export class TicTacToeAI {
    constructor(symbol) {
        this.symbol = symbol;
        this.opponent = symbol === 'X' ? 'O' : 'X';
    }
    minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
        const result = this.evaluateBoard(board);
        if (result !== null) {
            return result;
        }
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === null) {
                        board[row][col] = this.symbol;
                        const eval_ = this.minimax(board, depth + 1, false, alpha, beta);
                        board[row][col] = null;
                        maxEval = Math.max(maxEval, eval_);
                        alpha = Math.max(alpha, eval_);
                        if (beta <= alpha) break;
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let row = 0; row < 3; row++) {
                for (let col = 0; col < 3; col++) {
                    if (board[row][col] === null) {
                        board[row][col] = this.opponent;
                        const eval_ = this.minimax(board, depth + 1, true, alpha, beta);
                        board[row][col] = null;
                        minEval = Math.min(minEval, eval_);
                        beta = Math.min(beta, eval_);
                        if (beta <= alpha) break;
                    }
                }
            }
            return minEval;
        }
    }
    evaluateBoard(board) {
        const winner = this.checkWinner(board);
        if (winner === this.symbol) return 10;
        if (winner === this.opponent) return -10;
        if (this.isBoardFull(board)) return 0;
        return null;
    }
    checkWinner(board) {
        const winConditions = [
            [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
            [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
            [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
        ];
        for (const line of winConditions) {
            const [a, b, c] = line;
            if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
                return board[a[0]][a[1]];
            }
        }
        return null;
    }
    isBoardFull(board) {
        return board.every(row => row.every(cell => cell !== null));
    }
    getBestMove(board) {
        let bestScore = -Infinity;
        let bestMove = null;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === null) {
                    board[row][col] = this.symbol;
                    const score = this.minimax(board, 0, false);
                    board[row][col] = null;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { row, col };
                    }
                }
            }
        }
        return bestMove;
    }
}

export class TicTacToe {
    constructor(playerXName = "Player X", playerOName = "Player O", gameMode = "human-vs-human") {
        this.board = Array(3).fill(null).map(() => Array(3).fill(null));
        this.currentPlayer = "X";
        this.gameOver = false;
        this.winner = null;
        this.isDraw = false;
        this.gameMode = gameMode;
        this.players = new Map([
            ["X", { symbol: "X", name: playerXName, wins: 0, isAI: false }],
            ["O", { symbol: "O", name: playerOName, wins: 0, isAI: gameMode === "human-vs-ai" }]
        ]);
        if (gameMode === "human-vs-ai") {
            this.ai = new TicTacToeAI("O");
        }
    }
    playMove(row, col) {
        if (this.gameOver) return null;
        if (!this.isValidPosition(row, col)) return null;
        if (this.board[row][col] !== null) return null;
        this.board[row][col] = this.currentPlayer;
        const result = this.checkGameEnd();
        if (result.winner) {
            this.winner = result.winner;
            this.gameOver = true;
            this.players.get(result.winner).wins++;
        } else if (result.isDraw) {
            this.isDraw = true;
            this.gameOver = true;
        } else {
            this.switchPlayer();
        }
        return result;
    }
    isValidPosition(row, col) {
        return row >= 0 && row < 3 && col >= 0 && col < 3;
    }
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    }
    checkGameEnd() {
        const winResult = this.checkWin();
        if (winResult) {
            return { winner: this.currentPlayer, isDraw: false, winningLine: winResult };
        }
        if (this.isBoardFull()) {
            return { winner: null, isDraw: true };
        }
        return { winner: null, isDraw: false };
    }
    checkWin() {
        const winConditions = [
            [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
            [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
            [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
            [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
            [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
            [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
            [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
            [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }]
        ];
        for (const line of winConditions) {
            if (line.every(pos => this.board[pos.row][pos.col] === this.currentPlayer)) {
                return line;
            }
        }
        return null;
    }
    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== null));
    }
    getGameState() {
        return {
            board: this.board.map(row => [...row]),
            currentPlayer: this.currentPlayer,
            gameOver: this.gameOver,
            winner: this.winner,
            isDraw: this.isDraw
        };
    }
    getCurrentPlayer() {
        return this.players.get(this.currentPlayer);
    }
    getPlayerStats() {
        return Array.from(this.players.values());
    }
    resetGame() {
        this.board = Array(3).fill(null).map(() => Array(3).fill(null));
        this.currentPlayer = "X";
        this.gameOver = false;
        this.winner = null;
        this.isDraw = false;
    }
    setPlayerNames(playerXName, playerOName) {
        this.players.get("X").name = playerXName;
        this.players.get("O").name = playerOName;
    }
    getCurrentPlayerInfo() {
        return this.players.get(this.currentPlayer);
    }
    isCurrentPlayerAI() {
        return this.getCurrentPlayerInfo().isAI;
    }
    makeAIMove() {
        if (!this.isCurrentPlayerAI() || this.gameOver) return null;
        const move = this.ai.getBestMove(this.board);
        if (move) return this.playMove(move.row, move.col);
        return null;
    }
}

