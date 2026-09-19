/* ==========================================================================
   SIMULATOR HUB CONTROLLER (Tabs, Fullscreen, Routing & Toasts)
   ========================================================================== */
(function(){
  "use strict";

  // Anti-nesting: Ensure Hub is always the top-level window, never nested inside an iframe
  if (window.top !== window.self) {
    try {
      window.top.location.href = window.location.href;
    } catch(e) {}
  }

  const tabBtns = document.querySelectorAll('.hub-tab-btn');
  const tabPanels = document.querySelectorAll('.sim-tab-panel');
  const toast = document.getElementById('hubToast');

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2400);
  }

  function selectTab(tabKey) {
    tabBtns.forEach(btn => {
      const isActive = btn.dataset.tab === tabKey;
      btn.classList.toggle('active', isActive);
    });

    tabPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabKey}`);
    });

    window.location.hash = tabKey;

    const messages = {
      lan3d: '🌐 3D LAN Topologiyalari Simulyatori faol',
      hardware3d: '⚡ 3D Kompyuter Sxemalari & Hardware Atributlari faol',
      subnet: '🔢 IP Subnet & VLSM Kalkulyatori faol',
      ping: '💻 Jonli Ping & Latency Terminali faol',
      osi: '📶 OSI 7 Qatlamli Model Inspektori faol'
    };
    if (messages[tabKey]) showToast(messages[tabKey]);
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => selectTab(btn.dataset.tab));
  });

  // Handle Hash on Load
  const currentHash = window.location.hash.replace('#', '');
  if (['lan3d', 'hardware3d', 'subnet', 'ping', 'osi'].includes(currentHash)) {
    selectTab(currentHash);
  }

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (['lan3d', 'hardware3d', 'subnet', 'ping', 'osi'].includes(hash)) {
      selectTab(hash);
    }
  });

  // Fullscreen Simulator Mode (Target active simulator & hide header for 100% full screen)
  const fsBtn = document.getElementById('hubFullscreenBtn');
  const exitFsBtn = document.getElementById('exitFsFloatBtn');

  function getActiveSimTarget() {
    const activePanel = document.querySelector('.sim-tab-panel.active');
    if (!activePanel) return document.documentElement;
    const iframe = activePanel.querySelector('iframe');
    if (iframe) return iframe;
    return activePanel;
  }

  function toggleFullscreen() {
    const isNativeFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
    const isCssFs = document.body.classList.contains('is-fullscreen-sim');

    if (!isNativeFs && !isCssFs) {
      document.body.classList.add('is-fullscreen-sim');
      const target = getActiveSimTarget();
      const req = target.requestFullscreen || target.webkitRequestFullscreen || target.mozRequestFullScreen || target.msRequestFullscreen;
      if (req) {
        req.call(target).catch(() => {
          // Native fullscreen failed or blocked; CSS fullscreen remains active
        });
      }
      showToast("⛶ To‘liq ekran simulyatori yoqildi");
    } else {
      document.body.classList.remove('is-fullscreen-sim');
      if (isNativeFs) {
        const exit = document.exitFullscreen || document.webkitExitFullscreen || document.mozCancelFullScreen || document.msExitFullscreen;
        if (exit) exit.call(document).catch(() => {});
      }
      showToast("Oynaga qaytildi");
    }
  }

  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);
  if (exitFsBtn) exitFsBtn.addEventListener('click', toggleFullscreen);

  // Sync on native fullscreen exit (e.g. Esc key)
  ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'MSFullscreenChange'].forEach(ev => {
    document.addEventListener(ev, () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        document.body.classList.remove('is-fullscreen-sim');
      }
    });
  });

  window.selectHubTab = selectTab;
  window.showHubToast = showToast;
})();
