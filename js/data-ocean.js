// Data Ocean Animation (Debug Version)
console.log("🌊 Data Ocean Script Loaded!");

(function() {
  function initOcean() {
    console.log("🌊 Initializing Ocean...");
    
    // Check if already exists
    if (document.getElementById('data-ocean-canvas')) {
        console.log("🌊 Canvas already exists, skipping.");
        return;
    }

    const canvas = document.createElement('canvas');
    canvas.id = 'data-ocean-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '9999'; // Highest Possible
    canvas.style.pointerEvents = 'none'; // Passthrough
    canvas.style.mixBlendMode = 'screen';
    canvas.style.border = '5px solid red'; // DEBUG BORDER
    document.body.appendChild(canvas);
    
    console.log("🌊 Canvas appended to body!");

    const ctx = canvas.getContext('2d');
    let width, height;

    const shipsData = [
      { name: "OpenClaw", stars: 5000, url: "/2026/02/23/spotlight-openclaw/" },
      { name: "Claude-Code", stars: 3000, url: "https://github.com/anthropics/claude-code" },
      { name: "AutoGPT", stars: 15000, url: "https://github.com/Significant-Gravitas/AutoGPT" },
      { name: "Llama-3", stars: 8000, url: "https://github.com/meta-llama/llama3" }
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
        this.size = Math.random() * 2 + 2; // Bigger for debug
        this.alpha = Math.random() * 0.5 + 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = `rgba(0, 255, 0, ${this.alpha})`; // GREEN for visibility
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    class Ship {
      constructor(data) {
        this.name = data.name;
        this.url = data.url;
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
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
        ctx.fillStyle = "red"; // RED for ships
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(this.name, this.x, this.y);
      }
    }

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    
    // Add event listeners to window to ensure capture
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        let hit = false;
        ships.forEach(ship => {
            const dx = mouseX - ship.x;
            const dy = mouseY - ship.y;
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

    window.addEventListener('click', (e) => {
       // Check ships
       ships.forEach(ship => {
            const dx = e.clientX - ship.x;
            const dy = e.clientY - ship.y;
            if (Math.sqrt(dx*dx + dy*dy) < 50) {
                window.location.href = ship.url;
            }
        });
    });

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      ships.forEach(s => { s.update(); s.draw(); });
      requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener('resize', resize);
    
    // Init objects
    for(let i=0; i<50; i++) particles.push(new Particle());
    shipsData.forEach(d => ships.push(new Ship(d)));
    
    animate();
  }

  // Run immediately if body exists, or wait
  if (document.body) {
    initOcean();
  } else {
    window.addEventListener('DOMContentLoaded', initOcean);
  }

})();
