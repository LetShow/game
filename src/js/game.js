const Items = {
  key: { id: "key", name: "钥匙", emoji: "🔑", shape: [[1]], width: 1, height: 1, noover: false, noexposed: true, edge: false, rotatable: true, score: 12 },
  egg: { id: "egg", name: "鸡蛋", emoji: "🥚", shape: [[1]], width: 1, height: 1, noover: true, noexposed: false, edge: false, rotatable: true, score: 12 },
  candy: { id: "candy", name: "棒棒糖", emoji: "🍭", shape: [[1], [1]], width: 1, height: 2, noover: false, noexposed: false, edge: false, rotatable: true, score: 20 },
  orange: { id: "orange", name: "橙子", emoji: "🍊", shape: [[1, 1]], width: 2, height: 1, noover: true, noexposed: false, edge: false, rotatable: true, score: 22 },
  tissue: { id: "tissue", name: "纸巾", emoji: "🧻", shape: [[1], [1]], width: 1, height: 2, noover: false, noexposed: false, edge: false, rotatable: true, score: 20 },
  milk: { id: "milk", name: "牛奶盒", emoji: "🥛", shape: [[1], [1]], width: 1, height: 2, noover: false, noexposed: false, edge: false, rotatable: false, score: 22 },
  apple: { id: "apple", name: "苹果", emoji: "🍎", shape: [[1, 1], [1, 1]], width: 2, height: 2, noover: false, noexposed: false, edge: false, rotatable: true, score: 40 },
  dried: { id: "dried", name: "蜜饯", emoji: "🍒", shape: [[1, 1], [1, 1]], width: 2, height: 2, noover: true, noexposed: false, edge: false, rotatable: true, score: 42 },
  watch: { id: "watch", name: "手表", emoji: "⌚", shape: [[1, 1]], width: 2, height: 1, noover: false, noexposed: true, edge: false, rotatable: true, score: 22 },
  wallet: { id: "wallet", name: "零钱包", emoji: "👛", shape: [[1, 1]], width: 2, height: 1, noover: false, noexposed: true, edge: false, rotatable: true, score: 22 },
  banana: { id: "banana", name: "香蕉", emoji: "🍌", shape: [[1, 1, 1]], width: 3, height: 1, noover: true, noexposed: false, edge: false, rotatable: true, score: 32 },
  drink: { id: "drink", name: "瓶装饮料", emoji: "🧴", shape: [[1], [1], [1]], width: 1, height: 3, noover: false, noexposed: false, edge: true, rotatable: false, score: 32 },
  chips: { id: "chips", name: "薯片", emoji: "🥠", shape: [[1], [1], [1]], width: 1, height: 3, noover: true, noexposed: false, edge: false, rotatable: true, score: 32 },
  mask: { id: "mask", name: "口罩", emoji: "😷", shape: [[1, 1, 1]], width: 3, height: 1, noover: false, noexposed: false, edge: false, rotatable: true, score: 30 },
  sandwich: { id: "sandwich", name: "三明治", emoji: "🥪", shape: [[1, 1], [1, 1]], width: 2, height: 2, noover: true, noexposed: false, edge: false, rotatable: true, score: 42 },
  bread_1: { id: "bread_1", name: "面包片", emoji: "🍞", shape: [[1, 1], [1, 1]], width: 2, height: 2, noover: true, noexposed: false, edge: false, rotatable: true, score: 42 },
  burger: { id: "burger", name: "汉堡", emoji: "🍔", shape: [[1, 1], [1, 1]], width: 2, height: 2, noover: true, noexposed: false, edge: false, rotatable: true, score: 42 },
  hat: { id: "hat", name: "帽子", emoji: "🧢", shape: [[1, 1], [1, 1]], width: 2, height: 2, noover: false, noexposed: false, edge: false, rotatable: true, score: 40 },
  cup: { id: "cup", name: "水杯", emoji: "🥤", shape: [[1], [1], [1]], width: 1, height: 3, noover: false, noexposed: false, edge: true, rotatable: false, score: 34 },
  phone: { id: "phone", name: "手机", emoji: "📱", shape: [[1, 1], [1, 1], [1, 1]], width: 2, height: 3, noover: false, noexposed: true, edge: false, rotatable: true, score: 62 },
  chicken: { id: "chicken", name: "鸡腿", emoji: "🍗", shape: [[1, 1, 1], [0, 1, 1]], width: 3, height: 2, noover: false, noexposed: false, edge: false, rotatable: true, score: 50 },
  sunglasses: { id: "sunglasses", name: "太阳镜", emoji: "🕶️", shape: [[1, 1, 1], [1, 1, 1]], width: 3, height: 2, noover: true, noexposed: false, edge: false, rotatable: true, score: 62 },
  camera: { id: "camera", name: "相机", emoji: "📷", shape: [[1, 1, 1], [1, 1, 1]], width: 3, height: 2, noover: false, noexposed: true, edge: false, rotatable: true, score: 62 },
  wing: { id: "wing", name: "鸡翅", emoji: "🍖", shape: [[1, 1, 1], [0, 0, 1], [0, 0, 1]], width: 3, height: 3, noover: false, noexposed: false, edge: false, rotatable: true, score: 52 },
  bento: { id: "bento", name: "便当盒", emoji: "🍱", shape: [[1, 1, 1], [1, 1, 1], [1, 1, 1]], width: 3, height: 3, noover: false, noexposed: false, edge: false, rotatable: false, score: 92 },
  umbrella: { id: "umbrella", name: "雨伞", emoji: "☂️", shape: [[1], [1], [1]], width: 1, height: 3, noover: false, noexposed: false, edge: true, rotatable: false, score: 32 },
};

