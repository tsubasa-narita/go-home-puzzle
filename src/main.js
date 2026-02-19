/**
 * だ〜れだ？パズルラリー - メインアプリケーション
 */
import './style.css';
import { PUZZLES, getTodayPuzzle, saveProgress, loadProgress, resetProgress } from './puzzleData.js';
import { playStepSound, playGoalSound, startCelebration, animateButtonPress } from './effects.js';

// ===========================================
// State
// ===========================================
let currentStep = -1; // -1=未開始, 0=靴完了, 1=移動完了, 2=おうち完了, 3=おふろ完了, 4=ねる完了
let currentPuzzle = null;
let puzzleImage = null;
let revealMode = 'jigsaw'; // 'jigsaw' | 'curtain' | 'blur'

const REVEAL_MODES = [
  { id: 'jigsaw', label: '🧩 パズル' },
  { id: 'curtain', label: '🎭 カーテン' },
  { id: 'blur', label: '🌫️ ぼかし' },
];

// ===========================================
// Jigsaw Grid Settings
// ===========================================
const GRID_SIZE = 4; // 4×4 grid
const TOTAL_TILES = GRID_SIZE * GRID_SIZE; // 16 tiles

const STEPS = [
  {
    revealCount: 3,
    message: (puzzle) =>
      `あ！すこし みえた！✨<br>${puzzle.hints[0]}<br>いどう したら もっと みえるよ！`,
  },
  {
    revealCount: 6,
    message: (puzzle) =>
      `もっと みえてきた！🎉<br>${puzzle.hints[1]}<br>おうちに かえろう！`,
  },
  {
    revealCount: 9,
    message: (puzzle) =>
      `もうすぐ おうち だよ！🏠<br>なにかな？ なにかな？<br>おふろに はいろう！`,
  },
  {
    revealCount: 13,
    message: (puzzle) =>
      `きれいに なったね！🛀✨<br>もうすぐ わかるよ！<br>ねんね しようね！`,
  },
  {
    revealCount: TOTAL_TILES,
    message: (puzzle) =>
      `🎊 せいかい！<br><span style="color:#FF5722;font-size:1.3em;font-weight:900">${puzzle.name}</span><br>でした〜！おやすみ！😴`,
  },
];

// ===========================================
// DOM Elements
// ===========================================
const canvas = document.getElementById('puzzle-canvas');
const ctx = canvas.getContext('2d');
const hintText = document.getElementById('hint-text');
const messageText = document.getElementById('message-text');
const stepButtons = [
  document.getElementById('step-shoes'),
  document.getElementById('step-move'),
  document.getElementById('step-home'),
  document.getElementById('step-bath'),
  document.getElementById('step-bed'),
];

// Settings
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const resetBtn = document.getElementById('reset-btn');
const modalBackdrop = settingsModal.querySelector('.modal-backdrop');

// ===========================================
// Initialization
// ===========================================
function init() {
  // Load reveal mode
  revealMode = localStorage.getItem('reveal-mode') || 'jigsaw';

  // Check for manually selected puzzle
  const override = localStorage.getItem('puzzle-override');
  if (override) {
    currentPuzzle = PUZZLES.find(p => p.id === override) || getTodayPuzzle();
  } else {
    currentPuzzle = getTodayPuzzle();
  }

  // Load saved progress
  const saved = loadProgress();
  if (saved && saved.puzzleId === currentPuzzle.id) {
    currentStep = saved.step;
  }

  // Build pickers
  buildImagePicker();
  buildModePicker();

  // Load the puzzle image
  loadPuzzleImage();

  // Setup event listeners
  setupEventListeners();
}

function loadPuzzleImage() {
  puzzleImage = new Image();
  puzzleImage.crossOrigin = 'anonymous';
  puzzleImage.onload = () => {
    setupCanvas();
    renderPuzzle();
    updateUI();
  };
  puzzleImage.onerror = () => {
    console.error('Failed to load puzzle image:', currentPuzzle.image);
    ctx.fillStyle = '#333';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#FFF';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🖼️ がぞう よみこみちゅう...', canvas.width / 2, canvas.height / 2);
  };
  puzzleImage.src = currentPuzzle.image;
}

/**
 * 進捗保存（パズルIDも含む）
 */
