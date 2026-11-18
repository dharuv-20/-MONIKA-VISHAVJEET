/**
 * Lightweight Standalone Wedding Confetti & Sparkles Engine
 * Supports optional origin (x, y) coordinates for interactive touch bursts
 */
function triggerConfetti(originX, originY) {
  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const colors = ['#c9963e', '#e8c07a', '#ffd678', '#b31b32', '#fffdfb', '#5a1f2c', '#f06292', '#e91e63'];
  const isTouchBurst = originX !== undefined && originY !== undefined;
  const confettiCount = isTouchBurst ? 65 : 120;
  const particles = [];
  const startX = isTouchBurst ? originX : width / 2;
  const startY = isTouchBurst ? originY : height / 2;

  for (let i = 0; i < confettiCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 10 + 3;
    particles.push({
      x: startX + (Math.random() - 0.5) * 16,
      y: startY + (Math.random() - 0.5) * 16,
      w: Math.random() * 8 + 4,
      h: Math.random() * 5 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (isTouchBurst ? 3 : 6),
      rotation: Math.random() * 360,
      vRotation: (Math.random() - 0.5) * 14,
      gravity: 0.28,
      decay: 0.97,
      alpha: 1,
      shape: Math.random() > 0.35 ? 'rect' : 'circle'
    });
  }

  let animationFrame;
  function update() {
    ctx.clearRect(0, 0, width, height);

    let activeParticles = 0;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.decay;
      p.rotation += p.vRotation;
      p.alpha -= isTouchBurst ? 0.015 : 0.009;

      if (p.alpha > 0) {
        activeParticles++;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrame = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animationFrame = requestAnimationFrame(update);
}
