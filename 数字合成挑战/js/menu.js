const Menu = (() => {
  const $ = (id) => document.getElementById(id);

  const els = {
    menuScreen: $('menuScreen'),
    gameScreen: $('gameScreen'),
    menuSubtitle: $('menuSubtitle'),
    menuProgressLabel: $('menuProgressLabel'),
    menuProgressFill: $('menuProgressFill'),
    menuProgressText: $('menuProgressText'),
    menuStartBtn: $('menuStartBtn'),
    menuStatsToggle: $('menuStatsToggle'),
    menuStatsBody: $('menuStatsBody'),
    menuQuickBtns: $('menuQuickBtns'),
    statTotal: $('statTotal'),
    statWins: $('statWins'),
    statLosses: $('statLosses'),
    statRate: $('statRate'),
    statBest: $('statBest'),
    statStreak: $('statStreak'),
    statMaxStreak: $('statMaxStreak'),
    backBtn: $('backBtn'),
  };

  let animInterval = null;

  function showMenu() {
    els.gameScreen.classList.remove('active');
    els.menuScreen.classList.add('active');
    renderMenu();
  }

  function showGame() {
    els.menuScreen.classList.remove('active');
    els.gameScreen.classList.add('active');
    if (animInterval) { clearInterval(animInterval); animInterval = null; }
  }

  function renderMenu() {
    const stats = Game.loadStats();
    const maxLvl = stats.maxLevel || 1;

    els.menuProgressLabel.textContent = `已到达: 第 ${maxLvl} 关`;
    els.menuProgressFill.style.width = `${((maxLvl - 1) / 29) * 100}%`;
    els.menuProgressText.textContent = `${maxLvl} / 30`;

    els.statTotal.textContent = stats.totalGames;
    els.statWins.textContent = stats.wins;
    els.statLosses.textContent = stats.losses;
    els.statRate.textContent = stats.totalGames > 0 ? `${Math.round((stats.wins / stats.totalGames) * 100)}%` : '0%';
    els.statBest.textContent = stats.bestTime !== null ? `${stats.bestTime}s` : '--';
    els.statStreak.textContent = stats.streak;
    els.statMaxStreak.textContent = stats.maxStreak;

    renderQuickBtns(maxLvl);
    startSubtitleAnim();
  }

  function renderQuickBtns(maxLvl) {
    els.menuQuickBtns.innerHTML = '';
    const btns = [
      { label: `第${Math.max(1, maxLvl - 1)}关`, level: Math.max(1, maxLvl - 1) },
      { label: `第${maxLvl}关`, level: maxLvl },
      { label: `第${Math.min(30, maxLvl + 1)}关`, level: Math.min(30, maxLvl + 1) },
    ];
    btns.forEach(({ label, level }) => {
      const btn = document.createElement('button');
      btn.className = 'menu-quick-btn';
      btn.textContent = label;
      if (level > maxLvl) {
        btn.classList.add('locked');
        btn.textContent = '🔒 ' + label;
        btn.disabled = true;
      } else {
        btn.addEventListener('click', () => {
          Game.startFromLevel(level);
          showGame();
        });
      }
      els.menuQuickBtns.appendChild(btn);
    });
  }

  function startSubtitleAnim() {
    if (animInterval) clearInterval(animInterval);
    const parts = ['A', 'B', 'C'];
    const chars = '123456789';
    let count = 0;
    animInterval = setInterval(() => {
      const idx = count % 3;
      parts[idx] = chars[Math.floor(Math.random() * chars.length)];
      els.menuSubtitle.textContent = parts.join(' · ');
      count++;
    }, 400);
  }

  function setup() {
    els.menuStartBtn.addEventListener('click', () => {
      const stats = Game.loadStats();
      const level = stats.maxLevel || 1;
      Game.startFromLevel(level);
      showGame();
    });

    els.menuStatsToggle.addEventListener('click', () => {
      els.menuStatsBody.classList.toggle('open');
    });

    els.backBtn.addEventListener('click', () => {
      Game.showMenu();
      showMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'm') {
        Game.showMenu();
        showMenu();
      }
    });
  }

  setup();
  renderMenu();

  return { showMenu, showGame };
})();
