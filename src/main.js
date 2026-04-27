/**
 * だ〜れだ？パズルラリー - メインアプリケーション
 */
import './style.css';
import { PUZZLES, getTodayPuzzle, saveProgress, loadProgress, resetProgress, getAllPuzzlesWithCustom } from './puzzleData.js';
import { playStepSound, playGoalSound, startCelebration, animateButtonPress } from './effects.js';
import { ALL_STEPS, DEFAULT_WEEKDAY, DEFAULT_HOLIDAY, getStepDefs, calcRevealCounts, calcRevealPercents } from './stepRegistry.js';
import { saveImage, deleteImage, getImageCount, resizeImage, MAX_IMAGES } from './imageStore.js';

// ===========================================
// State
// ===========================================
let currentStep = -1;
let currentPuzzle = null;
let puzzleImage = null;
let revealMode = 'jigsaw'; // 'jigsaw' | 'curtain' | 'blur'
let dayMode = 'weekday'; // 'weekday' | 'holiday'
let activeStepIds = []; // current active step IDs
let activeStepDefs = []; // current active step definitions
let allPuzzles = [...PUZZLES]; // built-in + custom puzzles

const REVEAL_MODES = [
  { id: 'jigsaw', label: '🧩 パズル' },
  { id: 'curtain', label: '🎭 カーテン' },
  { id: 'blur', label: '🌫️ ぼかし' },
];

// ===========================================
// Timer State
// ===========================================
let timerEnabled = false;
let timerDuration = 180;      // seconds (default 3 min)
let timerRemaining = 0;
let timerIntervalId = null;
let timerPaused = false;
const TIMER_DOT_COUNT = 10;   // number of dots in timer bar
const TIMER_DURATIONS = [
  { seconds: 60, label: '1ぷん' },
  { seconds: 180, label: '3ぷん' },
  { seconds: 300, label: '5ぷん' },
];

// ===========================================
// Jigsaw Grid Settings
// ===========================================
const GRID_SIZE = 4;
const TOTAL_TILES = GRID_SIZE * GRID_SIZE;

// Dynamic steps (rebuilt when step config changes)
let STEPS = [];
let REVEAL_PERCENTS = [];

function buildDynamicSteps() {
  const count = activeStepDefs.length;
  const revealCounts = calcRevealCounts(count, TOTAL_TILES);
  REVEAL_PERCENTS = calcRevealPercents(count);

  STEPS = activeStepDefs.map((stepDef, i) => {
    if (i === count - 1) {
      // Final step
      return {
        revealCount: revealCounts[i],
        message: (puzzle) =>
          `🎊 せいかい！<br><span style="color:#FF5722;font-size:1.3em;font-weight:900">${puzzle.name}</span><br>でした〜！おやすみ！😴`,
      };
    } else {
      return {
        revealCount: revealCounts[i],
        message: (puzzle) => {
          const hint = puzzle.hints[i % puzzle.hints.length] || '';
          const nextLabel = activeStepDefs[i + 1]?.label || 'つぎ';
          return `${stepDef.goalMsg} ✨<br>${hint}<br>つぎは ${nextLabel} だよ！`;
        },
      };
    }
  });
}

// ===========================================
// DOM Elements
// ===========================================
const canvas = document.getElementById('puzzle-canvas');
const ctx = canvas.getContext('2d');
const hintText = document.getElementById('hint-text');
const messageText = document.getElementById('message-text');
let stepButtons = []; // dynamically built

// Settings
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const resetBtn = document.getElementById('reset-btn');
const modalBackdrop = settingsModal.querySelector('.modal-backdrop');
const countQuizModal = document.getElementById('count-quiz-modal');
const countQuizBackdrop = countQuizModal.querySelector('.modal-backdrop');
const countQuizPrompt = document.getElementById('count-quiz-prompt');
const countQuizNote = document.getElementById('count-quiz-note');
const countQuizChoices = document.getElementById('count-quiz-choices');
const countQuizFeedback = document.getElementById('count-quiz-feedback');
const closeCountQuizBtn = document.getElementById('close-count-quiz');

let currentCountQuizOptions = [];
const SELECTED_PUZZLES_KEY = 'selected-puzzle-history';

