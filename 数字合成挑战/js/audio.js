const AudioFX = (() => {
  let ctx = null;
  let enabled = true;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

  function playTone(freq, type, duration, volume = 0.15) {
    if (!enabled) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration);
    } catch (e) { /* silent */ }
  }

  function playSlide(from, to, type, duration, volume = 0.12) {
    if (!enabled) return;
    try {
      const c = getCtx();
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, c.currentTime);
      osc.frequency.linearRampToValueAtTime(to, c.currentTime + duration);
      gain.gain.value = volume;
      gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(c.currentTime);
      osc.stop(c.currentTime + duration);
    } catch (e) { /* silent */ }
  }

  function playChord(freqs, type, duration, volume = 0.08) {
    if (!enabled) return;
    try {
      const c = getCtx();
      freqs.forEach((freq, i) => {
        const osc = c.createOscillator();
        const gain = c.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.value = volume;
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration + i * 0.12);
        osc.connect(gain);
        gain.connect(c.destination);
        osc.start(c.currentTime + i * 0.12);
        osc.stop(c.currentTime + duration + i * 0.12);
      });
    } catch (e) { /* silent */ }
  }

  return {
    setEnabled(e) { enabled = e; },
    getEnabled() { return enabled; },
    select() { playTone(660, 'sine', 0.08, 0.1); },
    opSelect() { playTone(440, 'square', 0.05, 0.06); },
    calculate() { playSlide(300, 600, 'sine', 0.1, 0.1); },
    win() { playChord([523, 659, 784], 'sine', 0.5, 0.1); },
    lose() { playTone(150, 'sawtooth', 0.3, 0.08); },
    timeout() {
      if (!enabled) return;
      let count = 0;
      const id = setInterval(() => {
        playTone(440, 'square', 0.12, 0.06);
        count++;
        if (count >= 3) clearInterval(id);
      }, 300);
    },
    newGame() { playSlide(300, 500, 'sine', 0.12, 0.08); },
    error() { playTone(200, 'square', 0.1, 0.06); },
    hint() { playTone(880, 'sine', 0.1, 0.08); },
  };
})();
