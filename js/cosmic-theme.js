(function () {
  var isHome = location.pathname === '/' || location.pathname === '/index.html';

  if (!isHome) {
    document.body.classList.add('subpage-daylight');

    // Hard-apply daylight style on subpages (works even when CSS cache is stale)
    if (!document.getElementById('subpage-daylight-inline-style')) {
      var daylight = document.createElement('style');
      daylight.id = 'subpage-daylight-inline-style';
      daylight.textContent = "body.subpage-daylight{background:linear-gradient(180deg,#dff1ff 0%,#eef7ff 48%,#f7fbff 100%)!important;}"
        + "body.subpage-daylight .banner{background:linear-gradient(180deg,rgba(160,210,255,.32) 0%,rgba(225,242,255,.78) 100%)!important;}"
        + "body.subpage-daylight #board{background:rgba(255,255,255,.92)!important;border:1px solid rgba(113,157,198,.28)!important;box-shadow:0 14px 36px rgba(36,67,98,.16)!important;}"
        + "body.subpage-daylight .index-card,body.subpage-daylight .post-content,body.subpage-daylight .post-detail-card,body.subpage-daylight #post{background:rgba(255,255,255,.94)!important;border:1px solid rgba(127,171,212,.24)!important;}"
        + "body.subpage-daylight .markdown-body,body.subpage-daylight .about-content,body.subpage-daylight .post-content,body.subpage-daylight #post{color:#243b55!important;}"
        + "body.subpage-daylight .markdown-body h1,body.subpage-daylight .markdown-body h2,body.subpage-daylight .markdown-body h3,body.subpage-daylight .about-content h1,body.subpage-daylight .about-content h2,body.subpage-daylight .about-content h3{color:#13263d!important;}";
      document.head.appendChild(daylight);
    }
  }

  // Keep cosmic ocean only for homepage experience.
  if (isHome && !document.getElementById('planet-system')) {
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
