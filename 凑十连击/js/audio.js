import { loadFromStorage, saveToStorage } from './utils.js';

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.volume = 1.0;
    this.muted = false;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.volume = loadFromStorage('decaStrike_volume', 1.0);
      this.muted = loadFromStorage('decaStrike_muted', false);
      this.initialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  playTone(frequency, duration, type = 'sine', volume = 0.5) {
    if (!this.ctx || this.muted) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
    gain.gain.setValueAtTime(volume * this.volume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playShoot() {
    this.playTone(880, 0.15, 'square', 0.4);
    setTimeout(() => this.playTone(440, 0.15, 'square', 0.3), 50);
  }

  playHit() {
    this.playTone(300, 0.4, 'sawtooth', 0.5);
    this.playTone(200, 0.3, 'sine', 0.4);
  }

  playMiss() {
    this.playTone(150, 0.3, 'square', 0.4);
  }

  playCombo() {
    this.playTone(523, 0.2, 'sine', 0.5);
    setTimeout(() => this.playTone(659, 0.2, 'sine', 0.5), 100);
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.5), 200);
  }

  playGameStart() {
    this.playTone(392, 0.3, 'sine', 0.5);
    setTimeout(() => this.playTone(523, 0.3, 'sine', 0.5), 200);
    setTimeout(() => this.playTone(659, 0.4, 'sine', 0.5), 400);
  }

  playGameWin() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 0.4, 'sine', 0.6), i * 250);
    });
  }

  playGameLose() {
    this.playTone(400, 0.5, 'sawtooth', 0.5);
    setTimeout(() => this.playTone(300, 0.5, 'sawtooth', 0.5), 400);
    setTimeout(() => this.playTone(200, 0.6, 'sawtooth', 0.5), 800);
  }

  playButtonClick() {
    this.playTone(600, 0.15, 'sine', 0.4);
  }

  playPause() {
    this.playTone(500, 0.2, 'sine', 0.5);
  }

  setVolume(v) {
    this.volume = Math.max(0, Math.min(1, v));
    saveToStorage('decaStrike_volume', this.volume);
  }

  toggleMute() {
    this.muted = !this.muted;
    saveToStorage('decaStrike_muted', this.muted);
    return this.muted;
  }

  getVolume() {
    return this.volume;
  }

  isMuted() {
    return this.muted;
  }
}