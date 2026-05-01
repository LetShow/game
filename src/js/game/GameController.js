import { Grid } from '../core/Grid.js';
import { Validator } from '../core/Validator.js';
import { getItemById } from '../core/Item.js';

export class GameController {
  constructor(levelManager) {
    this.levelManager = levelManager;
    this.currentLevel = null;
    this.grid = null;
    this.validator = null;
    this.inventory = [];
    this.selectedItem = null;
    this.selectedItemIndex = -1;
    this.rotation = 0;
    this.score = 0;
    this.timeRemaining = 0;
    this.timerInterval = null;
    this.onTick = null;
    this.onComplete = null;
    this.onFail = null;
  }

  startLevel(levelId) {
    this.currentLevel = this.levelManager.getLevel(levelId);
    if (!this.currentLevel) {
      return false;
    }

    this.grid = new Grid(
      this.currentLevel.gridWidth,
      this.currentLevel.gridHeight,
      this.currentLevel.leftPocket || 0,
      this.currentLevel.rightPocket || 0
    );
    this.validator = new Validator(this.grid);
    
    this.inventory = this.currentLevel.items.map(id => getItemById(id));
    this.selectedItem = null;
    this.selectedItemIndex = -1;
    this.rotation = 0;
    this.score = 0;
    this.timeRemaining = this.currentLevel.timeLimit;
    
    this.startTimer();
    
    return true;
  }

  startTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      
      if (this.onTick) {
        this.onTick(this.timeRemaining);
      }
      
      if (this.timeRemaining <= 0) {
        this.stopTimer();
        if (this.onFail) {
          this.onFail();
        }
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  selectItem(itemId) {
    const idx = this.inventory.findIndex(i => i.id === itemId);
    if (idx !== -1) {
      this.selectedItem = this.inventory[idx];
      this.selectedItemIndex = idx;
      this.rotation = 0;
    }
  }

  deselectItem() {
    this.selectedItem = null;
    this.selectedItemIndex = -1;
    this.rotation = 0;
  }

  rotateCurrentItem() {
    if (this.selectedItem) {
      this.rotation = (this.rotation + 1) % 4;
      return this.rotation;
    }
    return null;
  }

  getCurrentRotatedItem() {
    if (!this.selectedItem) return null;
    
    let item = { ...this.selectedItem };
    let currentRotation = 0;
    
    while (currentRotation < this.rotation) {
      const shape = item.shape;
      const oldHeight = shape.length;
      const oldWidth = shape[0].length;
      const newWidth = oldHeight;
      const newHeight = oldWidth;
      
      const rotated = [];
      for (let newY = 0; newY < newHeight; newY++) {
        rotated[newY] = [];
        for (let newX = 0; newX < newWidth; newX++) {
          rotated[newY][newX] = shape[oldHeight - 1 - newX][newY];
        }
      }
      
      item = {
        ...item,
        shape: rotated,
        width: newWidth,
        height: newHeight
      };
      currentRotation++;
    }
    
    return item;
  }

  placeItem(x, y) {
    if (!this.selectedItem) {
      return { valid: false, errors: ['请先选择物品'] };
    }

    const rotatedItem = this.getCurrentRotatedItem();
    const validation = this.validator.validatePlacement(rotatedItem, x, y);
    
    if (!validation.valid) {
      return validation;
    }

    if (!this.grid.placeItem(rotatedItem, x, y, 0)) {
      return { valid: false, errors: ['放置失败'] };
    }

    this.scoredItem(rotatedItem);
    if (this.selectedItemIndex !== -1) {
      this.inventory.splice(this.selectedItemIndex, 1);
    }
    this.selectedItem = null;
    this.selectedItemIndex = -1;
    this.rotation = 0;

    if (this.validator.isComplete()) {
      this.stopTimer();
      const result = this.calculateResult();
      if (this.onComplete) {
        this.onComplete(result);
      }
    }

    return { valid: true, errors: [] };
  }

  removeItem(x, y) {
    const removed = this.grid.removeItemAt(x, y);
    if (removed) {
      this.inventory.push({ ...removed.item });
      return true;
    }
    return false;
  }

  scoredItem(item) {
    const baseScore = item.score || 0;
    this.score += baseScore;
  }

  calculateResult() {
    const timeUsed = this.currentLevel.timeLimit - this.timeRemaining;
    const timeLeft = this.timeRemaining;
    const totalCells = this.grid.getTotalMainCells();
    const placedItems = this.grid.placedItems;
    
    let occupiedCells = 0;
    for (const p of placedItems) {
      for (const cell of p.cells) {
        const xy = this.grid.getXYFromIndex(cell);
        if (xy.x >= 0 && xy.x < this.grid.width) {
          occupiedCells++;
        }
      }
    }

    const efficiency = Math.round((occupiedCells / totalCells) * 100);
    const timeSaved = Math.round((timeLeft / this.currentLevel.timeLimit) * 100);
    
    const timeBonus = timeLeft * 2;
    const finalScore = this.score + timeBonus;

    let stars = 1;
    if (efficiency >= 80) {
      stars = 2;
      if (timeSaved >= 20) {
        stars = 3;
      }
    }

    return {
      stars,
      score: finalScore,
      efficiency,
      timeUsed,
      timeLeft
    };
  }

  restart() {
    this.stopTimer();
    if (this.currentLevel) {
      this.startLevel(this.currentLevel.id);
    }
  }

  getEmptyCells() {
    return this.grid.getMainGridEmptyCount();
  }

  getPlacedScore() {
    return this.score;
  }

  cleanup() {
    this.stopTimer();
  }
}