/**
 * 反应速度测试
 * 等待屏幕变绿后立即点击
 */
(function () {
  const area = document.getElementById('reaction-area');
  const hint = document.getElementById('reaction-hint');
  const startBtn = document.getElementById('reaction-start');
  const avgEl = document.getElementById('reaction-avg');
  const bestEl = document.getElementById('reaction-best');
  const countEl = document.getElementById('reaction-count');

  if (!area || !hint) return;

  const MIN_DELAY = 1500;
  const MAX_DELAY = 4000;

  let state = 'idle'; // idle | waiting | ready
  let timer = null;
  let times = [];
  let best = Infinity;

  function getBest() {
    return parseInt(localStorage.getItem('reaction-best') || '99999', 10);
  }

  function setBest(val) {
    if (val < best) {
      best = val;
      localStorage.setItem('reaction-best', String(val));
    }
  }

  function updateStats() {
    if (countEl) countEl.textContent = times.length;
    if (times.length > 0) {
      const avg = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
      if (avgEl) avgEl.textContent = avg + ' ms';
      const min = Math.min(...times);
      setBest(min);
      if (bestEl) bestEl.textContent = (best === Infinity ? '--' : best) + ' ms';
    }
  }

  function showReady() {
    state = 'ready';
    area.classList.remove('reaction-waiting');
    area.classList.add('reaction-ready');
    hint.textContent = '点击！';
  }

  function reset() {
    state = 'idle';
    area.classList.remove('reaction-waiting', 'reaction-ready');
    hint.textContent = '点击「开始测试」后等待变绿再点击';
  }

  function startTest() {
    if (state !== 'idle') return;
    state = 'waiting';
    area.classList.add('reaction-waiting');
    hint.textContent = '等待变绿...';

    const delay = MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY);

    timer = setTimeout(() => {
      timer = null;
      showReady();
      // 等待浏览器完成下一帧绘制后再开始计时，避免把渲染延迟计入反应时间
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window._reactionStartTime = performance.now();
        });
      });
    }, delay);
  }

  function onAreaClick(ev) {
    if (state === 'idle') return;

    if (state === 'waiting') {
      clearTimeout(timer);
      timer = null;
      hint.textContent = '太早了！请等待变绿后再点击';
      state = 'idle';
      area.classList.remove('reaction-waiting');
      setTimeout(reset, 1500);
      return;
    }

    if (state === 'ready') {
      // 使用事件 timeStamp 而非 performance.now()：更接近硬件输入时刻，减少主线程繁忙带来的误差
      const endTime = ev?.timeStamp ?? performance.now();
      const startTime = window._reactionStartTime ?? performance.now();
      const elapsed = Math.max(0, Math.round(endTime - startTime));
      times.push(elapsed);
      setBest(elapsed);
      updateStats();
      hint.textContent = elapsed + ' ms！点击「开始测试」继续下一轮';
      state = 'idle';
      area.classList.remove('reaction-ready');
    }
  }

  startBtn?.addEventListener('click', startTest);
  // 使用 pointerdown 而非 click：click 需等按下+松开，会多算 50–150ms；pointerdown 在首次按下时即触发，更接近真实反应时间
  area?.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    onAreaClick(e);
  }, { passive: false });

  best = getBest();
  if (bestEl && best < 99999) bestEl.textContent = best + ' ms';
  if (avgEl) avgEl.textContent = '--';
  if (countEl) countEl.textContent = '0';
})();