function rotateItem(item) {
  const shape = item.shape;
  const oldHeight = shape.length;
  const oldWidth = shape[0].length;
  const newWidth = oldHeight;
  const newHeight = oldWidth;
  const rotated = [];
  for (let y = 0; y < newHeight; y++) {
    rotated[y] = [];
    for (let x = 0; x < newWidth; x++) {
      rotated[y][x] = shape[oldHeight - 1 - x][y];
    }
  }
  return { ...item, shape: rotated, width: newWidth, height: newHeight };
}

function getItemById(id) {
  return Items[id] ? { ...Items[id] } : null;
}

function getAllItemIds() {
  return Object.keys(Items);
}

class Grid {
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

  getTotalMainCells() { return this.width * this.height; }

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
    return y * (this.width + 2);
  }

  getRightPocketIndex(y) {
    if (this.rightPocketSize === 0) return -1;
    if (y < 0) return -1;
    return y * (this.width + 2) + 1 + this.width;
  }

  isMainGrid(x, y) { return x >= 0 && x < this.width && y >= 0 && y < this.height; }
  isLeftPocket(y) { return this.leftPocketSize > 0 && y >= 0; }
  isRightPocket(y) { return this.rightPocketSize > 0 && y >= 0; }
  isInBounds(x, y) { return this.getCellIndex(x, y) !== -1; }

  getCellIndex(x, y) {
    if (this.isMainGrid(x, y)) return this.getMainGridIndex(x, y);
    if (x < 0 && this.leftPocketSize > 0) return this.getLeftPocketIndex(y);
    if (x >= this.width && this.rightPocketSize > 0) return this.getRightPocketIndex(y);
    return -1;
  }

  getXYFromIndex(index) {
    const cols = this.width + 2;
    const y = Math.floor(index / cols);
    const x = index % cols;
    const leftOffset = this.leftPocketSize > 0 ? 1 : 0;
    if (x < leftOffset && this.leftPocketSize > 0) return { x: -1, y };
    if (x >= leftOffset + this.width && this.rightPocketSize > 0) return { x: this.width, y };
    return { x: x - leftOffset, y };
  }

  canPlace(itemShape, startX, startY) {
    const shape = itemShape;
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[0].length; dx++) {
        if (shape[dy][dx] === 1) {
          const absX = startX + dx;
          const absY = startY + dy;
          const cellIndex = this.getCellIndex(absX, absY);
          if (cellIndex === -1 || this.cells[cellIndex] !== null) return false;
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
      rotatedItem = { ...rotatedItem, shape: rotated, width: newWidth, height: newHeight };
    }
    if (!this.canPlace(rotatedItem.shape, startX, startY)) return false;
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
    this.placedItems.push({ item: rotatedItem, x: startX, y: startY, cells: placedCells });
    return true;
  }

  removeItemAt(x, y) {
    const cellIndex = this.getCellIndex(x, y);
    if (cellIndex === -1 || this.cells[cellIndex] === null) return null;
    const itemId = this.cells[cellIndex];
    const placedItem = this.placedItems.find(p => p.cells.includes(cellIndex));
    if (placedItem) {
      for (const idx of placedItem.cells) this.cells[idx] = null;
      this.placedItems = this.placedItems.filter(p => p !== placedItem);
      return placedItem;
    }
    return null;
  }

  removeItem(itemId) {
    const placedItem = this.placedItems.find(p => p.item.id === itemId);
    if (placedItem) {
      for (const idx of placedItem.cells) this.cells[idx] = null;
      this.placedItems = this.placedItems.filter(p => p !== placedItem);
      return placedItem;
    }
    return null;
  }

  getOccupiedCells() { return this.cells.map((cell, index) => cell !== null ? index : -1).filter(index => index !== -1); }
  getEmptyCellsCount() { return this.cells.filter(cell => cell === null).length; }

  getMainGridEmptyCount() {
    let count = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        if (this.getCellIndex(x, y) !== -1 && this.cells[this.getCellIndex(x, y)] === null) count++;
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

  clear() { this.cells.fill(null); this.placedItems = []; }
  getPlacedItemIds() { return this.placedItems.map(p => p.item.id); }
  getPlacedItems() { return this.placedItems.map(p => ({ ...p.item, placedX: p.x, placedY: p.y })); }
}