function saveProgressWithId(step) {
  saveProgress(step);
  // Also save puzzle ID to match on reload
  const today = new Date().toISOString().split('T')[0];
  const data = { date: today, step, puzzleId: currentPuzzle.id };
  localStorage.setItem('puzzle-progress', JSON.stringify(data));
}

function setupCanvas() {
  // Make canvas square and match display size
  const frame = canvas.parentElement;
  const size = frame.clientWidth;
  canvas.width = size * window.devicePixelRatio;
  canvas.height = size * window.devicePixelRatio;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

// ===========================================
// Jigsaw Tile Order (seeded shuffle by puzzle ID)
// ===========================================
function getShuffledTileOrder(puzzleId) {
  // Simple hash for seed
  let seed = 0;
  for (let i = 0; i < puzzleId.length; i++) {
    seed = ((seed << 5) - seed) + puzzleId.charCodeAt(i);
    seed = seed & seed;
  }
  // Ensure positive seed
  seed = Math.abs(seed) || 1;

  const seededRandom = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  // Fisher-Yates shuffle
  const tiles = Array.from({ length: TOTAL_TILES }, (_, i) => i);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

// ===========================================
// Reveal percent mapping (for curtain & blur modes)
// ===========================================
const REVEAL_PERCENTS = [0.25, 0.40, 0.55, 0.80, 1.0];

// ===========================================
// Rendering
// ===========================================
function renderPuzzle() {
  if (!puzzleImage || !puzzleImage.complete) return;

  const displaySize = canvas.width / window.devicePixelRatio;
  ctx.clearRect(0, 0, displaySize, displaySize);

  if (currentStep >= STEPS.length - 1) {
    // Fully revealed!
    drawFullImage(displaySize);
  } else if (currentStep >= 0) {
    if (revealMode === 'jigsaw') {
      drawJigsawReveal(displaySize, STEPS[currentStep].revealCount);
    } else if (revealMode === 'blur') {
      drawBlurReveal(displaySize, REVEAL_PERCENTS[currentStep]);
    } else {
      drawCurtainReveal(displaySize, REVEAL_PERCENTS[currentStep]);
    }
  } else {
    if (revealMode === 'jigsaw') {
      drawAllHidden(displaySize);
    } else if (revealMode === 'blur') {
      drawBlurReveal(displaySize, 0);
    } else {
      drawSilhouette(displaySize);
    }
  }
}

/**
 * 全タイル裏面（未公開）を描画
 */
function drawAllHidden(size) {
  const tileSize = size / GRID_SIZE;
  for (let i = 0; i < TOTAL_TILES; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    drawHiddenTile(col * tileSize, row * tileSize, tileSize);
  }
  // Big question mark in center
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = `bold ${size * 0.35}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('？', size / 2, size / 2);
}

/**
 * ジグソー方式：タイルごとに表/裏を描画
 */
function drawJigsawReveal(size, revealCount) {
  const tileSize = size / GRID_SIZE;
  const tileOrder = getShuffledTileOrder(currentPuzzle.id);
  const revealedSet = new Set(tileOrder.slice(0, revealCount));

  for (let i = 0; i < TOTAL_TILES; i++) {
    const row = Math.floor(i / GRID_SIZE);
    const col = i % GRID_SIZE;
    const x = col * tileSize;
    const y = row * tileSize;

    if (revealedSet.has(i)) {
      // Draw revealed tile (image portion)
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, tileSize, tileSize);
      ctx.clip();
      drawImageCover(size);
      ctx.restore();
    } else {
      // Draw hidden tile
      drawHiddenTile(x, y, tileSize);
    }
  }

  // Draw grid lines for visual separation
  drawGridLines(size, tileSize);
}

/**
 * 裏面タイルを描画（ダーク＋？マーク）
 */
function drawHiddenTile(x, y, tileSize) {
  const grad = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#16213e');
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, tileSize, tileSize);

  // Small question mark
  ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.font = `bold ${tileSize * 0.4}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('？', x + tileSize / 2, y + tileSize / 2);
}

/**
 * グリッド線を描画
 */
function drawGridLines(size, tileSize) {
  ctx.strokeStyle = 'rgba(255, 200, 0, 0.5)';
  ctx.lineWidth = 2;
  for (let i = 1; i < GRID_SIZE; i++) {
    // Vertical
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, size);
    ctx.stroke();
    // Horizontal
    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(size, i * tileSize);
    ctx.stroke();
  }
}

/**
 * 画像を全て表示
 */
function drawFullImage(size) {
  drawImageCover(size);
}

// ===========================================
// Curtain Mode (カーテン方式: 下から上に公開)
// ===========================================
/**
 * 完全なシルエット（黒）を描画
 */
function drawSilhouette(size) {
  drawImageCover(size);
  ctx.globalCompositeOperation = 'source-atop';
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#16213e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = `bold ${size * 0.4}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('？', size / 2, size / 2);
}

/**
 * カーテン方式：部分的に画像を表示（下から上）
 */
function drawCurtainReveal(size, percent) {
  const revealHeight = size * percent;
  const silhouetteHeight = size - revealHeight;

  // Revealed area (bottom)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, silhouetteHeight, size, revealHeight);
  ctx.clip();
  drawImageCover(size);
  ctx.restore();

  // Silhouette area (top)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, size, silhouetteHeight);
  ctx.clip();
  drawImageCover(size);
  ctx.globalCompositeOperation = 'source-atop';
  const grad = ctx.createLinearGradient(0, 0, 0, silhouetteHeight);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#2d2d5e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, silhouetteHeight);
  ctx.restore();

  // Dividing line
  ctx.globalCompositeOperation = 'source-over';
  const lineGrad = ctx.createLinearGradient(0, silhouetteHeight - 3, 0, silhouetteHeight + 3);
  lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  lineGrad.addColorStop(0.5, 'rgba(255, 200, 0, 0.8)');
  lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = lineGrad;
  ctx.fillRect(0, silhouetteHeight - 3, size, 6);

  // Question mark in dark area
  if (silhouetteHeight > 60) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.font = `bold ${Math.min(silhouetteHeight * 0.5, size * 0.3)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('？', size / 2, silhouetteHeight / 2);
  }
}

// ===========================================
// Blur Mode (ぼかし方式: 段階的にクリアに)
// ===========================================
/**
 * ぼかし方式：段階的にブラーを弱くする
 */
function drawBlurReveal(size, percent) {
  // percent 0=全ぼかし, 1=クリア
  // blur range: 30px (full blur) -> 0px (clear)
  const maxBlur = 30;
  const blurAmount = maxBlur * (1 - percent);

  ctx.save();
  ctx.filter = `blur(${blurAmount}px)`;
  drawImageCover(size);
  ctx.restore();

  // Reset filter
  ctx.filter = 'none';

  // Question mark overlay when heavily blurred
  if (blurAmount > 10) {
    ctx.fillStyle = `rgba(255, 255, 255, ${0.2 * (blurAmount / maxBlur)})`;
    ctx.font = `bold ${size * 0.35}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('？', size / 2, size / 2);
  }
}