// ===========================================
// Initialization
// ===========================================
let _initialized = false;
async function init() {
  if (_initialized) return;
  _initialized = true;
  try {
    console.log('[PUZZLE] init() start');
    // Load settings
    revealMode = localStorage.getItem('reveal-mode') || 'jigsaw';
    dayMode = localStorage.getItem('day-mode') || 'weekday';
    loadTimerConfig();
    loadStepConfig();
    console.log('[PUZZLE] loadStepConfig done, activeStepDefs:', activeStepDefs.length);

    // Build dynamic steps & step bar
    buildDynamicSteps();
    buildStepBar();
    console.log('[PUZZLE] buildStepBar done, stepButtons:', stepButtons.length);

    // Load custom images from IndexedDB
    allPuzzles = await getAllPuzzlesWithCustom();
    console.log('[PUZZLE] allPuzzles loaded:', allPuzzles.length);

    // Check for manually selected puzzle
    const override = localStorage.getItem('puzzle-override');
    if (override) {
      currentPuzzle = allPuzzles.find(p => p.id === override) || getTodayPuzzle();
    } else {
      currentPuzzle = getTodayPuzzle();
    }
    markPuzzleSelected(currentPuzzle.id);

    // Load saved progress
    const saved = loadProgress();
    if (saved && saved.puzzleId === currentPuzzle.id) {
      currentStep = saved.step;
    }

    // Build pickers
    buildImagePicker();
    buildModePicker();
    buildStepPicker();
    buildStepOrderList();
    buildDayModeToggle();
    buildTimerSettings();

    // Load the puzzle image
    loadPuzzleImage();

    // Setup event listeners
    setupEventListeners();

    // Auto-start timer if mid-progress and timer is enabled
    if (timerEnabled && currentStep >= 0 && currentStep < STEPS.length - 1) {
      console.log('[TIMER] Auto-starting timer on page load, currentStep:', currentStep);
      startTimer();
    }

    if (currentStep === STEPS.length - 1 && shouldShowCountQuiz()) {
      setTimeout(() => {
        showCountQuizModal();
      }, 600);
    }

    console.log('[PUZZLE] init() complete, timerEnabled:', timerEnabled);
  } catch (err) {
    console.error('[PUZZLE] init() ERROR:', err);
  }
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
    const firstLabel = activeStepDefs.length > 0 ? activeStepDefs[0].label : '';
    messageText.innerHTML = `だ〜れだ？<br>${firstLabel} してみよう！✨`;
  }

  // Update image picker selection
  updateImagePickerSelection();

  // Update timer UI
  updateTimerUI();
}

function hasCountQuiz(puzzle = currentPuzzle) {
  return Boolean(
    puzzle &&
    puzzle.countQuiz &&
    puzzle.countQuiz.enabled &&
    Number.isInteger(puzzle.countQuiz.answer)
  );
}

function buildCountQuizOptions(answer) {
  const options = answer <= 2 ? [1, 2, 3] : [answer - 1, answer, answer + 1];
  const unique = [...new Set(options)].filter((value) => value >= 1);

  while (unique.length < 3) {
    unique.push(unique[unique.length - 1] + 1);
  }

  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }

  return unique;
}

function closeCountQuizModal() {
  countQuizModal.classList.add('hidden');
  countQuizFeedback.textContent = '';
  countQuizFeedback.className = 'count-quiz-feedback';
  countQuizChoices.innerHTML = '';
  currentCountQuizOptions = [];
}

function shouldShowCountQuiz() {
  return hasCountQuiz() && !hasEarnedCountQuizStamp(currentPuzzle.id);
}

function showCountQuizModal() {
  if (!shouldShowCountQuiz()) return;

  const quiz = currentPuzzle.countQuiz;
  currentCountQuizOptions = buildCountQuizOptions(quiz.answer);
  countQuizPrompt.textContent = quiz.prompt || 'でんしゃは なんだい いたかな？';
  countQuizNote.textContent = quiz.note || 'みえている でんしゃを かぞえてね';
  countQuizFeedback.textContent = '';
  countQuizFeedback.className = 'count-quiz-feedback';
  countQuizChoices.innerHTML = '';

  currentCountQuizOptions.forEach((choice) => {
    const button = document.createElement('button');
    button.className = 'count-quiz-choice';
    button.type = 'button';
    button.textContent = String(choice);
    button.addEventListener('click', () => {
      answerCountQuiz(choice, button);
    });
    countQuizChoices.appendChild(button);
  });

  countQuizModal.classList.remove('hidden');
}

function answerCountQuiz(choice, selectedButton) {
  if (!hasCountQuiz()) return;

  const answer = currentPuzzle.countQuiz.answer;
  const buttons = Array.from(countQuizChoices.querySelectorAll('.count-quiz-choice'));

  if (choice === answer) {
    buttons.forEach((button) => {
      const value = Number(button.textContent);
      button.disabled = true;
      button.classList.toggle('correct', value === answer);
    });

    awardCountQuizStamp();
    countQuizFeedback.textContent = 'せいかい！ すうじはかせ！';
    countQuizFeedback.className = 'count-quiz-feedback success';
    messageText.innerHTML = 'せいかい！<br>すうじはかせ バッジ ゲット！🏅';

    setTimeout(() => {
      closeCountQuizModal();
      startCelebration({ particleCount: 130, spawnLimit: 220, durationMs: 6500 });
    }, 900);
    return;
  }

  selectedButton.classList.add('wrong');
  setTimeout(() => {
    selectedButton.classList.remove('wrong');
  }, 650);
  countQuizFeedback.textContent = 'おしい！ もういちど みてみよう';
  countQuizFeedback.className = 'count-quiz-feedback error';
}

