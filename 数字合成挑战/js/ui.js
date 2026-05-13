(() => {
  const $ = (id) => document.getElementById(id);

  const els = {
    levelBadge: $('levelBadge'),
    progressFill: $('progressFill'),
    targetValue: $('targetValue'),
    timerText: $('timerText'),
    cardGrid: $('cardGrid'),
    historyList: $('historyList'),
    hintBtn: $('hintBtn'),
    hintCount: $('hintCount'),
    resetBtn: $('resetBtn'),
    modalOverlay: $('modalOverlay'),
    modalIcon: $('modalIcon'),
    modalTitle: $('modalTitle'),
    modalBody: $('modalBody'),
    modalBtn: $('modalBtn'),
    opBtns: document.querySelectorAll('.op-btn'),
    statusSlots: $('statusSlots'),
    statusA: $('statusA'),
    statusOp: $('statusOp'),
    statusB: $('statusB'),
    guideText: $('guideText'),
  };

  const opDisplay = { '+': '+', '-': '−', '*': '×', '/': '÷' };

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  function getInteractionState(state) {
    if (state.selectedCard !== null && state.selectedOp !== null) return 'WAITING_B';
    if (state.selectedCard !== null) return 'WAITING_OP';
    return 'WAITING_A';
  }

  function render(state) {
    els.levelBadge.textContent = `第 ${state.level} 关`;
    els.progressFill.style.width = `${((state.level - 1) / 29) * 100}%`;
    els.targetValue.textContent = state.target;

    const isWarning = state.timeLeft <= 10;
    els.timerText.textContent = formatTime(state.timeLeft);
    els.timerText.classList.toggle('warning', isWarning);

    els.hintCount.textContent = `(${state.hintsLeft})`;
    els.hintBtn.disabled = !state.isPlaying || state.hintsLeft <= 0;

    renderCards(state);
    renderStatusBar(state);
    renderGuideText(state);
    renderHistory(state);
    renderOpBtns(state);
  }

  function renderCards(state) {
    els.cardGrid.innerHTML = '';
    state.pool.forEach((val, idx) => {
      const card = document.createElement('div');
      card.className = 'number-card';
      if (val === null) {
        card.classList.add('used');
        card.textContent = '?';
      } else {
        card.textContent = val;
      }
      if (state.selectedCard === idx) {
        card.classList.add('selected');
      }
      card.dataset.index = idx;
      card.addEventListener('click', () => Game.handleCardClick(idx));
      els.cardGrid.appendChild(card);
    });
  }

  function renderStatusBar(state) {
    const iState = getInteractionState(state);

    const slotA = els.statusA;
    const slotOp = els.statusOp;
    const slotB = els.statusB;

    slotA.classList.remove('filled');
    slotOp.classList.remove('filled');
    slotB.classList.remove('filled');

    switch (iState) {
      case 'WAITING_A':
        slotA.textContent = '?';
        slotOp.textContent = '?';
        slotB.textContent = '?';
        break;

      case 'WAITING_OP': {
        const val = state.pool[state.selectedCard];
        slotA.textContent = val;
        slotA.classList.add('filled');
        slotOp.textContent = '?';
        slotB.textContent = '?';
        break;
      }

      case 'WAITING_B': {
        const val = state.pool[state.selectedCard];
        slotA.textContent = val;
        slotA.classList.add('filled');
        slotOp.textContent = opDisplay[state.selectedOp] || state.selectedOp;
        slotOp.classList.add('filled');
        slotB.textContent = '?';
        break;
      }
    }
  }

  function renderGuideText(state) {
    const iState = getInteractionState(state);

    if (!state.isPlaying) {
      els.guideText.textContent = '游戏已结束';
      return;
    }

    switch (iState) {
      case 'WAITING_A':
        els.guideText.textContent = '点击数字卡片开始';
        break;
      case 'WAITING_OP':
        els.guideText.textContent = '请选择一个运算符';
        break;
      case 'WAITING_B':
        els.guideText.textContent = '请点击第二个数字';
        break;
    }
  }

  function renderHistory(state) {
    els.historyList.innerHTML = '';
    if (state.history.length === 0) {
      els.historyList.innerHTML = '<div class="history-empty">等待开始...</div>';
      return;
    }
    state.history.forEach((step, i) => {
      const div = document.createElement('div');
      div.className = 'history-step';
      div.style.animationDelay = `${i * 0.05}s`;
      div.innerHTML = `
        <span>${step.a} ${opDisplay[step.op] || step.op} ${step.b}</span>
        <span class="step-eq">=</span>
        <span class="step-result">${step.result}</span>
      `;
      els.historyList.appendChild(div);
    });
  }

  function renderOpBtns(state) {
    els.opBtns.forEach(btn => {
      const op = btn.dataset.op;
      btn.classList.toggle('selected', state.selectedOp === op);
      btn.disabled = state.selectedCard === null || !state.isPlaying;
    });
  }

  function showModal(icon, title, body, btnText, btnAction) {
    els.modalIcon.textContent = icon;
    els.modalTitle.textContent = title;
    els.modalBody.textContent = body;
    els.modalBtn.textContent = btnText;
    els.modalBtn.onclick = () => {
      els.modalOverlay.classList.remove('show');
      btnAction();
    };
    els.modalOverlay.classList.add('show');
  }

  function setupEventListeners() {
    els.opBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        Game.handleOpClick(btn.dataset.op);
      });
    });

    els.hintBtn.addEventListener('click', () => {
      Game.useHint();
    });

    els.resetBtn.addEventListener('click', () => {
      if (confirm('确定要重新开始当前关卡吗？')) {
        Game.reset();
      }
    });

    document.addEventListener('keydown', (e) => {
      const state = Game.getState();
      if (state.isMenuShowing) return;
      if (!state.isPlaying) return;

      const numKeys = ['1', '2', '3', '4', '5'];
      const opKeys = { 'q': '+', 'w': '-', 'e': '*', 'r': '/' };

      if (numKeys.includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        const validIndices = state.pool.map((v, i) => v !== null ? i : -1).filter(i => i >= 0);
        if (idx < validIndices.length) {
          Game.handleCardClick(validIndices[idx]);
        }
      } else if (opKeys[e.key]) {
        Game.handleOpClick(opKeys[e.key]);
      } else if (e.key === 'Enter' && state.selectedCard !== null && state.selectedOp !== null) {
        const remaining = state.pool.map((v, i) => v !== null ? i : -1).filter(i => i >= 0);
        const idxA = state.selectedCard;
        const idxB = remaining.find(i => i !== idxA);
        if (idxB !== undefined) {
          Game.handleCardClick(idxB);
        }
      } else if (e.key === 'Backspace' || e.key === 'Escape') {
        Game.handleCardClick(-1);
      } else if (e.key === 'h') {
        Game.useHint();
      } else if (e.key === 'r') {
        if (confirm('确定要重新开始当前关卡吗？')) {
          Game.reset();
        }
      }
    });
  }

  Game.setNotify((type, data) => {
    const state = Game.getState();
    switch (type) {
      case 'update':
        render(state);
        break;
      case 'error':
        render(state);
        els.cardGrid.querySelectorAll('.number-card').forEach(card => {
          if (!card.classList.contains('used')) {
            card.classList.add('error-shake');
            setTimeout(() => card.classList.remove('error-shake'), 400);
          }
        });
        break;
      case 'hint':
        render(state);
        if (data) {
          els.historyList.innerHTML = '';
          const div = document.createElement('div');
          div.className = 'history-step';
          div.innerHTML = `<span style="color:#d4a017;font-weight:600;">${data}</span>`;
          els.historyList.appendChild(div);
          setTimeout(() => render(state), 2000);
        }
        break;
      case 'win':
        render(state);
        showModal('🎉', '胜利！', `你用时 ${data.timeUsed} 秒合出了目标值 ${state.target}！`, '下一关', () => Game.nextLevel());
        break;
      case 'lose':
        render(state);
        if (data && data.reason === 'timeout') {
          showModal('⏰', '时间到！', '很遗憾，未能在规定时间内完成。', '重试', () => Game.reset());
        } else {
          showModal('😅', '结果不对', '剩余数字未能合出目标值，再想想？', '重试', () => Game.reset());
        }
        break;
      case 'tick':
        els.timerText.textContent = formatTime(state.timeLeft);
        els.timerText.classList.toggle('warning', state.timeLeft <= 10);
        break;
      case 'menu':
      case 'startGame':
        break;
    }
  });

  setupEventListeners();
})();