/**
 * 画像をカバーモードで描画（中央揃え、アスペクト比維持）
 */
function drawImageCover(size) {
  const img = puzzleImage;
  const imgRatio = img.naturalWidth / img.naturalHeight;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

  if (imgRatio > 1) {
    // Landscape: crop sides
    sw = img.naturalHeight;
    sx = (img.naturalWidth - sw) / 2;
  } else if (imgRatio < 1) {
    // Portrait: crop top/bottom
    sh = img.naturalWidth;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size);
}

// ===========================================
// UI Update
// ===========================================
function updateUI() {
  // Update step buttons
  stepButtons.forEach((btn, i) => {
    btn.classList.remove('active', 'completed', 'locked');
    btn.disabled = true;

    if (i <= currentStep) {
      btn.classList.add('completed');
    } else if (i === currentStep + 1) {
      btn.classList.add('active');
      btn.disabled = false;
    } else {
      btn.classList.add('locked');
    }
  });

  // Update hint text
  if (currentStep >= 0 && currentStep < STEPS.length - 1) {
    hintText.textContent = currentPuzzle.hints[currentStep] || '';
    hintText.classList.add('visible');
  } else {
    hintText.classList.remove('visible');
  }

  // Update message
  if (currentStep >= 0 && currentStep < STEPS.length) {
    messageText.innerHTML = STEPS[currentStep].message(currentPuzzle);
  } else {
    messageText.innerHTML = 'だ〜れだ？<br>くつをはいてみてみよう！✨';
  }

  // Update image picker selection
  updateImagePickerSelection();
}