class Validator {
  constructor(grid) { this.grid = grid; }

  validatePlacement(item, x, y) {
    const boundsCheck = this.checkBounds(item, x, y);
    if (!boundsCheck.valid) return { valid: false, errors: boundsCheck.errors };
    const overlapCheck = this.checkOverlap(item, x, y);
    if (!overlapCheck.valid) return { valid: false, errors: overlapCheck.errors };
    const edgeCheck = this.checkEdge(item, x, y);
    if (!edgeCheck.valid) return { valid: false, errors: edgeCheck.errors };
    const nooverCheck = this.checkNoover(item, x, y);
    if (!nooverCheck.valid) return { valid: false, errors: nooverCheck.errors };
    const noexposedCheck = this.checkNoexposed(item, x, y);
    if (!noexposedCheck.valid) return { valid: false, errors: noexposedCheck.errors };
    return { valid: true, errors: [], warnings: [] };
  }

  checkBounds(item, x, y) {
    const errors = [];
    const shape = item.shape;
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[0].length; dx++) {
        if (shape[dy][dx] === 1) {
          const absX = x + dx;
          const absY = y + dy;
          if (absX < 0) {
            if (!item.edge) errors.push('这个不能放侧边袋');
            else if (this.grid.leftPocketSize === 0) errors.push('放不下啦！超出左边边界');
          } else if (absX >= this.grid.width) {
            if (!item.edge) errors.push('这个不能放侧边袋');
            else if (this.grid.rightPocketSize === 0) errors.push('放不下啦！超出右边边界');
          } else if (absY < 0 || absY >= this.grid.height) {
            errors.push('放不下啦！超出边界');
          }
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }

  checkOverlap(item, x, y) {
    const errors = [];
    const shape = item.shape;
    for (let dy = 0; dy < shape.length; dy++) {
      for (let dx = 0; dx < shape[0].length; dx++) {
        if (shape[dy][dx] === 1) {
          const absX = x + dx;
          const absY = y + dy;
          const cellIndex = this.grid.getCellIndex(absX, absY);
          if (cellIndex !== -1 && this.grid.cells[cellIndex] !== null) errors.push('这里已经有东西了！');
        }
      }
    }
    return { valid: errors.length === 0, errors };
  }

  checkEdge(item, x, y) {
    if (!item.edge) return { valid: true, errors: [] };
    const inLeftPocket = x < 0 && this.grid.leftPocketSize > 0;
    const inRightPocket = x >= this.grid.width && this.grid.rightPocketSize > 0;
    if (!inLeftPocket && !inRightPocket) return { valid: false, errors: ['这个要靠边放~'] };
    return { valid: true, errors: [] };
  }

  checkNoover(item, x, y) {
    if (!item.noover) return { valid: true, errors: [] };
    if (y > 0) return { valid: false, errors: ['这个容易被压，放最上面吧！'] };
    return { valid: true, errors: [] };
  }

  checkNoexposed(item, x, y) {
    if (!item.noexposed) return { valid: true, errors: [] };
    if (y === 0) return { valid: false, errors: ['这个不能外露，需要有东西盖在上面'] };
    return { valid: true, errors: [] };
  }

  checkAllPlacements() {
    const allErrors = [];
    for (const placed of this.grid.placedItems) {
      const result = this.validatePlacement(placed.item, placed.x, placed.y);
      if (!result.valid) allErrors.push(...result.errors);
    }
    return { valid: allErrors.length === 0, errors: allErrors };
  }

  isComplete() { return this.grid.getMainGridEmptyCount() === 0; }
  canRemoveItemAt(x, y) { return this.grid.getCellIndex(x, y) !== -1 && this.grid.cells[this.grid.getCellIndex(x, y)] !== null; }
}

const STORAGE_KEY_SOUND = 'springtrip_settings';
const DEFAULT_SETTINGS = { sound: true, music: true, hint: true, vibrate: false };

class SoundManager {
  constructor() {
    this.settings = this.loadSettings();
    this.audioCtx = null;
    this.initialized = false;
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SOUND);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch { return { ...DEFAULT_SETTINGS }; }
  }

