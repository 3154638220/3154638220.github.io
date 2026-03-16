/**
 * 游戏页标签切换
 */
(function () {
  const tabs = document.querySelectorAll('.game-tab');
  const sections = document.querySelectorAll('.game-section');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const gameId = tab.getAttribute('data-game');
      tabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      sections.forEach((sec) => {
        const match = (gameId === 'shoot' && sec.id === 'game-shoot') ||
          (gameId === '2048' && sec.id === 'game-2048') ||
          (gameId === 'reaction' && sec.id === 'game-reaction');
        sec.classList.toggle('active', !!match);
        sec.hidden = !match;
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
    });
  });
})();

/**
 * 射击小游戏 - 鼠标控制准星
 * 移动鼠标瞄准，点击射击目标
 */
(function () {
  const canvas = document.getElementById('game-canvas');
  const ctx = canvas?.getContext('2d');
  const crosshair = document.getElementById('game-crosshair');
  const scoreEl = document.getElementById('game-score');
  const targetsEl = document.getElementById('game-targets');
  const timeEl = document.getElementById('game-time');
  const startBtn = document.getElementById('game-start');
  const stopBtn = document.getElementById('game-stop');
  const overlay = document.getElementById('game-overlay');
  const overlayText = document.getElementById('game-overlay-text');
  const overlayBtn = document.getElementById('game-overlay-btn');

  if (!canvas || !ctx || !crosshair) return;

  // 游戏配置
  const CONFIG = {
    targetRadius: 24,
    targetCount: 3, // 场上同时存在的目标数量
    hitScore: 10
  };

  let state = {
    running: false,
    score: 0,
    targets: [],
    mouseX: 0,
    mouseY: 0,
    timer: null,
    startTime: 0,
    firstHitTime: null, // 第一次击中目标的时间，null 表示尚未击中
    remainingTime: 60,
    gameDuration: 60,
    reactionTimes: [] // 每次击中的反应延迟（ms）
  };

  function getSelectedDuration() {
    const radio = document.querySelector('input[name="game-duration"]:checked');
    return radio ? parseInt(radio.value, 10) : 60;
  }

  // 目标类
  function Target(x, y, radius, spawnTime) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.hit = false;
    this.spawnTime = spawnTime;
  }

  Target.prototype.draw = function () {
    if (this.hit) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.9)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 245, 255, 0.6)';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  function spawnTarget() {
    if (!state.running) return;
    const r = CONFIG.targetRadius;
    const x = r + Math.random() * (canvas.width - 2 * r);
    const y = r + Math.random() * (canvas.height - 2 * r);
    state.targets.push(new Target(x, y, r, Date.now()));
    updateTargetsDisplay();
  }

  function hitTest(x, y) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (x - rect.left) * scaleX;
    const canvasY = (y - rect.top) * scaleY;

    for (let i = state.targets.length - 1; i >= 0; i--) {
      const t = state.targets[i];
      if (t.hit) continue;
      const dx = canvasX - t.x;
      const dy = canvasY - t.y;
      if (dx * dx + dy * dy <= t.radius * t.radius) {
        t.hit = true;
        state.score += CONFIG.hitScore;
        state.reactionTimes.push(Date.now() - t.spawnTime);
        if (state.firstHitTime === null) state.firstHitTime = Date.now(); // 第一次击中，开始倒计时
        spawnTarget(); // 击中后立刻生成下一个目标
        return true;
      }
    }
    return false;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    state.targets.forEach(t => t.draw());
    state.targets = state.targets.filter(t => !t.hit);
    updateTargetsDisplay();
    updateScoreDisplay();
  }

  function updateScoreDisplay() {
    if (scoreEl) scoreEl.textContent = state.score;
  }

  function updateTargetsDisplay() {
    if (targetsEl) targetsEl.textContent = state.targets.length;
  }

  function updateTimerDisplay() {
    if (!timeEl) return;
    if (state.firstHitTime === null) {
      timeEl.textContent = state.gameDuration; // 等待首次击中，显示总时长
    } else {
      timeEl.textContent = Math.max(0, Math.ceil(state.remainingTime));
    }
  }

  function gameLoop() {
    if (state.running) draw();
    requestAnimationFrame(gameLoop);
  }

  function endGame(reason) {
    state.running = false;
    if (state.timer) clearInterval(state.timer);
    state.timer = null;
    document.querySelectorAll('input[name="game-duration"]').forEach((el) => { el.disabled = false; });
    startBtn.disabled = false;
    stopBtn.disabled = true;
    overlay.classList.remove('hidden');
    let msg = reason === 'time' ? `时间到！最终得分: ${state.score}` : `游戏结束，得分: ${state.score}`;
    if (state.reactionTimes.length > 0) {
      const avg = Math.round(state.reactionTimes.reduce((a, b) => a + b, 0) / state.reactionTimes.length);
      msg += ` · 平均反应延迟: ${avg} ms`;
    }
    overlayText.textContent = msg;
    overlayBtn.style.display = 'inline-block';
  }

  function startGame() {
    state.gameDuration = getSelectedDuration();
    state.running = true;
    state.score = 0;
    state.targets = [];
    state.reactionTimes = [];
    state.firstHitTime = null; // 倒计时从第一次击中开始
    state.remainingTime = state.gameDuration;
    state.startTime = Date.now();
    startBtn.disabled = true;
    stopBtn.disabled = false;
    overlay.classList.add('hidden');
    overlayBtn.style.display = 'none';

    document.querySelectorAll('input[name="game-duration"]').forEach((el) => { el.disabled = true; });
    updateScoreDisplay();
    updateTargetsDisplay();
    updateTimerDisplay();

    state.timer = setInterval(() => {
      if (state.firstHitTime !== null) {
        state.remainingTime = state.gameDuration - (Date.now() - state.firstHitTime) / 1000;
        updateTimerDisplay();
        if (state.remainingTime <= 0) endGame('time');
      } else {
        updateTimerDisplay();
      }
    }, 100);

    for (let i = 0; i < CONFIG.targetCount; i++) spawnTarget(); // 游戏开始时生成三个目标
    gameLoop();
  }

  function stopGame() {
    endGame('stop');
  }

  canvas.addEventListener('click', (e) => {
    if (!state.running) return;
    hitTest(e.clientX, e.clientY);
    updateScoreDisplay();
  });

  startBtn?.addEventListener('click', startGame);
  stopBtn?.addEventListener('click', stopGame);
  overlayBtn?.addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlayBtn.style.display = 'none';
    startGame();
  });
})();