// ===========================================
// Step Actions
// ===========================================
function completeStep(stepIndex) {
  if (stepIndex !== currentStep + 1) return;

  currentStep = stepIndex;
  saveProgressWithId(currentStep);

  // Animate the button
  animateButtonPress(stepButtons[stepIndex]);

  // Play sound
  if (stepIndex === STEPS.length - 1) {
    playGoalSound();
  } else {
    playStepSound();
  }

  // Re-render with transition
  renderPuzzle();

  if (stepIndex === STEPS.length - 1) {
    // Final step: show full image with celebration
    updateUI();
    awardStamp();
    setTimeout(() => {
      startCelebration();
    }, 500);
  } else {
    // Normal step
    setTimeout(() => {
      updateUI();
    }, 100);
  }
}

// ===========================================
// Event Listeners
// ===========================================
function setupEventListeners() {
  // Step buttons
  stepButtons.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      completeStep(i);
    });
  });

  // Settings
  settingsBtn.addEventListener('click', () => {
    settingsModal.classList.remove('hidden');
  });

  closeSettings.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  modalBackdrop.addEventListener('click', () => {
    settingsModal.classList.add('hidden');
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    resetProgress();
    localStorage.removeItem('puzzle-override');
    currentStep = -1;
    currentPuzzle = getTodayPuzzle();
    loadPuzzleImage();
    settingsModal.classList.add('hidden');
  });

  // Handle resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      setupCanvas();
      renderPuzzle();
    }, 200);
  });

  // Stamp modal
  const stampBtn = document.getElementById('stamp-btn');
  const stampModal = document.getElementById('stamp-modal');
  const closeStamps = document.getElementById('close-stamps');
  const stampBackdrop = stampModal.querySelector('.modal-backdrop');

  stampBtn.addEventListener('click', () => {
    buildStampGrid();
    stampModal.classList.remove('hidden');
  });

  closeStamps.addEventListener('click', () => {
    stampModal.classList.add('hidden');
  });

  stampBackdrop.addEventListener('click', () => {
    stampModal.classList.add('hidden');
  });
}

// ===========================================
// Image Picker
// ===========================================
function buildImagePicker() {
  const picker = document.getElementById('image-picker');
  if (!picker) return;
  picker.innerHTML = '';

  PUZZLES.forEach((puzzle) => {
    const btn = document.createElement('button');
    btn.className = 'image-picker-item';
    btn.dataset.puzzleId = puzzle.id;
    if (puzzle.id === currentPuzzle.id) {
      btn.classList.add('selected');
    }

    const img = document.createElement('img');
    img.src = puzzle.image;
    img.alt = puzzle.name;

    const label = document.createElement('span');
    label.textContent = puzzle.name;

    btn.appendChild(img);
    btn.appendChild(label);

    btn.addEventListener('click', () => {
      switchPuzzle(puzzle.id);
    });

    picker.appendChild(btn);
  });
}

function switchPuzzle(puzzleId) {
  const newPuzzle = PUZZLES.find(p => p.id === puzzleId);
  if (!newPuzzle || newPuzzle.id === currentPuzzle.id) return;

  // Save override and reset progress
  localStorage.setItem('puzzle-override', puzzleId);
  resetProgress();
  currentStep = -1;
  currentPuzzle = newPuzzle;
  loadPuzzleImage();
  settingsModal.classList.add('hidden');
}

function updateImagePickerSelection() {
  const items = document.querySelectorAll('.image-picker-item');
  items.forEach(item => {
    item.classList.toggle('selected', item.dataset.puzzleId === currentPuzzle.id);
  });
}

// ===========================================
// Mode Picker
// ===========================================
function buildModePicker() {
  const container = document.getElementById('mode-picker');
  if (!container) return;
  container.innerHTML = '';

  REVEAL_MODES.forEach((mode) => {
    const btn = document.createElement('button');
    btn.className = 'mode-picker-item';
    btn.dataset.modeId = mode.id;
    if (mode.id === revealMode) {
      btn.classList.add('selected');
    }
    btn.textContent = mode.label;
    btn.addEventListener('click', () => {
      switchMode(mode.id);
    });
    container.appendChild(btn);
  });
}