  saveSettings() {
    try { localStorage.setItem(STORAGE_KEY_SOUND, JSON.stringify(this.settings)); } catch {}
  }

  init() {
    if (this.initialized) {
      if (this.audioCtx && this.audioCtx.state === 'suspended') this.audioCtx.resume();
      return;
    }
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) { console.warn('Web Audio API not supported'); }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.3) {
    if (!this.settings.sound || !this.audioCtx) return;
    try {
      const oscillator = this.audioCtx.createOscillator();
      const gainNode = this.audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(this.audioCtx.destination);
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);
      gainNode.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);
      oscillator.start(this.audioCtx.currentTime);
      oscillator.stop(this.audioCtx.currentTime + duration);
    } catch (e) {}
  }

  playClick() { this.playTone(800, 0.1, 'sine', 0.2); }
  playPlace() { this.playTone(600, 0.15, 'sine', 0.25); setTimeout(() => this.playTone(900, 0.15, 'sine', 0.2), 80); }
  playError() { this.playTone(200, 0.3, 'sawtooth', 0.15); }
  playSuccess() { const notes = [523, 659, 784, 1047]; notes.forEach((freq, i) => { setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.25), i * 150); }); }
  playTick() { this.playTone(1000, 0.05, 'square', 0.1); }
  updateSetting(key, value) { this.settings[key] = value; this.saveSettings(); }
  getSetting(key) { return this.settings[key]; }
  clearSettings() { this.settings = { ...DEFAULT_SETTINGS }; this.saveSettings(); }
}

const soundManager = new SoundManager();