// ===========================================
// Step Actions
// ===========================================
function completeStep(stepIndex) {
  if (stepIndex !== currentStep + 1) return;
  console.log('[TIMER] completeStep:', stepIndex, 'timerEnabled:', timerEnabled, 'totalSteps:', STEPS.length);

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
    stopTimer();
    resetTimerOverlay();
    updateUI();
    awardStamp();
    setTimeout(() => {
      startCelebration();
      if (shouldShowCountQuiz()) {
        setTimeout(() => {
          showCountQuizModal();
        }, 900);
      }
    }, 500);
  } else {
    // Normal step: start/restart timer
    resetTimerOverlay();
    if (timerEnabled) {
      console.log('[TIMER] Starting timer from completeStep, duration:', timerDuration);
      startTimer();
    }
    setTimeout(() => {
      updateUI();
    }, 100);
  }
}

// ===========================================
// Timer Functions
// ===========================================
function loadTimerConfig() {
  timerEnabled = localStorage.getItem('timer-enabled') === 'true';
  const savedDuration = parseInt(localStorage.getItem('timer-duration'), 10);
  if (savedDuration && TIMER_DURATIONS.some(d => d.seconds === savedDuration)) {
    timerDuration = savedDuration;
  }
}

function saveTimerConfig() {
  localStorage.setItem('timer-enabled', String(timerEnabled));
  localStorage.setItem('timer-duration', String(timerDuration));
}

function startTimer() {
  console.log('[TIMER] startTimer called, duration:', timerDuration, 'enabled:', timerEnabled);
  stopTimer();
  timerRemaining = timerDuration;
  timerPaused = false;
  showTimerBar(true);
  updateTimerUI();
  updateTimerOverlay();
  timerIntervalId = setInterval(() => {
    tickTimer();
  }, 1000);
  console.log('[TIMER] Timer started, intervalId:', timerIntervalId, 'remaining:', timerRemaining);
}

function stopTimer() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
  timerRemaining = 0;
  timerPaused = false;
  showTimerBar(false);
  // Remove warning class
  const frame = document.querySelector('.puzzle-frame');
  if (frame) frame.classList.remove('timer-warning');
  // Reset pause button
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (pauseBtn) {
    pauseBtn.classList.remove('paused');
    pauseBtn.textContent = '⏸️';
  }
}

function pauseTimer() {
  if (!timerIntervalId || timerPaused) return;
  timerPaused = true;
  clearInterval(timerIntervalId);
  timerIntervalId = null;
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (pauseBtn) {
    pauseBtn.classList.add('paused');
    pauseBtn.textContent = '▶️';
  }
  // Remove warning while paused
  const frame = document.querySelector('.puzzle-frame');
  if (frame) frame.classList.remove('timer-warning');
}

function resumeTimer() {
  if (!timerPaused || timerRemaining <= 0) return;
  timerPaused = false;
  const pauseBtn = document.getElementById('timer-pause-btn');
  if (pauseBtn) {
    pauseBtn.classList.remove('paused');
    pauseBtn.textContent = '⏸️';
  }
  timerIntervalId = setInterval(() => {
    tickTimer();
  }, 1000);
}

function tickTimer() {
  if (timerPaused) return;
  timerRemaining--;

  // Warning at 30 seconds or less
  const frame = document.querySelector('.puzzle-frame');
  if (timerRemaining <= 30 && timerRemaining > 0) {
    if (frame) frame.classList.add('timer-warning');
  } else {
    if (frame) frame.classList.remove('timer-warning');
  }

  updateTimerUI();
  updateTimerOverlay();

  if (timerRemaining <= 0) {
    // Time's up! Regress one step
    regressStep();
  }
}

/**
 * パズルオーバーレイの不透明度を更新
 * タイマー経過に応じてパズルが暗くなっていく
 */
function updateTimerOverlay() {
  const overlay = document.getElementById('timer-overlay');
  if (!overlay) return;

  if (!timerEnabled || timerRemaining <= 0 || !timerIntervalId) {
    return; // overlay is reset via resetTimerOverlay
  }

  const ratio = timerRemaining / timerDuration; // 1.0 → 0.0
  // Opacity: 0 (full time) → 0.85 (time's up)
  const opacity = (1 - ratio) * 0.85;
  overlay.style.opacity = String(opacity);

  // Show ? mark when more than half darkened
  if (ratio < 0.5) {
    overlay.classList.add('show-question');
  } else {
    overlay.classList.remove('show-question');
  }
}

/**
 * パズルオーバーレイをリセット（透明に戻す）
 */
function resetTimerOverlay() {
  const overlay = document.getElementById('timer-overlay');
  if (!overlay) return;
  overlay.style.opacity = '0';
  overlay.classList.remove('show-question');
}

function regressStep() {
  stopTimer();

  if (currentStep < 0) return; // already at start

  // Go back one step
  currentStep = currentStep - 1;
  saveProgressWithId(Math.max(currentStep, 0));

  // Re-render
  renderPuzzle();
  updateUI();

  // Update message to encourage action
  if (currentStep >= 0) {
    const nextLabel = activeStepDefs[currentStep + 1]?.label || 'つぎ';
    messageText.innerHTML = `⏳ じかんぎれ！<br>${nextLabel} を はやく やろう！`;
  } else {
    const firstLabel = activeStepDefs.length > 0 ? activeStepDefs[0].label : '';
    messageText.innerHTML = `⏳ じかんぎれ！<br>${firstLabel} を はやく やろう！`;
  }

  // Restart timer if still has steps to do
  if (currentStep >= 0 && timerEnabled) {
    startTimer();
  }
}