function switchMode(modeId) {
  if (modeId === revealMode) return;
  revealMode = modeId;
  localStorage.setItem('reveal-mode', modeId);

  // Reset progress and re-render
  resetProgress();
  currentStep = -1;
  renderPuzzle();
  updateUI();

  // Update mode picker selection
  const items = document.querySelectorAll('.mode-picker-item');
  items.forEach(item => {
    item.classList.toggle('selected', item.dataset.modeId === revealMode);
  });
}

// ===========================================
// Stamp Card
// ===========================================
const STAMP_KEY = 'puzzle-stamps';

function loadStamps() {
  try {
    return JSON.parse(localStorage.getItem(STAMP_KEY)) || [];
  } catch {
    return [];
  }
}

function saveStamps(stamps) {
  localStorage.setItem(STAMP_KEY, JSON.stringify(stamps));
}

function awardStamp() {
  const stamps = loadStamps();
  const today = new Date().toISOString().slice(0, 10);

  // Don't duplicate stamp for same date + puzzle
  const exists = stamps.some(s => s.date === today && s.puzzleId === currentPuzzle.id);
  if (exists) return;

  stamps.push({
    date: today,
    puzzleId: currentPuzzle.id,
    puzzleName: currentPuzzle.name,
    image: currentPuzzle.image,
  });
  saveStamps(stamps);
}

function getStreak() {
  const stamps = loadStamps();
  if (stamps.length === 0) return 0;

  // Get unique dates, sorted descending
  const dates = [...new Set(stamps.map(s => s.date))].sort().reverse();
  const today = new Date().toISOString().slice(0, 10);

  // Check if latest stamp is today or yesterday
  if (dates[0] !== today) {
    // Check if yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    if (dates[0] !== yesterdayStr) return 0;
  }

  let streak = 1;
  for (let i = 0; i < dates.length - 1; i++) {
    const curr = new Date(dates[i]);
    const prev = new Date(dates[i + 1]);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function buildStampGrid() {
  const stamps = loadStamps();
  const streakEl = document.getElementById('stamp-streak');
  const gridEl = document.getElementById('stamp-grid');

  // Streak display
  const streak = getStreak();
  if (streak >= 2) {
    streakEl.textContent = `🔥 ${streak}にち れんぞく！すごい！`;
    streakEl.style.display = 'block';
  } else if (stamps.length > 0) {
    streakEl.textContent = `⭐ スタンプ ${stamps.length}こ ゲット！`;
    streakEl.style.display = 'block';
  } else {
    streakEl.textContent = 'パズルを クリア して スタンプを あつめよう！';
    streakEl.style.display = 'block';
  }

  // Grid
  gridEl.innerHTML = '';

  // Show earned stamps (newest first)
  const reversed = [...stamps].reverse();
  reversed.forEach((stamp) => {
    const item = document.createElement('div');
    item.className = 'stamp-item earned';

    const img = document.createElement('img');
    img.className = 'stamp-img';
    img.src = stamp.image;
    img.alt = stamp.puzzleName;

    const name = document.createElement('span');
    name.className = 'stamp-name';
    name.textContent = stamp.puzzleName;

    const date = document.createElement('span');
    date.className = 'stamp-date';
    // Format: MM/DD
    const [, m, d] = stamp.date.split('-');
    date.textContent = `${parseInt(m)}/${parseInt(d)}`;

    item.appendChild(img);
    item.appendChild(name);
    item.appendChild(date);
    gridEl.appendChild(item);
  });

  // Fill remaining slots to show 8 minimum
  const minSlots = 8;
  const remaining = Math.max(0, minSlots - stamps.length);
  for (let i = 0; i < remaining; i++) {
    const item = document.createElement('div');
    item.className = 'stamp-item empty';
    const text = document.createElement('span');
    text.className = 'stamp-empty-text';
    text.textContent = '？';
    item.appendChild(text);
    gridEl.appendChild(item);
  }
}

// ===========================================
// PWA Registration
// ===========================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW registration failed, that's okay for development
    });
  });
}

// ===========================================
// Start!
// ===========================================
document.addEventListener('DOMContentLoaded', init);
// Also handle the case where script loads after DOMContentLoaded
if (document.readyState !== 'loading') {
  init();
}