const STORAGE_KEY_LEVEL = "springtrip_level_progress";

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Solutions = [
  { id: 1, items: ["apple", "egg", "candy", "tissue"] },
  { id: 2, items: ["apple", "milk", "egg", "candy", "key", "tissue"] },
  { id: 3, items: ["apple", "apple", "orange", "tissue", "milk", "key", "egg"] },
  { id: 4, items: ["apple", "orange", "banana", "egg", "candy", "key", "wallet"] },
  { id: 5, items: ["apple", "banana", "orange", "chips", "candy", "tissue", "key", "milk", "egg"] },
  { id: 6, items: ["sandwich", "chips", "banana", "drink", "candy", "tissue", "milk", "key", "egg", "mask"] },
  { id: 7, items: ["sandwich", "burger", "apple", "banana", "drink", "candy", "tissue", "milk", "key", "egg"] },
  { id: 8, items: ["sandwich", "burger", "bread_1", "apple", "banana", "drink", "chips", "candy", "camera", "tissue", "key", "egg"] },
  { id: 9, items: ["burger", "sandwich", "hat", "apple", "banana", "drink", "chips", "mask", "tissue", "candy", "milk", "egg"] },
  { id: 10, items: ["hat", "cup", "burger", "phone", "banana", "drink", "chips", "mask", "candy", "tissue", "milk", "key", "egg"] },
  { id: 11, items: ["cup", "drink", "hat", "phone", "sunglasses", "burger", "sandwich", "chips", "mask", "banana", "tissue", "milk", "key", "egg"] },
  { id: 12, items: ["phone", "camera", "cup", "drink", "hat", "burger", "sandwich", "chips", "mask", "banana", "tissue", "apple", "orange", "candy", "egg"] },
  { id: 13, items: ["chicken", "sunglasses", "phone", "camera", "cup", "drink", "hat", "burger", "sandwich", "chips", "mask", "banana", "tissue", "milk", "apple", "egg"] },
  { id: 14, items: ["sunglasses", "chicken", "wing", "phone", "camera", "cup", "drink", "hat", "burger", "sandwich", "chips", "mask", "banana", "tissue", "milk", "key", "egg"] },
  { id: 15, items: ["camera", "bento", "sunglasses", "chicken", "wing", "phone", "cup", "drink", "hat", "burger", "sandwich", "mask", "banana", "tissue", "milk", "apple", "egg", "orange"] },
  { id: 16, items: ["wing", "bento", "chicken", "camera", "sunglasses", "phone", "cup", "drink", "hat", "burger", "sandwich", "mask", "banana", "tissue", "milk", "apple", "orange", "key", "egg"] },
  { id: 17, items: ["bento", "wing", "chicken", "camera", "sunglasses", "phone", "umbrella", "cup", "drink", "hat", "burger", "sandwich", "mask", "banana", "tissue", "milk", "apple", "orange", "key", "egg"] },
  { id: 18, items: ["umbrella", "bento", "wing", "chicken", "camera", "sunglasses", "phone", "cup", "drink", "hat", "burger", "sandwich", "mask", "banana", "tissue", "milk", "apple", "orange", "candy", "key", "egg"] },
  { id: 19, items: ["umbrella", "bento", "wing", "chicken", "camera", "sunglasses", "phone", "cup", "drink", "hat", "burger", "sandwich", "mask", "banana", "tissue", "milk", "apple", "orange", "dried", "key", "egg"] },
  { id: 20, items: ["umbrella", "bento", "wing", "chicken", "camera", "sunglasses", "phone", "cup", "drink", "hat", "burger", "sandwich", "wing", "mask", "banana", "tissue", "milk", "apple", "orange", "dried", "key", "egg", "candy"] },
  { id: 21, items: ["umbrella", "bento", "wing", "chicken", "camera", "sunglasses", "phone", "cup", "drink", "hat", "burger", "sandwich", "wing", "mask", "banana", "tissue", "milk", "apple", "orange", "dried", "key", "egg", "candy", "watch"] },
  { id: 22, items: ["umbrella", "bento", "wing", "chicken", "camera", "sunglasses", "phone", "cup", "drink", "hat", "burger", "sandwich", "wing", "bread_1", "chicken", "mask", "banana", "sandwich", "tissue", "milk", "apple", "orange", "wallet", "watch", "banana"] },
];

function generateLevel(levelId) {
  const configs = [
    { id: 1, width: 3, height: 3, left: 0, right: 0, time: 30 },
    { id: 2, width: 3, height: 4, left: 0, right: 0, time: 35 },
    { id: 3, width: 4, height: 4, left: 0, right: 0, time: 40 },
    { id: 4, width: 4, height: 4, left: 0, right: 0, time: 40 },
    { id: 5, width: 4, height: 5, left: 0, right: 0, time: 45 },
    { id: 6, width: 4, height: 5, left: 0, right: 0, time: 45 },
    { id: 7, width: 5, height: 5, left: 1, right: 1, time: 50 },
    { id: 8, width: 5, height: 5, left: 1, right: 1, time: 50 },
    { id: 9, width: 5, height: 5, left: 2, right: 1, time: 55 },
    { id: 10, width: 5, height: 6, left: 1, right: 1, time: 55 },
    { id: 11, width: 5, height: 6, left: 1, right: 1, time: 60 },
    { id: 12, width: 5, height: 6, left: 1, right: 1, time: 60 },
    { id: 13, width: 6, height: 6, left: 1, right: 1, time: 65 },
    { id: 14, width: 6, height: 6, left: 1, right: 1, time: 65 },
    { id: 15, width: 6, height: 6, left: 1, right: 1, time: 70 },
    { id: 16, width: 6, height: 7, left: 1, right: 1, time: 75 },
    { id: 17, width: 6, height: 7, left: 1, right: 1, time: 80 },
    { id: 18, width: 6, height: 7, left: 1, right: 1, time: 80 },
    { id: 19, width: 7, height: 7, left: 1, right: 1, time: 85 },
    { id: 20, width: 7, height: 7, left: 1, right: 1, time: 90 },
    { id: 21, width: 7, height: 8, left: 1, right: 1, time: 95 },
    { id: 22, width: 7, height: 8, left: 1, right: 1, time: 100 },
  ];

  const config = configs[levelId - 1];
  if (!config) return null;
  const solution = Solutions.find(s => s.id === levelId);
  if (!solution) return null;
  const mainItems = [...solution.items];
  const interference = levelId >= 4 ? Math.floor(levelId / 3) : 0;
  const pool = getAllItemIds();
  const extraPool = pool.filter(id => !mainItems.includes(id));
  const extra = shuffle(extraPool).slice(0, interference);
  const allItems = shuffle([...mainItems, ...extra]);
  return { id: config.id, gridWidth: config.width, gridHeight: config.height, leftPocket: config.left, rightPocket: config.right, timeLimit: config.time, items: allItems };
}

