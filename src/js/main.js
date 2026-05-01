import { LevelManager } from './game/LevelManager.js';
import { GameController } from './game/GameController.js';
import { getItemById, rotateItem } from './core/Item.js';
import { soundManager } from './core/SoundManager.js';

class Game {
  constructor() {
    this.levelManager = new LevelManager();
    this.game = new GameController(this.levelManager);
    this.currentScreen = 'start';
    this.currentChapter = 0;

    this.init();
  }

  init() {
    this.bindEvents();
    this.setupGameCallbacks();
    this.showScreen('start');
    this.initSound();
  }

  initSound() {
    document.addEventListener('click', () => soundManager.init(), { once: true });
    document.addEventListener('keydown', () => soundManager.init(), { once: true });
  }

  bindEvents() {
    document.getElementById('start-btn').addEventListener('click', () => { this.showScreen('level'); soundManager.playClick(); });
    document.getElementById('help-btn').addEventListener('click', () => { this.showScreen('help'); soundManager.playClick(); });
    document.getElementById('settings-btn').addEventListener('click', () => { this.showScreen('settings'); soundManager.playClick(); });
    document.getElementById('rank-btn').addEventListener('click', () => { this.showScreen('rank'); soundManager.playClick(); });
    document.getElementById('back-to-start').addEventListener('click', () => this.showScreen('start'));
    document.getElementById('back-to-level').addEventListener('click', () => this.showScreen('level'));
    document.getElementById('back-from-help').addEventListener('click', () => this.showScreen('start'));
    document.getElementById('back-from-settings').addEventListener('click', () => this.showScreen('start'));
    document.getElementById('back-from-rank').addEventListener('click', () => this.showScreen('start'));
    document.getElementById('back-to-level-result').addEventListener('click', () => this.showScreen('level'));
    document.getElementById('restart-btn').addEventListener('click', () => this.restartLevel());
    document.getElementById('next-level-btn').addEventListener('click', () => this.goToNextLevel());
    document.getElementById('retry-btn').addEventListener('click', () => this.restartLevel());
    document.getElementById('rotate-btn').addEventListener('click', () => this.rotateSelectedItem());
    document.getElementById('clear-progress-btn').addEventListener('click', () => this.clearProgress());

    document.getElementById('sound-toggle').addEventListener('change', (e) => soundManager.updateSetting('sound', e.target.checked));
    document.getElementById('music-toggle').addEventListener('change', (e) => soundManager.updateSetting('music', e.target.checked));
    document.getElementById('hint-toggle').addEventListener('change', (e) => soundManager.updateSetting('hint', e.target.checked));

    document.querySelectorAll('.chapter-tab').forEach(tab => {
      tab.addEventListener('click', (e) => this.switchChapter(parseInt(e.target.dataset.chapter)));
    });
  }

  setupGameCallbacks() {
    let lastTickSecond = -1;

    this.game.onTick = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      document.getElementById('timer').textContent = `⏱${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      document.getElementById('score-display').textContent = `⭐${this.game.getPlacedScore()}`;
      document.getElementById('empty-cells').textContent = `剩余空位: ${this.game.getEmptyCells()}`;

      if (seconds !== lastTickSecond) {
        lastTickSecond = seconds;
        if (time <= 10) {
          soundManager.playTick();
        }
      }
    };

    this.game.onComplete = (result) => {
      setTimeout(() => this.showResult(result, true), 500);
    };

    this.game.onFail = () => {
      setTimeout(() => this.showResult({ stars: 0, score: 0, efficiency: 0, timeUsed: 0, timeLeft: 0 }, false), 500);
    };
  }

  showScreen(screen) {
    if (this.currentScreen === 'game' && screen !== 'game') {
      this.game.cleanup();
    }

    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${screen}-screen`).classList.remove('hidden');
    this.currentScreen = screen;

    if (screen === 'level') {
      this.renderLevelGrid();
    }

    if (screen === 'settings') {
      document.getElementById('sound-toggle').checked = soundManager.getSetting('sound');
      document.getElementById('music-toggle').checked = soundManager.getSetting('music');
      document.getElementById('hint-toggle').checked = soundManager.getSetting('hint');
    }

