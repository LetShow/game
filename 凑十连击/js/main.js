import { Game } from './game.js';

window.onload = () => {
  const container = document.getElementById('game-container');
  window.game = new Game(container);
};