const Levels = [];
for (let i = 1; i <= 22; i++) { Levels.push(generateLevel(i)); }

class LevelManager {
  constructor() { this.progress = this.loadProgress(); }

  loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LEVEL);
      return saved ? JSON.parse(saved) : { unlocked: 1, stars: {}, scores: {} };
    } catch { return { unlocked: 1, stars: {}, scores: {} }; }
  }

  saveProgress() {
    try { localStorage.setItem(STORAGE_KEY_LEVEL, JSON.stringify(this.progress)); } catch {}
  }

  getLevel(id) { return Levels.find(l => l.id === id) || null; }
  isUnlocked(id) { return this.progress.unlocked >= id; }
  getStars(id) { return this.progress.stars[id] || 0; }

  completeLevel(id, stars, score) {
    if (id >= this.progress.unlocked && id < Levels.length) this.progress.unlocked = id + 1;
    if (!this.progress.stars[id] || this.progress.stars[id] < stars) this.progress.stars[id] = stars;
    if (!this.progress.scores[id] || this.progress.scores[id] < score) this.progress.scores[id] = score;
    this.saveProgress();
  }

  clearProgress() { this.progress = { unlocked: 1, stars: {}, scores: {} }; this.saveProgress(); }
  getChapterLevels(chapter) { const start = chapter * 6; return Levels.slice(start, start + 6); }
  getTotalLevels() { return Levels.length; }
  getScore(id) { return this.progress.scores[id] || 0; }
  getTotalScore() { return Object.values(this.progress.scores).reduce((sum, s) => sum + s, 0); }
  getCompletedCount() { return Object.keys(this.progress.scores).length; }
}

