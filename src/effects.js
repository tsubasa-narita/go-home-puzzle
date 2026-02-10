/**
 * エフェクト・アニメーション管理
 */

// ===========================================
// Web Audio API - 効果音生成
// ===========================================
let audioCtx = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

/**
 * ステップ完了時の効果音（ピコッ）
 */
export function playStepSound() {
    if (!isSoundEnabled()) return;
    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        console.warn('Audio error:', e);
    }
}

/**
 * ゴール時の効果音（ジャジャーン！）
 */
export function playGoalSound() {
    if (!isSoundEnabled()) return;
    try {
        const ctx = getAudioContext();
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);

            gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
            gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + i * 0.15 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.15 + 0.6);

            osc.start(ctx.currentTime + i * 0.15);
            osc.stop(ctx.currentTime + i * 0.15 + 0.6);
        });
    } catch (e) {
        console.warn('Audio error:', e);
    }
}

function isSoundEnabled() {
    const toggle = document.getElementById('sound-toggle');
    return toggle ? toggle.checked : true;
}

// ===========================================
// キラキラパーティクル
// ===========================================

const PARTICLE_COLORS = [
    '#FF5722', '#FF9800', '#FFC107', '#4CAF50',
    '#2196F3', '#9C27B0', '#E91E63', '#00BCD4',
];

class Particle {
    constructor(canvas) {
        this.canvas = canvas;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = -10;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = (Math.random() - 0.5) * 3;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = (Math.random() - 0.5) * 10;
        this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        this.opacity = 1;
        this.shape = Math.random() > 0.5 ? 'star' : 'circle';
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
    }

    update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.opacity = this.life;
        return this.life > 0 && this.y < this.canvas.height + 20;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        if (this.shape === 'star') {
            this.drawStar(ctx, 0, 0, 5, this.size, this.size / 2);
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius);
            rot += step;
            ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
    }
}

let particles = [];
let animationId = null;

/**
 * キラキラエフェクトを開始
 */
export function startCelebration() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    particles = [];
    for (let i = 0; i < 80; i++) {
        const p = new Particle(canvas);
        p.y = Math.random() * canvas.height * 0.3;
        particles.push(p);
    }

    let spawnCounter = 0;

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Spawn new particles
        spawnCounter++;
        if (spawnCounter % 3 === 0 && particles.length < 150) {
            particles.push(new Particle(canvas));
        }

        // Update & draw
        particles = particles.filter(p => {
            const alive = p.update();
            if (alive) p.draw(ctx);
            return alive;
        });

        if (particles.length > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    if (animationId) cancelAnimationFrame(animationId);
    animate();

    // Stop after 5 seconds
    setTimeout(() => {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        particles = [];
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 5000);
}

/**
 * ボタン押下のバウンスアニメーション
 */
export function animateButtonPress(button) {
    button.classList.add('btn-pressed');
    button.addEventListener('animationend', () => {
        button.classList.remove('btn-pressed');
    }, { once: true });
}
