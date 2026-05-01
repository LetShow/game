export class Grid {
  constructor(width, height, leftPocket = 0, rightPocket = 0) {
    this.width = width;
    this.height = height;
    this.leftPocketSize = leftPocket;
    this.rightPocketSize = rightPocket;
    const leftCols = leftPocket > 0 ? 1 : 0;
    const rightCols = rightPocket > 0 ? 1 : 0;
    this.cells = new Array((width + leftCols + rightCols) * height).fill(null);
    this.placedItems = [];
  }

  getTotalMainCells() {
    return this.width * this.height;
  }

  getTotalCells() {
    const leftCols = this.leftPocketSize > 0 ? 1 : 0;
    const rightCols = this.rightPocketSize > 0 ? 1 : 0;
    return (this.width + leftCols + rightCols) * this.height;
  }

  getMainGridIndex(x, y) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) return -1;
    const leftCols = this.leftPocketSize > 0 ? 1 : 0;
    return (y * (this.width + leftCols + (this.rightPocketSize > 0 ? 1 : 0))) + (x + leftCols);
  }

  getLeftPocketIndex(y) {
    if (this.leftPocketSize === 0) return -1;
    if (y < 0) return -1;
    const cols = this.width + 2;
    return y * cols;
  }

  getRightPocketIndex(y) {
    if (this.rightPocketSize === 0) return -1;
    if (y < 0) return -1;
    const cols = this.width + 2;
    const offsetX = 1 + this.width;
    return (y * cols) + offsetX;
  }

  isMainGrid(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  isLeftPocket(y) {
    return this.leftPocketSize > 0 && y >= 0;
  }

  isRightPocket(y) {
    return this.rightPocketSize > 0 && y >= 0;
  }

  isInBounds(x, y) {
    return this.getCellIndex(x, y) !== -1;
  }

  getCellIndex(x, y) {
    if (this.isMainGrid(x, y)) {
      return this.getMainGridIndex(x, y);
    }
    if (x < 0 && this.leftPocketSize > 0) {
      return this.getLeftPocketIndex(y);
    }
    if (x >= this.width && this.rightPocketSize > 0) {
      return this.getRightPocketIndex(y);
    }
    return -1;
  }

  getXYFromIndex(index) {
    const cols = this.width + 2;
    const y = Math.floor(index / cols);
    const x = index % cols;
    const leftOffset = this.leftPocketSize > 0 ? 1 : 0;
    
    if (x < leftOffset && this.leftPocketSize > 0) {
      return { x: -1, y };
    }
    if (x >= leftOffset + this.width && this.rightPocketSize > 0) {
      return { x: this.width, y };
    }
    return { x: x - leftOffset, y };
  }

  canPlace(itemShape, startX, startY) {
    const shape = itemShape;
    const h = shape.length;
    const w = shape[0].length;
    
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (shape[dy][dx] === 1) {
          const absX = startX + dx;
          const absY = startY + dy;
          const cellIndex = this.getCellIndex(absX, absY);
          
          if (cellIndex === -1 || this.cells[cellIndex] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }

  placeItem(item, startX, startY, rotation = 0) {
    let rotatedItem = { ...item };
    for (let i = 0; i < rotation; i++) {
      const shape = rotatedItem.shape;
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
      
      rotatedItem = {
        ...rotatedItem,
        shape: rotated,
        width: newWidth,
        height: newHeight
      };
    }
    
    if (!this.canPlace(rotatedItem.shape, startX, startY)) {
      return false;
    }
    
    const placedCells = [];
    const shape = rotatedItem.shape;
    
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[0].length; dx++) {
        if (shape[dy][dx] === 1) {
          const absX = startX + dx;
          const absY = startY + dy;
          const cellIndex = this.getCellIndex(absX, absY);
          
          if (cellIndex !== -1) {
            this.cells[cellIndex] = rotatedItem.id;
            placedCells.push(cellIndex);
          }
        }
      }
    }
    
    this.placedItems.push({
      item: rotatedItem,
      x: startX,
      y: startY,
      cells: placedCells
    });
    
    return true;
  }

  removeItemAt(x, y) {
    const cellIndex = this.getCellIndex(x, y);
    if (cellIndex === -1 || this.cells[cellIndex] === null) {
      return null;
    }
    
    const itemId = this.cells[cellIndex];
    const placedItem = this.placedItems.find(p => p.cells.includes(cellIndex));
    
    if (placedItem) {
      for (const idx of placedItem.cells) {
        this.cells[idx] = null;
      }
      this.placedItems = this.placedItems.filter(p => p !== placedItem);
      return placedItem;
    }
    
    return null;
  }

  removeItem(itemId) {
    const placedItem = this.placedItems.find(p => p.item.id === itemId);
    
    if (placedItem) {
      for (const idx of placedItem.cells) {
        this.cells[idx] = null;
      }
      this.placedItems = this.placedItems.filter(p => p !== placedItem);
      return placedItem;
    }
    
    return null;
  }

  getOccupiedCells() {
    return this.cells.map((cell, index) => cell !== null ? index : -1).filter(index => index !== -1);
  }

  getEmptyCellsCount() {
    return this.cells.filter(cell => cell === null).length;
  }

  getMainGridEmptyCount() {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getCellIndex(x, y) !== -1 && this.cells[this.getCellIndex(x, y)] === null) {
          count++;
        }
      }
    }
    return count;
  }

  getItemAt(x, y) {
    const cellIndex = this.getCellIndex(x, y);
    if (cellIndex === -1) return null;
    
    const itemId = this.cells[cellIndex];
    if (!itemId) return null;
    
    const placedItem = this.placedItems.find(p => p.cells.includes(cellIndex));
    return placedItem ? placedItem.item : null;
  }

  clear() {
    this.cells.fill(null);
    this.placedItems = [];
  }

  getPlacedItemIds() {
    return this.placedItems.map(p => p.item.id);
  }

  getPlacedItems() {
    return this.placedItems.map(p => ({ ...p.item, placedX: p.x, placedY: p.y }));
  }
}