class GameController {
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
    if (!this.currentLevel) return false;
    this.grid = new Grid(this.currentLevel.gridWidth, this.currentLevel.gridHeight, this.currentLevel.leftPocket, this.currentLevel.rightPocket);
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
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      if (this.onTick) this.onTick(this.timeRemaining);
      if (this.timeRemaining <= 0) {
        this.stopTimer();
        if (this.onFail) this.onFail();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  selectItem(index) {
    if (index < 0 || index >= this.inventory.length) return;
    this.selectedItemIndex = index;
    this.selectedItem = this.inventory[index];
    this.rotation = 0;
  }

  deselectItem() {
    this.selectedItemIndex = -1;
    this.selectedItem = null;
    this.rotation = 0;
  }

  getCurrentRotatedItem() {
    if (!this.selectedItem) return null;
    let rotated = this.selectedItem;
    for (let i = 0; i < this.rotation; i++) rotated = rotateItem(rotated);
    return rotated;
  }

  rotateCurrentItem() {
    if (!this.selectedItem || !this.selectedItem.rotatable) return null;
    this.rotation = (this.rotation + 1) % 4;
    return this.rotation;
  }

  placeItem(x, y) {
    if (!this.selectedItem) return { valid: false };
    const rotated = this.getCurrentRotatedItem();
    const result = this.validator.validatePlacement(rotated, x, y);
    if (!result.valid) return result;
    if (!this.grid.placeItem(this.selectedItem, x, y, this.rotation)) return { valid: false, errors: ['放置失败'] };
    this.inventory.splice(this.selectedItemIndex, 1);
    this.score += rotated.score;
    this.deselectItem();
    if (this.validator.isComplete()) {
      this.stopTimer();
      const efficiency = Math.min(100, Math.floor((this.score / (this.grid.width * this.grid.height * 10)) * 100));
      const stars = efficiency >= 90 ? 3 : efficiency >= 70 ? 2 : 1;
      if (this.onComplete) this.onComplete({ stars, score: this.score, efficiency, timeUsed: this.currentLevel.timeLimit - this.timeRemaining, timeLeft: this.timeRemaining });
    }
    return { valid: true };
  }

  removeItem(x, y) {
    const removed = this.grid.removeItemAt(x, y);
    if (removed) {
      this.inventory.push(removed.item);
      this.score -= removed.item.score;
      return true;
    }
    return false;
  }

  getPlacedScore() { return this.score; }
  getEmptyCells() { return this.grid.getMainGridEmptyCount(); }
  cleanup() { this.stopTimer(); }
  restart() { if (this.currentLevel) this.startLevel(this.currentLevel.id); }
}

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
        if (time <= 10) soundManager.playTick();
      }
    };
    this.game.onComplete = (result) => { setTimeout(() => this.showResult(result, true), 500); };
    this.game.onFail = () => { setTimeout(() => this.showResult({ stars: 0, score: 0, efficiency: 0, timeUsed: 0, timeLeft: 0 }, false), 500); };
  }

  showScreen(screen) {
    if (this.currentScreen === 'game' && screen !== 'game') this.game.cleanup();
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById(`${screen}-screen`).classList.remove('hidden');
    this.currentScreen = screen;
    if (screen === 'level') this.renderLevelGrid();
    if (screen === 'settings') {
      document.getElementById('sound-toggle').checked = soundManager.getSetting('sound');
      document.getElementById('music-toggle').checked = soundManager.getSetting('music');
    }
    if (screen === 'rank') this.renderRank();
  }

  renderLevelGrid() {
    const grid = document.getElementById('level-grid');
    grid.innerHTML = '';
    const levels = this.levelManager.getChapterLevels(this.currentChapter);
    const startId = this.currentChapter * 6 + 1;
    const endId = startId + levels.length - 1;
    document.getElementById('chapter-title').textContent = `春游打包 / 第${startId}-${endId} 关`;
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

  switchChapter(chapter) { this.currentChapter = chapter; this.renderLevelGrid(); }

  startGame(levelId) {
    if (!this.game.startLevel(levelId)) return;
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
      el.innerHTML = `<span class="emoji">${item.emoji}</span><span class="name">${item.name}</span><span class="item-score">${item.score}分</span>${props.length > 0 ? `<div class="prop-tags">${props.join('')}</div>` : ''}<div class="shape-preview">${shapePreview}</div>`;
      if (item.noover) el.classList.add('item-noover');
      if (item.noexposed) el.classList.add('item-noexposed');
      if (item.edge) el.classList.add('item-edge');
      if (!item.rotatable) el.classList.add('item-norotate');
      el.addEventListener('click', () => this.selectItem(item.id));
      if (this.game.selectedItem && this.game.selectedItem.id === item.id) el.classList.add('selected');
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
      const leftPlaced = grid.placedItems.find(p => { const pos = grid.getXYFromIndex(p.cells[0]); return pos.x < 0; });
      if (leftPlaced) { leftPocket.textContent = leftPlaced.item.emoji; leftPocket.style.fontSize = `${mainCellSize * 0.7}px`; }
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
        if (item) { cell.textContent = item.emoji; cell.classList.add('placed'); cell.style.fontSize = `${mainCellSize * 0.6}px`; }
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
      const rightPlaced = grid.placedItems.find(p => { const pos = grid.getXYFromIndex(p.cells[0]); return pos.x >= grid.width; });
      if (rightPlaced) { rightPocket.textContent = rightPlaced.item.emoji; rightPocket.style.fontSize = `${mainCellSize * 0.7}px`; }
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
    if (!this.game.selectedItem) { display.innerHTML = ''; rotateBtn.style.display = 'none'; propsEl.innerHTML = ''; return; }
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
    propsHtml += `<div class="props-title">属性详情</div><div class="props-list">`;
    if (rotated.noover) propsHtml += `<div class="props-item prop-noover"><span class="prop-icon">🔴</span><span class="prop-label">不可压</span><span class="prop-desc">必须放最上层</span></div>`;
    if (rotated.noexposed) propsHtml += `<div class="props-item prop-noexposed"><span class="prop-icon">🟣</span><span class="prop-label">不可外露</span><span class="prop-desc">需要物品覆盖</span></div>`;
    if (rotated.edge) propsHtml += `<div class="props-item prop-edge"><span class="prop-icon">🟡</span><span class="prop-label">需放侧边</span><span class="prop-desc">必须放侧边袋</span></div>`;
    if (!rotated.rotatable) propsHtml += `<div class="props-item prop-norotate"><span class="prop-icon">🔵</span><span class="prop-label">不可旋转</span><span class="prop-desc">不能改变方向</span></div>`;
    if (!rotated.noover && !rotated.noexposed && !rotated.edge && rotated.rotatable) propsHtml += `<div class="props-item prop-normal"><span class="prop-icon">✅</span><span class="prop-label">普通物品</span><span class="prop-desc">无特殊限制</span></div>`;
    propsHtml += '</div></div>';
    propsEl.innerHTML = propsHtml;
  }

  selectItem(itemId) {
    if (this.game.selectedItem && this.game.selectedItem.id === itemId) this.game.deselectItem();
    else { const idx = this.game.inventory.findIndex(i => i.id === itemId); if (idx >= 0) this.game.selectItem(idx); }
    this.renderInventory();
    this.renderSelectedItem();
    soundManager.playClick();
  }

  rotateSelectedItem() {
    const rotation = this.game.rotateCurrentItem();
    if (rotation !== null) { this.renderSelectedItem(); soundManager.playClick(); }
  }

  onGridCellClick(x, y) {
    if (this.game.selectedItem) {
      const result = this.game.placeItem(x, y);
      if (result.valid) { this.renderGame(); soundManager.playPlace(); }
      else if (result.errors && result.errors.length > 0) { this.showToast(result.errors[0]); this.flashError(x, y); soundManager.playError(); }
    } else {
      if (this.game.removeItem(x, y)) { this.renderGame(); soundManager.playClick(); }
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
          document.querySelectorAll(`.grid-cell[data-x="${targetX}"][data-y="${targetY}"]`).forEach(cell => cell.classList.add('highlight'));
        }
      }
    }
    if (x < 0) document.querySelector('.side-pocket.left')?.classList.add('highlight');
    else if (x >= this.game.grid.width) document.querySelector('.side-pocket.right')?.classList.add('highlight');
  }

  clearGridHighlight() { document.querySelectorAll('.grid-cell.highlight, .side-pocket.highlight').forEach(cell => cell.classList.remove('highlight')); }

  flashError(x, y) {
    document.querySelectorAll(`.grid-cell[data-x="${x}"][data-y="${y}"]`).forEach(cell => { cell.classList.add('error'); setTimeout(() => cell.classList.remove('error'), 300); });
  }

  showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 2000);
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
    if (success) { this.levelManager.completeLevel(this.game.currentLevel.id, result.stars, result.score); soundManager.playSuccess(); }
    else soundManager.playError();
  }

  restartLevel() { if (this.game.currentLevel) { this.game.restart(); this.showScreen('game'); this.renderGame(); } }

  goToNextLevel() {
    const nextId = this.game.currentLevel.id + 1;
    if (this.levelManager.getLevel(nextId)) this.startGame(nextId);
  }

  clearProgress() { if (confirm('确定要清除所有进度吗？')) { this.levelManager.clearProgress(); this.showToast('进度已清除'); } }

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
      if (score > 0) levels.push({ id: i, stars, score });
    }
    if (levels.length === 0) { rankList.innerHTML = '<div class="rank-empty">暂无记录，快去闯关吧！</div>'; return; }
    levels.sort((a, b) => b.score - a.score);
    levels.forEach((level, index) => {
      const item = document.createElement('div');
      item.className = 'rank-item';
      item.innerHTML = `<span class="rank-num">${index + 1}</span><span class="rank-level">第 ${level.id} 关</span><span class="rank-stars">${'⭐'.repeat(level.stars)}</span><span class="rank-score">${level.score} 分</span>`;
      rankList.appendChild(item);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => { new Game(); });