// Built-in Playable Space Typing Arcade Hub

export class SpaceTypingHub {
  static open(account, soundFX = null, onScoreAward = null) {
    const modal = document.getElementById('hubModal');
    const container = document.getElementById('hubModalBody');
    if (!modal || !container) return;

    if (soundFX) soundFX.playPortalEnter();

    container.className = 'hub-body space-typing-theme';
    container.innerHTML = `
      <div class="hub-header">
        <div class="hub-badge-icon">🚀</div>
        <div>
          <div class="hub-title">Space Typing Arcade</div>
          <div class="hub-subtitle">Type words quickly to blast meteors and defend the sky station!</div>
        </div>
      </div>

      <div class="arcade-screen-container">
        <div class="typing-hud">
          <div>SCORE: <span id="arcadeScore">0</span></div>
          <div>STREAK: <span id="arcadeStreak">0</span>x</div>
          <div>LIVES: <span id="arcadeLives">❤️❤️❤️</span></div>
        </div>
        <canvas id="typingGameCanvas"></canvas>
      </div>

      <div class="typing-input-bar">
        <input type="text" id="arcadeInput" class="typing-input" placeholder="Type falling words here..." autocomplete="off" autofocus />
        <button type="button" class="btn btn-primary" id="startArcadeBtn" style="flex: 0 0 130px; background: linear-gradient(135deg, #8b5cf6, #3b82f6);">
          Start Game
        </button>
      </div>
    `;

    modal.classList.add('active');

    // Initialize Canvas Game
    const canvas = document.getElementById('typingGameCanvas');
    const input = document.getElementById('arcadeInput');
    const scoreEl = document.getElementById('arcadeScore');
    const streakEl = document.getElementById('arcadeStreak');
    const livesEl = document.getElementById('arcadeLives');
    const startBtn = document.getElementById('startArcadeBtn');

    const wordList = [
      'star', 'moon', 'ship', 'code', 'game', 'play', 'hero', 'jump',
      'space', 'laser', 'orbit', 'cloud', 'cyber', 'block', 'robot',
      'galaxy', 'rocket', 'arcade', 'plasma', 'island', 'crystal',
      'velocity', 'universe', 'quantum', 'computer', 'keyboard', 'champion'
    ];

    let animationId = null;
    let isRunning = false;
    let score = 0;
    let streak = 0;
    let lives = 3;
    let meteors = [];
    let particles = [];
    let lasers = [];
    let spawnTimer = 0;

    function resizeCanvas() {
      const parent = canvas.parentElement;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    }
    resizeCanvas();

    function spawnMeteor() {
      const word = wordList[Math.floor(Math.random() * wordList.length)];
      const x = 50 + Math.random() * (canvas.width - 100);
      const speed = 0.8 + Math.random() * 0.8 + (score / 1500);

      meteors.push({
        word,
        x,
        y: -20,
        speed,
        radius: 24,
        color: ['#f43f5e', '#ec4899', '#a855f7', '#38bdf8'][Math.floor(Math.random() * 4)]
      });
    }

    function createExplosion(x, y, color) {
      if (soundFX) soundFX.playExplosion();
      for (let i = 0; i < 20; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 4;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color
        });
      }
    }

    function startGame() {
      score = 0;
      streak = 0;
      lives = 3;
      meteors = [];
      particles = [];
      lasers = [];
      isRunning = true;
      scoreEl.textContent = '0';
      streakEl.textContent = '0';
      livesEl.textContent = '❤️❤️❤️';
      startBtn.textContent = 'Restart';
      input.value = '';
      input.focus();
    }

    startBtn.addEventListener('click', startGame);

    input.addEventListener('input', () => {
      if (!isRunning) return;
      const text = input.value.trim().toLowerCase();

      const targetIndex = meteors.findIndex(m => m.word.toLowerCase() === text);
      if (targetIndex !== -1) {
        const m = meteors[targetIndex];

        // Fire Laser
        if (soundFX) soundFX.playLaser();
        lasers.push({
          startX: canvas.width / 2,
          startY: canvas.height - 20,
          targetX: m.x,
          targetY: m.y,
          life: 0.2
        });

        createExplosion(m.x, m.y, m.color);
        meteors.splice(targetIndex, 1);

        streak++;
        score += 100 * Math.min(streak, 5);

        if (soundFX) soundFX.playScore();

        scoreEl.textContent = score;
        streakEl.textContent = streak;
        input.value = '';

        if (onScoreAward) {
          onScoreAward(100);
        }
      }
    });

    const ctx = canvas.getContext('2d');

    function gameLoop() {
      if (!modal.classList.contains('active')) {
        cancelAnimationFrame(animationId);
        return;
      }

      ctx.fillStyle = 'rgba(5, 5, 16, 0.35)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Starfield background
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let i = 0; i < 15; i++) {
        ctx.fillRect((Date.now() * 0.05 + i * 80) % canvas.width, (i * 35) % canvas.height, 2, 2);
      }

      if (isRunning) {
        spawnTimer++;
        if (spawnTimer >= 90 - Math.min(score / 50, 45)) {
          spawnMeteor();
          spawnTimer = 0;
        }

        // Draw & Update Meteors
        for (let i = meteors.length - 1; i >= 0; i--) {
          const m = meteors[i];
          m.y += m.speed;

          // Draw Meteor
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
          ctx.fillStyle = m.color;
          ctx.shadowColor = m.color;
          ctx.shadowBlur = 15;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Draw Word
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 16px Space Grotesk, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(m.word, m.x, m.y - 12);

          // Meteor reached bottom
          if (m.y > canvas.height - 20) {
            createExplosion(m.x, m.y, '#ef4444');
            meteors.splice(i, 1);
            streak = 0;
            streakEl.textContent = '0';
            lives--;
            livesEl.textContent = '❤️'.repeat(Math.max(0, lives));

            if (lives <= 0) {
              isRunning = false;
              alert(`Game Over! Final Score: ${score}`);
            }
          }
        }

        // Draw Lasers
        for (let i = lasers.length - 1; i >= 0; i--) {
          const l = lasers[i];
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 4;
          ctx.shadowColor = '#06b6d4';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.moveTo(l.startX, l.startY);
          ctx.lineTo(l.targetX, l.targetY);
          ctx.stroke();
          ctx.shadowBlur = 0;

          l.life -= 0.05;
          if (l.life <= 0) lasers.splice(i, 1);
        }

        // Draw Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= 0.03;

          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, 3, 3);

          if (p.life <= 0) particles.splice(i, 1);
        }
      } else {
        // Ready screen
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px Space Grotesk, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PRESS "START GAME" TO PLAY', canvas.width / 2, canvas.height / 2);
      }

      animationId = requestAnimationFrame(gameLoop);
    }

    gameLoop();
    input.focus();
  }
}