function showTimerBar(visible) {
  const bar = document.getElementById('timer-bar');
  if (!bar) return;
  if (visible && timerEnabled) {
    bar.classList.remove('hidden');
  } else {
    bar.classList.add('hidden');
  }
}

function updateTimerUI() {
  const dotsContainer = document.getElementById('timer-dots');
  if (!dotsContainer) return;

  // Only show if timer is active
  if (!timerEnabled || (timerRemaining <= 0 && !timerIntervalId)) {
    return;
  }

  // Build dots if needed
  if (dotsContainer.children.length !== TIMER_DOT_COUNT) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < TIMER_DOT_COUNT; i++) {
      const dot = document.createElement('div');
      dot.className = 'timer-dot';
      dotsContainer.appendChild(dot);
    }
  }

  // Calculate how many dots should be "on"
  const ratio = timerRemaining / timerDuration;
  const activeDots = Math.ceil(ratio * TIMER_DOT_COUNT);
  const warningThreshold = 30 / timerDuration; // 30 seconds
  const cautionThreshold = 0.5; // 50%

  const dots = dotsContainer.children;
  for (let i = 0; i < TIMER_DOT_COUNT; i++) {
    const dot = dots[i];
    dot.classList.remove('warning', 'danger', 'off');

    if (i >= activeDots) {
      dot.classList.add('off');
    } else if (ratio <= warningThreshold) {
      dot.classList.add('danger');
    } else if (ratio <= cautionThreshold) {
      dot.classList.add('warning');
    }
    // else: default green (no extra class)
  }
}

// ===========================================
// Timer Settings
// ===========================================
function buildTimerSettings() {
  // Toggle
  const toggle = document.getElementById('timer-toggle');
  if (toggle) {
    toggle.checked = timerEnabled;
    toggle.addEventListener('change', () => {
      timerEnabled = toggle.checked;
      saveTimerConfig();
      if (!timerEnabled) {
        stopTimer();
      } else if (currentStep >= 0 && currentStep < STEPS.length - 1) {
        // Mid-puzzle: start timer immediately
        startTimer();
      }
      updateTimerDurationPickerState();
    });
  }

  // Duration picker
  const container = document.getElementById('timer-duration-picker');
  if (!container) return;
  container.innerHTML = '';

  TIMER_DURATIONS.forEach((dur) => {
    const btn = document.createElement('button');
    btn.className = 'mode-picker-item';
    btn.dataset.seconds = String(dur.seconds);
    if (dur.seconds === timerDuration) {
      btn.classList.add('selected');
    }
    btn.textContent = dur.label;
    btn.addEventListener('click', () => {
      timerDuration = dur.seconds;
      saveTimerConfig();
      // Update selection
      container.querySelectorAll('.mode-picker-item').forEach(b => {
        b.classList.toggle('selected', b.dataset.seconds === String(timerDuration));
      });
      // Restart timer if running
      if (timerIntervalId || timerPaused) {
        startTimer();
      }
    });
    container.appendChild(btn);
  });

  updateTimerDurationPickerState();
}

function updateTimerDurationPickerState() {
  const container = document.getElementById('timer-duration-picker');
  if (!container) return;
  container.style.opacity = timerEnabled ? '1' : '0.4';
  container.style.pointerEvents = timerEnabled ? 'auto' : 'none';
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
    stopTimer();
    closeCountQuizModal();
    localStorage.removeItem('puzzle-override');
    currentStep = -1;
    currentPuzzle = getTodayPuzzle();
    loadPuzzleImage();
    settingsModal.classList.add('hidden');
  });

  // Timer pause button
  const timerPauseBtn = document.getElementById('timer-pause-btn');
  timerPauseBtn.addEventListener('click', () => {
    if (timerPaused) {
      resumeTimer();
    } else {
      pauseTimer();
    }
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

  closeCountQuizBtn.addEventListener('click', () => {
    closeCountQuizModal();
  });

  countQuizBackdrop.addEventListener('click', () => {
    closeCountQuizModal();
  });
}

// ===========================================
// Image Picker
// ===========================================
function buildImagePicker() {
  const picker = document.getElementById('image-picker');
  if (!picker) return;
  picker.innerHTML = '';
  const selectedPuzzleIds = getKnownSelectedPuzzleIds();

  allPuzzles.forEach((puzzle) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'image-picker-wrapper';

    const btn = document.createElement('button');
    btn.className = 'image-picker-item';
    btn.dataset.puzzleId = puzzle.id;
    if (puzzle.id === currentPuzzle.id) {
      btn.classList.add('selected');
    }
    if (selectedPuzzleIds.includes(puzzle.id)) {
      btn.classList.add('previously-selected');
    }

    const img = document.createElement('img');
    img.src = puzzle.image;
    img.alt = puzzle.name;

    const label = document.createElement('span');
    label.textContent = puzzle.name;

    btn.appendChild(img);
    btn.appendChild(label);

    if (selectedPuzzleIds.includes(puzzle.id)) {
      const badge = document.createElement('span');
      badge.className = 'image-selected-badge';
      badge.textContent = 'えらんだ';
      btn.appendChild(badge);
    }

    btn.addEventListener('click', () => {
      showImagePreview(puzzle);
    });

    wrapper.appendChild(btn);

    // Add delete button for custom images
    if (puzzle.isCustom) {
      const delBtn = document.createElement('button');
      delBtn.className = 'image-delete-btn';
      delBtn.textContent = '×';
      delBtn.title = 'さくじょ';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleImageDelete(puzzle.id);
      });
      wrapper.appendChild(delBtn);
    }

    picker.appendChild(wrapper);
  });

  // Add upload button (hidden if at max)
  buildUploadButton(picker);
}

