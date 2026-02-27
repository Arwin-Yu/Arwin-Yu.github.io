(function () {
  // Avoid duplicate layers on index (already custom-built)
  if (!document.getElementById('planet-system')) {
    var ocean = document.createElement('div');
    ocean.id = 'cosmic-ocean';
    ocean.style.position = 'fixed';
    ocean.style.inset = '0';
    ocean.style.zIndex = '-1';
    ocean.style.pointerEvents = 'none';
    ocean.style.overflow = 'hidden';
    ocean.style.background = "linear-gradient(180deg, rgba(6,10,20,0.72) 0%, rgba(8,12,24,0.35) 100%), url('/img/generated-space-v2/002-ultra-cinematic-deep-space-background-fo.png') center/cover no-repeat";
    ocean.style.animation = 'cosmosDrift 40s ease-in-out infinite alternate';

    var style = document.createElement('style');
    style.textContent = '@keyframes cosmosDrift{0%{transform:scale(1.01)}100%{transform:scale(1.03) translate3d(-0.5%,-0.4%,0)}}';
    document.head.appendChild(style);
    document.body.appendChild(ocean);
  }

  function cleanupLegacyFloatingBadges() {
    // Remove legacy subpage floating labels/ships (OpenClaw, AI HUB, etc.)
    var ids = ['vanta-bg'];
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.remove();
    });

    var selectors = ['.ocean-ship', '.ocean-lighthouse'];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { el.remove(); });
    });
  }

  cleanupLegacyFloatingBadges();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cleanupLegacyFloatingBadges, { once: true });
  }

  var art = document.getElementById('planet-art');
  if (art) {
    art.addEventListener('click', function () {
      window.location.href = '/2026/02/26/ai-projects-100k/';
    });
  }
})();