    if (screen === 'rank') {
      this.renderRank();
    }
  }

  renderLevelGrid() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';

    const levels = this.levelManager.getChapterLevels(this.currentChapter);
    const startId = this.currentChapter * 6 + 1;

    document.getElementById('chapter-title').textContent = `春游打包 / 第${startId}-${startId + 5} 关`;

    levels.forEach(level => {
      const btn = document.createElement('button');
      btn.className = 'level-btn';
      btn.dataset.level = level.id;

      if (!this.levelManager.isUnlocked(level.id)) {
        btn.classList.add('locked');
        btn.innerHTML = `<span>${level.id}</span><span class="stars">🔒</span>`;
      } else {
        const stars = this.levelManager.getStars(level.id);
        btn.innerHTML = `<span>${level.id}</span><span class="stars">${'⭐'.repeat(stars)}</span>`;
      }

      btn.addEventListener('click', () => this.startGame(level.id));
      grid.appendChild(btn);
    });

    document.querySelectorAll('.chapter-tab').forEach(tab => {
      tab.classList.toggle('active', parseInt(tab.dataset.chapter) === this.currentChapter);
    });
  }

  switchChapter(chapter) {
    this.currentChapter = chapter;
    this.renderLevelGrid();
  }

  startGame(levelId) {
    if (!this.game.startLevel(levelId)) {
      return;
    }

    this.showScreen('game');
    this.renderGame();
  }

  renderGame() {
    const level = this.game.currentLevel;
    document.getElementById('level-title').textContent = `Level ${level.id}`;
    document.getElementById('timer').textContent = `⏱${Math.floor(level.timeLimit / 60).toString().padStart(2, '0')}:${(level.timeLimit % 60).toString().padStart(2, '0')}`;
    document.getElementById('score-display').textContent = `⭐0`;
    document.getElementById('empty-cells').textContent = `剩余空位: ${this.game.getEmptyCells()}`;

    this.renderInventory();
    this.renderGrid();
  }

  renderInventory() {
    const container = document.getElementById('inventory');
    container.innerHTML = '';

    this.game.inventory.forEach(item => {
      const el = document.createElement('div');
      el.className = 'inventory-item';
      el.dataset.id = item.id;

      const shapePreview = this.createShapePreview(item, 8);
      
      const props = [];
      if (item.noover) props.push('<span class="prop-tag prop-noover" title="不可压">🔴</span>');
      if (item.noexposed) props.push('<span class="prop-tag prop-noexposed" title="不可外露">🟣</span>');
      if (item.edge) props.push('<span class="prop-tag prop-edge" title="侧边袋">🟡</span>');
      if (!item.rotatable) props.push('<span class="prop-tag prop-norotate" title="不可旋转">🔵</span>');

      el.innerHTML = `
        <span class="emoji">${item.emoji}</span>
        <span class="name">${item.name}</span>
        <span class="item-score">${item.score}分</span>
        ${props.length > 0 ? `<div class="prop-tags">${props.join('')}</div>` : ''}
        <div class="shape-preview">${shapePreview}</div>
      `;

      if (item.noover) el.classList.add('item-noover');
      if (item.noexposed) el.classList.add('item-noexposed');
      if (item.edge) el.classList.add('item-edge');
      if (!item.rotatable) el.classList.add('item-norotate');

      el.addEventListener('click', () => this.selectItem(item.id));

      if (this.game.selectedItem && this.game.selectedItem.id === item.id) {
        el.classList.add('selected');
      }

      container.appendChild(el);
    });
  }

  createShapePreview(item, cellSize = 8) {
    const preview = document.createElement('div');
    preview.className = 'mini-preview';
    preview.style.gridTemplateColumns = `repeat(${item.width}, ${cellSize}px)`;
    preview.style.gridTemplateRows = `repeat(${item.height}, ${cellSize}px)`;

    for (let y = 0; y < item.height; y++) {
      for (let x = 0; x < item.width; x++) {
        const cell = document.createElement('div');
        cell.className = 'mini-cell' + (item.shape[y]?.[x] ? '' : ' empty');
        preview.appendChild(cell);
      }
    }
    return preview.outerHTML;
  }

  renderGrid() {
    const container = document.getElementById('grid-container');
    container.innerHTML = '';

    const grid = this.game.grid;
    const cols = grid.width;
    const rows = grid.height;
    const leftSize = grid.leftPocketSize;
    const rightSize = grid.rightPocketSize;

    const stage = document.getElementById('stage');
    const stageRect = stage.getBoundingClientRect();
    const availableWidth = stageRect.width - 60;
    const availableHeight = stageRect.height - 60;

    const cellSizeW = Math.floor(availableWidth / (cols + leftSize + rightSize));
    const cellSizeH = Math.floor(availableHeight / Math.max(rows, Math.max(leftSize, rightSize)));
    const mainCellSize = Math.min(cellSizeW, cellSizeH, 50);
    const mainCellSizePx = `${mainCellSize}px`;

    container.style.display = 'grid';
    container.style.gridTemplateColumns = `auto auto auto`;
    container.style.gridTemplateRows = `auto`;
    container.style.alignItems = 'end';
    container.style.gap = '0';

if (leftSize > 0) {
      const leftPocket = document.createElement('div');
      leftPocket.className = 'side-pocket left';
      leftPocket.style.alignSelf = 'end';
      leftPocket.style.width = `${mainCellSize * 0.9}px`;
      leftPocket.style.height = `${mainCellSize * rows}px`;

      const leftPlaced = grid.placedItems.find(p => {
        const pos = grid.getXYFromIndex(p.cells[0]);
        return pos.x < 0;
      });
      if (leftPlaced) {
        leftPocket.textContent = leftPlaced.item.emoji;
        leftPocket.style.fontSize = `${mainCellSize * 0.7}px`;
      }

      leftPocket.addEventListener('click', () => this.onGridCellClick(-1, 0));
      leftPocket.addEventListener('mouseenter', (e) => this.onGridCellHover(-1, 0, e));
      leftPocket.addEventListener('mouseleave', () => this.clearGridHighlight());

      container.appendChild(leftPocket);
    }

    const mainGrid = document.createElement('div');
    mainGrid.className = 'bag-body';
    mainGrid.style.gridTemplateColumns = `repeat(${cols}, ${mainCellSizePx})`;
    mainGrid.style.gridTemplateRows = `repeat(${rows}, ${mainCellSizePx})`;
    mainGrid.style.gap = '2px';

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.style.width = mainCellSizePx;
        cell.style.height = mainCellSizePx;
        cell.dataset.x = x;
        cell.dataset.y = y;

        const item = grid.getItemAt(x, y);
        if (item) {
          cell.textContent = item.emoji;
          cell.classList.add('placed');
          cell.style.fontSize = `${mainCellSize * 0.6}px`;
        }

        cell.addEventListener('click', () => this.onGridCellClick(x, y));
        cell.addEventListener('mouseenter', (e) => this.onGridCellHover(x, y, e));
        cell.addEventListener('mouseleave', () => this.clearGridHighlight());

        mainGrid.appendChild(cell);
      }
    }

    container.appendChild(mainGrid);