function loadSelectedPuzzleIds() {
  try {
    const value = JSON.parse(localStorage.getItem(SELECTED_PUZZLES_KEY));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveSelectedPuzzleIds(puzzleIds) {
  localStorage.setItem(SELECTED_PUZZLES_KEY, JSON.stringify([...new Set(puzzleIds)]));
}

function markPuzzleSelected(puzzleId) {
  if (!puzzleId) return;
  const selectedPuzzleIds = loadSelectedPuzzleIds();
  if (selectedPuzzleIds.includes(puzzleId)) return;
  selectedPuzzleIds.push(puzzleId);
  saveSelectedPuzzleIds(selectedPuzzleIds);
}

function getKnownSelectedPuzzleIds() {
  const selectedPuzzleIds = loadSelectedPuzzleIds();
  const stampedPuzzleIds = loadStamps().map((stamp) => stamp.puzzleId);
  return [...new Set([...selectedPuzzleIds, ...stampedPuzzleIds])];
}

function buildUploadButton(picker) {
  const customCount = allPuzzles.filter(p => p.isCustom).length;
  if (customCount >= MAX_IMAGES) return;

  const uploadBtn = document.createElement('button');
  uploadBtn.className = 'image-upload-btn';
  uploadBtn.innerHTML = `<span class="image-upload-icon">📷</span><span>えを ついか</span>`;
  uploadBtn.addEventListener('click', () => {
    handleImageUpload();
  });
  picker.appendChild(uploadBtn);
}

function handleImageUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if (!file) return;

    try {
      // Check count
      const count = await getImageCount();
      if (count >= MAX_IMAGES) {
        alert(`さいだい ${MAX_IMAGES}まい までだよ！`);
        return;
      }

      // Ask for name
      const name = prompt('なまえ を いれてね（ひらがな）', '');
      if (!name || !name.trim()) return;

      // Resize and save
      const blob = await resizeImage(file);
      const id = `img-${Date.now()}`;
      await saveImage(id, name.trim(), blob);

      // Reload custom images and rebuild picker
      allPuzzles = await getAllPuzzlesWithCustom();
      buildImagePicker();
      console.log('[PUZZLE] Custom image saved:', name.trim());
    } catch (err) {
      console.error('[PUZZLE] Image upload failed:', err);
      alert('がぞう の ほぞん に しっぱい しました');
    }
  });
  input.click();
}

async function handleImageDelete(puzzleId) {
  // Extract original ID from 'custom-img-xxx' format
  const originalId = puzzleId.replace(/^custom-/, '');
  const puzzle = allPuzzles.find(p => p.id === puzzleId);
  const name = puzzle ? puzzle.name : '';

  if (!confirm(`「${name}」を さくじょ する？`)) return;

  try {
    // If currently viewing this puzzle, switch to today's
    if (currentPuzzle.id === puzzleId) {
      localStorage.removeItem('puzzle-override');
      currentPuzzle = getTodayPuzzle();
      resetProgress();
      currentStep = -1;
      loadPuzzleImage();
    }

    // Revoke object URL
    if (puzzle && puzzle.image) {
      URL.revokeObjectURL(puzzle.image);
    }

    await deleteImage(originalId);
    allPuzzles = await getAllPuzzlesWithCustom();
    buildImagePicker();
    console.log('[PUZZLE] Custom image deleted:', name);
  } catch (err) {
    console.error('[PUZZLE] Image delete failed:', err);
  }
}

function switchPuzzle(puzzleId) {
  const newPuzzle = allPuzzles.find(p => p.id === puzzleId);
  if (!newPuzzle || newPuzzle.id === currentPuzzle.id) return;

  // Save override and reset progress
  closeCountQuizModal();
  localStorage.setItem('puzzle-override', puzzleId);
  markPuzzleSelected(puzzleId);
  resetProgress();
  currentStep = -1;
  currentPuzzle = newPuzzle;
  loadPuzzleImage();
  settingsModal.classList.add('hidden');
}

