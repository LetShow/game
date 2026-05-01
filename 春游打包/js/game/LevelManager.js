import { getItemById, getAllItemIds } from "../core/Item.js";

const STORAGE_KEY = "springtrip_level_progress";

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
  {
    id: 3,
    items: ["apple", "apple", "orange", "tissue", "milk", "key", "egg"],
  },
  {
    id: 4,
    items: ["apple", "orange", "banana", "egg", "candy", "key", "wallet"],
  },
  {
    id: 5,
    items: [
      "apple",
      "banana",
      "orange",
      "chips",
      "candy",
      "tissue",
      "key",
      "milk",
      "egg",
    ],
  },
  {
    id: 6,
    items: [
      "sandwich",
      "chips",
      "banana",
      "drink",
      "candy",
      "tissue",
      "milk",
      "key",
      "egg",
      "mask",
    ],
  },
  {
    id: 7,
    items: [
      "sandwich",
      "burger",
      "apple",
      "banana",
      "drink",
      "candy",
      "tissue",
      "milk",
      "key",
      "egg",
    ],
  },
  {
    id: 8,
    items: [
      "sandwich",
      "burger",
      "bread_1",
      "apple",
      "banana",
      "drink",
      "chips",
      "candy",
      "camera",
      "tissue",
      "key",
      "egg",
    ],
  },
  {
    id: 9,
    items: [
      "burger",
      "sandwich",
      "hat",
      "apple",
      "banana",
      "drink",
      "chips",
      "mask",
      "tissue",
      "candy",
      "milk",
      "egg",
    ],
  },
  {
    id: 10,
    items: [
      "hat",
      "cup",
      "burger",
      "phone",
      "banana",
      "drink",
      "chips",
      "mask",
      "candy",
      "tissue",
      "milk",
      "key",
      "egg",
    ],
  },
  {
    id: 11,
    items: [
      "cup",
      "drink",
      "hat",
      "phone",
      "sunglasses",
      "burger",
      "sandwich",
      "chips",
      "mask",
      "banana",
      "tissue",
      "milk",
      "key",
      "egg",
    ],
  },
  {
    id: 12,
    items: [
      "phone",
      "camera",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "chips",
      "mask",
      "banana",
      "tissue",
      "apple",
      "orange",
      "candy",
      "egg",
    ],
  },
  {
    id: 13,
    items: [
      "chicken",
      "sunglasses",
      "phone",
      "camera",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "chips",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "egg",
    ],
  },
  {
    id: 14,
    items: [
      "sunglasses",
      "chicken",
      "wing",
      "phone",
      "camera",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "chips",
      "mask",
      "banana",
      "tissue",
      "milk",
      "key",
      "egg",
    ],
  },
  {
    id: 15,
    items: [
      "camera",
      "bento",
      "sunglasses",
      "chicken",
      "wing",
      "phone",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "egg",
      "orange",
    ],
  },
  {
    id: 16,
    items: [
      "wing",
      "bento",
      "chicken",
      "camera",
      "sunglasses",
      "phone",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "orange",
      "key",
      "egg",
    ],
  },
  {
    id: 17,
    items: [
      "bento",
      "wing",
      "chicken",
      "camera",
      "sunglasses",
      "phone",
      "umbrella",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "orange",
      "key",
      "egg",
    ],
  },
  {
    id: 18,
    items: [
      "umbrella",
      "bento",
      "wing",
      "chicken",
      "camera",
      "sunglasses",
      "phone",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "orange",
      "candy",
      "key",
      "egg",
    ],
  },
  {
    id: 19,
    items: [
      "umbrella",
      "bento",
      "wing",
      "chicken",
      "camera",
      "sunglasses",
      "phone",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "orange",
      "dried",
      "key",
      "egg",
    ],
  },
  {
    id: 20,
    items: [
      "umbrella",
      "bento",
      "wing",
      "chicken",
      "camera",
      "sunglasses",
      "phone",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "wing",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "orange",
      "dried",
      "key",
      "egg",
      "candy",
    ],
  },
  {
    id: 21,
    items: [
      "umbrella",
      "bento",
      "wing",
      "chicken",
      "camera",
      "sunglasses",
      "phone",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "wing",
      "mask",
      "banana",
      "tissue",
      "milk",
      "apple",
      "orange",
      "dried",
      "key",
      "egg",
      "candy",
      "watch",
    ],
  },
  {
    id: 22,
    items: [
      "umbrella",
      "bento",
      "wing",
      "chicken",
      "camera",
      "sunglasses",
      "phone",
      "cup",
      "drink",
      "hat",
      "burger",
      "sandwich",
      "wing",
      "bread_1",
      "chicken",
      "mask",
      "banana",
      "sandwich",
      "tissue",
      "milk",
      "apple",
      "orange",
      "wallet",
      "watch",
      "banana",
    ],
  },
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

  const solution = Solutions.find((s) => s.id === levelId);
  if (!solution) return null;

  const mainItems = [...solution.items];
  const interference = levelId >= 4 ? Math.floor(levelId / 3) : 0;

  const pool = getAllItemIds();
  const extraPool = pool.filter((id) => !mainItems.includes(id));
  const extra = shuffle(extraPool).slice(0, interference);

  const allItems = shuffle([...mainItems, ...extra]);

  return {
    id: config.id,
    gridWidth: config.width,
    gridHeight: config.height,
    leftPocket: config.left,
    rightPocket: config.right,
    timeLimit: config.time,
    items: allItems,
  };
}

export const Levels = [];
for (let i = 1; i <= 22; i++) {
  Levels.push(generateLevel(i));
}

export class LevelManager {
  constructor() {
    this.progress = this.loadProgress();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : { unlocked: 1, stars: {}, scores: {} };
    } catch {
      return { unlocked: 1, stars: {}, scores: {} };
    }
  }

  saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.progress));
    } catch {
      console.warn("Failed to save progress");
    }
  }

  getLevel(id) {
    return Levels.find((l) => l.id === id) || null;
  }

  isUnlocked(id) {
    return this.progress.unlocked >= id;
  }

  getStars(id) {
    return this.progress.stars[id] || 0;
  }

  completeLevel(id, stars, score) {
    if (id >= this.progress.unlocked && id < Levels.length) {
      this.progress.unlocked = id + 1;
    }
    if (!this.progress.stars[id] || this.progress.stars[id] < stars) {
      this.progress.stars[id] = stars;
    }
    if (!this.progress.scores[id] || this.progress.scores[id] < score) {
      this.progress.scores[id] = score;
    }
    this.saveProgress();
  }

  getScore(id) {
    return this.progress.scores[id] || 0;
  }

  getTotalScore() {
    return Object.values(this.progress.scores).reduce((sum, s) => sum + s, 0);
  }

  getCompletedCount() {
    return Object.keys(this.progress.scores).length;
  }

  clearProgress() {
    this.progress = { unlocked: 1, stars: {}, scores: {} };
    this.saveProgress();
  }

  getChapterLevels(chapter) {
    const start = chapter * 6;
    return Levels.slice(start, start + 6);
  }

  getTotalLevels() {
    return Levels.length;
  }
}
