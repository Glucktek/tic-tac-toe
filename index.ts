type Player = "X" | "O";
type Cell = Player | null;
type Board = Cell[][];
type Position = { row: number; col: number };

interface PlayerInfo {
  symbol: Player;
  name: string;
  wins: number;
}

interface GameState {
  board: Board;
  currentPlayer: Player;
  gameOver: boolean;
  winner: Player | null;
  isDraw: boolean;
}

interface GameResult {
  winner: Player | null;
  isDraw: boolean;
  winningLine?: Position[];
}

class TicTacToe {
  private board: Board;
  private currentPlayer: Player;
  private gameOver: boolean;
  private winner: Player | null;
  private isDraw: boolean;
  private players: Map<Player, PlayerInfo>;

  constructor(playerXName: string = "Player X", playerOName: string = "Player O") {
    this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    this.currentPlayer = "X";
    this.gameOver = false;
    this.winner = null;
    this.isDraw = false;
    this.players = new Map([
      ["X", { symbol: "X", name: playerXName, wins: 0 }],
      ["O", { symbol: "O", name: playerOName, wins: 0 }]
    ]);
  }

  public playMove(row: number, col: number): GameResult | null {
    if (this.gameOver) {
      console.log("Game is already over. Start a new game.");
      return null;
    }

    if (!this.isValidPosition(row, col)) {
      console.log("Invalid position. Please enter row and column between 0-2.");
      return null;
    }

    if (this.board[row][col] !== null) {
      console.log("Invalid move, spot is already taken.");
      return null;
    }

    this.board[row][col] = this.currentPlayer;
    
    const result = this.checkGameEnd();
    if (result.winner) {
      this.winner = result.winner;
      this.gameOver = true;
      this.players.get(result.winner)!.wins++;
      console.log(`${this.players.get(result.winner)!.name} wins!`);
    } else if (result.isDraw) {
      this.isDraw = true;
      this.gameOver = true;
      console.log("It's a draw!");
    } else {
      this.switchPlayer();
    }

    return result;
  }

  private isValidPosition(row: number, col: number): boolean {
    return row >= 0 && row < 3 && col >= 0 && col < 3;
  }

  private switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
  }

  private checkGameEnd(): GameResult {
    const winResult = this.checkWin();
    if (winResult) {
      return { winner: this.currentPlayer, isDraw: false, winningLine: winResult };
    }

    if (this.isBoardFull()) {
      return { winner: null, isDraw: true };
    }

    return { winner: null, isDraw: false };
  }

  private checkWin(): Position[] | null {
    const winConditions: Position[][] = [
      // Rows
      [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
      [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
      [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],
      // Columns
      [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
      [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
      // Diagonals
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

  private isBoardFull(): boolean {
    return this.board.every(row => row.every(cell => cell !== null));
  }

  public getGameState(): GameState {
    return {
      board: this.board.map(row => [...row]),
      currentPlayer: this.currentPlayer,
      gameOver: this.gameOver,
      winner: this.winner,
      isDraw: this.isDraw
    };
  }

  public getCurrentPlayer(): PlayerInfo {
    return this.players.get(this.currentPlayer)!;
  }

  public getPlayerStats(): PlayerInfo[] {
    return Array.from(this.players.values());
  }

  public resetGame(): void {
    this.board = Array(3).fill(null).map(() => Array(3).fill(null));
    this.currentPlayer = "X";
    this.gameOver = false;
    this.winner = null;
    this.isDraw = false;
  }

  public printBoard(): void {
    console.log("\n  0   1   2");
    this.board.forEach((row, index) => {
      console.log(`${index} ${row.map(cell => cell || " ").join(" | ")}`);
      if (index < 2) console.log("  ---|---|---");
    });
    console.log();
  }

  public printStats(): void {
    console.log("\n=== Game Statistics ===");
    this.getPlayerStats().forEach(player => {
      console.log(`${player.name}: ${player.wins} wins`);
    });
    console.log();
  }

  public startGame(): void {
    const readline = require("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askMove = () => {
      if (this.gameOver) {
        this.printStats();
        rl.question("Play again? (y/n): ", (answer: string) => {
          if (answer.toLowerCase() === 'y') {
            this.resetGame();
            askMove();
          } else {
            rl.close();
          }
        });
        return;
      }

      this.printBoard();
      const currentPlayerInfo = this.getCurrentPlayer();
      rl.question(
        `${currentPlayerInfo.name} (${currentPlayerInfo.symbol}), enter your move (row col): `,
        (answer: string) => {
          const parts = answer.trim().split(/\s+/);
          if (parts.length !== 2) {
            console.log("Please enter row and column separated by space (e.g., '1 2')");
            askMove();
            return;
          }

          const [row, col] = parts.map(Number);
          if (isNaN(row) || isNaN(col)) {
            console.log("Please enter valid numbers for row and column.");
            askMove();
            return;
          }

          const result = this.playMove(row, col);
          if (result !== null) {
            this.printBoard();
          }
          askMove();
        }
      );
    };

    console.log("=== Welcome to Tic-Tac-Toe ===");
    console.log("Enter moves as 'row col' (0-2 for both)");
    askMove();
  }
}

const game = new TicTacToe();
game.startGame();