function updateImagePickerSelection() {
  const items = document.querySelectorAll('.image-picker-item');
  const selectedPuzzleIds = getKnownSelectedPuzzleIds();
  items.forEach(item => {
    item.classList.toggle('selected', item.dataset.puzzleId === currentPuzzle.id);
    const wasSelected = selectedPuzzleIds.includes(item.dataset.puzzleId);
    item.classList.toggle('previously-selected', wasSelected);
    if (wasSelected && !item.querySelector('.image-selected-badge')) {
      const badge = document.createElement('span');
      badge.className = 'image-selected-badge';
      badge.textContent = 'えらんだ';
      item.appendChild(badge);
    }
  });
}

// ===========================================
// Image Preview Modal
// ===========================================
function showImagePreview(puzzle) {
  // Remove existing preview if any
  const existing = document.getElementById('image-preview-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'image-preview-modal';
  modal.className = 'image-preview-modal';

  const backdrop = document.createElement('div');
  backdrop.className = 'image-preview-backdrop';
  backdrop.addEventListener('click', () => modal.remove());

  const content = document.createElement('div');
  content.className = 'image-preview-content';

  const img = document.createElement('img');
  img.src = puzzle.image;
  img.alt = puzzle.name;
  img.className = 'image-preview-img';

  const name = document.createElement('p');
  name.className = 'image-preview-name';
  name.textContent = puzzle.name;

  const selectedNote = document.createElement('p');
  selectedNote.className = 'image-preview-selected-note';
  selectedNote.textContent = 'まえに えらんだ え だよ';
  selectedNote.hidden = !getKnownSelectedPuzzleIds().includes(puzzle.id);

  const btnGroup = document.createElement('div');
  btnGroup.className = 'image-preview-buttons';

  const isCurrentPuzzle = puzzle.id === currentPuzzle.id;

  const selectBtn = document.createElement('button');
  selectBtn.className = 'image-preview-select-btn';
  if (isCurrentPuzzle) {
    selectBtn.textContent = 'いま この え だよ ✨';
    selectBtn.disabled = true;
    selectBtn.classList.add('current');
  } else {
    selectBtn.textContent = 'この え にする！';
    selectBtn.addEventListener('click', () => {
      modal.remove();
      switchPuzzle(puzzle.id);
    });
  }

  const closeBtn = document.createElement('button');
  closeBtn.className = 'image-preview-close-btn';
  closeBtn.textContent = 'もどる';
  closeBtn.addEventListener('click', () => modal.remove());

  btnGroup.appendChild(selectBtn);
  btnGroup.appendChild(closeBtn);

  content.appendChild(img);
  content.appendChild(name);
  content.appendChild(selectedNote);
  content.appendChild(btnGroup);

  modal.appendChild(backdrop);
  modal.appendChild(content);

  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => {
    modal.classList.add('visible');
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
// Step Bar (Dynamic)
// ===========================================
function buildStepBar() {
  const bar = document.getElementById('steps-bar');
  if (!bar) return;
  bar.innerHTML = '';
  stepButtons = [];

  // Add 2-row class when 6+ steps
  bar.classList.toggle('steps-bar-wrap', activeStepDefs.length > 5);

  activeStepDefs.forEach((stepDef, i) => {
    const btn = document.createElement('button');
    btn.className = 'step-btn locked';
    btn.dataset.step = String(i);
    btn.disabled = true;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'step-icon';
    const img = document.createElement('img');
    img.className = 'step-icon-img';
    img.src = stepDef.icon;
    img.alt = stepDef.label;
    // Fallback to emoji if image fails
    img.onerror = () => {
      img.style.display = 'none';
      iconSpan.textContent = stepDef.emoji;
      iconSpan.style.fontSize = '1.8rem';
    };
    iconSpan.appendChild(img);

    const labelSpan = document.createElement('span');
    labelSpan.className = 'step-label';
    labelSpan.textContent = stepDef.label;

    btn.appendChild(iconSpan);
    btn.appendChild(labelSpan);

    btn.addEventListener('click', () => {
      completeStep(i);
    });

    bar.appendChild(btn);
    stepButtons.push(btn);
  });
}

// ===========================================
// Step Config (localStorage)
// ===========================================
const STEP_CONFIG_KEY = 'step-config';

function loadStepConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(STEP_CONFIG_KEY));
    if (saved && saved.weekday && saved.holiday) {
      activeStepIds = dayMode === 'weekday' ? saved.weekday : saved.holiday;
    } else {
      activeStepIds = dayMode === 'weekday' ? [...DEFAULT_WEEKDAY] : [...DEFAULT_HOLIDAY];
    }
  } catch {
    activeStepIds = dayMode === 'weekday' ? [...DEFAULT_WEEKDAY] : [...DEFAULT_HOLIDAY];
  }
  activeStepDefs = getStepDefs(activeStepIds);
}

