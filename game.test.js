import { TicTacToe, TicTacToeAI } from './tic-tac-toe-core.js';
import { test, expect } from 'bun:test';

test('game initializes with empty board', () => {
  const game = new TicTacToe('A', 'B', 'human-vs-human');
  expect(game.getGameState().board.flat().every(cell => cell === null)).toBe(true);
  expect(game.getGameState().currentPlayer).toBe('X');
  expect(game.getGameState().gameOver).toBe(false);
});

test('can play valid moves', () => {
  const game = new TicTacToe('A', 'B', 'human-vs-human');
  const move1 = game.playMove(0, 0);
  expect(game.getGameState().board[0][0]).toBe('X');
  expect(game.getGameState().currentPlayer).toBe('O');
  expect(move1.winner).toBe(null);

  const move2 = game.playMove(1, 1);
  expect(game.getGameState().board[1][1]).toBe('O');
  expect(game.getGameState().currentPlayer).toBe('X');
});

test('prevents move on occupied cell', () => {
  const game = new TicTacToe('A', 'B', 'human-vs-human');
  game.playMove(0, 0);
  const badMove = game.playMove(0, 0);
  expect(badMove).toBe(null);
});

test('detects wins', () => {
  const game = new TicTacToe('A', 'B', 'human-vs-human');
  game.playMove(0, 0); // X
  game.playMove(1, 0); // O
  game.playMove(0, 1); // X
  game.playMove(1, 1); // O
  const win = game.playMove(0, 2); // X
  expect(win.winner).toBe('X');
  expect(game.getGameState().gameOver).toBe(true);
  expect(game.getGameState().winner).toBe('X');
});

test('detects draw', () => {
  const game = new TicTacToe('A', 'B', 'human-vs-human');
  game.playMove(0,0); // X
  game.playMove(0,1); // O
  game.playMove(0,2); // X
  game.playMove(1,2); // O
  game.playMove(1,0); // X
  game.playMove(2,0); // O
  game.playMove(1,1); // X
  game.playMove(2,2); // O
  const draw = game.playMove(2,1); // X
  expect(draw.isDraw).toBe(true);
  expect(game.getGameState().gameOver).toBe(true);
  expect(game.getGameState().winner).toBe(null);
});

test('win increases winner stats', () => {
  const game = new TicTacToe('A', 'B', 'human-vs-human');
  game.playMove(0,0); // X
  game.playMove(1,0); // O
  game.playMove(0,1); // X
  game.playMove(1,1); // O
  game.playMove(0,2); // X wins
  const stats = game.getPlayerStats();
  expect(stats.find(p=>p.symbol==='X').wins).toBe(1);
  expect(stats.find(p=>p.symbol==='O').wins).toBe(0);
});

test('resetGame clears the board and keeps stats', () => {
  const game = new TicTacToe('A', 'B', 'human-vs-human');
  game.playMove(0,0); // X
  game.playMove(1,0); // O
  game.playMove(0,1); // X
  game.playMove(1,1); // O
  game.playMove(0,2); // X wins
  game.resetGame();
  expect(game.getGameState().board.flat().every(cell => cell === null)).toBe(true);
  expect(game.getPlayerStats().find(p=>p.symbol==='X').wins).toBe(1);
});

test('AI blocks winning move', () => {
  const g = new TicTacToe('A', 'AI', 'human-vs-ai');
  const ai = g.ai;
  g.board = [
    ['X', 'X', null],
    ['O', null, null],
    [null, 'O', null]
  ];
  g.currentPlayer = 'O';
  const move = ai.getBestMove(g.board);
  expect(move).toEqual({ row: 0, col: 2 }); // Block X win
});

test('AI takes win if available', () => {
  const g = new TicTacToe('A', 'AI', 'human-vs-ai');
  const ai = g.ai;
  g.board = [
    ['O', 'O', null],
    ['X', 'X', null],
    [null, null, null]
  ];
  g.currentPlayer = 'O';
  const move = ai.getBestMove(g.board);
  expect(move).toEqual({ row: 0, col: 2 }); // Take win
});
