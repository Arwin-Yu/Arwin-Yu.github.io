// Data Ocean Animation (Global Overlay Mode)
document.addEventListener('DOMContentLoaded', function () {
  // Only run on home page (optional, remove check to run everywhere)
  // Fluid theme usually has specific classes for index
  
  const canvas = document.createElement('canvas');
  canvas.id = 'data-ocean-canvas';
  canvas.style.position = 'fixed'; // Sticky to screen
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = '1'; // Above most things
  canvas.style.pointerEvents = 'none'; // Let clicks pass through (for now)
  canvas.style.mixBlendMode = 'screen'; // Cool blending effect
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width, height;

  // Mock Data
  const shipsData = [
    { name: "OpenClaw", stars: 5000 },
    { name: "Claude-Code", stars: 3000 },
    { name: "AutoGPT", stars: 15000 },
    { name: "Llama-3", stars: 8000 }
  ];

  let particles = [];
  let ships = [];

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = `rgba(0, 255, 255, ${this.alpha})`; // Cyan
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Ship {
    constructor(data) {
      this.name = data.name;
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.vy = (Math.random() - 0.5) * 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if(this.x < 0) this.x = width;
      if(this.x > width) this.x = 0;
      if(this.y < 0) this.y = height;
      if(this.y > height) this.y = 0;
    }
    draw() {
      // Glowing Core
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#00ffff";
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.font = "12px monospace";
      ctx.fillText(this.name, this.x + 10, this.y);
    }
  }

  function init() {
    resize();
    window.addEventListener('resize', resize);
    for(let i=0; i<50; i++) particles.push(new Particle());
    shipsData.forEach(d => ships.push(new Ship(d)));
    animate();
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw Particles
    particles.forEach(p => { p.update(); p.draw(); });
    
    // Connect Particles (Neural Net)
    ctx.strokeStyle = "rgba(0, 255, 255, 0.05)";
    for(let i=0; i<particles.length; i++) {
      for(let j=i+1; j<particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        if (dx*dx + dy*dy < 10000) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw Ships
    ships.forEach(s => { s.update(); s.draw(); });

    requestAnimationFrame(animate);
  }

  init();
});