function saveStepConfig() {
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(STEP_CONFIG_KEY)) || {};
  } catch {
    saved = {};
  }
  if (!saved.weekday) saved.weekday = [...DEFAULT_WEEKDAY];
  if (!saved.holiday) saved.holiday = [...DEFAULT_HOLIDAY];

  if (dayMode === 'weekday') {
    saved.weekday = [...activeStepIds];
  } else {
    saved.holiday = [...activeStepIds];
  }
  localStorage.setItem(STEP_CONFIG_KEY, JSON.stringify(saved));
}

function rebuildAfterConfigChange() {
  activeStepDefs = getStepDefs(activeStepIds);
  buildDynamicSteps();
  buildStepBar();
  resetProgress();
  stopTimer();
  currentStep = -1;
  renderPuzzle();
  updateUI();
  saveStepConfig();
}

// ===========================================
// Day Mode Toggle
// ===========================================
function buildDayModeToggle() {
  const container = document.getElementById('day-mode-toggle');
  if (!container) return;
  container.innerHTML = '';

  const modes = [
    { id: 'weekday', label: '📅 へいじつ' },
    { id: 'holiday', label: '🎉 おやすみ' },
  ];

  modes.forEach((mode) => {
    const btn = document.createElement('button');
    btn.className = 'mode-picker-item';
    btn.dataset.dayMode = mode.id;
    if (mode.id === dayMode) {
      btn.classList.add('selected');
    }
    btn.textContent = mode.label;
    btn.addEventListener('click', () => {
      if (mode.id === dayMode) return;
      dayMode = mode.id;
      localStorage.setItem('day-mode', dayMode);
      loadStepConfig();
      rebuildAfterConfigChange();
      buildStepPicker(); // refresh picker
      buildStepOrderList(); // refresh order list
      // Update toggle selection
      container.querySelectorAll('.mode-picker-item').forEach(b => {
        b.classList.toggle('selected', b.dataset.dayMode === dayMode);
      });
    });
    container.appendChild(btn);
  });
}

// ===========================================
// Step Picker (settings)
// ===========================================
function buildStepPicker() {
  const container = document.getElementById('step-picker');
  if (!container) return;
  container.innerHTML = '';

  ALL_STEPS.forEach((stepDef) => {
    const item = document.createElement('label');
    item.className = 'step-picker-item';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = stepDef.id;
    checkbox.checked = activeStepIds.includes(stepDef.id);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        if (activeStepIds.length < 10) {
          activeStepIds.push(stepDef.id);
        } else {
          checkbox.checked = false;
          return;
        }
      } else {
        if (activeStepIds.length <= 2) {
          checkbox.checked = true;
          return;
        }
        activeStepIds = activeStepIds.filter(id => id !== stepDef.id);
      }
      rebuildAfterConfigChange();
      buildStepOrderList();
    });

    const iconSpan = document.createElement('span');
    iconSpan.className = 'step-picker-icon';
    iconSpan.textContent = stepDef.emoji;

    const labelSpan = document.createElement('span');
    labelSpan.className = 'step-picker-label';
    labelSpan.textContent = stepDef.label;

    item.appendChild(checkbox);
    item.appendChild(iconSpan);
    item.appendChild(labelSpan);
    container.appendChild(item);
  });
}

// ===========================================
// Step Order List (touch drag & drop reorder)
// ===========================================
let _dragState = null;

function buildStepOrderList() {
  const container = document.getElementById('step-order-list');
  if (!container) return;
  container.innerHTML = '';

  activeStepIds.forEach((id, idx) => {
    const stepDef = ALL_STEPS.find(s => s.id === id);
    if (!stepDef) return;

    const row = document.createElement('div');
    row.className = 'step-order-row';
    row.dataset.idx = String(idx);

    // Drag handle
    const handle = document.createElement('span');
    handle.className = 'step-order-handle';
    handle.textContent = '☰';

    // Number badge
    const numBadge = document.createElement('span');
    numBadge.className = 'step-order-num';
    numBadge.textContent = idx + 1;

    // Icon + label
    const info = document.createElement('span');
    info.className = 'step-order-info';
    info.textContent = `${stepDef.emoji} ${stepDef.label}`;

    row.appendChild(handle);
    row.appendChild(numBadge);
    row.appendChild(info);
    container.appendChild(row);
  });

  // Setup drag listeners on the container
  setupDragListeners(container);
}

