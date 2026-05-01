const STORAGE_KEY = 'springtrip_settings';

const DEFAULT_SETTINGS = {
  sound: true,
  music: true,
  hint: true,
  vibrate: false
};

class SoundManager {
  constructor() {
    this.settings = this.loadSettings();
    this.audioCtx = null;
    this.initialized = false;
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch {
      console.warn('Failed to save settings');
    }
  }

  init() {
    if (this.initialized) {
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      return;
    }
    try {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
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
    } catch (e) {
      console.warn('Failed to play sound');
    }
  }

  playClick() {
    this.playTone(800, 0.1, 'sine', 0.2);
  }

  playPlace() {
    this.playTone(600, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(900, 0.15, 'sine', 0.2), 80);
  }

  playError() {
    this.playTone(200, 0.3, 'sawtooth', 0.15);
  }

  playSuccess() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', 0.25), i * 150);
    });
  }

  playTick() {
    this.playTone(1000, 0.05, 'square', 0.1);
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    this.saveSettings();
  }

  getSetting(key) {
    return this.settings[key];
  }

  clearSettings() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
  }
}

export const soundManager = new SoundManager();