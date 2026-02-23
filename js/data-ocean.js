// Data Ocean Animation for Arwin's AI Lab
// Powered by OpenClaw

document.addEventListener('DOMContentLoaded', function () {
  // Fluid Theme Banner Selector Strategy
  // 1. Try .banner (class)
  // 2. Try #banner (id)
  // 3. Try header (tag)
  let banner = document.querySelector('.banner');
  if (!banner) banner = document.getElementById('banner');
  if (!banner) banner = document.querySelector('header');
  
  if (!banner) {
    console.error("Data Ocean: Banner not found!");
    return;
  }

  // Create Canvas
  const canvas = document.createElement('canvas');
  canvas.id = 'data-ocean-canvas';
  canvas.style.position = 'absolute';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.zIndex = '1'; // Above bg
  canvas.style.pointerEvents = 'auto'; // Enable clicks
  
  // Ensure banner container is relative so absolute canvas works
  const style = window.getComputedStyle(banner);
  if (style.position === 'static') {
    banner.style.position = 'relative';
  }
  
  banner.insertBefore(canvas, banner.firstChild);

  const ctx = canvas.getContext('2d');
  let width, height;

  // Mock Data: Trending AI Projects (The Ships)
  const shipsData = [
    { name: "OpenClaw", stars: 5000, url: "https://github.com/openclaw/openclaw" },
    { name: "Claude-Code", stars: 3000, url: "https://github.com/anthropics/claude-code" },
    { name: "AutoGPT", stars: 15000, url: "https://github.com/Significant-Gravitas/AutoGPT" },
    { name: "Llama-3", stars: 8000, url: "https://github.com/meta-llama/llama3" },
    { name: "LangChain", stars: 10000, url: "https://github.com/langchain-ai/langchain" }
  ];

  let particles = [];
  let ships = [];
  let lighthouse = null;

  // --- Classes ---

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
      this.alpha = Math.random() * 0.5;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = `rgba(100, 200, 255, ${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  class Ship {
    constructor(data) {
      this.name = data.name;
      this.url = data.url;
      this.baseSize = Math.max(5, Math.log(data.stars) * 2); // Logarithmic scale
      this.x = Math.random() * (width * 0.8);
      this.y = height / 2 + (Math.random() - 0.5) * 100;
      this.floatOffset = Math.random() * 100;
    }
    update(time) {
      // Floating effect
      this.y += Math.sin(time * 0.002 + this.floatOffset) * 0.2;
    }
    draw(isHovered) {
      // Glow
      ctx.shadowBlur = isHovered ? 30 : 15;
      ctx.shadowColor = "cyan";
      
      // Core
      ctx.fillStyle = isHovered ? "#fff" : "#00ffff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0; // Reset

      // Text Label
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      ctx.font = "12px monospace";
      ctx.textAlign = "center";
      ctx.fillText(this.name, this.x, this.y - this.baseSize - 10);
    }
  }

  class Lighthouse {
    constructor() {
      this.x = width * 0.9; // Right side
      this.y = height * 0.5;
      this.size = 20;
      this.pulse = 0;
    }
    update(time) {
      this.pulse = (Math.sin(time * 0.005) + 1) / 2; // 0 to 1
    }
    draw(isHovered) {
      // Beacon Light
      const glowSize = 20 + this.pulse * 30;
      const gradient = ctx.createRadialGradient(this.x, this.y, 5, this.x, this.y, glowSize);
      gradient.addColorStop(0, "rgba(255, 200, 100, 1)");
      gradient.addColorStop(1, "rgba(255, 100, 50, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, glowSize, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = isHovered ? "#fff" : "#ffaa00";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#ffaa00";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("AI NEWS HUB", this.x, this.y + 40);
    }
  }

  // --- Init & Loop ---

  function init() {
    resize();
    window.addEventListener('resize', resize);
    
    // Create particles
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }
    
    // Create ships
    shipsData.forEach(data => ships.push(new Ship(data)));
    
    // Create lighthouse
    lighthouse = new Lighthouse();

    animate();
  }

  function resize() {
    width = banner.offsetWidth;
    height = banner.offsetHeight;
    canvas.width = width;
    canvas.height = height;
    // Re-position lighthouse
    if(lighthouse) lighthouse.x = width * 0.9;
  }

  // Mouse Interaction
  let mouseX = 0, mouseY = 0;
  let hoveredShip = null;
  let hoveredLighthouse = false;

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  canvas.addEventListener('click', () => {
    if (hoveredLighthouse) {
      window.location.href = '/categories/Weekly-AI/'; // Jump to News Hub
    } else if (hoveredShip) {
      window.open(hoveredShip.url, '_blank'); // Open GitHub
    }
  });

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw background particles (The Ocean)
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Connecting lines (Neural Network effect)
    ctx.strokeStyle = "rgba(100, 200, 255, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Update Interaction State
    hoveredShip = null;
    hoveredLighthouse = false;

    // Check Lighthouse Hover
    const dlx = mouseX - lighthouse.x;
    const dly = mouseY - lighthouse.y;
    if (Math.sqrt(dlx*dlx + dly*dly) < 30) {
      hoveredLighthouse = true;
      canvas.style.cursor = 'pointer';
    }

    // Draw Lighthouse
    lighthouse.update(time);
    lighthouse.draw(hoveredLighthouse);

    // Draw Ships
    ships.forEach(ship => {
      const dx = mouseX - ship.x;
      const dy = mouseY - ship.y;
      const isHovered = Math.sqrt(dx*dx + dy*dy) < ship.baseSize + 5;
      if (isHovered) {
        hoveredShip = ship;
        canvas.style.cursor = 'pointer';
      }
      
      ship.update(time);
      ship.draw(isHovered);
    });

    if (!hoveredShip && !hoveredLighthouse) {
      canvas.style.cursor = 'default';
    }

    requestAnimationFrame(animate);
  }

  init();
});
