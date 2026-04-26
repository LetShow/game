import { getCardColorClass, getRandomPosition } from './utils.js';

export class DOMRenderer {
  constructor(container) {
    this.container = container;
    this.isDesktop = window.innerWidth >= 768;
    this.cardSize = this.isDesktop ? 60 : 50;
    this.bulletSize = this.isDesktop ? 24 : 20;
  }

  createCard(number, x, y) {
    const card = document.createElement('div');
    card.className = `card ${getCardColorClass(number)} card-appear`;
    card.dataset.number = number;
    card.style.width = `${this.cardSize}px`;
    card.style.height = `${this.cardSize}px`;
    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    card.textContent = number;
    return card;
  }

  createBullet(number, startX, startY) {
    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.dataset.number = number;
    bullet.style.width = `${this.bulletSize}px`;
    bullet.style.height = `${this.bulletSize}px`;
    bullet.style.left = `${startX}px`;
    bullet.style.top = `${startY}px`;
    bullet.textContent = number;
    return bullet;
  }

  createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    const size = this.cardSize;
    explosion.style.width = `${size}px`;
    explosion.style.height = `${size}px`;
    explosion.style.left = `${x - size / 2}px`;
    explosion.style.top = `${y - size / 2}px`;
    return explosion;
  }

  createScorePopup(score, x, y) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = `+${score}`;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    return popup;
  }

  removeElement(el) {
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  addClass(el, className) {
    if (el) el.classList.add(className);
  }

  removeClass(el, className) {
    if (el) el.classList.remove(className);
  }
}