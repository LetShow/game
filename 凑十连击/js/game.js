import { DOMRenderer } from './dom.js';
import { AudioManager } from './audio.js';
import { randomInt, randomCardNumber, checkCollision, getRandomPosition, loadFromStorage, saveToStorage } from './utils.js';

export class Game {
  constructor(container) {
    this.container = container;
    this.gameArea = container.querySelector('#game-area');
    this.turret = container.querySelector('#turret');
    this.turretBullet = this.turret.querySelector('.turret-bullet');
    this.renderer = new DOMRenderer(container);
    this.audio = new AudioManager();
    
    this.state = 'menu';
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeRemaining = 90;
    this.spawnInterval = 2000;
    this.minSpawnInterval = 800;
    this.maxCards = 6;
    this.cards = [];
    this.bullet = null;
    this.bulletNumber = 0;
    this.canShoot = true;
    this.highScore = loadFromStorage('decaStrike_highscore', 0);
    this.cardsSpawned = 0;
    
    this.cardSize = this.renderer.cardSize;
    this.bulletSize = this.renderer.bulletSize;
    
    this.timerInterval = null;
    this.spawnTimer = null;
    this.comboTimer = null;
    this.lastTime = 0;
    this.animationId = null;
    
    this.difficulty = 'normal';
    this.setupEventListeners();
  }