if (rightSize > 0) {
      const rightPocket = document.createElement('div');
      rightPocket.className = 'side-pocket right';
      rightPocket.style.alignSelf = 'end';
      rightPocket.style.width = `${mainCellSize * 0.9}px`;
      rightPocket.style.height = `${mainCellSize * rows}px`;

      const rightPlaced = grid.placedItems.find(p => {
        const pos = grid.getXYFromIndex(p.cells[0]);
        return pos.x >= grid.width;
      });
      if (rightPlaced) {
        rightPocket.textContent = rightPlaced.item.emoji;
        rightPocket.style.fontSize = `${mainCellSize * 0.7}px`;
      }

      rightPocket.addEventListener('click', () => this.onGridCellClick(grid.width, 0));
      rightPocket.addEventListener('mouseenter', (e) => this.onGridCellHover(grid.width, 0, e));
      rightPocket.addEventListener('mouseleave', () => this.clearGridHighlight());

      container.appendChild(rightPocket);
    }

    this.renderSelectedItem(mainCellSize);
  }

  renderSelectedItem(cellSize = 0) {
    const display = document.getElementById('selected-item-display');
    const rotateBtn = document.getElementById('rotate-btn');
    const propsEl = document.getElementById('item-props');

    if (!this.game.selectedItem) {
      display.innerHTML = '';
      rotateBtn.style.display = 'none';
      propsEl.innerHTML = '';
      return;
    }

    const rotated = this.game.getCurrentRotatedItem();
    const preview = document.createElement('div');
    preview.className = 'preview-item';
    const cellPreviewSize = cellSize > 0 ? Math.max(15, cellSize * 0.3) : 20;
    preview.style.gridTemplateColumns = `repeat(${rotated.width}, ${cellPreviewSize}px)`;
    preview.style.gridTemplateRows = `repeat(${rotated.height}, ${cellPreviewSize}px)`;

    for (let y = 0; y < rotated.height; y++) {
      for (let x = 0; x < rotated.width; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell' + (rotated.shape[y]?.[x] ? '' : ' empty');
        preview.appendChild(cell);
      }
    }

    display.innerHTML = '';
    display.appendChild(preview);

    const scoreEl = document.createElement('div');
    scoreEl.className = 'selected-score';
    scoreEl.textContent = `分值: ${rotated.score}`;
    display.appendChild(scoreEl);

    rotateBtn.style.display = rotated.rotatable ? 'block' : 'none';

    let propsHtml = '<div class="props-detail">';
    propsHtml += `<div class="props-title">属性详情</div>`;
    propsHtml += '<div class="props-list">';
    
    if (rotated.noover) {
      propsHtml += `<div class="props-item prop-noover">
        <span class="prop-icon">🔴</span>
        <span class="prop-label">不可压</span>
        <span class="prop-desc">必须放最上层</span>
      </div>`;
    }
    if (rotated.noexposed) {
      propsHtml += `<div class="props-item prop-noexposed">
        <span class="prop-icon">🟣</span>
        <span class="prop-label">不可外露</span>
        <span class="prop-desc">需要物品覆盖</span>
      </div>`;
    }
    if (rotated.edge) {
      propsHtml += `<div class="props-item prop-edge">
        <span class="prop-icon">🟡</span>
        <span class="prop-label">需放侧边</span>
        <span class="prop-desc">必须放侧边袋</span>
      </div>`;
    }
    if (!rotated.rotatable) {
      propsHtml += `<div class="props-item prop-norotate">
        <span class="prop-icon">🔵</span>
        <span class="prop-label">不可旋转</span>
        <span class="prop-desc">不能改变方向</span>
      </div>`;
    }
    
    if (!rotated.noover && !rotated.noexposed && !rotated.edge && rotated.rotatable) {
      propsHtml += `<div class="props-item prop-normal">
        <span class="prop-icon">✅</span>
        <span class="prop-label">普通物品</span>
        <span class="prop-desc">无特殊限制</span>
      </div>`;
    }
    
    propsHtml += '</div></div>';
    propsEl.innerHTML = propsHtml;
  }

  selectItem(itemId) {
    if (this.game.selectedItem && this.game.selectedItem.id === itemId) {
      this.game.deselectItem();
    } else {
      this.game.selectItem(itemId);
    }
    this.renderInventory();
    this.renderSelectedItem();
    soundManager.playClick();
  }

  rotateSelectedItem() {
    const rotation = this.game.rotateCurrentItem();
    if (rotation !== null) {
      this.renderSelectedItem();
      soundManager.playClick();
    }
  }

  onGridCellClick(x, y) {
    if (this.game.selectedItem) {
      const result = this.game.placeItem(x, y);

      if (result.valid) {
        this.renderGame();
        soundManager.playPlace();
      } else if (result.errors && result.errors.length > 0) {
        this.showToast(result.errors[0]);
        this.flashError(x, y);
        soundManager.playError();
      }
    } else {
      if (this.game.removeItem(x, y)) {
        this.renderGame();
        soundManager.playClick();
      }
    }
  }

  onGridCellHover(x, y, e) {
    if (!this.game.selectedItem) return;

    const rotated = this.game.getCurrentRotatedItem();

    this.clearGridHighlight();

    for (let dy = 0; dy < rotated.height; dy++) {
      for (let dx = 0; dx < rotated.width; dx++) {
        if (rotated.shape[dy]?.[dx]) {
          const targetX = x + dx;
          const targetY = y + dy;

          const cells = document.querySelectorAll(`.grid-cell[data-x="${targetX}"][data-y="${targetY}"]`);
          cells.forEach(cell => {
            cell.classList.add('highlight');
          });
        }
      }
    }

    if (x < 0) {
      document.querySelector('.side-pocket.left')?.classList.add('highlight');
    } else if (x >= this.game.grid.width) {
      document.querySelector('.side-pocket.right')?.classList.add('highlight');
    }
  }

  clearGridHighlight() {
    document.querySelectorAll('.grid-cell.highlight, .side-pocket.highlight').forEach(cell => {
      cell.classList.remove('highlight');
    });
  }

  flashError(x, y) {
    const cells = document.querySelectorAll(`.grid-cell[data-x="${x}"][data-y="${y}"]`);
    cells.forEach(cell => {
      cell.classList.add('error');
      setTimeout(() => cell.classList.remove('error'), 300);
    });
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2000);
  }

  showResult(result, success) {
    this.showScreen('result');

    const title = document.getElementById('result-title');
    title.textContent = success ? '🎉 闯关成功! 🎉' : '⏰ 时间到了！';

    const starsEl = document.getElementById('stars');
    starsEl.textContent = success ? '⭐'.repeat(result.stars) : '';

    document.getElementById('final-score').textContent = `${result.score} 分`;
    document.getElementById('time-used').textContent = `用时: ${result.timeUsed}秒`;
    document.getElementById('efficiency').textContent = `效率: ${result.efficiency}%`;

    const nextBtn = document.getElementById('next-level-btn');
    nextBtn.style.display = success && this.game.currentLevel.id < 22 ? 'block' : 'none';

    if (success) {
      this.levelManager.completeLevel(this.game.currentLevel.id, result.stars, result.score);
      soundManager.playSuccess();
    } else {
      soundManager.playError();
    }
  }

  restartLevel() {
    if (this.game.currentLevel) {
      this.game.restart();
      this.showScreen('game');
      this.renderGame();
    }
  }

  goToNextLevel() {
    const nextId = this.game.currentLevel.id + 1;
    if (this.levelManager.getLevel(nextId)) {
      this.startGame(nextId);
    }
  }

  clearProgress() {
    if (confirm('确定要清除所有进度吗？')) {
      this.levelManager.clearProgress();
      this.showToast('进度已清除');
    }
  }

  renderRank() {
    const totalStars = Object.values(this.levelManager.progress.stars).reduce((sum, s) => sum + s, 0);
    const totalScore = this.levelManager.getTotalScore();
    const completedLevels = this.levelManager.getCompletedCount();

    document.getElementById('total-stars').textContent = totalStars;
    document.getElementById('total-score').textContent = totalScore;
    document.getElementById('completed-levels').textContent = completedLevels;

    const rankList = document.getElementById('rank-list');
    rankList.innerHTML = '';

    const levels = [];
    for (let i = 1; i <= 22; i++) {
      const stars = this.levelManager.getStars(i);
      const score = this.levelManager.getScore(i);
      if (score > 0) {
        levels.push({ id: i, stars, score });
      }
    }

    if (levels.length === 0) {
      rankList.innerHTML = '<div class="rank-empty">暂无记录，快去闯关吧！</div>';
      return;
    }

    levels.sort((a, b) => b.score - a.score);

    levels.forEach((level, index) => {
      const item = document.createElement('div');
      item.className = 'rank-item';
      item.innerHTML = `
        <span class="rank-num">${index + 1}</span>
        <span class="rank-level">第 ${level.id} 关</span>
        <span class="rank-stars">${'⭐'.repeat(level.stars)}</span>
        <span class="rank-score">${level.score} 分</span>
      `;
      rankList.appendChild(item);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Game();
});