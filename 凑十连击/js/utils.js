export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomCardNumber() {
  return randomInt(1, 9);
}

export function getCardColorClass(number) {
  if (number >= 1 && number <= 3) return 'card-1';
  if (number >= 4 && number <= 6) return 'card-4';
  return 'card-7';
}

export function getScoreForCard(number) {
  return 10 + number * 5;
}

export function formatTime(seconds) {
  return Math.ceil(seconds);
}

export function getElementCenter(el) {
  const rect = el.getBoundingClientRect();
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}

export function checkCollision(el1, el2) {
  const r1 = el1.getBoundingClientRect();
  const r2 = el2.getBoundingClientRect();
  return !(r1.right < r2.left || r1.left > r2.right || r1.bottom < r2.top || r1.top > r2.bottom);
}

export function getRandomPosition(container, elementWidth, elementHeight, padding = 50) {
  const containerRect = container.getBoundingClientRect();
  const maxX = containerRect.width - elementWidth - padding;
  const maxY = containerRect.height - elementHeight - padding;
  return {
    x: randomInt(padding, maxX),
    y: randomInt(padding, maxY)
  };
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

export function loadFromStorage(key, defaultValue = null) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (e) {
    console.warn('Storage load failed:', e);
    return defaultValue;
  }
}