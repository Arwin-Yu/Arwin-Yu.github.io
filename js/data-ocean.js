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

  // Mock Data (Updated with internal links)
  const shipsData = [
    { name: "OpenClaw", stars: 5000, url: "/2026/02/23/spotlight-openclaw/" },
    { name: "Claude-Code", stars: 3000, url: "https://github.com/anthropics/claude-code" },
    { name: "AutoGPT", stars: 15000, url: "https://github.com/Significant-Gravitas/AutoGPT" },
    { name: "Llama-3", stars: 8000, url: "https://github.com/meta-llama/llama3" }
  ];

  let particles = [];
  let ships = [];
  
  // ... (Classes remain the same) ...

  // Mouse Interaction (Smart Pointer Events)
  let mouseX = 0, mouseY = 0;
  let hoveredShip = null;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Check collision logic here to toggle pointer-events
    // We need to loop through ships to see if we are over one
    let hit = false;
    ships.forEach(ship => {
        const dx = mouseX - ship.x;
        const dy = mouseY - ship.y;
        // Increased hitbox to 50px
        if (Math.sqrt(dx*dx + dy*dy) < 50) hit = true;
    });
    
    if (hit) {
        canvas.style.pointerEvents = 'auto';
        canvas.style.cursor = 'pointer';
    } else {
        canvas.style.pointerEvents = 'none';
        canvas.style.cursor = 'default';
    }
  });

  canvas.addEventListener('click', () => {
    // Re-check collision because click event needs precise target
    ships.forEach(ship => {
        const dx = mouseX - ship.x;
        const dy = mouseY - ship.y;
        if (Math.sqrt(dx*dx + dy*dy) < 50) {
            window.location.href = ship.url;
        }
    });
  });
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
      // Pulsating Glow (Bigger)
      const pulse = Math.sin(Date.now() * 0.005) * 5 + 10; // 5-15px fluctuation
      
      ctx.shadowBlur = 30;
      ctx.shadowColor = "#00ffff";
      
      // Outer Ring
      ctx.strokeStyle = `rgba(0, 255, 255, ${0.3 + Math.sin(Date.now() * 0.005)*0.2})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 25 + pulse, 0, Math.PI * 2); // Big visible target
      ctx.stroke();

      // Core
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 8, 0, Math.PI * 2); // Solid core
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label (Bigger & Clearer)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(this.name, this.x, this.y + 45); // Text below ring
    }
  }

  function init() {
    // Clear array to prevent duplication if init runs twice
    particles = [];
    ships = [];
    
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
