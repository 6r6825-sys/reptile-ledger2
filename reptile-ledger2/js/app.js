/**
 * REPTILE PIXEL ACCOUNTING (鱗帳) - APPLICATION BOOTSTRAPPER
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Apply saved theme or default 'obsidian-dark' (預設黑底)
  const currentTheme = Store.getTheme();
  document.documentElement.setAttribute('data-theme', currentTheme);

  // Mark theme card as active
  document.querySelectorAll('.theme-card').forEach(card => {
    card.classList.toggle('active', card.getAttribute('data-theme-name') === currentTheme);
  });

  // 2. Initialize Reptile Mascot (黃色鬆獅蜥、立可白肥尾守宮、黑夜豹紋守宮)
  const mascotEngine = window.ReptileMascots || window.ChameleonMascot;
  if (mascotEngine) {
    mascotEngine.init('#chameleon-avatar', '#chameleon-status');
  }

  // 3. Initialize UI controller and views
  UI.init();

  // 4. Setup Settings & Backup modal triggers
  const btnOpenSettings = document.getElementById('btn-open-settings-modal');
  const modalSettings = document.getElementById('modal-settings');
  const btnCloseSettings = document.getElementById('btn-close-settings-modal');

  if (btnOpenSettings && modalSettings) {
    btnOpenSettings.addEventListener('click', () => {
      PixelAudio.playClick();
      modalSettings.style.display = 'flex';
    });
  }

  if (btnCloseSettings && modalSettings) {
    btnCloseSettings.addEventListener('click', () => {
      modalSettings.style.display = 'none';
    });
  }

  // Close modals on clicking backdrop
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.style.display = 'none';
    }
  });

  // 5. Register PWA Service Worker for iPhone Offline Privacy Operation
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').then((reg) => {
        console.log('🦎 PWA 離線快取服務已就緒，支援 iPhone 斷網完全離線記帳！', reg.scope);
      }).catch((err) => {
        console.log('PWA Service Worker 狀態提示：', err.message);
      });
    });
  }

  console.log('🦎 鱗帳 (Reptile Ledger) 8-Bit 像素復古複式記帳官方網站已啟動！');
});