function setupDragListeners(container) {
  // Prevent duplicate listeners (this function is called every rebuild)
  if (container.dataset.dragReady) return;
  container.dataset.dragReady = '1';
  // --- Touch events ---
  container.addEventListener('touchstart', (e) => {
    const handle = e.target.closest('.step-order-handle');
    if (!handle) return;
    const row = handle.closest('.step-order-row');
    if (!row) return;
    e.preventDefault();
    startDrag(container, row, e.touches[0].clientY);
  }, { passive: false });

  container.addEventListener('touchmove', (e) => {
    if (!_dragState) return;
    e.preventDefault();
    moveDrag(e.touches[0].clientY);
  }, { passive: false });

  container.addEventListener('touchend', () => {
    if (!_dragState) return;
    endDrag();
  });

  // --- Mouse events (for desktop testing) ---
  container.addEventListener('mousedown', (e) => {
    const handle = e.target.closest('.step-order-handle');
    if (!handle) return;
    const row = handle.closest('.step-order-row');
    if (!row) return;
    e.preventDefault();
    startDrag(container, row, e.clientY);

    const onMouseMove = (ev) => {
      if (!_dragState) return;
      moveDrag(ev.clientY);
    };
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      if (_dragState) endDrag();
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

function startDrag(container, row, clientY) {
  const rect = row.getBoundingClientRect();
  const idx = parseInt(row.dataset.idx, 10);

  // Create ghost element
  const ghost = row.cloneNode(true);
  ghost.className = 'step-order-row step-order-ghost';
  ghost.style.width = rect.width + 'px';
  ghost.style.top = rect.top + 'px';
  ghost.style.left = rect.left + 'px';
  document.body.appendChild(ghost);

  // Create placeholder
  const placeholder = document.createElement('div');
  placeholder.className = 'step-order-placeholder';
  placeholder.style.height = rect.height + 'px';

  // Hide original row and insert placeholder
  row.classList.add('step-order-dragging');
  row.parentNode.insertBefore(placeholder, row);

  _dragState = {
    container,
    row,
    ghost,
    placeholder,
    startY: clientY,
    offsetY: clientY - rect.top,
    currentIdx: idx,
    targetIdx: idx,
  };
}

function moveDrag(clientY) {
  if (!_dragState) return;
  const { ghost, container, placeholder, offsetY } = _dragState;

  // Move ghost
  ghost.style.top = (clientY - offsetY) + 'px';

  // Calculate target index from non-dragging rows
  const rows = Array.from(container.querySelectorAll('.step-order-row:not(.step-order-dragging)'));
  let targetIdx = rows.length;

  for (let i = 0; i < rows.length; i++) {
    const rowRect = rows[i].getBoundingClientRect();
    const midY = rowRect.top + rowRect.height / 2;
    if (clientY < midY) {
      targetIdx = i;
      break;
    }
  }

  // Move placeholder to target position
  if (targetIdx < rows.length) {
    container.insertBefore(placeholder, rows[targetIdx]);
  } else {
    container.appendChild(placeholder);
  }
  _dragState.targetIdx = targetIdx;
}

function endDrag() {
  if (!_dragState) return;
  const { row, ghost, placeholder, currentIdx, targetIdx } = _dragState;

  // Clean up DOM
  ghost.remove();
  placeholder.remove();
  row.classList.remove('step-order-dragging');

  // Adjust target index (account for removed item)
  let finalIdx = targetIdx;
  if (finalIdx > currentIdx) finalIdx--;

  // Apply reorder if changed
  if (finalIdx !== currentIdx) {
    const [removed] = activeStepIds.splice(currentIdx, 1);
    activeStepIds.splice(finalIdx, 0, removed);
    rebuildAfterConfigChange();
  }

  _dragState = null;
  buildStepOrderList();
}


// ===========================================
// Stamp Card
// ===========================================
const STAMP_KEY = 'puzzle-stamps';
const COUNT_QUIZ_STAMP_KEY = 'count-quiz-stamps';

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

function loadCountQuizStamps() {
  try {
    return JSON.parse(localStorage.getItem(COUNT_QUIZ_STAMP_KEY)) || [];
  } catch {
    return [];
  }
}

function saveCountQuizStamps(stamps) {
  localStorage.setItem(COUNT_QUIZ_STAMP_KEY, JSON.stringify(stamps));
}

function hasEarnedCountQuizStamp(puzzleId) {
  const stamps = loadCountQuizStamps();
  const today = new Date().toISOString().slice(0, 10);
  return stamps.some((stamp) => stamp.date === today && stamp.puzzleId === puzzleId);
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

function awardCountQuizStamp() {
  const stamps = loadCountQuizStamps();
  const today = new Date().toISOString().slice(0, 10);
  const exists = stamps.some(s => s.date === today && s.puzzleId === currentPuzzle.id);
  if (exists) return;

  stamps.push({
    date: today,
    puzzleId: currentPuzzle.id,
    puzzleName: currentPuzzle.name,
  });
  saveCountQuizStamps(stamps);
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
  const countQuizStamps = loadCountQuizStamps();
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

  if (countQuizStamps.length > 0) {
    streakEl.textContent += ` / 123 ${countQuizStamps.length}こ`;
  }

  // Grid
  gridEl.innerHTML = '';

  // Show earned stamps (newest first)
  const reversed = [...stamps].reverse();
  reversed.forEach((stamp) => {
    const item = document.createElement('div');
    item.className = 'stamp-item earned';
    const hasSpecial = countQuizStamps.some((specialStamp) =>
      specialStamp.date === stamp.date && specialStamp.puzzleId === stamp.puzzleId
    );
    if (hasSpecial) {
      item.classList.add('special-earned');
    }

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

    if (hasSpecial) {
      const badge = document.createElement('span');
      badge.className = 'stamp-special-badge';
      badge.textContent = '123';
      badge.title = 'すうじはかせ';
      item.appendChild(badge);
    }

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
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
