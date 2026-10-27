/**
 * LifeOS UI Components & Helpers
 * Toast notifications, Modals, Confetti particles, Clock formatters
 */

// Управление всплывающими подсказками (Toasts)
const Toast = {
  show(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'warning') icon = '⚠️';
    if (type === 'sparkle') icon = '✨';

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <span class="toast-text">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Управление модальными окнами
const Modal = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      lifeSound.playClick();
    }
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  initListeners() {
    // Закрытие по клику на крестик или элементы с data-close-modal
    document.addEventListener('click', (e) => {
      const closeTarget = e.target.closest('[data-close-modal]');
      if (closeTarget) {
        const modalId = closeTarget.getAttribute('data-close-modal');
        Modal.close(modalId);
      } else if (e.target.classList.contains('modal-overlay')) {
        // Клик по оверлею
        e.target.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Закрытие по клавише Esc
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(modal => {
          modal.classList.remove('active');
        });
        document.body.style.overflow = '';
      }
    });
  }
};

// Эффект праздничного конфетти на Canvas
const Confetti = {
  canvas: null,
  ctx: null,
  particles: [],
  animationId: null,

  init() {
    this.canvas = document.getElementById('confettiCanvas');
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  },

  resize() {
    if (this.canvas) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  },

  burst(count = 70) {
    if (!this.canvas) this.init();
    if (!this.ctx) return;

    lifeSound.playSuccess();

    const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#06B6D4', '#FFF'];
    const originX = window.innerWidth / 2;
    const originY = window.innerHeight * 0.4;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 5;
      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        life: 1
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // гравитация
      p.vx *= 0.98; // сопротивление воздуха
      p.rotation += p.rotationSpeed;
      p.life -= 0.015;
      p.opacity = Math.max(0, p.life);

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      this.ctx.restore();

      if (p.life <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
      }
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
};