  setupEventListeners() {
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startGame());
    }
    
    document.getElementById('pause-btn').addEventListener('click', () => this.pause());
    document.getElementById('resume-btn').addEventListener('click', () => this.resume());
    document.getElementById('pause-menu-btn').addEventListener('click', () => this.showMenu());
    document.getElementById('restart-btn').addEventListener('click', () => this.restart());
    document.getElementById('end-menu-btn').addEventListener('click', () => this.showMenu());
    document.getElementById('end-leaderboard-btn').addEventListener('click', () => this.showLeaderboard());
    document.getElementById('leaderboard-btn').addEventListener('click', () => this.showLeaderboard());
    document.getElementById('clear-leaderboard-btn').addEventListener('click', () => this.clearLeaderboard());
    document.getElementById('leaderboard-back-btn').addEventListener('click', () => this.hideLeaderboard());
    document.getElementById('help-btn').addEventListener('click', () => this.showHelp());
    document.getElementById('help-back-btn').addEventListener('click', () => this.hideHelp());
    document.getElementById('mute-btn').addEventListener('click', () => this.toggleMute());
    
    this.gameArea.addEventListener('click', (e) => this.handleShoot(e));
    window.addEventListener('keydown', (e) => {
      console.log('Key pressed:', e.code, 'state:', this.state);
      if (e.code === 'Space' && this.state === 'playing') {
        e.preventDefault();
        this.discardBullet();
      }
    });
    
    window.addEventListener('resize', () => this.handleResize());
  }

  handleResize() {
    this.renderer.isDesktop = window.innerWidth >= 768;
    this.renderer.cardSize = this.renderer.isDesktop ? 60 : 50;
    this.renderer.bulletSize = this.renderer.isDesktop ? 24 : 20;
    this.cardSize = this.renderer.cardSize;
    this.bulletSize = this.renderer.bulletSize;
    
    this.adjustContainerSize();
  }
  
  adjustContainerSize() {
    const gameContainer = document.getElementById('game-container');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let newWidth = width;
    let newHeight = height;
    
    if (width < 600) newWidth = 600;
    if (width > 1200) newWidth = 1200;
    if (height < 600) newHeight = 600;
    
    gameContainer.style.width = `${newWidth}px`;
    gameContainer.style.height = `${newHeight}px`;
    
    const ratio = height / newWidth;
    gameContainer.classList.remove('height-tall', 'height-very-tall');
    if (ratio > 1.2) {
      gameContainer.classList.add('height-very-tall');
    } else if (ratio > 1.0) {
      gameContainer.classList.add('height-tall');
    }
  }

  startGame() {
    this.audio.init();
    this.audio.playGameStart();
    
    this.state = 'playing';
    this.score = 0;
    this.combo = 0;
    this.lives = 3;
    this.timeRemaining = 90;
    this.spawnInterval = 2000;
    this.minSpawnInterval = 800;
    this.maxCards = 6;
    this.cardsSpawned = 0;
    
    const gameContainer = document.getElementById('game-container');
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let newWidth = width;
    let newHeight = height;
    if (width < 600) newWidth = 600;
    if (width > 1200) newWidth = 1200;
    if (height < 600) newHeight = 600;
    
    gameContainer.style.width = newWidth + 'px';
    gameContainer.style.height = newHeight + 'px';
    gameContainer.style.minHeight = newHeight + 'px';
    
    const ratio = height / newWidth;
    gameContainer.classList.remove('height-tall', 'height-very-tall');
    if (ratio > 1.2) {
      gameContainer.classList.add('height-very-tall');
    } else if (ratio > 1.0) {
      gameContainer.classList.add('height-tall');
    }
    
    this.gameArea.innerHTML = '';
    this.updateBulletNumber();
    this.updateUI();
    
    this.showScreen('game-screen');
    this.startTimers();
    this.spawnInitialCards();
    this.gameLoop();
  }

  spawnInitialCards() {
    const initialCount = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < initialCount; i++) {
      this.spawnCard();
    }
    this.startCardSpawning();
  }

  startCardSpawning() {
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    this.spawnTimer = setInterval(() => {
      if (this.state === 'playing' && this.cards.length < this.maxCards) {
        this.spawnCard();
      }
    }, this.spawnInterval);
    
    if (this.forceSpawnTimer) clearTimeout(this.forceSpawnTimer);
    this.forceSpawnTimer = setTimeout(() => this.forceSpawnCard(), 5000);
  }
  
  forceSpawnCard() {
    if (this.state !== 'playing') return;
    if (this.cards.length < this.maxCards) {
      this.spawnCard();
    }
    if (this.cards.length < 2) {
      this.spawnCard();
      this.spawnCard();
    }
  }

  spawnCard() {
    const pos = this.getValidCardPosition();
    if (!pos) return;
    
    const number = this.getUniqueNumber();
    const card = this.renderer.createCard(number, pos.x, pos.y);
    this.gameArea.appendChild(card);
    this.cards.push(card);
  }

  getUniqueNumber() {
    const counts = {};
    for (const card of this.cards) {
      const num = parseInt(card.dataset.number);
      counts[num] = (counts[num] || 0) + 1;
    }
    
    const available = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => (counts[n] || 0) < 2);
    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }
    return randomCardNumber();
  }

  getValidCardPosition() {
    let attempts = 0;
    const turretRect = this.turret.getBoundingClientRect();
    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const turretCenterX = turretRect.left + turretRect.width / 2;
    const turretCenterY = turretRect.top + turretRect.height / 2;
    const minDistance = gameAreaRect.height / 3;
    const hudHeight = 60;
    const edgePadding = 80;
    const minOverlapDistance = 80;
    const spawnAreaTop = hudHeight + 50;
    const spawnAreaBottom = Math.min(turretRect.top - gameAreaRect.top - 50, gameAreaRect.height * 2 / 3);
    
    while (attempts < 100) {
      const pos = {
        x: edgePadding + Math.random() * (this.gameArea.offsetWidth - edgePadding * 2),
        y: spawnAreaTop + Math.random() * (spawnAreaBottom - spawnAreaTop)
      };
      
      const cardCenterX = pos.x;
      const cardCenterY = pos.y + this.cardSize / 2;
      const dist = Math.sqrt(Math.pow(cardCenterX - turretCenterX, 2) + Math.pow(cardCenterY - turretCenterY, 2));
      
      let overlaps = false;
      for (const card of this.cards) {
        const cardRect = card.getBoundingClientRect();
        const cardCenterX2 = cardRect.left + cardRect.width / 2 - gameAreaRect.left;
        const cardCenterY2 = cardRect.top + cardRect.height / 2 - gameAreaRect.top;
        const dist2 = Math.sqrt(Math.pow(cardCenterX - cardCenterX2, 2) + Math.pow(cardCenterY - cardCenterY2, 2));
        if (dist2 < minOverlapDistance) {
          overlaps = true;
          break;
        }
      }
      
      if (dist >= minDistance && pos.y > hudHeight && !overlaps) {
        return pos;
      }
      attempts++;
    }
    
    return { x: edgePadding + 50, y: hudHeight + 150 };
  }

  handleShoot(e) {
    if (this.state !== 'playing' || !this.canShoot || this.bullet) return;
    if (e) e.preventDefault();
    
    const gameArea = this.gameArea;
    const turret = this.turret;
    let targetX, targetY;
    
    if (e.type === 'touchstart' || e.type === 'touchend') {
      const touch = e.changedTouches ? e.changedTouches[0] : e.touches[0];
      targetX = touch.clientX;
      targetY = touch.clientY;
    } else {
      targetX = e.clientX;
      targetY = e.clientY;
    }
    
    const gameAreaRect = gameArea.getBoundingClientRect();
    const turretRect = turret.getBoundingClientRect();
    
    const startX = turretRect.left + turretRect.width / 2 - gameAreaRect.left - this.bulletSize / 2;
    const startY = turretRect.top - gameAreaRect.top - this.bulletSize;
    const targetRelX = targetX - gameAreaRect.left;
    const targetRelY = targetY - gameAreaRect.top;
    
    this.fireBullet(startX, startY, targetRelX, targetRelY);
  }

  fireBullet(startX, startY, targetX, targetY) {
    this.canShoot = false;
    
    this.bullet = this.renderer.createBullet(this.bulletNumber, startX, startY);
    this.gameArea.appendChild(this.bullet);
    this.audio.playShoot();
    
    const speed = 10;
    const dx = targetX - startX;
    const dy = targetY - startY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist === 0) {
      this.handleBulletMiss();
      return;
    }
    
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;
    
    let bulletX = startX;
    let bulletY = startY;
    
    const gameWidth = this.gameArea.offsetWidth;
    const gameHeight = this.gameArea.offsetHeight;
    const bulletSize = this.bulletSize;
    
    const animate = () => {
      if (!this.bullet || this.state !== 'playing') return;
      
      bulletX += vx;
      bulletY += vy;
      
      this.bullet.style.left = `${bulletX}px`;
      this.bullet.style.top = `${bulletY}px`;
      
      if (bulletY < -bulletSize || bulletY > gameHeight || 
          bulletX < -bulletSize || bulletX > gameWidth) {
        this.handleBulletMiss();
        return;
      }
      
      requestAnimationFrame(animate);
    };
    
    requestAnimationFrame(animate);
  }

  createBulletTrail(startX, startY) {
    const trail = document.createElement('div');
    trail.className = 'bullet-trail';
    trail.style.left = `${startX + this.bulletSize / 2}px`;
    trail.style.top = `${startY + this.bulletSize / 2}px`;
    this.gameArea.appendChild(trail);
    trail.id = `trail-${Date.now()}`;
    this.bullet.dataset.trailId = trail.id;
  }

  checkBulletCollisions() {
    if (!this.bullet) return;
    
    const bulletRect = this.bullet.getBoundingClientRect();
    const bulletCenterX = bulletRect.left + bulletRect.width / 2;
    const bulletCenterY = bulletRect.top + bulletRect.height / 2;
    
    for (let i = this.cards.length - 1; i >= 0; i--) {
      const card = this.cards[i];
      const cardRect = card.getBoundingClientRect();
      
      if (bulletCenterX >= cardRect.left && bulletCenterX <= cardRect.right &&
          bulletCenterY >= cardRect.top && bulletCenterY <= cardRect.bottom) {
        const bulletNum = parseInt(this.bullet.dataset.number);
        const cardNum = parseInt(card.dataset.number);
        
        if (bulletNum + cardNum === 10) {
          this.handleElimination(card, i);
        } else {
          this.handleBulletMiss();
        }
        return;
      }
    }
  }

  isColliding(r1, r2) {
    return !(r1.right < r2.left || r1.left > r2.right || 
             r1.bottom < r2.top || r1.top > r2.bottom);
  }

  handleElimination(card, index) {
    const cardNum = parseInt(card.dataset.number);
    const bulletRect = this.bullet.getBoundingClientRect();
    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const x = bulletRect.left + bulletRect.width / 2 - gameAreaRect.left;
    const y = bulletRect.top + bulletRect.height / 2 - gameAreaRect.top;
    
    this.createEnhancedExplosion(x, y);
    
    this.renderer.removeElement(this.bullet);
    this.renderer.removeElement(card);
    
    this.cards.splice(index, 1);
    this.bullet = null;
    
    this.combo++;
    const comboScore = this.combo * 5;
    const totalScore = 10 + comboScore;
    this.score += totalScore;
    
    const popup = this.renderer.createScorePopup(totalScore, x, y);
    this.gameArea.appendChild(popup);
    
    this.audio.playHit();
    if (this.combo >= 2) {
      this.audio.playCombo();
    }
    
    this.applyComboEffects();
    this.checkDifficultyIncrease();
    
    if (this.combo > 0) {
      this.resetComboTimer();
    }
    
    if (this.cards.length === 0) {
      this.end(true);
      return;
    }
    
    this.updateUI();
    this.updateBulletNumber();
    this.canShoot = true;
    
    setTimeout(() => {
      this.gameArea.querySelectorAll('.explosion, .explosion-ring, .explosion-particles, .score-popup').forEach(el => el.remove());
    }, 600);
  }

  createEnhancedExplosion(x, y) {
    const explosion = this.renderer.createExplosion(x, y);
    this.gameArea.appendChild(explosion);
    
    const ring = document.createElement('div');
    ring.className = 'explosion-ring';
    ring.style.width = `${this.cardSize}px`;
    ring.style.height = `${this.cardSize}px`;
    ring.style.left = `${x - this.cardSize / 2}px`;
    ring.style.top = `${y - this.cardSize / 2}px`;
    this.gameArea.appendChild(ring);
    
    const particles = document.createElement('div');
    particles.className = 'explosion-particles';
    particles.style.left = `${x}px`;
    particles.style.top = `${y}px`;
    
    const colors = ['#FDCB6E', '#00B894', '#0984E3', '#D63031', '#6C5CE7'];
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement('div');
      particle.className = 'explosion-particle';
      const angle = (i / 8) * Math.PI * 2;
      const distance = 30 + Math.random() * 20;
      particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
      particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      this.gameArea.appendChild(particle);
    }
  }

  applyComboEffects() {
    const comboDisplay = document.getElementById('combo-display');
    const gameContainer = document.getElementById('game-container');
    
    comboDisplay.classList.remove('combo-text-glow', 'combo-pulse');
    void comboDisplay.offsetWidth;
    comboDisplay.classList.add('combo-text-glow');
    
    if (this.combo >= 2) {
      this.createComboTextEffect(this.combo);
    }
    
    if (this.combo >= 3 && this.combo < 6) {
      gameContainer.classList.add('combo-glow');
      gameContainer.classList.add('screen-flash');
    } else if (this.combo >= 6) {
      gameContainer.classList.add('combo-glow-strong');
      gameContainer.classList.add('screen-flash');
    }

    setTimeout(() => {
      gameContainer.classList.remove('screen-flash');
    }, 300);
  }

  createComboTextEffect(combo) {
    const comboText = document.createElement('div');
    comboText.className = 'combo-text-effect';
    comboText.textContent = combo + ' COMBO!';
    this.gameArea.appendChild(comboText);
    
    setTimeout(() => comboText.remove(), 800);
  }

  resetComboEffects() {
    const gameContainer = document.getElementById('game-container');
    gameContainer.classList.remove('combo-glow', 'combo-glow-strong');
  }

  handleBulletMiss() {
    if (!this.bullet) return;
    
    const bulletRect = this.bullet.getBoundingClientRect();
    const gameAreaRect = this.gameArea.getBoundingClientRect();
    const x = bulletRect.left + bulletRect.width / 2 - gameAreaRect.left;
    const y = bulletRect.top + bulletRect.height / 2 - gameAreaRect.top;
    
    const currentNum = parseInt(this.bullet.dataset.number);
    this.renderer.removeElement(this.bullet);
    
    const pos = this.getValidCardPosition();
    if (pos) {
      const card = this.renderer.createCard(currentNum, pos.x, pos.y);
      this.gameArea.appendChild(card);
      this.cards.push(card);
    }
    
    this.bullet = null;
    this.lives--;
    this.combo = 0;
    
    this.audio.playMiss();
    
    this.updateUI();
    
    if (this.lives <= 0) {
      this.end(false);
      return;
    }
    
    this.updateBulletNumber();
    this.canShoot = true;
  }

  discardBullet() {
    if (this.state !== 'playing') return;
    
    this.updateBulletNumber();
    this.audio.playButtonClick();
  }

  updateBulletNumber() {
    this.bulletNumber = randomCardNumber();
    this.turretBullet.textContent = this.bulletNumber;
    this.turretBullet.dataset.number = this.bulletNumber;
  }

  checkDifficultyIncrease() {
    const interval = Math.floor(this.score / 100);
    if (interval > 0) {
      this.spawnInterval = Math.max(this.minSpawnInterval, 2000 - interval * 150);
      this.maxCards = Math.min(6, 4 + interval);
      this.startCardSpawning();
    }
  }

  resetComboTimer() {
    if (this.comboTimer) clearTimeout(this.comboTimer);
    this.comboTimer = setTimeout(() => {
      this.combo = 0;
      this.resetComboEffects();
      this.updateUI();
    }, 3000);
  }

  startTimers() {
    this.timerInterval = setInterval(() => {
      if (this.state === 'playing') {
        this.timeRemaining--;
        this.updateUI();
        
        if (this.timeRemaining <= 0) {
          this.end(false);
        }
      }
    }, 1000);
  }

  pause() {
    if (this.state !== 'playing') return;
    
    this.state = 'paused';
    this.audio.playPause();
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.comboTimer) clearTimeout(this.comboTimer);
    
    if (this.bullet) {
      const computed = window.getComputedStyle(this.bullet);
      this.bullet.dataset.pausedTop = this.bullet.style.top;
    }
    
    this.showScreen('pause-screen');
  }

  resume() {
    if (this.state !== 'paused') return;
    
    this.state = 'playing';
    this.audio.playPause();
    
    this.startTimers();
    this.startCardSpawning();
    
    if (this.combo > 0) {
      this.resetComboTimer();
    }
    
    this.hideScreen('pause-screen');
  }

  restart() {
    this.hideScreen('end-screen');
    this.startGame();
  }

  end(won) {
    this.state = 'ended';
    
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.comboTimer) clearTimeout(this.comboTimer);
    
    if (this.bullet) {
      this.renderer.removeElement(this.bullet);
      this.bullet = null;
    }
    
    if (won) {
      this.audio.playGameWin();
      this.showConfetti();
    } else {
      this.audio.playGameLose();
      this.container.classList.add('shake');
      setTimeout(() => this.container.classList.remove('shake'), 500);
    }
    
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveToStorage('decaStrike_highscore', this.highScore);
    }
    
    this.saveScore();
    
    document.getElementById('end-title').textContent = won ? '胜利!' : '游戏结束';
    document.getElementById('end-title').className = won ? 'win' : 'lose';
    document.getElementById('final-score-value').textContent = this.score;
    document.getElementById('result-highscore-value').textContent = this.highScore;
    
    this.showScreen('end-screen');
  }

  showConfetti() {
    const colors = ['#6C5CE7', '#A29BFE', '#FDCB6E', '#00B894', '#0984E3', '#D63031'];
    for (let i = 0; i < 50; i++) {
      setTimeout(() => {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${1.5 + Math.random()}s`;
        this.gameArea.appendChild(confetti);
        
        setTimeout(() => this.renderer.removeElement(confetti), 2000);
      }, i * 50);
    }
  }

  saveScore() {
    const leaderboard = loadFromStorage('decaStrike_leaderboard', { scores: [] });
    leaderboard.scores.push({
      score: this.score,
      date: new Date().toISOString().split('T')[0],
      difficulty: this.difficulty
    });
    leaderboard.scores.sort((a, b) => b.score - a.score);
    leaderboard.scores = leaderboard.scores.slice(0, 5);
    saveToStorage('decaStrike_leaderboard', leaderboard);
  }

  gameLoop() {
    if (this.state !== 'playing') return;
    
    if (this.bullet) {
      this.checkBulletCollisions();
    }
    
    this.animationId = requestAnimationFrame(() => this.gameLoop());
  }

  updateUI() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('lives').textContent = this.lives;
    document.getElementById('combo').textContent = this.combo;
    document.getElementById('highscore').textContent = this.highScore;
    document.getElementById('timer').textContent = this.timeRemaining;
    
    const timerEl = document.getElementById('timer-display');
    timerEl.classList.remove('warning', 'critical');
    if (this.timeRemaining <= 30) {
      timerEl.classList.add('critical');
    } else if (this.timeRemaining <= 60) {
      timerEl.classList.add('warning');
    }
  }

  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
  }

  hideScreen(screenId) {
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.remove('active');
  }

  showMenu() {
    this.state = 'menu';
    if (this.timerInterval) clearInterval(this.timerInterval);
    if (this.spawnTimer) clearInterval(this.spawnTimer);
    if (this.comboTimer) clearTimeout(this.comboTimer);
    if (this.animationId) cancelAnimationFrame(this.animationId);
    
    this.gameArea.innerHTML = '';
    this.cards = [];
    this.bullet = null;
    
    this.adjustContainerSize();
    document.body.classList.remove('game-screen-active');
    
    this.showScreen('start-screen');
  }

  showLeaderboard() {
    this.audio.playButtonClick();
    const leaderboard = loadFromStorage('decaStrike_leaderboard', { scores: [] });
    const list = document.getElementById('leaderboard-list');
    list.innerHTML = '';
    
    if (leaderboard.scores.length === 0) {
      list.innerHTML = '<li class="leaderboard-item"><span class="leaderboard-empty">暂无记录</span></li>';
    } else {
      leaderboard.scores.forEach((entry, i) => {
        const li = document.createElement('li');
        li.className = 'leaderboard-item';
        li.innerHTML = `
          <span class="leaderboard-rank">第${i + 1}名</span>
          <span class="leaderboard-score">${entry.score}分</span>
          <span class="leaderboard-date">${entry.date}</span>
        `;
        list.appendChild(li);
      });
    }
    
    this.showScreen('leaderboard-screen');
  }

  hideLeaderboard() {
    this.audio.playButtonClick();
    this.hideScreen('leaderboard-screen');
    this.showScreen('start-screen');
  }

  clearLeaderboard() {
    this.audio.playButtonClick();
    saveToStorage('decaStrike_leaderboard', { scores: [] });
    this.showLeaderboard();
  }

  showHelp() {
    this.audio.playButtonClick();
    this.showScreen('help-screen');
  }

  hideHelp() {
    this.audio.playButtonClick();
    this.hideScreen('help-screen');
    this.showScreen('start-screen');
  }

  toggleMute() {
    this.audio.init();
    const muted = this.audio.toggleMute();
    document.getElementById('mute-btn').textContent = muted ? '🔇' : '🔊';
  }
}