/**
 * 2048 小游戏
 * 使用方向键或 WASD 移动，相同数字合并
 * 方块带平滑移动动画
 */
(function () {
  const GRID_SIZE = 4;
  const ANIM_DURATION = 150;
  const CELL_COLORS = {
    0: 'transparent',
    2: '#3b82f6',
    4: '#0ea5e9',
    8: '#06b6d4',
    16: '#14b8a6',
    32: '#10b981',
    64: '#22c55e',
    128: '#84cc16',
    256: '#eab308',
    512: '#f59e0b',
    1024: '#ef4444',
    2048: '#a855f7',
    4096: '#8b5cf6'
  };

  const gridEl = document.getElementById('game2048-grid');
  const scoreEl = document.getElementById('game2048-score');
  const bestEl = document.getElementById('game2048-best');
  const startBtn = document.getElementById('game2048-start');
  const overlay = document.getElementById('game2048-overlay');
  const overlayText = document.getElementById('game2048-overlay-text');
  const overlayBtn = document.getElementById('game2048-overlay-btn');

  if (!gridEl) return;

  let grid = [];
  let score = 0;
  let best = parseInt(localStorage.getItem('game2048-best') || '0', 10);
  let tileId = 0;
  let tileMap = new Map();
  let isAnimating = false;

  function initGrid() {
    grid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  }

  function addRandomTile() {
    const empty = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) empty.push({ r, c });
      }
    }
    if (empty.length === 0) return null;
    const { r, c } = empty[Math.floor(Math.random() * empty.length)];
    grid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return { r, c, value: grid[r][c] };
  }

  function getLines(dir) {
    const lines = [];
    if (dir === 'left' || dir === 'right') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const cells = [];
        const values = [];
        for (let c = 0; c < GRID_SIZE; c++) {
          cells.push({ r, c });
          values.push(grid[r][c]);
        }
        if (dir === 'right') {
          cells.reverse();
          values.reverse();
        }
        lines.push({ cells, values });
      }
    } else {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cells = [];
        const values = [];
        for (let r = 0; r < GRID_SIZE; r++) {
          cells.push({ r, c });
          values.push(grid[r][c]);
        }
        if (dir === 'down') {
          cells.reverse();
          values.reverse();
        }
        lines.push({ cells, values });
      }
    }
    return lines;
  }

  function mergeLine(arr) {
    const filtered = arr.filter(x => x > 0);
    const result = [];
    const merged = Array(GRID_SIZE).fill(false);
    const fromTo = [];
    let i = 0;
    let outIdx = 0;
    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        result.push(filtered[i] * 2);
        merged[outIdx] = true;
        fromTo.push({ from: i, to: outIdx, merged: true });
        fromTo.push({ from: i + 1, to: outIdx, merged: true });
        i += 2;
      } else {
        result.push(filtered[i]);
        fromTo.push({ from: i, to: outIdx, merged: false });
        i += 1;
      }
      outIdx++;
    }
    while (result.length < GRID_SIZE) result.push(0);
    return { values: result, merged, fromTo };
  }

  function computeMovements(direction) {
    const movements = [];
    const lineList = getLines(direction);
    let changed = false;

    for (const line of lineList) {
      const nonZeroCells = line.cells.filter((_, i) => line.values[i] > 0);
      const { values, fromTo } = mergeLine(line.values);

      for (const { from: fromIdx, to: toIdx, merged } of fromTo) {
        const fromCell = nonZeroCells[fromIdx];
        const toCell = line.cells[toIdx];
        const value = values[toIdx];
        movements.push({
          from: { r: fromCell.r, c: fromCell.c },
          to: { r: toCell.r, c: toCell.c },
          value,
          merged
        });
      }

      for (let i = 0; i < GRID_SIZE; i++) {
        const { r, c } = line.cells[i];
        if (grid[r][c] !== values[i]) changed = true;
      }
    }
    return { movements, changed };
  }

  function createTile(r, c, value, isNew) {
    const el = document.createElement('div');
    el.className = 'game2048-tile' + (isNew ? ' game2048-tile-new' : '');
    el.dataset.id = String(++tileId);
    el.textContent = value;
    el.style.setProperty('--row', r);
    el.style.setProperty('--col', c);
    el.style.backgroundColor = CELL_COLORS[value] || CELL_COLORS[0];
    el.style.color = value >= 8 ? '#fff' : 'var(--color-text)';
    return el;
  }

  function updateTile(el, r, c, value) {
    el.style.setProperty('--row', r);
    el.style.setProperty('--col', c);
    el.textContent = value;
    el.style.backgroundColor = CELL_COLORS[value] || CELL_COLORS[0];
    el.style.color = value >= 8 ? '#fff' : 'var(--color-text)';
  }

  function key(r, c) {
    return r + ',' + c;
  }

  function move(direction) {
    if (isAnimating) return false;
    const { movements, changed } = computeMovements(direction);
    if (!changed || movements.length === 0) return false;

    isAnimating = true;

    const mergedTargets = new Map();
    const tilesToRemove = [];
    const tilesToMove = [];
    const newTileMap = new Map();

    for (const m of movements) {
      const fromKey = key(m.from.r, m.from.c);
      const toKey = key(m.to.r, m.to.c);
      const el = tileMap.get(fromKey);
      if (!el) continue;

      updateTile(el, m.to.r, m.to.c, m.value);
      el.classList.remove('game2048-tile-new');
      if (m.merged) {
        el.classList.add('game2048-tile-merge');
        if (mergedTargets.has(toKey)) {
          tilesToRemove.push(el);
        } else {
          mergedTargets.set(toKey, el);
        }
      }
      tilesToMove.push(el);
      if (!mergedTargets.has(toKey) || mergedTargets.get(toKey) === el) {
        newTileMap.set(toKey, el);
      }
    }

    tileMap = newTileMap;

    const lineList = getLines(direction);
    for (const line of lineList) {
      const { values, merged } = mergeLine(line.values);
      for (let i = 0; i < GRID_SIZE; i++) {
        const { r, c } = line.cells[i];
        grid[r][c] = values[i];
        if (values[i] > 0 && merged[i]) score += values[i];
      }
    }

    if (best < score) {
      best = score;
      localStorage.setItem('game2048-best', String(best));
    }
    if (scoreEl) scoreEl.textContent = score;
    if (bestEl) bestEl.textContent = best;

    setTimeout(() => {
      for (const el of tilesToRemove) {
        el.remove();
      }
      for (const el of tilesToMove) {
        el.classList.remove('game2048-tile-merge');
      }
      const newTile = addRandomTile();
      if (newTile) {
        const el = createTile(newTile.r, newTile.c, newTile.value, true);
        const tilesWrap = gridEl.querySelector('.game2048-tiles');
        if (tilesWrap) tilesWrap.appendChild(el);
        tileMap.set(key(newTile.r, newTile.c), el);
      }
      isAnimating = false;
      if (checkGameOver()) showOverlay((window.i18n && window.i18n.t('game.gameOverExclaim')) || 'Game Over!');
    }, ANIM_DURATION);
    return true;
  }

  function checkGameOver() {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (grid[r][c] === 0) return false;
        if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return false;
        if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return false;
      }
    }
    return true;
  }

  function updateDisplay() {
    if (scoreEl) scoreEl.textContent = score;
    if (bestEl) bestEl.textContent = best;

    gridEl.innerHTML = '';
    gridEl.style.setProperty('--grid-size', GRID_SIZE);
    tileMap.clear();
    tileId = 0;

    const cellsWrap = document.createElement('div');
    cellsWrap.className = 'game2048-cells';
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const cell = document.createElement('div');
        cell.className = 'game2048-cell';
        cellsWrap.appendChild(cell);
      }
    }
    gridEl.appendChild(cellsWrap);

    const tilesWrap = document.createElement('div');
    tilesWrap.className = 'game2048-tiles';
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const val = grid[r][c];
        if (val > 0) {
          const tile = createTile(r, c, val, false);
          tilesWrap.appendChild(tile);
          tileMap.set(key(r, c), tile);
        }
      }
    }
    gridEl.appendChild(tilesWrap);
  }

  function showOverlay(text) {
    overlayText.textContent = text;
    overlay.classList.remove('hidden');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
  }

  function startGame() {
    initGrid();
    score = 0;
    addRandomTile();
    addRandomTile();
    updateDisplay();
    hideOverlay();
  }

  const keyMap = {
    ArrowLeft: 'left',
    ArrowRight: 'right',
    ArrowUp: 'up',
    ArrowDown: 'down',
    a: 'left',
    d: 'right',
    w: 'up',
    s: 'down'
  };

  document.addEventListener('keydown', (e) => {
    const section = document.getElementById('game-2048');
    if (!section || section.hidden) return;
    const dir = keyMap[e.key];
    if (dir) {
      e.preventDefault();
      move(dir);
    }
  });

  startBtn?.addEventListener('click', startGame);
  overlayBtn?.addEventListener('click', () => {
    hideOverlay();
    startGame();
  });

  if (bestEl) bestEl.textContent = best;
})();
