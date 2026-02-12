/**
 * だ〜れだ？パズルラリー - メインアプリケーション
 */
import './style.css';
import { PUZZLES, getTodayPuzzle, saveProgress, loadProgress, resetProgress } from './puzzleData.js';
import { playStepSound, playGoalSound, startCelebration, animateButtonPress } from './effects.js';

// ===========================================
// State
// ===========================================
let currentStep = -1; // -1=未開始, 0=靴完了, 1=移動完了, 2=おうち完了
let currentPuzzle = null;
let puzzleImage = null;

const STEPS = [
  {
    revealPercent: 0.30,
    message: (puzzle) =>
      `あ！いろが みえた！✨<br>${puzzle.hints[0]}<br>いどう したら もっと みえるよ！`,
  },
  {
    revealPercent: 0.65,
    message: (puzzle) =>
      `もっと みえてきた！🎉<br>${puzzle.hints[1]}<br>おうちに ついたら ぜんぶ みえるよ！`,
  },
  {
    revealPercent: 1.0,
    message: (puzzle) =>
      `🎊 せいかい！<br><span style="color:#FF5722;font-size:1.3em;font-weight:900">${puzzle.name}</span><br>でした〜！おかえり！🏠`,
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

  // Build image picker
  buildImagePicker();

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
// Rendering
// ===========================================
function renderPuzzle() {
  if (!puzzleImage || !puzzleImage.complete) return;

  const displaySize = canvas.width / window.devicePixelRatio;
  ctx.clearRect(0, 0, displaySize, displaySize);

  if (currentStep >= 2) {
    // Fully revealed!
    drawFullImage(displaySize);
  } else if (currentStep >= 0) {
    // Partially revealed
    const revealPercent = STEPS[currentStep].revealPercent;
    drawPartialReveal(displaySize, revealPercent);
  } else {
    // Silhouette only
    drawSilhouette(displaySize);
  }
}

/**
 * 完全なシルエット（黒）を描画
 */
function drawSilhouette(size) {
  // Draw the image
  drawImageCover(size);

  // Apply silhouette effect using compositing
  ctx.globalCompositeOperation = 'source-atop';

  // Dark silhouette with subtle gradient
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#16213e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  // Add question mark
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.font = `bold ${size * 0.4}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('？', size / 2, size / 2);

  // Subtle sparkle dots
  for (let i = 0; i < 15; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 3 + 1;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.3 + 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 部分的に画像を表示（上からカーテンが開くように）
 */
function drawPartialReveal(size, percent) {
  // Calculate reveal area: reveal from bottom up to create curiosity
  const revealHeight = size * percent;
  const silhouetteHeight = size - revealHeight;

  // First, draw the full color image in the revealed area (bottom)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, silhouetteHeight, size, revealHeight);
  ctx.clip();
  drawImageCover(size);
  ctx.restore();

  // Then draw the silhouette in the remaining area (top)
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, size, silhouetteHeight);
  ctx.clip();
  drawImageCover(size);
  // Overlay with dark color
  ctx.globalCompositeOperation = 'source-atop';
  const grad = ctx.createLinearGradient(0, 0, 0, silhouetteHeight);
  grad.addColorStop(0, '#1a1a2e');
  grad.addColorStop(1, '#2d2d5e');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, silhouetteHeight);
  ctx.restore();

  // Draw a sparkly dividing line
  ctx.globalCompositeOperation = 'source-over';
  const lineY = silhouetteHeight;
  const lineGrad = ctx.createLinearGradient(0, lineY - 3, 0, lineY + 3);
  lineGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  lineGrad.addColorStop(0.5, 'rgba(255, 200, 0, 0.8)');
  lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = lineGrad;
  ctx.fillRect(0, lineY - 3, size, 6);

  // Question mark in dark area
  if (silhouetteHeight > 60) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.font = `bold ${Math.min(silhouetteHeight * 0.5, size * 0.3)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('？', size / 2, silhouetteHeight / 2);
  }
}

/**
 * 画像を全て表示
 */
function drawFullImage(size) {
  drawImageCover(size);
}

/**
 * 画像をカバーモードで描画（中央揃え、アスペクト比維持）
 */
function drawImageCover(size) {
  const img = puzzleImage;
  const imgRatio = img.naturalWidth / img.naturalHeight;

  let drawWidth = size;
  let drawHeight = size;
  let dx = 0;
  let dy = 0;

  if (imgRatio > 1) {
    // Landscape: width matches size, height scales down
    drawHeight = size / imgRatio;
    dy = (size - drawHeight) / 2;
  } else {
    // Portrait: height matches size, width scales down
    drawWidth = size * imgRatio;
    dx = (size - drawWidth) / 2;
  }

  ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, drawWidth, drawHeight);
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
  if (currentStep >= 0 && currentStep < 2) {
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
  if (stepIndex === 2) {
    playGoalSound();
  } else {
    playStepSound();
  }

  // Re-render with transition
  renderPuzzle();

  if (stepIndex === 2) {
    // Final step: show full image with celebration
    updateUI();
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
