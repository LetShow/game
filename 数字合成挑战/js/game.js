const Game = (() => {
  const LEVELS = [
    { numbers: 3, maxNum: 10, targets: [24], time: 90 },
    { numbers: 3, maxNum: 13, targets: [24, 36], time: 75 },
    { numbers: 4, maxNum: 10, targets: [24], time: 120 },
    { numbers: 4, maxNum: 13, targets: [24, 36, 60], time: 100 },
    { numbers: 5, maxNum: 10, targets: [24, 36], time: 150 },
    { numbers: 5, maxNum: 13, targets: [24, 36, 60], time: 120 },
  ];

  const HINTS_PER_LEVEL = 3;

  let state = {
    level: 1,
    numbers: [],
    target: 24,
    pool: [],
    selectedCard: null,
    selectedOp: null,
    history: [],
    hintsLeft: HINTS_PER_LEVEL,
    solution: null,
    timeLeft: 0,
    maxTime: 0,
    timerId: null,
    isPlaying: false,
    isFinished: false,
    isMenuShowing: true,
    stats: null,
    progress: 0,
  };

  function getLevelConfig(level) {
    const idx = Math.min(Math.floor((level - 1) / 5), LEVELS.length - 1);
    return LEVELS[idx];
  }

  function pickTarget(targets) {
    return targets[Math.floor(Math.random() * targets.length)];
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem('game_stats_24p');
      if (raw) return JSON.parse(raw);
    } catch (e) { /* ignore */ }
    return { totalGames: 0, wins: 0, losses: 0, bestTime: null, streak: 0, maxStreak: 0, maxLevel: 1 };
  }

  function saveStats(stats) {
    try {
      localStorage.setItem('game_stats_24p', JSON.stringify(stats));
    } catch (e) { /* ignore */ }
  }

  function stopTimer() {
    if (state.timerId) {
      clearInterval(state.timerId);
      state.timerId = null;
    }
  }

  function startTimer() {
    stopTimer();
    state.timerId = setInterval(() => {
      state.timeLeft--;
      if (state.timeLeft <= 0) {
        state.timeLeft = 0;
        stopTimer();
        lose('timeout');
      }
      notify('tick');
    }, 1000);
  }

  function startLevel(level) {
    stopTimer();

    const config = getLevelConfig(level);
    const target = pickTarget(config.targets);
    const { numbers, solution } = Generator.generate(target, config.numbers, config.maxNum);

    state.level = level;
    state.target = target;
    state.numbers = [...numbers];
    state.pool = [...numbers];
    state.selectedCard = null;
    state.selectedOp = null;
    state.history = [];
    state.hintsLeft = HINTS_PER_LEVEL;
    state.solution = solution;
    state.timeLeft = config.time;
    state.maxTime = config.time;
    state.isPlaying = true;
    state.isFinished = false;
    state.isMenuShowing = false;
    state.progress = ((level - 1) / 29) * 100;

    state.stats = loadStats();
    startTimer();
    notify('update');
  }

  function showMenu() {
    stopTimer();
    state.isPlaying = false;
    state.isMenuShowing = true;
    state.selectedCard = null;
    state.selectedOp = null;
    notify('menu');
  }

  function startFromLevel(level) {
    startLevel(level);
    notify('startGame');
  }

  function handleCardClick(index) {
    if (!state.isPlaying || state.isFinished) return;

    if (index === -1) {
      state.selectedCard = null;
      state.selectedOp = null;
      notify('update');
      return;
    }

    if (state.pool[index] === null) return;

    if (state.selectedCard === index) {
      state.selectedCard = null;
      notify('update');
      return;
    }

    if (state.selectedCard !== null && state.selectedOp !== null) {
      executeOperation(state.selectedCard, state.selectedOp, index);
      return;
    }

    if (state.selectedCard === null) {
      state.selectedCard = index;
      AudioFX.select();
      notify('update');
      return;
    }

    if (state.selectedOp === null) {
      state.selectedCard = index;
      AudioFX.select();
      notify('update');
      return;
    }

    state.selectedCard = index;
    AudioFX.select();
    notify('update');
  }

  function handleOpClick(op) {
    if (!state.isPlaying || state.isFinished) return;
    if (state.selectedCard === null) return;

    if (state.selectedOp === op) {
      state.selectedOp = null;
      notify('update');
      return;
    }

    state.selectedOp = op;
    AudioFX.opSelect();
    notify('update');
  }

  function executeOperation(idxA, op, idxB) {
    if (idxA === idxB) return;
    const a = state.pool[idxA];
    const b = state.pool[idxB];
    if (a === null || b === null) return;

    let result;
    switch (op) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/':
        if (b === 0 || a % b !== 0) {
          AudioFX.error();
          notify('error', '无法整除，请选择其他运算');
          return;
        }
        result = a / b;
        break;
      default: return;
    }

    state.pool[idxA] = result;
    state.pool[idxB] = null;
    state.history.push({ a, op, b, result });
    state.selectedCard = null;
    state.selectedOp = null;

    AudioFX.calculate();

    const remaining = state.pool.filter(v => v !== null);
    if (remaining.length === 1) {
      if (remaining[0] === state.target) {
        win();
      } else {
        lose('wrong');
      }
    }

    notify('update');
  }

  function win() {
    state.isPlaying = false;
    state.isFinished = true;
    stopTimer();

    const timeUsed = state.maxTime - state.timeLeft;
    AudioFX.win();

    state.stats = loadStats();
    state.stats.totalGames++;
    state.stats.wins++;
    state.stats.streak++;
    if (state.stats.streak > state.stats.maxStreak) state.stats.maxStreak = state.stats.streak;
    if (state.stats.bestTime === null || timeUsed < state.stats.bestTime) state.stats.bestTime = timeUsed;
    if (state.level > state.stats.maxLevel) state.stats.maxLevel = state.level;
    state.stats.maxLevel = Math.min(state.stats.maxLevel, 30);
    saveStats(state.stats);

    notify('win', { timeUsed });
  }

  function lose(reason) {
    state.isPlaying = false;
    state.isFinished = true;
    stopTimer();

    state.stats = loadStats();
    state.stats.totalGames++;
    state.stats.losses++;
    state.stats.streak = 0;
    saveStats(state.stats);

    if (reason === 'timeout') {
      AudioFX.timeout();
      notify('lose', { reason: 'timeout' });
    } else {
      AudioFX.lose();
      notify('lose', { reason: 'wrong' });
    }
  }

  function useHint() {
    if (!state.isPlaying || state.isFinished) return;
    if (state.hintsLeft <= 0) return;

    const remaining = state.pool.filter(v => v !== null);

    if (state.solution && state.history.length < state.solution.length) {
      const step = state.solution[state.history.length];
      const opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      state.hintsLeft--;
      AudioFX.hint();
      notify('hint', `提示: ${step.b} ${opMap[step.op] || step.op} ${step.c} = ?`);
      return;
    }

    const solutions = Solver.solve(remaining, state.target);
    if (solutions.length > 0 && solutions[0].length > 0) {
      const step = solutions[0][0];
      const opMap = { '+': '+', '-': '−', '*': '×', '/': '÷' };
      state.hintsLeft--;
      AudioFX.hint();
      notify('hint', `提示: ${step.a} ${opMap[step.op] || step.op} ${step.b} = ?`);
    } else {
      notify('hint', '无解，请重开');
    }
  }

  function reset() {
    startLevel(state.level);
    AudioFX.newGame();
    notify('update');
  }

  function nextLevel() {
    const next = Math.min(state.level + 1, 30);
    startLevel(next);
    AudioFX.newGame();
    notify('update');
  }

  function getState() {
    return { ...state };
  }

  let _notify = null;
  function setNotify(fn) { _notify = fn; }
  function notify(type, data) { if (_notify) _notify(type, data); }

  return {
    startLevel,
    showMenu,
    startFromLevel,
    handleCardClick,
    handleOpClick,
    useHint,
    reset,
    nextLevel,
    getState,
    getLevelConfig,
    loadStats,
    setNotify,
  };
})();
