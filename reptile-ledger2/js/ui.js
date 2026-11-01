/**
 * REPTILE PIXEL ACCOUNTING (鱗帳) - USER INTERFACE CONTROLLER
 */

const UI = (() => {
  // Current active navigation tab
  let activeTab = 'entry';

  // Tab definitions dictionary
  const TAB_DEFS = {
    'entry': { icon: '📝', name: '輸入分錄', desc: '日常借貸記帳與自動平衡' },
    'journal': { icon: '📖', name: '日記帳', desc: '依時間序查核所有交易憑證' },
    'balance-sheet': { icon: '📑', name: '資產負債表', desc: '資產與負債總額及淨資產淨值' },
    'cash-flow': { icon: '🌊', name: '資金流向表', desc: '依借貸分錄自動分析實質現金流入流出與自有帳戶調度' },
    'comparison': { icon: '📈', name: '科目跨期比較', desc: '科目跨期雙期精準對比分析' },
    'accounts': { icon: '🗂️', name: '會計科目', desc: '會計要素代碼管理、餘額總覽與明細分類帳對帳' },
    'favorites': { icon: '⭐', name: '常用分錄', desc: '快速套用複合借貸模板庫' }
  };

  // Entry Form In-Memory State
  let currentDebitLegs = [];
  let currentCreditLegs = [];
  let currentEditingTransactionId = null;

  // Comparison Tab In-Memory State
  let comparisonAccountId = null;
  let comparisonMode = 'two_periods'; // 'two_periods'

  // Ledger Tab View State (總覽 vs 明細)
  let ledgerMode = 'overview'; // 'overview' | 'details'
  let ledgerSelectedAccountId = null;

  // Account Management Scroll Target State (避免新增科目跳至頂端)
  let pendingScrollTargetAccId = null;

  // Navigation History Stack (支援手機滑動返回與跨分頁歷史返回)
  let navHistory = [];
  let isBackNavigating = false;

  // Helper for Toasts
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'pixel-toast';
    toast.innerHTML = message;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 2800);
  }

  // Helper: Format currency
  function fmtCurrency(num) {
    if (num === undefined || num === null || isNaN(num)) return '$0';
    return '$' + Number(num).toLocaleString('zh-TW');
  }

  // Helper: Format Voucher No (V + two digits, e.g. V01, V02)
  function fmtVoucherNo(v) {
    if (!v) return 'V01';
    const str = String(v).trim();
    if (/^V\d{2}$/i.test(str)) {
      return str.toUpperCase();
    }
    const m = str.match(/\d+/g);
    if (m && m.length > 0) {
      const lastNumStr = m[m.length - 1];
      const twoDigits = lastNumStr.slice(-2).padStart(2, '0');
      return `V${twoDigits}`;
    }
    return str;
  }

  // Helper: Get Taiwanese date string
  function getTodayString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  return {
    // ==========================================
    // INITIALIZATION
    // ==========================================
    init: () => {
      // 1. Set current date for entry form
      const dateInput = document.getElementById('entry-date');
      if (dateInput) dateInput.value = getTodayString();

      // 2. Initialize default legs for entry form (1 Debit, 1 Credit)
      UI.resetEntryForm();

      // 3. Setup Navigation Tabs & Reorder Engine
      UI.renderNavTabs();
      UI.setupTabOrderModal();

      // 4. Setup Theme Modal & Buttons
      UI.setupThemeControls();

      // 5. Setup Mascot Controls (全 20 款爬蟲/毛孩/鳥禽萌寵)
      UI.setupMascotControls();

      // 6. Setup Brand Title / Subtitle Customization
      UI.setupBrandingControls();
      UI.updateBrandingDOM();

      // 7. Setup Entry Form Events
      UI.setupEntryFormEvents();

      // 8. Setup Journal View Events
      UI.setupJournalEvents();

      // 9. Setup Ledger View Events
      UI.setupLedgerEvents();


      // 11. Setup Balance Sheet Events (資產負債表)
      UI.setupBalanceSheetEvents();

      // 11.5. Setup Cash Flow Events (資金流向表)
      UI.setupCashFlowEvents();

      // 12. Setup Comparison Events
      UI.setupComparisonEvents();

      // 13. Setup Account Management Events
      UI.setupAccountEvents();

      // 14. Setup Presets Events
      UI.setupPresetEvents();

      // 15. Setup Settings & Backup Events
      UI.setupSettingsEvents();

      // 16. Setup Website Footer Navigation
      UI.setupFooterEvents();

      // 17. Setup Mobile Navigation & Selectable List
      UI.setupMobileNav();

      // 18. Setup Preset Modal Events (新增/編輯常用分錄)
      UI.setupPresetModalEvents();

      // 19. Setup Pixel Numeric Keypad Events (像素金額數字鍵盤)
      UI.setupKeypadEvents();

      // 20. Setup Mobile Swipe Back Navigation (手機滑動回上一頁)
      UI.setupSwipeBack();

      // 21. Setup Left/Right Swipe Tab Navigation (左右滑動切換分頁)
      UI.setupSwipeTabNavigation();

      // 22. Mobile Fast-Tap Anti-Zoom Optimization (防止手機快速點擊時誤觸畫面放大)
      let lastTouchTime = 0;
      document.addEventListener('touchend', (e) => {
        const currentTime = Date.now();
        if (currentTime - lastTouchTime <= 300) {
          if (e.target.closest('button, input, select, a, .pixel-btn, .keypad-btn, .nav-tab-btn, .chameleon-avatar-box, .theme-card, .mascot-choice-card, .mascot-filter-btn')) {
            e.preventDefault();
            e.target.click();
          }
        }
        lastTouchTime = currentTime;
      }, { passive: false });

      // Subscribe to Store updates
      Store.subscribe((event, payload) => {
        if (event === 'transactions_updated' || event === 'accounts_updated' || event === 'all_data_reset') {
          UI.renderCurrentTab();
          UI.populateAccountDropdowns();
          UI.refreshQuickFavOptions();
        }
        if (event === 'favorites_updated') {
          UI.refreshQuickFavOptions();
          if (activeTab === 'favorites') {
            UI.renderFavoritesList();
          }
        }
        if (event === 'brand_change') {
          UI.updateBrandingDOM();
        }
        if (event === 'mascot_change') {
          ReptileMascots.renderCurrent(payload);
        }
        if (event === 'theme_change') {
          ReptileMascots.renderCurrent(Store.getMascot());
        }
        if (event === 'tab_order_change') {
          UI.renderNavTabs();
          UI.renderMobileTabPickerList();
        }
      });

      // Initial render of current tab & dropdowns
      UI.populateAccountDropdowns();
      UI.refreshQuickFavOptions();
      UI.switchTab('entry');
      try {
        if (window.history && window.history.replaceState) {
          window.history.replaceState({ tab: 'entry' }, '', '#entry');
        }
      } catch (e) {}

      // Check CRT initial state
      if (Store.getCrtEnabled()) {
        document.body.classList.add('crt-enabled');
      }

      // Responsive redraw on window resize (e.g. mobile orientation change)
      let resizeTimer = null;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (activeTab === 'comparison') {
            UI.renderComparison();
          }
        }, 200);
      });
    },

    // ==========================================
    // TAB SWITCHING & RENDERING
    // ==========================================
    switchTab: (tabName, isBack = false) => {
      if (tabName === 'ledger') tabName = 'accounts';
      if (tabName === 'pnl') tabName = 'entry';
      let targetTab = tabName || 'entry';
      if (targetTab === 'pnl') targetTab = 'entry';

      // Push history if navigating to a new tab and not in back-navigation
      if (!isBack && activeTab && activeTab !== targetTab) {
        navHistory.push(activeTab);
        if (navHistory.length > 40) navHistory.shift();

        try {
          if (window.history && window.history.pushState) {
            window.history.pushState({ tab: targetTab }, '', '#' + targetTab);
          }
        } catch (e) {}
      }

      activeTab = targetTab;
      if (activeTab === 'accounts') {
        const overviewView = document.getElementById('accounts-overview-view');
        const ledgerView = document.getElementById('accounts-ledger-view');
        if (overviewView) overviewView.style.display = 'flex';
        if (ledgerView) ledgerView.style.display = 'none';
      }
      document.querySelectorAll('.nav-tab-btn').forEach(b => {
        const isMatched = b.getAttribute('data-tab') === activeTab;
        b.classList.toggle('active', isMatched);
        if (isMatched) {
          b.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      document.querySelectorAll('.tab-content').forEach(c => {
        c.classList.toggle('active', c.id === `tab-${activeTab}`);
      });

      // Update Mobile Bottom Navigation Display
      const def = TAB_DEFS[activeTab] || { icon: '📄', name: activeTab };
      const iconEl = document.getElementById('bottom-active-icon');
      const nameEl = document.getElementById('bottom-active-name');
      if (iconEl) iconEl.innerText = def.icon;
      if (nameEl) nameEl.innerText = def.name;

      // Update Tab Picker Sheet Items Active State
      document.querySelectorAll('.tab-picker-item').forEach(item => {
        const isMatched = item.getAttribute('data-tab') === activeTab;
        item.classList.toggle('active', isMatched);
        const existingBadge = item.querySelector('.tab-picker-item-badge');
        if (existingBadge) existingBadge.remove();
        if (isMatched) {
          const badgeEl = document.createElement('span');
          badgeEl.className = 'tab-picker-item-badge';
          badgeEl.innerText = '✓ 目前分頁';
          item.appendChild(badgeEl);
        }
      });

      // Always refresh quick fav options when landing on entry tab
      if (activeTab === 'entry') {
        UI.refreshQuickFavOptions();
      }

      UI.renderCurrentTab();
    },

    renderCurrentTab: () => {
      switch (activeTab) {
        case 'entry':
          UI.renderEntryLegs();
          UI.updateBalanceMetrics();
          break;
        case 'journal':
          UI.renderJournal();
          break;
        case 'ledger':
          UI.switchTab('accounts');
          break;
        case 'pnl':
          UI.switchTab('entry');
          break;
        case 'balance-sheet':
          UI.renderBalanceSheet();
          break;
        case 'cash-flow':
          UI.renderCashFlow();
          break;
        case 'comparison':
          UI.renderComparison();
          break;
        case 'accounts':
          UI.renderAccountsList();
          break;
        case 'favorites':
          UI.renderFavoritesList();
          break;
      }
    },

    // ==========================================
    // ACCOUNT DROPDOWN BUILDER
    // ==========================================
    populateAccountDropdowns: () => {
      const accounts = Store.getAccounts();
      const optionsHtml = accounts.map(a => {
        const catInfo = AccountingConstants.CATEGORIES[a.category] || { name: '其他' };
        return `<option value="${a.id}">[${a.code}] ${a.name} (${catInfo.name})</option>`;
      }).join('');



      const ledgerSelectAcc = document.getElementById('ledger-select-account');
      if (ledgerSelectAcc) {
        const currentVal = ledgerSelectAcc.value;
        ledgerSelectAcc.innerHTML = optionsHtml;
        if (currentVal && accounts.some(a => a.id === currentVal)) {
          ledgerSelectAcc.value = currentVal;
        } else if (accounts.length > 0) {
          ledgerSelectAcc.value = accounts[0].id;
        }
      }
    },

    // ==========================================
    // DOUBLE ENTRY FORM LOGIC (複合分錄)
    // ==========================================
    updateEditModeUI: (isEditing, tx = null) => {
      const banner = document.getElementById('entry-edit-banner');
      const voucherInfo = document.getElementById('entry-edit-voucher-info');
      const cancelBottom = document.getElementById('btn-cancel-edit-bottom');
      const favLabel = document.getElementById('entry-save-as-fav-label');
      const submitBtn = document.getElementById('btn-submit-entry');

      if (banner) {
        banner.style.display = isEditing ? 'flex' : 'none';
      }
      if (voucherInfo) {
        voucherInfo.innerHTML = isEditing && tx 
          ? `<strong>${fmtVoucherNo(tx.voucherNo)}</strong> (${tx.date}) ${tx.description || ''}`
          : '';
      }
      if (cancelBottom) {
        cancelBottom.style.display = isEditing ? 'inline-flex' : 'none';
      }
      if (favLabel) {
        favLabel.style.display = isEditing ? 'none' : 'flex';
      }
      if (submitBtn) {
        submitBtn.innerHTML = isEditing ? '💾 儲存修改 (更新分錄)' : '💾 儲存分錄';
      }
    },

    startEditTransaction: (id) => {
      const tx = Store.getTransactionById(id);
      if (!tx) {
        showToast('找不到該分錄資料！');
        return;
      }
      PixelAudio.playClick();
      currentEditingTransactionId = id;

      const dateInput = document.getElementById('entry-date');
      const descInput = document.getElementById('entry-desc');
      if (dateInput) dateInput.value = tx.date;
      if (descInput) descInput.value = tx.description || '';

      const debitLegs = (tx.legs || []).filter(l => l.type === 'debit');
      const creditLegs = (tx.legs || []).filter(l => l.type === 'credit');

      currentDebitLegs = debitLegs.map(l => ({
        id: 'leg_' + Math.random(),
        accountId: l.accountId,
        amount: l.amount
      }));
      currentCreditLegs = creditLegs.map(l => ({
        id: 'leg_' + Math.random(),
        accountId: l.accountId,
        amount: l.amount
      }));

      if (currentDebitLegs.length === 0) {
        const accounts = Store.getAccounts();
        currentDebitLegs.push({ id: 'leg_' + Math.random(), accountId: accounts[0].id, amount: '' });
      }
      if (currentCreditLegs.length === 0) {
        const accounts = Store.getAccounts();
        currentCreditLegs.push({ id: 'leg_' + Math.random(), accountId: accounts[0].id, amount: '' });
      }

      UI.renderEntryLegs();
      UI.updateBalanceMetrics();
      UI.updateEditModeUI(true, tx);
      UI.switchTab('entry');
      showToast(`✏️ 載入憑證【${fmtVoucherNo(tx.voucherNo)}】進行修改`);
    },

    cancelEditTransaction: () => {
      PixelAudio.playClick();
      currentEditingTransactionId = null;
      UI.updateEditModeUI(false);
      UI.resetEntryForm();
      showToast('已取消修改分錄');
    },

    resetEntryForm: () => {
      currentEditingTransactionId = null;
      UI.updateEditModeUI(false);

      const accounts = Store.getAccounts();
      const defaultDebit = accounts.find(a => a.category === 'expense') || accounts[0];
      const defaultCredit = accounts.find(a => a.category === 'asset' || a.category === 'liability') || accounts[1];

      currentDebitLegs = [
        { id: 'leg_' + Math.random(), accountId: defaultDebit ? defaultDebit.id : '', amount: '' }
      ];
      currentCreditLegs = [
        { id: 'leg_' + Math.random(), accountId: defaultCredit ? defaultCredit.id : '', amount: '' }
      ];

      const descInput = document.getElementById('entry-desc');
      if (descInput) descInput.value = '';

      const dateInput = document.getElementById('entry-date');
      if (dateInput) dateInput.value = getTodayString();

      const favSelect = document.getElementById('entry-quick-fav');
      if (favSelect) favSelect.value = '';

      const saveAsFavCheckbox = document.getElementById('entry-save-as-fav');
      if (saveAsFavCheckbox) saveAsFavCheckbox.checked = false;

      const favCustomNameInput = document.getElementById('entry-fav-custom-name');
      if (favCustomNameInput) {
        favCustomNameInput.value = '';
        favCustomNameInput.style.display = 'none';
      }

      UI.renderEntryLegs();
      UI.updateBalanceMetrics();
    },

    renderEntryLegs: () => {
      const accounts = Store.getAccounts();
      const makeOptions = (selectedId) => {
        return accounts.map(a => {
          const cat = AccountingConstants.CATEGORIES[a.category] || { name: '其他' };
          const sel = a.id === selectedId ? 'selected' : '';
          return `<option value="${a.id}" ${sel}>${a.name} (${cat.name})</option>`;
        }).join('');
      };

      // 1. Render Debit Legs (純科目與金額，無明細摘要)
      const debitListEl = document.getElementById('debit-legs-list');
      if (debitListEl) {
        debitListEl.innerHTML = currentDebitLegs.map((leg, idx) => `
          <div class="leg-row" data-id="${leg.id}">
            <select class="pixel-select leg-account" data-side="debit" data-idx="${idx}">
              ${makeOptions(leg.accountId)}
            </select>
            <input type="number" min="0" step="any" inputmode="decimal" class="pixel-input leg-amount" placeholder="🔢 金額" 
              title="點擊填寫金額 (開啟像素數字鍵盤)" value="${leg.amount}" data-side="debit" data-idx="${idx}">
            <button type="button" class="pixel-btn pixel-btn-danger pixel-btn-sm btn-del-leg" 
              data-side="debit" data-idx="${idx}" title="刪除此借方行">✕</button>
          </div>
        `).join('');
      }

      // 2. Render Credit Legs (純科目與金額，無明細摘要)
      const creditListEl = document.getElementById('credit-legs-list');
      if (creditListEl) {
        creditListEl.innerHTML = currentCreditLegs.map((leg, idx) => `
          <div class="leg-row" data-id="${leg.id}">
            <select class="pixel-select leg-account" data-side="credit" data-idx="${idx}">
              ${makeOptions(leg.accountId)}
            </select>
            <input type="number" min="0" step="any" inputmode="decimal" class="pixel-input leg-amount" placeholder="🔢 金額" 
              title="點擊填寫金額 (開啟像素數字鍵盤)" value="${leg.amount}" data-side="credit" data-idx="${idx}">
            <button type="button" class="pixel-btn pixel-btn-danger pixel-btn-sm btn-del-leg" 
              data-side="credit" data-idx="${idx}" title="刪除此貸方行">✕</button>
          </div>
        `).join('');
      }

      // Attach row change listeners
      document.querySelectorAll('.leg-account').forEach(el => {
        el.addEventListener('change', (e) => {
          const side = e.target.dataset.side;
          const idx = parseInt(e.target.dataset.idx, 10);
          if (side === 'debit') currentDebitLegs[idx].accountId = e.target.value;
          else currentCreditLegs[idx].accountId = e.target.value;
        });
      });

      document.querySelectorAll('.leg-amount').forEach(el => {
        el.addEventListener('click', (e) => {
          const side = e.target.dataset.side;
          const idx = parseInt(e.target.dataset.idx, 10);
          UI.openKeypad(side, idx, e.target);
        });

        el.addEventListener('focus', (e) => {
          if (UI.keypadState && UI.keypadState.justClosedTimer) return;
          if (!UI.isKeypadOpen()) {
            const side = e.target.dataset.side;
            const idx = parseInt(e.target.dataset.idx, 10);
            UI.openKeypad(side, idx, e.target);
          }
        });

        el.addEventListener('input', (e) => {
          const side = e.target.dataset.side;
          const idx = parseInt(e.target.dataset.idx, 10);
          const val = parseFloat(e.target.value) || '';
          if (side === 'debit') currentDebitLegs[idx].amount = val;
          else currentCreditLegs[idx].amount = val;
          UI.updateBalanceMetrics();
        });
      });

      document.querySelectorAll('.btn-del-leg').forEach(el => {
        el.addEventListener('click', (e) => {
          PixelAudio.playClick();
          const side = e.target.dataset.side;
          const idx = parseInt(e.target.dataset.idx, 10);
          if (side === 'debit') {
            if (currentDebitLegs.length <= 1) {
              showToast('借方至少需保留一行！');
              return;
            }
            currentDebitLegs.splice(idx, 1);
          } else {
            if (currentCreditLegs.length <= 1) {
              showToast('貸方至少需保留一行！');
              return;
            }
            currentCreditLegs.splice(idx, 1);
          }
          UI.renderEntryLegs();
          UI.updateBalanceMetrics();
        });
      });
    },

    updateBalanceMetrics: () => {
      const debitTotal = currentDebitLegs.reduce((sum, leg) => sum + (parseFloat(leg.amount) || 0), 0);
      const creditTotal = currentCreditLegs.reduce((sum, leg) => sum + (parseFloat(leg.amount) || 0), 0);
      const diff = debitTotal - creditTotal;
      const isBalanced = Math.abs(diff) < 0.0001 && debitTotal > 0;

      // Update text values
      const debitValEl = document.getElementById('metric-debit-total');
      const creditValEl = document.getElementById('metric-credit-total');
      const diffValEl = document.getElementById('metric-diff');
      const subtotalDebit = document.getElementById('subtotal-debit');
      const subtotalCredit = document.getElementById('subtotal-credit');

      if (debitValEl) debitValEl.innerText = fmtCurrency(debitTotal);
      if (creditValEl) creditValEl.innerText = fmtCurrency(creditTotal);
      if (subtotalDebit) subtotalDebit.innerText = fmtCurrency(debitTotal);
      if (subtotalCredit) subtotalCredit.innerText = fmtCurrency(creditTotal);

      if (diffValEl) {
        diffValEl.innerText = fmtCurrency(Math.abs(diff));
        diffValEl.style.color = isBalanced ? 'var(--balance-ok)' : 'var(--balance-err)';
      }

      // Update Status Box
      const statusBox = document.getElementById('balance-status-box');
      if (statusBox) {
        if (isBalanced) {
          statusBox.className = 'balance-status-box balanced';
          statusBox.innerHTML = `<span>✓ 借貸完全平衡</span>`;
        } else {
          statusBox.className = 'balance-status-box unbalanced';
          statusBox.innerHTML = `<span>⚠️ 借貸尚未平衡 (差 $${Math.abs(diff)})</span>`;
        }
      }

      // Update submit button state
      const submitBtn = document.getElementById('btn-submit-entry');
      if (submitBtn) {
        submitBtn.disabled = !isBalanced;
        if (isBalanced) {
          submitBtn.classList.add('pixel-btn-primary');
        } else {
          submitBtn.classList.remove('pixel-btn-primary');
        }
      }

      // Notify Active Mascot!
      ReptileMascots.setBalanceStatus(isBalanced, diff);
    },

    setupEntryFormEvents: () => {
      // Add Debit Leg button
      const btnAddDebit = document.getElementById('btn-add-debit');
      if (btnAddDebit) {
        btnAddDebit.addEventListener('click', () => {
          PixelAudio.playClick();
          const accounts = Store.getAccounts();
          currentDebitLegs.push({
            id: 'leg_' + Math.random(),
            accountId: accounts[0].id,
            amount: ''
          });
          UI.renderEntryLegs();
          UI.updateBalanceMetrics();
        });
      }

      // Add Credit Leg button
      const btnAddCredit = document.getElementById('btn-add-credit');
      if (btnAddCredit) {
        btnAddCredit.addEventListener('click', () => {
          PixelAudio.playClick();
          const accounts = Store.getAccounts();
          currentCreditLegs.push({
            id: 'leg_' + Math.random(),
            accountId: accounts[0].id,
            amount: ''
          });
          UI.renderEntryLegs();
          UI.updateBalanceMetrics();
        });
      }

      // Cancel Edit buttons
      const btnCancelEdit = document.getElementById('btn-cancel-edit');
      const btnCancelEditBottom = document.getElementById('btn-cancel-edit-bottom');
      const handleCancel = () => UI.cancelEditTransaction();
      if (btnCancelEdit) btnCancelEdit.addEventListener('click', handleCancel);
      if (btnCancelEditBottom) btnCancelEditBottom.addEventListener('click', handleCancel);

      // Auto Balance Button (✨ 自動平衡)
      const btnAutoBalance = document.getElementById('btn-auto-balance');
      if (btnAutoBalance) {
        btnAutoBalance.addEventListener('click', () => {
          PixelAudio.playCoin();
          const debitTotal = currentDebitLegs.reduce((sum, leg) => sum + (parseFloat(leg.amount) || 0), 0);
          const creditTotal = currentCreditLegs.reduce((sum, leg) => sum + (parseFloat(leg.amount) || 0), 0);
          const diff = debitTotal - creditTotal;

          if (Math.abs(diff) < 0.0001) {
            showToast('🦎 目前借貸已經平衡囉！');
            return;
          }

          if (diff > 0) {
            // Debit > Credit: add difference to credit
            const lastCredit = currentCreditLegs[currentCreditLegs.length - 1];
            if (!lastCredit.amount || lastCredit.amount === 0) {
              lastCredit.amount = diff;
            } else {
              // Add new credit leg
              const accounts = Store.getAccounts();
              currentCreditLegs.push({
                id: 'leg_' + Math.random(),
                accountId: lastCredit.accountId || accounts[0].id,
                amount: diff
              });
            }
          } else {
            // Credit > Debit: add difference to debit
            const lastDebit = currentDebitLegs[currentDebitLegs.length - 1];
            if (!lastDebit.amount || lastDebit.amount === 0) {
              lastDebit.amount = Math.abs(diff);
            } else {
              const accounts = Store.getAccounts();
              currentDebitLegs.push({
                id: 'leg_' + Math.random(),
                accountId: lastDebit.accountId || accounts[0].id,
                amount: Math.abs(diff)
              });
            }
          }

          UI.renderEntryLegs();
          UI.updateBalanceMetrics();
          showToast('✨ 已自動補齊借貸平衡！');
        });
      }

      // Quick Favorite Entry select
      const quickFavSelect = document.getElementById('entry-quick-fav');
      if (quickFavSelect) {
        UI.refreshQuickFavOptions();
        quickFavSelect.addEventListener('change', (e) => {
          if (!e.target.value) return;
          UI.applyFavoritePreset(e.target.value);
        });
      }

      // Checkbox for saving as favorite preset (顯示/隱藏自訂名稱輸入框)
      const saveAsFavCheckbox = document.getElementById('entry-save-as-fav');
      const favCustomNameInput = document.getElementById('entry-fav-custom-name');
      if (saveAsFavCheckbox && favCustomNameInput) {
        saveAsFavCheckbox.addEventListener('change', (e) => {
          PixelAudio.playClick();
          favCustomNameInput.style.display = e.target.checked ? 'inline-block' : 'none';
          if (e.target.checked) {
            favCustomNameInput.focus();
          }
        });
      }

      // Submit Entry
      const form = document.getElementById('double-entry-form');
      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();

          const debitTotal = currentDebitLegs.reduce((sum, leg) => sum + (parseFloat(leg.amount) || 0), 0);
          const creditTotal = currentCreditLegs.reduce((sum, leg) => sum + (parseFloat(leg.amount) || 0), 0);

          if (Math.abs(debitTotal - creditTotal) > 0.0001 || debitTotal <= 0) {
            PixelAudio.playError();
            showToast('⚠️ 借貸不平衡或金額為零，無法儲存分錄！');
            return;
          }

          const date = document.getElementById('entry-date').value || getTodayString();
          const desc = document.getElementById('entry-desc').value.trim() || '日常複式分錄';

          const legs = [];
          currentDebitLegs.forEach(l => {
            legs.push({
              type: 'debit',
              accountId: l.accountId,
              amount: parseFloat(l.amount)
            });
          });
          currentCreditLegs.forEach(l => {
            legs.push({
              type: 'credit',
              accountId: l.accountId,
              amount: parseFloat(l.amount)
            });
          });

          // Check if user wants to save as favorite preset
          const saveAsFavEl = document.getElementById('entry-save-as-fav');
          const favNameEl = document.getElementById('entry-fav-custom-name');
          let savedAsFavName = null;

          if (saveAsFavEl && saveAsFavEl.checked) {
            const customName = favNameEl ? favNameEl.value.trim() : '';
            savedAsFavName = customName || desc || '常用分錄';
            try {
              Store.addFavorite({
                name: savedAsFavName,
                reptileIcon: '🦎',
                description: desc,
                category: '常用',
                legs: JSON.parse(JSON.stringify(legs))
              });
              UI.refreshQuickFavOptions();
              if (activeTab === 'favorites') {
                UI.renderFavoritesList();
              }
            } catch (favErr) {
              console.error('Save favorite preset error:', favErr);
            }
            saveAsFavEl.checked = false;
            if (favNameEl) {
              favNameEl.value = '';
              favNameEl.style.display = 'none';
            }
          }

          // If in edit mode: update existing transaction
          if (currentEditingTransactionId) {
            Store.updateTransaction(currentEditingTransactionId, {
              date,
              description: desc,
              legs,
              totalDebit: debitTotal,
              totalCredit: creditTotal
            });

            currentEditingTransactionId = null;
            UI.updateEditModeUI(false);
            UI.resetEntryForm();

            PixelAudio.playSuccess();
            ReptileMascots.triggerAction();
            if (savedAsFavName) {
              showToast(`✅ 分錄已成功更新，並同時建立常用分錄「${savedAsFavName}」！`);
            } else {
              showToast(`✅ 分錄已成功更新！總額 ${fmtCurrency(debitTotal)}`);
            }
            UI.switchTab('journal');
            return;
          }

          // Create transaction in store
          Store.addTransaction({
            date,
            description: desc,
            legs,
            totalDebit: debitTotal,
            totalCredit: creditTotal
          });

          PixelAudio.playSuccess();
          ReptileMascots.triggerAction();
          if (savedAsFavName) {
            showToast(`🦎 分錄已成功入帳，並已同時建立常用分錄「${savedAsFavName}」！`);
          } else {
            showToast(`🦎 分錄已成功入帳！總額 ${fmtCurrency(debitTotal)}`);
          }

          UI.resetEntryForm();
        });
      }
    },

    refreshQuickFavOptions: () => {
      const quickFavSelect = document.getElementById('entry-quick-fav');
      if (!quickFavSelect) return;
      const favs = Store.getFavorites();
      quickFavSelect.innerHTML = `<option value="">-- 快速套用常用分錄模板 --</option>` +
        favs.map(f => `<option value="${f.id}">${f.reptileIcon || '🦎'} ${f.name}</option>`).join('');
    },

    applyFavoritePreset: (presetId) => {
      const favs = Store.getFavorites();
      const tpl = favs.find(f => f.id === presetId);
      if (!tpl) return;

      PixelAudio.playCoin();

      const debitLegs = tpl.legs.filter(l => l.type === 'debit');
      const creditLegs = tpl.legs.filter(l => l.type === 'credit');

      currentDebitLegs = debitLegs.map(l => ({
        id: 'leg_' + Math.random(),
        accountId: l.accountId,
        amount: l.amount
      }));

      currentCreditLegs = creditLegs.map(l => ({
        id: 'leg_' + Math.random(),
        accountId: l.accountId,
        amount: l.amount
      }));

      const descInput = document.getElementById('entry-desc');
      if (descInput) descInput.value = tpl.name;

      UI.renderEntryLegs();
      UI.updateBalanceMetrics();
      showToast(`已載入常用分錄「${tpl.name}」！`);
    },

    // ==========================================
    // JOURNAL VIEW (日記帳)
    // ==========================================
    setupJournalEvents: () => {
      const searchInput = document.getElementById('journal-search');
      const dateFilter = document.getElementById('journal-filter-period');

      const refresh = () => UI.renderJournal();

      if (searchInput) searchInput.addEventListener('input', refresh);
      if (dateFilter) dateFilter.addEventListener('change', refresh);

      // Export CSV
      const btnExport = document.getElementById('btn-export-journal-csv');
      if (btnExport) {
        btnExport.addEventListener('click', () => {
          PixelAudio.playCoin();
          UI.exportJournalCSV();
        });
      }
    },

    renderJournal: () => {
      const container = document.getElementById('journal-table-body');
      const summaryBar = document.getElementById('journal-summary-bar');
      if (!container) return;

      const keyword = (document.getElementById('journal-search')?.value || '').trim();
      const period = document.getElementById('journal-filter-period')?.value || 'this_month';
      const accountId = '';

      // Date calculations
      const now = new Date();
      let startDate = null;
      let endDate = null;

      if (period === 'this_month') {
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      } else if (period === 'last_month') {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startDate = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 0).getDate();
        endDate = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      } else if (period === 'today') {
        startDate = getTodayString();
        endDate = getTodayString();
      }

      const journalData = AccountingEngine.getJournalEntries({
        startDate,
        endDate,
        keyword,
        accountId
      });

      if (summaryBar) {
        summaryBar.innerHTML = `
          <span>分錄共 <strong>${journalData.totalEntries}</strong> 筆</span> |
          <span>借方累計: <strong style="color:var(--debit-color)">${fmtCurrency(journalData.totalDebit)}</strong></span> |
          <span>貸方累計: <strong style="color:var(--credit-color)">${fmtCurrency(journalData.totalCredit)}</strong></span>
        `;
      }

      if (journalData.entries.length === 0) {
        container.innerHTML = `
          <tr>
            <td colspan="6" style="text-align:center; padding: 30px; color:var(--text-muted)">
              🦎 查無分錄資料！請調整篩選條件或至「記帳」新增分錄。
            </td>
          </tr>
        `;
        return;
      }

      let html = '';
      journalData.entries.forEach(entry => {
        const debitLegsHtml = entry.debitLegs.map(leg => `
          <div class="journal-leg-item debit-leg">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="pixel-badge badge-debit">借</span>
              <strong>${leg.accountName}</strong>
            </div>
            <span style="font-family:var(--font-pixel-heading); color:var(--debit-color); font-weight:bold;">${fmtCurrency(leg.amount)}</span>
          </div>
        `).join('');

        const creditLegsHtml = entry.creditLegs.map(leg => `
          <div class="journal-leg-item credit-leg">
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="pixel-badge badge-credit">貸</span>
              <strong>${leg.accountName}</strong>
            </div>
            <span style="font-family:var(--font-pixel-heading); color:var(--credit-color); font-weight:bold;">${fmtCurrency(leg.amount)}</span>
          </div>
        `).join('');

        html += `
          <tr class="journal-entry-row">
            <td class="journal-date-col">
              <div class="journal-date-text">${entry.date}</div>
              <div class="journal-voucher-badge">${fmtVoucherNo(entry.voucherNo)}</div>
              <div class="journal-actions-box">
                <button type="button" class="pixel-btn pixel-btn-sm btn-edit-tx" data-id="${entry.id}" title="修改此筆分錄">修改</button>
                <button type="button" class="pixel-btn pixel-btn-danger pixel-btn-sm btn-delete-tx" data-id="${entry.id}" title="刪除此筆分錄">刪除</button>
              </div>
            </td>
            <td class="journal-content-col">
              <div class="journal-legs-flow">
                ${debitLegsHtml}
                ${creditLegsHtml}
              </div>
              <div class="journal-desc-bottom">
                <span>📝</span>
                <span>${entry.description || '無摘要'}</span>
              </div>
            </td>
          </tr>
        `;
      });

      container.innerHTML = html;

      // Attach edit transaction listeners
      document.querySelectorAll('.btn-edit-tx').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          UI.startEditTransaction(id);
        });
      });

      // Attach delete transaction listeners
      document.querySelectorAll('.btn-delete-tx').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          if (confirm('確定要刪除此筆交易分錄嗎？此操作無法還原。')) {
            PixelAudio.playError();
            Store.deleteTransaction(id);
            if (currentEditingTransactionId === id) {
              UI.cancelEditTransaction();
            }
            showToast('已刪除分錄！');
          }
        });
      });
    },

    exportJournalCSV: () => {
      const allTx = Store.getTransactions();
      const accountsMap = new Map(Store.getAccounts().map(a => [a.id, a]));

      let csv = '\uFEFF憑證號,日期,摘要,借/貸,科目代號,科目名稱,金額,明細備註\n';
      allTx.forEach(tx => {
        tx.legs.forEach(leg => {
          const acc = accountsMap.get(leg.accountId) || { code: '', name: '' };
          const side = leg.type === 'debit' ? '借' : '貸';
          csv += `"${fmtVoucherNo(tx.voucherNo)}","${tx.date}","${tx.description.replace(/"/g, '""')}","${side}","${acc.code}","${acc.name}","${leg.amount}","${(leg.note||'').replace(/"/g, '""')}"\n`;
        });
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `日記帳_${getTodayString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('日記帳 CSV 已下載！');
    },

    // ==========================================
    // LEDGER DETAILS VIEW (分類帳明細 - 內嵌於會計科目中)
    // ==========================================
    setupLedgerEvents: () => {
      // 1. Back to accounts overview button
      const btnBack = document.getElementById('btn-back-to-accounts-overview');
      if (btnBack) {
        btnBack.addEventListener('click', () => {
          PixelAudio.playClick();
          const overviewView = document.getElementById('accounts-overview-view');
          const ledgerView = document.getElementById('accounts-ledger-view');
          if (overviewView) overviewView.style.display = 'flex';
          if (ledgerView) ledgerView.style.display = 'none';

          if (ledgerSelectedAccountId) {
            setTimeout(() => {
              const rowEl = document.getElementById(`acc-row-${ledgerSelectedAccountId}`);
              if (rowEl) {
                rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                rowEl.classList.add('pixel-highlight-row');
                setTimeout(() => rowEl.classList.remove('pixel-highlight-row'), 2400);
              }
            }, 60);
          }
        });
      }

      // 2. Drilldown account switcher
      const selectAcc = document.getElementById('ledger-select-account');
      if (selectAcc) {
        selectAcc.addEventListener('change', () => {
          ledgerSelectedAccountId = selectAcc.value;
          UI.renderAccountLedgerDetails(selectAcc.value);
        });
      }

      // 3. Drilldown period filter
      const selectPeriod = document.getElementById('ledger-filter-period');
      if (selectPeriod) {
        selectPeriod.addEventListener('change', () => {
          if (ledgerSelectedAccountId) {
            UI.renderAccountLedgerDetails(ledgerSelectedAccountId);
          }
        });
      }
    },

    openAccountLedgerDetails: (accId) => {
      ledgerSelectedAccountId = accId;
      const overviewView = document.getElementById('accounts-overview-view');
      const ledgerView = document.getElementById('accounts-ledger-view');
      if (overviewView) overviewView.style.display = 'none';
      if (ledgerView) ledgerView.style.display = 'flex';

      try {
        if (window.history && window.history.pushState) {
          window.history.pushState({ subview: 'ledger', accId }, '', '#accounts/ledger/' + accId);
        }
      } catch (e) {}

      UI.renderAccountLedgerDetails(accId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    renderAccountLedgerDetails: (accId) => {
      const accounts = Store.getAccounts();
      if (!accId && accounts.length > 0) {
        accId = accounts[0].id;
      }
      ledgerSelectedAccountId = accId;

      const selectAcc = document.getElementById('ledger-select-account');
      if (selectAcc) {
        selectAcc.innerHTML = accounts.map(a => {
          const catInfo = AccountingConstants.CATEGORIES[a.category] || { name: '其他' };
          return `<option value="${a.id}">[${a.code}] ${a.name} (${catInfo.name})</option>`;
        }).join('');
        selectAcc.value = accId;
      }

      const now = new Date();
      const period = document.getElementById('ledger-filter-period')?.value || 'this_month';
      let startDate = null;
      let endDate = null;
      if (period === 'this_month') {
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      } else if (period === 'last_month') {
        const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startDate = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(prevD.getFullYear(), prevD.getMonth() + 1, 0).getDate();
        endDate = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      }

      const ledger = AccountingEngine.getGeneralLedger(accId, startDate, endDate);
      if (!ledger) return;

      const catInfo = AccountingConstants.CATEGORIES[ledger.account.category] || { name: '其他' };
      const metaBox = document.getElementById('ledger-account-meta');
      if (metaBox) {
        metaBox.innerHTML = `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div>
              <span class="pixel-badge ${catInfo.badgeClass || ''}">${catInfo.name}</span>
              <strong style="font-size:18px; margin-left:6px;">[${ledger.account.code}] ${ledger.account.name}</strong>
              <span style="color:var(--text-muted); font-size:14px; margin-left:8px;">${ledger.account.description || ''}</span>
            </div>
            <div style="font-size:14px;">
              正常方向: <strong>${ledger.account.normalBalance === 'debit' ? '借方 (Debit)' : '貸方 (Credit)'}</strong>
              <span style="margin:0 6px;">|</span>
              期末結餘: <strong style="font-family:var(--font-pixel-heading); color:var(--primary); font-size:16px;">${fmtCurrency(ledger.endingBalance)}</strong>
            </div>
          </div>
        `;
      }

      const tableBody = document.getElementById('ledger-table-body');
      if (tableBody) {
        let html = '';
        // Beginning balance row
        html += `
          <tr style="background-color: var(--bg-card-alt); font-weight:bold;">
            <td style="white-space:nowrap;">${startDate || '--'}</td>
            <td style="white-space:nowrap; text-align:center;">--</td>
            <td>期初餘額 (Beginning Balance)</td>
            <td style="text-align:right;">--</td>
            <td style="text-align:right;">--</td>
            <td style="text-align:center;">${ledger.initialDirection}</td>
            <td style="text-align:right; font-family:var(--font-pixel-heading);">${fmtCurrency(ledger.initialBalance)}</td>
          </tr>
        `;

        if (ledger.lines.length === 0) {
          html += `
            <tr>
              <td colspan="7" style="text-align:center; padding: 25px; color:var(--text-muted)">
                🦎 此期間無任何變動交易明細。
              </td>
            </tr>
          `;
        } else {
          ledger.lines.forEach(line => {
            html += `
              <tr>
                <td style="white-space:nowrap;">${line.date}</td>
                <td style="white-space:nowrap; text-align:center; font-family:var(--font-pixel-heading); font-size:12px; color:var(--text-muted)">${fmtVoucherNo(line.voucherNo)}</td>
                <td>${line.description} ${line.note ? `<span style="font-size:13px; color:var(--text-muted)">[${line.note}]</span>` : ''}</td>
                <td style="text-align:right; font-family:var(--font-pixel-heading); color:var(--debit-color)">${line.debit ? fmtCurrency(line.debit) : ''}</td>
                <td style="text-align:right; font-family:var(--font-pixel-heading); color:var(--credit-color)">${line.credit ? fmtCurrency(line.credit) : ''}</td>
                <td style="text-align:center;">
                  <span class="pixel-badge ${line.direction === '借' ? 'badge-debit' : 'badge-credit'}">${line.direction}</span>
                </td>
                <td style="text-align:right; font-family:var(--font-pixel-heading);">${fmtCurrency(line.balance)}</td>
              </tr>
            `;
          });
        }

        // Ending balance row
        html += `
          <tr style="background-color: var(--bg-card-alt); font-weight:bold; border-top: 2px solid var(--border-color);">
            <td colspan="3" style="text-align:right;">本期合計與期末餘額：</td>
            <td style="text-align:right; font-family:var(--font-pixel-heading); color:var(--debit-color)">${fmtCurrency(ledger.periodTotalDebit)}</td>
            <td style="text-align:right; font-family:var(--font-pixel-heading); color:var(--credit-color)">${fmtCurrency(ledger.periodTotalCredit)}</td>
            <td style="text-align:center;">
              <span class="pixel-badge ${ledger.endingDirection === '借' ? 'badge-debit' : 'badge-credit'}">${ledger.endingDirection}</span>
            </td>
            <td style="text-align:right; font-family:var(--font-pixel-heading); font-size:18px; color:var(--primary)">${fmtCurrency(ledger.endingBalance)}</td>
          </tr>
        `;

        tableBody.innerHTML = html;
      }
    },

    renderLedger: () => {
      UI.renderAccountsList();
    },

    // ==========================================
    // BALANCE SHEET VIEW (資產負債表 - 資產與負債)
    // ==========================================
    setupBalanceSheetEvents: () => {
      // Equation verification & as-of-date filter removed per request
    },

    renderBalanceSheet: () => {
      const bs = AccountingEngine.getBalanceSheet(null);

      // Render Exclusion Notice Banner
      const bsExBanner = document.getElementById('bs-exclusion-banner');
      if (bsExBanner) {
        if (bs.excludedCount > 0) {
          bsExBanner.style.display = 'flex';
          bsExBanner.innerHTML = `
            <span>🚫 <strong>報表排除提示</strong>：已排除 <strong>${bs.excludedCount}</strong> 個設定為「不計入報表」之科目（${bs.excludedAccounts.map(a => `[${a.code}] ${a.name}`).join('、')}），不列入資產與負債總計。</span>
          `;
        } else {
          bsExBanner.style.display = 'none';
        }
      }

      // Assets List
      const assetsListEl = document.getElementById('bs-assets-list');
      const totalAssetsVal = document.getElementById('bs-total-assets-val');
      if (assetsListEl) {
        assetsListEl.innerHTML = bs.assetAccounts.map(a => `
          <div class="bs-item-row">
            <span>[${a.code}] ${a.name}</span>
            <span style="font-family:var(--font-pixel-heading); color:var(--debit-color)">${fmtCurrency(a.amount)}</span>
          </div>
        `).join('') || '<div style="color:var(--text-muted); padding:6px;">無資產科目</div>';
      }
      if (totalAssetsVal) totalAssetsVal.innerText = fmtCurrency(bs.totalAssets);

      // Liabilities List
      const liabListEl = document.getElementById('bs-liabilities-list');
      const totalLiabVal = document.getElementById('bs-total-liab-val');
      if (liabListEl) {
        liabListEl.innerHTML = bs.liabilityAccounts.map(l => `
          <div class="bs-item-row">
            <span>[${l.code}] ${l.name}</span>
            <span style="font-family:var(--font-pixel-heading); color:var(--balance-err)">${fmtCurrency(l.amount)}</span>
          </div>
        `).join('') || '<div style="color:var(--text-muted); padding:6px;">無負債科目</div>';
      }
      if (totalLiabVal) totalLiabVal.innerText = fmtCurrency(bs.totalLiabilities);

      // Net Assets (資產總計 - 負債總計)
      const netAssetsVal = document.getElementById('bs-net-assets-val');
      if (netAssetsVal) {
        netAssetsVal.innerText = fmtCurrency(bs.netAssets);
        netAssetsVal.style.color = bs.netAssets >= 0 ? 'var(--primary)' : 'var(--balance-err)';
      }
    },

    // ==========================================
    // INCOME STATEMENT VIEW (損益表 - 已刪除)
    // ==========================================
    setupPnLEvents: () => {},
    renderPnL: () => {},

    // ==========================================
    // CASH FLOW STATEMENT VIEW (資金流向表)
    // 依借貸分錄自動產生，隔離內部帳戶互轉，明確區分信用卡消費與卡費扣繳
    // ==========================================
    // TAB 5.5: 資金流向表 (CASH & FUND FLOW)
    // 依借貸分錄自動產生，區分內部互轉與信用卡消費/繳款
    // ==========================================
    setupCashFlowEvents: () => {
      const periodSelect = document.getElementById('cashflow-filter-period');
      const includeExCheckbox = document.getElementById('cashflow-include-excluded');
      const btnPrint = document.getElementById('btn-print-cashflow');

      if (periodSelect) {
        periodSelect.addEventListener('change', () => UI.renderCashFlow());
      }
      if (includeExCheckbox) {
        includeExCheckbox.addEventListener('change', () => UI.renderCashFlow());
      }
      if (btnPrint) {
        btnPrint.addEventListener('click', () => {
          PixelAudio.playClick();
          window.print();
        });
      }
    },

    renderCashFlow: () => {
      const periodSelect = document.getElementById('cashflow-filter-period');
      const period = periodSelect ? periodSelect.value : 'this_month';
      const now = new Date();
      let startDate = null;
      let endDate = null;

      if (period === 'this_month') {
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      } else if (period === 'last_month') {
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        startDate = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 0).getDate();
        endDate = `${lastMonthDate.getFullYear()}-${String(lastMonthDate.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
      } else if (period === 'this_year') {
        startDate = `${now.getFullYear()}-01-01`;
        endDate = `${now.getFullYear()}-12-31`;
      } else if (period === 'all') {
        startDate = null;
        endDate = null;
      }

      const includeExcluded = Boolean(document.getElementById('cashflow-include-excluded')?.checked);
      const cf = AccountingEngine.getCashFlow(startDate, endDate, { includeExcluded });

      // 1. Render 3 KPI Cards
      const kpiInflow = document.getElementById('cf-kpi-inflow');
      const kpiOutflow = document.getElementById('cf-kpi-outflow');
      const kpiNet = document.getElementById('cf-kpi-net');
      const kpiNetSub = document.getElementById('cf-kpi-net-sub');

      if (kpiInflow) kpiInflow.innerText = fmtCurrency(cf.kpi.totalInflow);
      if (kpiOutflow) kpiOutflow.innerText = fmtCurrency(cf.kpi.totalOutflow);
      if (kpiNet) {
        kpiNet.innerText = (cf.kpi.netFlow >= 0 ? '+' : '') + fmtCurrency(cf.kpi.netFlow);
        kpiNet.style.color = cf.kpi.isSurplus ? 'var(--balance-ok)' : 'var(--balance-err)';
      }
      if (kpiNetSub) {
        kpiNetSub.innerText = cf.kpi.isSurplus ? '✅ 本期實質資金淨增加' : '⚠️ 本期實質資金淨流出';
      }

      // Exclusion notice
      const exBanner = document.getElementById('cashflow-exclusion-banner');
      if (exBanner) {
        if (cf.excludedCount > 0 && !includeExcluded) {
          exBanner.style.display = 'flex';
          exBanner.innerHTML = `
            <span>🚫 <strong>報表排除提示</strong>：已自動排除 <strong>${cf.excludedCount}</strong> 個標記為「不計入報表」之科目（${cf.excludedAccounts.map(a => `[${a.code}] ${a.name}`).join('、')}），避免非實質收支影響資金流向分析。</span>
          `;
        } else {
          exBanner.style.display = 'none';
        }
      }

      // 2. Render Inflows Breakdown List
      const inflowListEl = document.getElementById('cf-inflow-list');
      const inflowCountBadge = document.getElementById('cf-inflow-count-badge');
      if (inflowCountBadge) {
        inflowCountBadge.innerText = `${cf.inflowBreakdown.length} 類來源`;
      }
      if (inflowListEl) {
        if (cf.inflowBreakdown.length === 0) {
          inflowListEl.innerHTML = `<div style="color:var(--text-muted); font-size:12px; padding:10px;">本期無實質資金流入</div>`;
        } else {
          inflowListEl.innerHTML = cf.inflowBreakdown.map(item => `
            <div>
              <div class="cf-breakdown-row" style="border-left-color:var(--credit-color);">
                <span class="cf-breakdown-name" title="${item.name}">🪙 ${item.name}</span>
                <span style="font-family:var(--font-pixel-heading); color:var(--credit-color); white-space:nowrap;">
                  ${fmtCurrency(item.amount)} <small style="font-size:11px; opacity:0.8;">(${item.percentage}%)</small>
                </span>
              </div>
              <div class="cf-progress-track">
                <div class="cf-progress-bar" style="width:${item.percentage}%; background:var(--credit-color);"></div>
              </div>
            </div>
          `).join('');
        }
      }

      // 3. Render Outflows Breakdown List (包含現金支付與信用卡刷卡)
      const outflowListEl = document.getElementById('cf-outflow-list');
      const outflowCountBadge = document.getElementById('cf-outflow-count-badge');
      if (outflowCountBadge) {
        outflowCountBadge.innerText = `${cf.outflowBreakdown.length} 類項目`;
      }
      if (outflowListEl) {
        if (cf.outflowBreakdown.length === 0) {
          outflowListEl.innerHTML = `<div style="color:var(--text-muted); font-size:12px; padding:10px;">本期無實質資金流出</div>`;
        } else {
          outflowListEl.innerHTML = cf.outflowBreakdown.map(item => `
            <div>
              <div class="cf-breakdown-row" style="border-left-color:var(--debit-color);">
                <span class="cf-breakdown-name" title="${item.name}">💸 ${item.name}</span>
                <span style="font-family:var(--font-pixel-heading); color:var(--debit-color); white-space:nowrap;">
                  ${fmtCurrency(item.amount)} <small style="font-size:11px; opacity:0.8;">(${item.percentage}%)</small>
                </span>
              </div>
              <div class="cf-progress-track">
                <div class="cf-progress-bar" style="width:${item.percentage}%; background:var(--debit-color);"></div>
              </div>
            </div>
          `).join('');
        }
      }

      // 4. Render Chronological Activity Log Table (簡約 4 欄式，適配 iPhone 14 Pro 無須左右移動)
      const activityCountEl = document.getElementById('cf-activity-count');
      const activityTbody = document.getElementById('cf-activity-tbody');
      if (activityCountEl) {
        activityCountEl.innerText = `共 ${cf.activities.length} 筆動態`;
      }
      if (activityTbody) {
        if (cf.activities.length === 0) {
          activityTbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted); padding:20px;">此期間內尚無資金流向明細</td></tr>`;
        } else {
          activityTbody.innerHTML = cf.activities.map(act => {
            const isCredit = act.type === 'inflow';
            const color = isCredit ? 'var(--credit-color)' : 'var(--debit-color)';
            const noteText = act.note || act.description || '';
            const noteHtml = (noteText && noteText !== act.item)
              ? `<div class="cf-item-note" title="${noteText}">${noteText}</div>`
              : '';

            return `
              <tr>
                <td class="cf-col-date">${act.date}</td>
                <td class="cf-col-item">
                  <div class="cf-item-title" title="${act.item}">${act.item}</div>
                  ${noteHtml}
                </td>
                <td class="cf-col-method">
                  <span class="pixel-badge ${act.badgeClass || 'badge-secondary'}" title="${act.paymentMethod}">
                    ${act.paymentMethod}
                  </span>
                </td>
                <td class="cf-col-amount" style="color:${color};">
                  ${act.sign} ${fmtCurrency(act.amount)}
                </td>
              </tr>
            `;
          }).join('');
        }
      }

      // 5. Render Credit Card Reconciliation & Isolation Panel (位於最下方)
      // 信用卡狀態：不受日期影響，只受分錄影響 (順序：已出帳金額、未出帳金額、本期已扣繳金額)
      const ccPurchasesEl = document.getElementById('cf-cc-purchases');
      const ccBalanceEl = document.getElementById('cf-cc-balance');
      const ccPaymentsEl = document.getElementById('cf-cc-payments');

      if (ccPurchasesEl) ccPurchasesEl.innerText = fmtCurrency(cf.creditCardSummary.billedAmount);
      if (ccBalanceEl) ccBalanceEl.innerText = fmtCurrency(cf.creditCardSummary.unbilledAmount);
      if (ccPaymentsEl) ccPaymentsEl.innerText = fmtCurrency(cf.creditCardSummary.settledAmount);
    },

    // ==========================================
    // ==========================================
    // COMPARATIVE TIME ANALYSIS (科目跨期雙期精準對比)
    // ==========================================
    // COMPARATIVE TIME ANALYSIS (科目跨期雙期精準對比 - 收入與費用全覽)
    // ==========================================
    setupComparisonEvents: () => {
      // Period A & B triggers
      ['comp-period-a', 'comp-period-b'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', () => UI.renderComparison());
      });

      // Drilldown click delegation on comparison table container
      const tableArea = document.getElementById('comp-details-table');
      if (tableArea) {
        tableArea.addEventListener('click', (e) => {
          const link = e.target.closest('.comp-drill-link');
          if (link) {
            e.preventDefault();
            PixelAudio.playClick();
            const targetId = link.getAttribute('data-target');
            const drawer = document.getElementById(targetId);
            if (drawer) {
              const isHidden = drawer.style.display === 'none' || !drawer.style.display;
              drawer.style.display = isHidden ? 'table-row' : 'none';
              link.innerText = isHidden ? '收合 ✕' : '明細 🔍';
            }
          }
        });
      }
    },

    renderComparison: () => {
      const now = new Date();
      const pAChoice = document.getElementById('comp-period-a')?.value || 'this_month';
      const pBChoice = document.getElementById('comp-period-b')?.value || 'last_month';

      function getDates(choice) {
        if (choice === 'this_month') {
          const s = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          const e = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
          return { name: `本月 (${now.getMonth() + 1}月)`, startDate: s, endDate: e };
        } else if (choice === 'last_month') {
          const prevD = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const s = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}-01`;
          const lastDay = new Date(prevD.getFullYear(), prevD.getMonth() + 1, 0).getDate();
          const e = `${prevD.getFullYear()}-${String(prevD.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
          return { name: `上月 (${prevD.getMonth() + 1}月)`, startDate: s, endDate: e };
        } else if (choice === 'this_year') {
          const y = now.getFullYear();
          return { name: `今年 (${y})`, startDate: `${y}-01-01`, endDate: `${y}-12-31` };
        } else if (choice === 'last_year') {
          const y = now.getFullYear() - 1;
          return { name: `去年 (${y})`, startDate: `${y}-01-01`, endDate: `${y}-12-31` };
        } else {
          const s = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
          const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
          const e = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
          return { name: `本月 (${now.getMonth() + 1}月)`, startDate: s, endDate: e };
        }
      }

      const pA = getDates(pAChoice);
      const pB = getDates(pBChoice);

      const comp = AccountingEngine.compareIncomeExpensePeriods(pA, pB);
      if (!comp) return;

      // 1. Render Summary KPI Cards (只顯示數字，不顯示交易筆數)
      const chartArea = document.getElementById('comp-chart-canvas');
      if (chartArea) {
        const revDiffSign = comp.revenues.diffTotal >= 0 ? '+' : '';
        const expDiffSign = comp.expenses.diffTotal >= 0 ? '+' : '';
        const netDiffSign = comp.netIncome.diff >= 0 ? '+' : '';

        chartArea.innerHTML = `
          <div class="comp-summary-grid">
            <div class="comp-summary-card pixel-box" style="border-left:4px solid var(--credit-color);">
              <div style="font-size:11px; color:var(--text-muted);">🪙 總營業收入 (${pA.name} vs ${pB.name})</div>
              <div style="font-family:var(--font-pixel-heading); font-size:20px; color:var(--credit-color); margin-top:2px;">
                ${fmtCurrency(comp.revenues.totalA)}
              </div>
              <div style="font-size:12px; color:var(--text-muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:4px;">
                <span>基準期: ${fmtCurrency(comp.revenues.totalB)}</span>
                <span style="font-family:var(--font-pixel-heading); color:${comp.revenues.diffTotal >= 0 ? 'var(--credit-color)' : 'var(--balance-err)'}; font-weight:bold;">
                  ${revDiffSign}${fmtCurrency(comp.revenues.diffTotal)} (${revDiffSign}${comp.revenues.diffTotalPercent}%)
                </span>
              </div>
            </div>

            <div class="comp-summary-card pixel-box" style="border-left:4px solid var(--debit-color);">
              <div style="font-size:11px; color:var(--text-muted);">🔥 總營業費用 (${pA.name} vs ${pB.name})</div>
              <div style="font-family:var(--font-pixel-heading); font-size:20px; color:var(--debit-color); margin-top:2px;">
                ${fmtCurrency(comp.expenses.totalA)}
              </div>
              <div style="font-size:12px; color:var(--text-muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:4px;">
                <span>基準期: ${fmtCurrency(comp.expenses.totalB)}</span>
                <span style="font-family:var(--font-pixel-heading); color:${comp.expenses.diffTotal > 0 ? 'var(--balance-err)' : 'var(--balance-ok)'}; font-weight:bold;">
                  ${expDiffSign}${fmtCurrency(comp.expenses.diffTotal)} (${expDiffSign}${comp.expenses.diffTotalPercent}%)
                </span>
              </div>
            </div>

            <div class="comp-summary-card pixel-box" style="border-left:4px solid ${comp.netIncome.amountA >= 0 ? 'var(--balance-ok)' : 'var(--balance-err)'};">
              <div style="font-size:11px; color:var(--text-muted);">⚖️ 收支淨損益 (${pA.name} vs ${pB.name})</div>
              <div style="font-family:var(--font-pixel-heading); font-size:20px; color:${comp.netIncome.amountA >= 0 ? 'var(--balance-ok)' : 'var(--balance-err)'}; margin-top:2px;">
                ${comp.netIncome.amountA >= 0 ? '+' : ''}${fmtCurrency(comp.netIncome.amountA)}
              </div>
              <div style="font-size:12px; color:var(--text-muted); display:flex; justify-content:space-between; flex-wrap:wrap; gap:4px;">
                <span>基準期: ${comp.netIncome.amountB >= 0 ? '+' : ''}${fmtCurrency(comp.netIncome.amountB)}</span>
                <span style="font-family:var(--font-pixel-heading); color:${comp.netIncome.diff >= 0 ? 'var(--balance-ok)' : 'var(--balance-err)'}; font-weight:bold;">
                  變動: ${netDiffSign}${fmtCurrency(comp.netIncome.diff)}
                </span>
              </div>
            </div>
          </div>
        `;
      }

      // Helper to build table rows with inline detail drawer
      function renderTableSection(title, icon, groupData, isRevenue) {
        const items = groupData.items;
        if (items.length === 0) {
          return `
            <div class="comp-section-box">
              <div class="comp-section-header">
                <span style="font-family:var(--font-pixel-heading); font-size:13px;">${icon} ${title}</span>
              </div>
              <div class="comp-empty-hint" style="padding:12px;">尚無設定此類科目</div>
            </div>
          `;
        }

        const rowsHtml = items.map(item => {
          const acc = item.account;
          const diffSign = item.diffAmount >= 0 ? '+' : '';
          let diffColor = 'var(--text-muted)';
          if (isRevenue) {
            diffColor = item.diffAmount > 0 ? 'var(--credit-color)' : (item.diffAmount < 0 ? 'var(--balance-err)' : 'var(--text-muted)');
          } else {
            diffColor = item.diffAmount > 0 ? 'var(--balance-err)' : (item.diffAmount < 0 ? 'var(--balance-ok)' : 'var(--text-muted)');
          }

          const txsA = item.transactionsA;
          const txsB = item.transactionsB;

          const drawerId = `comp-detail-${acc.id}`;

          const listAHtml = txsA.length === 0
            ? `<div class="comp-empty-hint">無明細紀錄</div>`
            : txsA.map(tx => `
                <div class="comp-detail-item">
                  <div class="comp-detail-item-left">
                    <span class="comp-detail-item-date">${tx.date}</span>
                    <span class="comp-detail-item-desc" title="${tx.description}">${tx.description}</span>
                  </div>
                  <span class="comp-detail-item-amt" style="color:${isRevenue ? 'var(--credit-color)' : 'var(--debit-color)'};">
                    ${fmtCurrency(tx.amount)}
                  </span>
                </div>
              `).join('');

          const listBHtml = txsB.length === 0
            ? `<div class="comp-empty-hint">無明細紀錄</div>`
            : txsB.map(tx => `
                <div class="comp-detail-item">
                  <div class="comp-detail-item-left">
                    <span class="comp-detail-item-date">${tx.date}</span>
                    <span class="comp-detail-item-desc" title="${tx.description}">${tx.description}</span>
                  </div>
                  <span class="comp-detail-item-amt" style="color:${isRevenue ? 'var(--credit-color)' : 'var(--debit-color)'};">
                    ${fmtCurrency(tx.amount)}
                  </span>
                </div>
              `).join('');

          return `
            <tr>
              <td class="comp-col-acc">
                <span class="comp-acc-title" title="[${acc.code}] ${acc.name}">[${acc.code}] ${acc.name}</span>
                <a href="javascript:void(0)" class="comp-drill-link" data-target="${drawerId}">明細 🔍</a>
              </td>
              <td class="comp-val-cell" style="color:${item.amountA > 0 ? (isRevenue ? 'var(--credit-color)' : 'var(--debit-color)') : 'var(--text-dim)'};">
                ${fmtCurrency(item.amountA)}
              </td>
              <td class="comp-val-cell" style="color:var(--text-muted);">
                ${fmtCurrency(item.amountB)}
              </td>
              <td class="comp-diff-cell" style="color:${diffColor};">
                ${diffSign}${fmtCurrency(item.diffAmount)}<br>
                <small style="font-size:10px; opacity:0.85;">(${diffSign}${item.diffPercent}%)</small>
              </td>
            </tr>
            <tr id="${drawerId}" style="display:none;">
              <td colspan="4" style="padding:0; border-bottom:2px solid var(--border-color);">
                <div class="comp-detail-drawer">
                  <div class="comp-detail-block">
                    <div class="comp-detail-title" style="color:var(--primary);">
                      <span>📌 期間 A (${pA.name})</span>
                      <span>小計: ${fmtCurrency(item.amountA)}</span>
                    </div>
                    <div class="comp-detail-list">
                      ${listAHtml}
                    </div>
                  </div>
                  <div class="comp-detail-block">
                    <div class="comp-detail-title" style="color:var(--secondary);">
                      <span>📌 期間 B (${pB.name})</span>
                      <span>小計: ${fmtCurrency(item.amountB)}</span>
                    </div>
                    <div class="comp-detail-list">
                      ${listBHtml}
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          `;
        }).join('');

        const subtotalDiffSign = groupData.diffTotal >= 0 ? '+' : '';
        const subtotalColor = isRevenue
          ? (groupData.diffTotal >= 0 ? 'var(--credit-color)' : 'var(--balance-err)')
          : (groupData.diffTotal > 0 ? 'var(--balance-err)' : 'var(--balance-ok)');

        return `
          <div class="comp-section-box">
            <div class="comp-section-header">
              <span style="font-family:var(--font-pixel-heading); font-size:13px; color:${isRevenue ? 'var(--credit-color)' : 'var(--debit-color)'};">
                ${icon} ${title}
              </span>
              <span style="font-size:12px; color:var(--text-muted);">
                ${pA.name} 合計：<strong style="color:${isRevenue ? 'var(--credit-color)' : 'var(--debit-color)'};">${fmtCurrency(groupData.totalA)}</strong>
              </span>
            </div>

            <div class="comp-table-wrap">
              <table class="comp-table">
                <thead>
                  <tr>
                    <th style="text-align:left;">科目項目</th>
                    <th style="text-align:right; width:28%;">期間 A<br><small style="font-size:10px; font-weight:normal; opacity:0.75;">${pA.name}</small></th>
                    <th style="text-align:right; width:28%;">期間 B<br><small style="font-size:10px; font-weight:normal; opacity:0.75;">${pB.name}</small></th>
                    <th style="text-align:right; width:24%;">增減差異</th>
                  </tr>
                </thead>
                <tbody>
                  ${rowsHtml}
                </tbody>
                <tfoot>
                  <tr style="background:var(--bg-card-alt); font-weight:bold; border-top:2px solid var(--border-color);">
                    <td style="font-family:var(--font-pixel-heading); font-size:12px;">合計</td>
                    <td class="comp-val-cell" style="color:${isRevenue ? 'var(--credit-color)' : 'var(--debit-color)'};">
                      ${fmtCurrency(groupData.totalA)}
                    </td>
                    <td class="comp-val-cell" style="color:var(--text-muted);">
                      ${fmtCurrency(groupData.totalB)}
                    </td>
                    <td class="comp-diff-cell" style="color:${subtotalColor};">
                      ${subtotalDiffSign}${fmtCurrency(groupData.diffTotal)}<br>
                      <small style="font-size:10px;">(${subtotalDiffSign}${groupData.diffTotalPercent}%)</small>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        `;
      }

      // 2. Render Tables into details table area
      const tableArea = document.getElementById('comp-details-table');
      if (tableArea) {
        tableArea.innerHTML = `
          <div style="display:flex; flex-direction:column; gap:16px;">
            ${renderTableSection('營業收入科目比較分析', '🪙', comp.revenues, true)}
            ${renderTableSection('營業費用科目比較分析', '🔥', comp.expenses, false)}
          </div>
        `;
      }
    },

    // ==========================================
    // ACCOUNT MANAGEMENT (會計科目管理 - ALCRE 按鈕組)
    // ==========================================
    setAccountCategory: (catKey, triggerChange = true) => {
      const ALCRE_MAP = {
        asset: { letter: 'A', name: '資產', code: '1xxx', dir: '借方 (Debit)', icon: '💎', dirKey: '借' },
        liability: { letter: 'L', name: '負債', code: '2xxx', dir: '貸方 (Credit)', icon: '📜', dirKey: '貸' },
        revenue: { letter: 'R', name: '收入', code: '4xxx', dir: '貸方 (Credit)', icon: '🪙', dirKey: '貸' },
        expense: { letter: 'E', name: '費用', code: '5xxx', dir: '借方 (Debit)', icon: '🔥', dirKey: '借' }
      };

      const key = ALCRE_MAP[catKey] ? catKey : 'asset';
      const catInput = document.getElementById('acc-category');
      if (catInput) catInput.value = key;

      const catButtons = document.querySelectorAll('#acc-category-buttons .alcre-btn');
      catButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === key);
      });

      const info = ALCRE_MAP[key];
      const catHintEl = document.getElementById('acc-cat-current-hint');
      if (catHintEl) {
        catHintEl.innerText = `${info.letter}・${info.name} (${info.code} ${info.dirKey})`;
      }

      const catDescBox = document.getElementById('acc-category-desc-box');
      if (catDescBox) {
        catDescBox.innerHTML = `<span>${info.icon} <strong>[${info.letter}] ${info.name}</strong> (${info.code})</span><span style="font-weight:bold; color:var(--text-muted);">正常方向：${info.dir}</span>`;
      }

      if (triggerChange) {
        const editIdInput = document.getElementById('acc-edit-id');
        const parentIdInput = document.getElementById('acc-parent-id');
        const parentInfoEl = document.getElementById('sub-acc-parent-info');
        if (editIdInput && editIdInput.value) {
          const pId = parentIdInput ? parentIdInput.value : '';
          if (pId && parentInfoEl) {
            const pAcc = Store.getAccountById(pId);
            if (pAcc && pAcc.category !== key) {
              parentInfoEl.style.display = 'block';
              const newCatName = AccountingConstants.CATEGORIES[key]?.name || key;
              parentInfoEl.innerHTML = `⚠️ 類別已變更為【${newCatName}】，儲存時將自動解除與原母科目 [${pAcc.code}] 的從屬關係`;
            } else if (pAcc) {
              parentInfoEl.style.display = 'block';
              parentInfoEl.innerHTML = `📌 此科目為 <strong>[${pAcc.code}] ${pAcc.name}</strong> 的子科目`;
            }
          }
        }
      }
    },

    setAccountCategoryDisabled: (disabled) => {
      const catButtons = document.querySelectorAll('#acc-category-buttons .alcre-btn');
      catButtons.forEach(btn => {
        btn.disabled = disabled;
        btn.classList.toggle('disabled', disabled);
      });
    },

    setupAccountEvents: () => {
      const btnAddAccount = document.getElementById('btn-open-add-account-modal');
      const modal = document.getElementById('modal-add-account');
      const btnCloseModal = document.getElementById('btn-close-account-modal');
      const form = document.getElementById('form-add-account');
      const modalTitle = document.getElementById('modal-account-title');
      const submitBtn = document.getElementById('btn-submit-account');
      const editIdInput = document.getElementById('acc-edit-id');
      const catGroup = document.getElementById('group-acc-category');
      const codeInput = document.getElementById('acc-code');
      const parentIdInput = document.getElementById('acc-parent-id');
      const parentInfoEl = document.getElementById('sub-acc-parent-info');

      // Wire ALCRE Category Button Clicks
      const catButtons = document.querySelectorAll('#acc-category-buttons .alcre-btn');
      catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          if (btn.disabled) return;
          PixelAudio.playClick();
          UI.setAccountCategory(btn.dataset.category, true);
        });
      });

      if (btnAddAccount && modal) {
        btnAddAccount.addEventListener('click', () => {
          PixelAudio.playClick();
          if (form) form.reset();
          if (editIdInput) editIdInput.value = '';
          if (parentIdInput) parentIdInput.value = '';
          if (parentInfoEl) parentInfoEl.style.display = 'none';

          const initialBalInput = document.getElementById('acc-initial-balance');
          if (initialBalInput) initialBalInput.value = '0';
          const excludeEl = document.getElementById('acc-exclude-reports');
          if (excludeEl) excludeEl.checked = false;

          if (modalTitle) modalTitle.innerText = '➕ 新增會計科目';
          if (submitBtn) submitBtn.innerText = '確認建立科目';
          UI.setAccountCategory('asset', false);
          UI.setAccountCategoryDisabled(false);
          if (catGroup) catGroup.style.display = 'block';
          modal.style.display = 'flex';
        });
      }

      // Auto-detect parent account when typing code with hyphen e.g. 1101-01
      if (codeInput) {
        codeInput.addEventListener('input', () => {
          if (editIdInput && editIdInput.value) return; // Only auto-detect when creating new
          const codeVal = codeInput.value.trim();
          if (codeVal.includes('-')) {
            const pCode = codeVal.split('-')[0].trim();
            const pAcc = Store.getAccounts().find(a => a.code === pCode);
            if (pAcc) {
              if (parentIdInput) parentIdInput.value = pAcc.id;
              UI.setAccountCategory(pAcc.category, false);
              UI.setAccountCategoryDisabled(true);
              if (parentInfoEl) {
                parentInfoEl.style.display = 'block';
                parentInfoEl.innerHTML = `📌 自動關聯母科目：<strong>[${pAcc.code}] ${pAcc.name}</strong> (順序流水排序)`;
              }
              return;
            }
          }
          // If no hyphen found and not editing
          if (!editIdInput?.value) {
            if (parentIdInput) parentIdInput.value = '';
            UI.setAccountCategoryDisabled(false);
            if (parentInfoEl) parentInfoEl.style.display = 'none';
          }
        });
      }

      if (btnCloseModal && modal) {
        btnCloseModal.addEventListener('click', () => {
          if (document.activeElement && typeof document.activeElement.blur === 'function') {
            document.activeElement.blur();
          }
          modal.style.display = 'none';
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const editId = editIdInput ? editIdInput.value.trim() : '';
          const parentId = document.getElementById('acc-parent-id')?.value.trim() || null;
          const code = document.getElementById('acc-code').value.trim();
          const name = document.getElementById('acc-name').value.trim();
          let category = document.getElementById('acc-category').value;
          const desc = document.getElementById('acc-desc').value.trim();
          const initialBalance = parseFloat(document.getElementById('acc-initial-balance')?.value) || 0;
          const excludeFromReports = Boolean(document.getElementById('acc-exclude-reports')?.checked);

          // Auto-link parent and category if code includes hyphen e.g. 1101-01 (only for new accounts)
          let resolvedParentId = parentId;
          if (!editId && code.includes('-')) {
            const pCode = code.split('-')[0].trim();
            const pAcc = Store.getAccounts().find(a => a.code === pCode);
            if (pAcc) {
              resolvedParentId = pAcc.id;
              category = pAcc.category;
            }
          } else if (editId && resolvedParentId) {
            // If editing and category differs from parent, decouple parent
            const pAcc = Store.getAccountById(resolvedParentId);
            if (pAcc && pAcc.category !== category) {
              resolvedParentId = null;
            }
          }

          const catInfo = AccountingConstants.CATEGORIES[category];
          if (!catInfo) return;

          try {
            let targetScrollAccId = null;
            if (editId) {
              // Edit existing account - Category, Parent, Normal Balance are all updated!
              targetScrollAccId = editId;
              pendingScrollTargetAccId = editId;
              Store.updateAccount(editId, {
                code,
                name,
                category,
                parentId: resolvedParentId,
                normalBalance: catInfo.normalBalance,
                description: desc,
                initialBalance,
                excludeFromReports
              });
              PixelAudio.playSuccess();
              showToast(`✨ 已成功更新科目 [${code}] ${name}！`);
            } else {
              // Add new account or sub-account
              const newId = 'acc_' + Date.now();
              targetScrollAccId = newId;
              pendingScrollTargetAccId = newId;
              Store.addAccount({
                id: newId,
                code,
                name,
                category,
                parentId: resolvedParentId || null,
                normalBalance: catInfo.normalBalance,
                description: desc,
                initialBalance,
                excludeFromReports,
                isSystem: false
              });
              PixelAudio.playSuccess();
              showToast(resolvedParentId ? `✨ 已新增子科目 [${code}] ${name}！` : `✨ 已新增會計科目 [${code}] ${name}！`);
            }

            // Blur active element before closing modal so browser focus doesn't jump viewport to top
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
              document.activeElement.blur();
            }
            form.reset();
            modal.style.display = 'none';

            // Deferred smooth scroll and highlight to ensure viewport locates the newly added/edited row
            if (targetScrollAccId) {
              setTimeout(() => {
                const rowEl = document.getElementById(`acc-row-${targetScrollAccId}`);
                if (rowEl) {
                  rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  rowEl.classList.add('pixel-highlight-row');
                  setTimeout(() => rowEl.classList.remove('pixel-highlight-row'), 2400);
                }
              }, 80);
            }
          } catch (err) {
            PixelAudio.playError();
            alert(err.message);
          }
        });
      }
    },

    renderAccountsList: () => {
      const container = document.getElementById('accounts-list-container');
      const modal = document.getElementById('modal-add-account');
      const modalTitle = document.getElementById('modal-account-title');
      const submitBtn = document.getElementById('btn-submit-account');
      const editIdInput = document.getElementById('acc-edit-id');
      const catGroup = document.getElementById('group-acc-category');
      const form = document.getElementById('form-add-account');
      if (!container) return;

      const accounts = Store.getAccounts();
      const categories = ['asset', 'liability', 'revenue', 'expense'];

      // Get ledger summary for live balances & category subtotals
      const ledgerSummary = typeof AccountingEngine !== 'undefined' ? AccountingEngine.getAllAccountsLedgerSummary() : null;
      const balMap = new Map();
      if (ledgerSummary && ledgerSummary.allAccounts) {
        ledgerSummary.allAccounts.forEach(item => {
          balMap.set(item.id, item);
        });
      }

      let html = '';
      categories.forEach(catKey => {
        const catInfo = AccountingConstants.CATEGORIES[catKey];
        if (!catInfo) return;
        const accsInCat = accounts.filter(a => a.category === catKey);

        const catGroup = ledgerSummary && ledgerSummary.grouped ? ledgerSummary.grouped.find(g => g.categoryKey === catKey) : null;
        const totalEnding = catGroup ? catGroup.totalEnding : 0;

        html += `
          <div class="pixel-box" style="padding:16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid var(--border-color); padding-bottom:8px; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
              <div style="font-family:var(--font-pixel-heading); font-size:13px; display:flex; align-items:center; gap:8px;">
                <span class="pixel-badge ${catInfo.badgeClass}">${catInfo.icon} ${catInfo.name} (${catInfo.codePrefix}xxx)</span>
                <span style="font-size:13px; color:var(--text-muted)">共 ${accsInCat.length} 個科目</span>
              </div>
              <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <span style="font-family:var(--font-pixel-heading); font-size:11px; color:var(--text-muted)">
                  類別餘額小計: <strong class="category-total-ending" style="color:var(--primary); font-size:13px;">${fmtCurrency(totalEnding)}</strong>
                </span>
                <button type="button" class="pixel-btn pixel-btn-sm btn-quick-add-cat-acc" data-category="${catKey}" title="快速在此類別建立科目">
                  ➕ 新增${catInfo.name}
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="pixel-table accounts-table">
                <thead>
                  <tr>
                    <th class="acc-col-code">科目代碼</th>
                    <th class="acc-col-name">科目名稱</th>
                    <th class="acc-col-bal" style="text-align:right;">餘額</th>
                    <th class="acc-col-actions" style="text-align:right;">操作</th>
                  </tr>
                </thead>
                <tbody>
                  ${accsInCat.map(a => {
                    const isSub = a.parentId || (a.code && a.code.includes('-'));
                    const balInfo = balMap.get(a.id) || {
                      endingBalance: Math.abs(Number(a.initialBalance) || 0),
                      endingDirection: a.normalBalance === 'debit' ? '借' : '貸'
                    };
                    const balDir = balInfo.endingDirection || (a.normalBalance === 'debit' ? '借' : '貸');
                    const endingBal = balInfo.endingBalance !== undefined ? balInfo.endingBalance : 0;

                    return `
                    <tr id="acc-row-${a.id}" class="acc-row-item" data-id="${a.id}">
                      <td class="acc-col-code">
                        ${isSub ? `<span style="opacity:0.5; margin-right:3px;">└</span>` : ''}${a.code}
                      </td>
                      <td class="acc-col-name">
                        <span style="${isSub ? 'padding-left:6px;' : ''} display:inline-flex; align-items:center; flex-wrap:wrap; gap:4px;">
                          ${isSub ? `<span style="color:var(--primary); font-weight:bold;">↳</span>` : ''}
                          <strong class="acc-name-link" data-id="${a.id}" title="點選檢視【${a.name}】明細分類帳" style="cursor:pointer; color:var(--primary); text-decoration:underline; text-underline-offset:3px;">
                            ${a.name} 🔍
                          </strong>
                          ${a.excludeFromReports ? `<span class="pixel-badge badge-warning" style="font-size:11px; margin-left:4px; padding:1px 5px;" title="不計入報表統計">🚫</span>` : ''}
                        </span>
                      </td>
                      <td class="acc-col-bal">
                        <div class="acc-bal-cell" title="科目當前結餘：${balDir}方 ${fmtCurrency(endingBal)}">
                          <span class="pixel-badge gl-bal-dir ${balDir === '借' ? 'badge-debit' : 'badge-credit'}">${balDir}</span>
                          <span class="acc-bal-amt">${fmtCurrency(endingBal)}</span>
                        </div>
                      </td>
                      <td class="acc-col-actions" style="text-align:right;">
                        <div class="acc-actions-wrap">
                          <button type="button" class="pixel-btn pixel-btn-sm btn-edit-acc" data-id="${a.id}" title="修改科目資訊與期初餘額">
                            <span class="desktop-text">編輯</span>
                            <span class="mobile-text">編輯</span>
                          </button>
                          <button type="button" class="pixel-btn pixel-btn-danger pixel-btn-sm btn-delete-acc" data-id="${a.id}" data-name="${a.name}" data-code="${a.code}" title="刪除此科目">
                            <span class="desktop-text">刪除</span>
                            <span class="mobile-text">✕</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        `;
      });

      const savedScrollY = window.scrollY;
      container.innerHTML = html;

      // Handle click on account name to drilldown to ledger details
      container.querySelectorAll('.acc-name-link').forEach(link => {
        link.addEventListener('click', (e) => {
          e.stopPropagation();
          const accId = link.dataset.id;
          PixelAudio.playClick();
          UI.openAccountLedgerDetails(accId);
        });
      });

      // Handle scroll preservation or targeted scrolling
      if (pendingScrollTargetAccId) {
        const targetId = pendingScrollTargetAccId;
        pendingScrollTargetAccId = null;
        setTimeout(() => {
          const rowEl = document.getElementById(`acc-row-${targetId}`);
          if (rowEl) {
            rowEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            rowEl.classList.add('pixel-highlight-row');
            setTimeout(() => rowEl.classList.remove('pixel-highlight-row'), 2400);
          }
        }, 60);
      } else if (savedScrollY > 0) {
        window.scrollTo({ top: savedScrollY, behavior: 'instant' });
      }

      // Quick add button in category cards
      container.querySelectorAll('.btn-quick-add-cat-acc').forEach(btn => {
        btn.addEventListener('click', () => {
          const cat = btn.dataset.category;
          PixelAudio.playClick();
          if (form) form.reset();
          if (editIdInput) editIdInput.value = '';
          const parentIdInput = document.getElementById('acc-parent-id');
          if (parentIdInput) parentIdInput.value = '';
          const parentInfoEl = document.getElementById('sub-acc-parent-info');
          if (parentInfoEl) parentInfoEl.style.display = 'none';

          const initialBalInput = document.getElementById('acc-initial-balance');
          if (initialBalInput) initialBalInput.value = '0';
          const excludeEl = document.getElementById('acc-exclude-reports');
          if (excludeEl) excludeEl.checked = false;

          const catInfo = AccountingConstants.CATEGORIES[cat];
          if (modalTitle) modalTitle.innerText = `➕ 新增【${catInfo ? catInfo.name : ''}】會計科目`;
          if (submitBtn) submitBtn.innerText = '確認建立科目';
          UI.setAccountCategory(cat || 'asset', false);
          UI.setAccountCategoryDisabled(false);
          if (catGroup) catGroup.style.display = 'block';
          if (modal) modal.style.display = 'flex';
        });
      });

      // Edit account handlers
      container.querySelectorAll('.btn-edit-acc').forEach(btn => {
        btn.addEventListener('click', () => {
          const accId = btn.dataset.id;
          const acc = Store.getAccountById(accId);
          if (!acc || !modal) return;
          PixelAudio.playClick();

          const parentIdInput = document.getElementById('acc-parent-id');
          if (parentIdInput) parentIdInput.value = acc.parentId || '';
          const parentInfoEl = document.getElementById('sub-acc-parent-info');
          if (parentInfoEl) {
            if (acc.parentId) {
              const parentAcc = Store.getAccountById(acc.parentId);
              parentInfoEl.style.display = 'block';
              parentInfoEl.innerHTML = `📌 此科目為 <strong>[${parentAcc ? parentAcc.code : ''}] ${parentAcc ? parentAcc.name : '母科目'}</strong> 的子科目`;
            } else {
              parentInfoEl.style.display = 'none';
            }
          }

          if (editIdInput) editIdInput.value = acc.id;
          document.getElementById('acc-code').value = acc.code;
          document.getElementById('acc-name').value = acc.name;
          document.getElementById('acc-desc').value = acc.description || '';
          
          const initialBalInput = document.getElementById('acc-initial-balance');
          if (initialBalInput) {
            initialBalInput.value = acc.initialBalance !== undefined ? acc.initialBalance : 0;
          }

          const excludeEl = document.getElementById('acc-exclude-reports');
          if (excludeEl) {
            excludeEl.checked = Boolean(acc.excludeFromReports);
          }

          UI.setAccountCategory(acc.category, false);
          UI.setAccountCategoryDisabled(false); // Allow changing category when editing
          if (catGroup) catGroup.style.display = 'block';
          if (modalTitle) modalTitle.innerText = `✏️ 編輯會計科目 [${acc.code}]`;
          if (submitBtn) submitBtn.innerText = '儲存修改';
          modal.style.display = 'flex';
        });
      });

      // Delete account handlers (all accounts are now deletable!)
      container.querySelectorAll('.btn-delete-acc').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.dataset.id;
          const code = btn.dataset.code || '';
          const name = btn.dataset.name || '';

          if (!confirm(`確定要刪除會計科目 [${code}] ${name} 嗎？`)) {
            return;
          }

          try {
            Store.deleteAccount(id, false);
            PixelAudio.playSuccess();
            showToast(`已成功刪除會計科目 [${code}] ${name}！`);
          } catch (err) {
            PixelAudio.playError();
            if (err.isUsed) {
              const doForce = confirm(
                `⚠️ 科目 [${code}] ${name} 目前有 ${err.usedCount} 筆交易分錄正在使用中！\n\n` +
                `若強制刪除，系統將一併清除引用該科目的 ${err.usedCount} 筆交易紀錄以維持複式借貸平衡。\n\n` +
                `確定要強制刪除該科目與其關聯交易嗎？`
              );
              if (doForce) {
                try {
                  Store.deleteAccount(id, true);
                  PixelAudio.playSuccess();
                  showToast(`已強制刪除科目 [${code}] ${name} 與關聯交易！`);
                } catch (forceErr) {
                  PixelAudio.playError();
                  alert(forceErr.message);
                }
              }
            } else {
              alert(err.message);
            }
          }
        });
      });
    },

    // ==========================================
    // FAVORITE PRESETS (常用分錄管理)
    // ==========================================
    setupPresetEvents: () => {
      // Favorite cards click handled in rendering
    },

    renderFavoritesList: () => {
      const container = document.getElementById('presets-cards-container');
      if (!container) return;

      const favs = Store.getFavorites();
      const accountsMap = new Map(Store.getAccounts().map(a => [a.id, a]));

      if (favs.length === 0) {
        container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px; color:var(--text-muted)">尚無常用分錄模板</div>`;
        return;
      }

      container.innerHTML = favs.map(f => {
        const debitLegs = f.legs.filter(l => l.type === 'debit');
        const creditLegs = f.legs.filter(l => l.type === 'credit');

        return `
          <div class="preset-card pixel-box">
            <div class="preset-card-header">
              <div class="preset-name">
                <span>${f.reptileIcon || '🦎'}</span>
                <span>${f.name}</span>
              </div>
              <span class="pixel-badge">${f.category || '分錄'}</span>
            </div>

            <p style="font-size:14px; color:var(--text-muted);">${f.description || ''}</p>

            <div class="preset-legs-preview">
              <div style="color:var(--debit-color)">
                借：${debitLegs.map(l => {
                  const acc = accountsMap.get(l.accountId);
                  return `[${acc ? acc.name : '?'}] ${l.amount ? '$' + l.amount : ''}`;
                }).join(', ')}
              </div>
              <div style="color:var(--credit-color)">
                貸：${creditLegs.map(l => {
                  const acc = accountsMap.get(l.accountId);
                  return `[${acc ? acc.name : '?'}] ${l.amount ? '$' + l.amount : ''}`;
                }).join(', ')}
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px; gap:6px;">
              <button class="pixel-btn pixel-btn-primary pixel-btn-sm btn-apply-preset" data-id="${f.id}">
                ⚡ 立即套用
              </button>
              <div style="display:flex; gap:6px;">
                <button class="pixel-btn pixel-btn-sm btn-edit-preset" data-id="${f.id}">
                  ✏️ 編輯
                </button>
                <button class="pixel-btn pixel-btn-danger pixel-btn-sm btn-del-preset" data-id="${f.id}">
                  ✕ 刪除
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');

      // Apply button
      document.querySelectorAll('.btn-apply-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          UI.switchTab('entry');
          UI.applyFavoritePreset(id);
        });
      });

      // Edit preset button
      document.querySelectorAll('.btn-edit-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          const fav = Store.getFavoriteById(id);
          if (fav && UI.openPresetModal) {
            UI.openPresetModal(fav);
          }
        });
      });

      // Delete preset button
      document.querySelectorAll('.btn-del-preset').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          if (confirm('確定要刪除此常用分錄模板嗎？')) {
            Store.deleteFavorite(id);
            PixelAudio.playSuccess();
            showToast('已刪除常用分錄！');
            UI.renderFavoritesList();
          }
        });
      });
    },

    // ==========================================
    // THEMES & SOUND & BACKUP CONTROLS
    // ==========================================
    setupThemeControls: () => {
      const btnTheme = document.getElementById('btn-open-theme-modal');
      const modal = document.getElementById('modal-theme-picker');
      const btnCloseModal = document.getElementById('btn-close-theme-modal');

      if (btnTheme && modal) {
        btnTheme.addEventListener('click', () => {
          PixelAudio.playClick();
          const currentTheme = Store.getTheme();
          document.querySelectorAll('.theme-card').forEach(c => {
            c.classList.toggle('active', c.getAttribute('data-theme-name') === currentTheme);
          });
          modal.style.display = 'flex';
        });
      }

      if (btnCloseModal && modal) {
        btnCloseModal.addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }

      // Theme options click
      document.querySelectorAll('.theme-card').forEach(card => {
        card.addEventListener('click', () => {
          const theme = card.getAttribute('data-theme-name');
          PixelAudio.playThemeShift();
          Store.setTheme(theme);
          document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
          showToast(`已切換至主題：${card.querySelector('.theme-title')?.innerText || theme}`);
          modal.style.display = 'none';
        });
      });

      // Sound mute toggle
      const btnSound = document.getElementById('btn-toggle-sound');
      if (btnSound) {
        const updateSoundIcon = () => {
          btnSound.innerHTML = PixelAudio.isMuted() ? '🔇 靜音' : '🔊 音效';
        };
        updateSoundIcon();
        btnSound.addEventListener('click', () => {
          PixelAudio.toggleMute();
          updateSoundIcon();
          showToast(PixelAudio.isMuted() ? '已關閉 8-bit 音效' : '已開啟 8-bit 音效！');
        });
      }

      // CRT Scanlines toggle
      const btnCrt = document.getElementById('btn-toggle-crt');
      if (btnCrt) {
        const updateCrtText = () => {
          btnCrt.innerHTML = Store.getCrtEnabled() ? '📺 CRT: 開' : '📺 CRT: 關';
        };
        updateCrtText();
        btnCrt.addEventListener('click', () => {
          PixelAudio.playClick();
          const next = !Store.getCrtEnabled();
          Store.setCrtEnabled(next);
          updateCrtText();
          showToast(next ? '已啟用 CRT 復古掃描線！' : '已關閉 CRT 掃描線');
        });
      }

      // Privacy Mask toggle (金額防窺模式)
      const btnPrivacy = document.getElementById('btn-toggle-privacy');
      if (btnPrivacy) {
        let isPrivacyMasked = localStorage.getItem('scale_ledger_privacy_mode') === 'true';
        const updatePrivacyDOM = () => {
          if (isPrivacyMasked) {
            document.body.classList.add('privacy-masked');
            btnPrivacy.innerHTML = '🙈 隱私: 開';
          } else {
            document.body.classList.remove('privacy-masked');
            btnPrivacy.innerHTML = '👁️ 隱私: 關';
          }
        };
        updatePrivacyDOM();

        btnPrivacy.addEventListener('click', () => {
          PixelAudio.playClick();
          isPrivacyMasked = !isPrivacyMasked;
          localStorage.setItem('scale_ledger_privacy_mode', isPrivacyMasked);
          updatePrivacyDOM();
          showToast(isPrivacyMasked ? '已開啟金額隱私遮罩（滑過或輕點可暫時查看）' : '已關閉金額隱私遮罩');
        });
      }
    },

    setupSettingsEvents: () => {
      // Export Backup
      const btnExport = document.getElementById('btn-backup-export');
      if (btnExport) {
        btnExport.addEventListener('click', () => {
          PixelAudio.playCoin();
          const backup = Store.exportBackup();
          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `鱗帳備份_${getTodayString()}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          showToast('資料備份 JSON 已成功匯出！');
        });
      }

      // Import Backup
      const fileInput = document.getElementById('input-backup-file');
      if (fileInput) {
        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          const reader = new FileReader();
          reader.onload = (evt) => {
            try {
              const data = JSON.parse(evt.target.result);
              Store.importBackup(data);
              PixelAudio.playSuccess();
              showToast('✨ 備份資料已成功還原！');
            } catch (err) {
              PixelAudio.playError();
              alert('匯入失敗：' + err.message);
            }
          };
          reader.readAsText(file);
        });
      }

      // Reset to Demo
      const btnReset = document.getElementById('btn-reset-demo');
      if (btnReset) {
        btnReset.addEventListener('click', () => {
          if (confirm('確定要重置為爬蟲主題範例資料嗎？（現有自訂資料將會被範例取代）')) {
            PixelAudio.playSuccess();
            Store.resetToDemo();
            showToast('已重置為預設展示資料！');
          }
        });
      }
    },

    // ==========================================
    // MASCOT SELECTION (全 20 款爬蟲/毛孩/鳥禽萌寵)
    // ==========================================
    setupMascotControls: () => {
      const btnOpenMascot = document.getElementById('btn-open-mascot-modal');
      const avatarBox = document.getElementById('chameleon-avatar');
      const modal = document.getElementById('modal-mascot-picker');
      const btnCloseModal = document.getElementById('btn-close-mascot-modal');
      const listContainer = document.getElementById('mascot-picker-list');
      const filterTabsContainer = document.getElementById('mascot-filter-tabs');

      let currentCategory = 'all';

      const renderMascotList = () => {
        if (!listContainer) return;
        const allMascots = ReptileMascots.getMascotList();
        const currentId = Store.getMascot();
        const filtered = currentCategory === 'all'
          ? allMascots
          : allMascots.filter(m => m.category === currentCategory);

        listContainer.innerHTML = filtered.map(m => `
          <div class="mascot-choice-card pixel-box ${m.id === currentId ? 'active' : ''}" data-id="${m.id}">
            <div class="mascot-choice-preview">
              ${m.render('normal')}
            </div>
            <div class="mascot-choice-info">
              <div style="display:flex; align-items:center; gap:8px;">
                <strong style="font-family:var(--font-pixel-heading); font-size:12px; color:var(--primary)">${m.name}</strong>
                <span class="pixel-badge">${m.tag}</span>
              </div>
              <div style="font-size:14px; color:var(--accent); margin:3px 0;">${m.subtitle}</div>
              <p style="font-size:13px; color:var(--text-muted);">${m.description}</p>
            </div>
            <div>
              <button type="button" class="pixel-btn ${m.id === currentId ? 'pixel-btn-primary' : ''} pixel-btn-sm btn-select-mascot" data-id="${m.id}">
                ${m.id === currentId ? '✓ 現正陪伴' : '換此萌寵'}
              </button>
            </div>
          </div>
        `).join('');

        listContainer.querySelectorAll('.btn-select-mascot, .mascot-choice-card').forEach(el => {
          el.addEventListener('click', (e) => {
            const id = el.dataset.id || el.closest('[data-id]')?.dataset.id;
            if (id) {
              PixelAudio.playCoin();
              ReptileMascots.switchMascot(id);
              showToast(`已更換陪伴萌寵為【${ReptileMascots.getMascot(id).name}】！`);
              if (modal) modal.style.display = 'none';
            }
          });
        });
      };

      if (filterTabsContainer) {
        filterTabsContainer.querySelectorAll('.mascot-filter-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            PixelAudio.playClick();
            filterTabsContainer.querySelectorAll('.mascot-filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.cat || 'all';
            renderMascotList();
          });
        });
      }

      const openModal = () => {
        PixelAudio.playClick();
        currentCategory = 'all';
        if (filterTabsContainer) {
          filterTabsContainer.querySelectorAll('.mascot-filter-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.cat === 'all');
          });
        }
        renderMascotList();
        if (modal) modal.style.display = 'flex';
      };

      if (btnOpenMascot) btnOpenMascot.addEventListener('click', openModal);
      if (avatarBox) avatarBox.addEventListener('click', (e) => {
        openModal();
      });
      if (btnCloseModal && modal) {
        btnCloseModal.addEventListener('click', () => {
          modal.style.display = 'none';
        });
      }
    },

    // ==========================================
    // BRANDING CUSTOMIZATION (店名與副標題自行修改)
    // ==========================================
    updateBrandingDOM: () => {
      const title = Store.getBrandTitle();
      const subtitle = Store.getBrandSubtitle();

      const titleInput = document.getElementById('brand-title-input');
      const titleEl = document.getElementById('brand-title-text');
      const subtitleEl = document.getElementById('brand-subtitle-custom');

      if (titleInput && titleInput !== document.activeElement) {
        titleInput.value = title;
      }
      if (titleEl) titleEl.innerText = title;
      if (subtitleEl) subtitleEl.innerText = subtitle;
      document.title = `${title} — 複式記帳`;
    },

    setupBrandingControls: () => {
      const btnEdit = document.getElementById('btn-edit-branding');
      const brandHeader = document.getElementById('brand-clickable-area');
      const modal = document.getElementById('modal-edit-branding');
      const btnClose = document.getElementById('btn-close-branding-modal');
      const form = document.getElementById('form-edit-branding');
      const inputTitle = document.getElementById('input-brand-title');
      const inputSubtitle = document.getElementById('input-brand-subtitle');
      const titleInput = document.getElementById('brand-title-input');

      // Direct header input listener
      if (titleInput) {
        titleInput.value = Store.getBrandTitle();
        titleInput.addEventListener('change', () => {
          const newTitle = titleInput.value.trim() || '？？？';
          titleInput.value = newTitle;
          Store.setBrandTitle(newTitle);
          PixelAudio.playSuccess();
          showToast(`已成功修改帳簿名稱為「${newTitle}」！`);
        });
        titleInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            titleInput.blur();
          }
        });
      }

      const openModal = () => {
        PixelAudio.playClick();
        if (inputTitle) inputTitle.value = Store.getBrandTitle();
        if (inputSubtitle) inputSubtitle.value = Store.getBrandSubtitle();
        if (modal) modal.style.display = 'flex';
      };

      if (btnEdit) btnEdit.addEventListener('click', openModal);
      if (brandHeader) {
        brandHeader.style.cursor = 'pointer';
        brandHeader.addEventListener('click', openModal);
      }
      if (btnClose && modal) {
        btnClose.addEventListener('click', () => { modal.style.display = 'none'; });
      }

      const btnResetDefault = document.getElementById('btn-reset-branding-default');
      if (btnResetDefault) {
        btnResetDefault.addEventListener('click', () => {
          PixelAudio.playClick();
          const defaultTitle = '？？？';
          const defaultSubtitle = '8-BIT 複式記帳系統';
          if (inputTitle) inputTitle.value = defaultTitle;
          if (inputSubtitle) inputSubtitle.value = defaultSubtitle;
          Store.setBrandTitle(defaultTitle);
          Store.setBrandSubtitle(defaultSubtitle);
          if (titleInput) titleInput.value = defaultTitle;
          PixelAudio.playSuccess();
          showToast(`已恢復預設名稱「${defaultTitle}」！`);
          if (modal) modal.style.display = 'none';
        });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const newTitle = inputTitle.value.trim() || '？？？';
          const newSubtitle = inputSubtitle.value.trim() || '8-BIT 複式記帳系統';
          Store.setBrandTitle(newTitle);
          Store.setBrandSubtitle(newSubtitle);
          if (titleInput) titleInput.value = newTitle;
          PixelAudio.playSuccess();
          showToast(`已成功修改帳簿名稱為「${newTitle}」！`);
          modal.style.display = 'none';
        });
      }
    },

    // ==========================================
    // NAV TABS DRAG & DROP AND ORDER MANAGER
    // ==========================================
    renderNavTabs: () => {
      const navContainer = document.getElementById('main-nav-tabs');
      if (!navContainer) return;

      const order = Store.getTabOrder();
      navContainer.innerHTML = order.map(tabKey => {
        const def = TAB_DEFS[tabKey] || { icon: '📄', name: tabKey };
        const isActive = tabKey === activeTab ? 'active' : '';
        return `
          <button class="nav-tab-btn ${isActive}" data-tab="${tabKey}" draggable="true" title="按住可拖曳排序">
            <span>${def.icon}</span> ${def.name}
          </button>
        `;
      }).join('');

      let draggedTabKey = null;

      navContainer.querySelectorAll('.nav-tab-btn').forEach(btn => {
        const tabKey = btn.getAttribute('data-tab');

        // Click to switch tabs
        btn.addEventListener('click', () => {
          PixelAudio.playClick();
          UI.switchTab(tabKey);
        });

        // HTML5 Drag & Drop handlers
        btn.addEventListener('dragstart', (e) => {
          draggedTabKey = tabKey;
          btn.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          e.dataTransfer.setData('text/plain', tabKey);
        });

        btn.addEventListener('dragend', () => {
          btn.classList.remove('dragging');
          navContainer.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.remove('drag-over'));
        });

        btn.addEventListener('dragover', (e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (draggedTabKey && draggedTabKey !== tabKey) {
            btn.classList.add('drag-over');
          }
        });

        btn.addEventListener('dragleave', () => {
          btn.classList.remove('drag-over');
        });

        btn.addEventListener('drop', (e) => {
          e.preventDefault();
          btn.classList.remove('drag-over');
          if (!draggedTabKey || draggedTabKey === tabKey) return;

          const currentOrder = Store.getTabOrder();
          const fromIdx = currentOrder.indexOf(draggedTabKey);
          const toIdx = currentOrder.indexOf(tabKey);

          if (fromIdx !== -1 && toIdx !== -1) {
            currentOrder.splice(fromIdx, 1);
            currentOrder.splice(toIdx, 0, draggedTabKey);
            Store.setTabOrder(currentOrder);
            PixelAudio.playCoin();
            showToast('已自訂調整分頁順序！');
            UI.renderNavTabs();
          }
        });
      });
    },

    setupTabOrderModal: () => {
      const btnOpen = document.getElementById('btn-open-tab-order-modal');
      const modal = document.getElementById('modal-tab-order');
      const btnClose = document.getElementById('btn-close-tab-order-modal');
      const btnConfirm = document.getElementById('btn-confirm-tab-order');
      const btnReset = document.getElementById('btn-reset-tab-order');
      const listContainer = document.getElementById('tab-order-list-container');

      const renderList = () => {
        if (!listContainer) return;
        const currentOrder = Store.getTabOrder();
        listContainer.innerHTML = currentOrder.map((key, idx) => {
          const def = TAB_DEFS[key] || { icon: '📄', name: key };
          return `
            <div class="tab-order-item" data-key="${key}">
              <div>
                <strong style="color:var(--primary); margin-right:6px;">#${idx + 1}</strong>
                <span>${def.icon} ${def.name}</span>
              </div>
              <div class="tab-order-actions">
                <button type="button" class="pixel-btn pixel-btn-sm btn-move-tab-up" data-idx="${idx}" ${idx === 0 ? 'disabled' : ''}>
                  ⬆️ 上移
                </button>
                <button type="button" class="pixel-btn pixel-btn-sm btn-move-tab-down" data-idx="${idx}" ${idx === currentOrder.length - 1 ? 'disabled' : ''}>
                  ⬇️ 下移
                </button>
              </div>
            </div>
          `;
        }).join('');

        listContainer.querySelectorAll('.btn-move-tab-up').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            if (idx > 0) {
              PixelAudio.playClick();
              const order = Store.getTabOrder();
              const temp = order[idx - 1];
              order[idx - 1] = order[idx];
              order[idx] = temp;
              Store.setTabOrder(order);
              UI.renderNavTabs();
              renderList();
            }
          });
        });

        listContainer.querySelectorAll('.btn-move-tab-down').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            const order = Store.getTabOrder();
            if (idx < order.length - 1) {
              PixelAudio.playClick();
              const temp = order[idx + 1];
              order[idx + 1] = order[idx];
              order[idx] = temp;
              Store.setTabOrder(order);
              UI.renderNavTabs();
              renderList();
            }
          });
        });
      };

      if (btnOpen && modal) {
        btnOpen.addEventListener('click', () => {
          PixelAudio.playClick();
          renderList();
          modal.style.display = 'flex';
        });
      }

      if (btnClose && modal) {
        btnClose.addEventListener('click', () => { modal.style.display = 'none'; });
      }

      if (btnConfirm && modal) {
        btnConfirm.addEventListener('click', () => {
          PixelAudio.playSuccess();
          modal.style.display = 'none';
          showToast('分頁排序設定完成！');
        });
      }

      if (btnReset) {
        btnReset.addEventListener('click', () => {
          PixelAudio.playCoin();
          Store.resetTabOrder();
          UI.renderNavTabs();
          renderList();
          showToast('已還原為預設分頁順序！');
        });
      }
    },

    // ==========================================
    // WEBSITE FOOTER NAVIGATION
    // ==========================================
    setupFooterEvents: () => {
      document.querySelectorAll('.btn-footer-nav').forEach(btn => {
        btn.addEventListener('click', () => {
          const tab = btn.dataset.tab;
          if (tab) {
            PixelAudio.playClick();
            UI.switchTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        });
      });
    },

    // ==========================================
    // MOBILE BOTTOM NAVIGATION & TAB PICKER
    // ==========================================
    renderMobileTabPickerList: () => {
      const container = document.getElementById('tab-picker-list-items');
      if (!container) return;
      const order = Store.getTabOrder();
      container.innerHTML = order.map(key => {
        const def = TAB_DEFS[key] || { icon: '📄', name: key, desc: '' };
        const isActive = key === activeTab;
        return `
          <div class="tab-picker-item ${isActive ? 'active' : ''}" data-tab="${key}">
            <div class="tab-picker-item-left">
              <span class="tab-picker-item-icon">${def.icon}</span>
              <div>
                <div class="tab-picker-item-title">${def.name}</div>
                <div class="tab-picker-item-desc">${def.desc || ''}</div>
              </div>
            </div>
            ${isActive ? '<span class="tab-picker-item-badge">✓ 目前分頁</span>' : ''}
          </div>
        `;
      }).join('');

      container.querySelectorAll('.tab-picker-item').forEach(item => {
        item.addEventListener('click', () => {
          const tabKey = item.getAttribute('data-tab');
          if (tabKey) {
            PixelAudio.playClick();
            UI.switchTab(tabKey);
            const modal = document.getElementById('modal-tab-picker');
            if (modal) modal.style.display = 'none';
          }
        });
      });
    },

    setupMobileNav: () => {
      const btnOpenPicker = document.getElementById('btn-open-tab-picker');
      const modalPicker = document.getElementById('modal-tab-picker');
      const btnClosePicker = document.getElementById('btn-close-tab-picker');

      if (btnOpenPicker && modalPicker) {
        btnOpenPicker.addEventListener('click', () => {
          PixelAudio.playClick();
          UI.renderMobileTabPickerList();
          modalPicker.style.display = 'flex';
        });
      }

      if (btnClosePicker && modalPicker) {
        btnClosePicker.addEventListener('click', () => {
          modalPicker.style.display = 'none';
        });
      }

      // Prev & Next tab buttons
      const btnPrev = document.getElementById('btn-prev-tab');
      const btnNext = document.getElementById('btn-next-tab');

      if (btnPrev) {
        btnPrev.addEventListener('click', () => {
          PixelAudio.playClick();
          UI.goBack();
        });
      }

      if (btnNext) {
        btnNext.addEventListener('click', () => {
          PixelAudio.playClick();
          const order = Store.getTabOrder();
          const currentIdx = order.indexOf(activeTab);
          const nextIdx = (currentIdx + 1) % order.length;
          UI.switchTab(order[nextIdx]);
        });
      }

      // Quick Tools menu
      const btnToolsMenu = document.getElementById('btn-open-tools-menu');
      const btnMobileTools = document.getElementById('btn-open-mobile-tools');
      const btnMobileMore = document.getElementById('btn-mobile-more-menu');
      const modalQuickMenu = document.getElementById('modal-quick-menu');
      const btnCloseQuickMenu = document.getElementById('btn-close-quick-menu');

      const openQuickMenu = () => {
        PixelAudio.playClick();
        if (modalQuickMenu) modalQuickMenu.style.display = 'flex';
      };

      if (btnToolsMenu) btnToolsMenu.addEventListener('click', openQuickMenu);
      if (btnMobileTools) btnMobileTools.addEventListener('click', openQuickMenu);
      if (btnMobileMore) btnMobileMore.addEventListener('click', openQuickMenu);
      if (btnCloseQuickMenu && modalQuickMenu) {
        btnCloseQuickMenu.addEventListener('click', () => {
          modalQuickMenu.style.display = 'none';
        });
      }

      // Wire items inside Quick Menu to existing modals
      const wireQuickBtn = (btnId, targetBtnId) => {
        const btn = document.getElementById(btnId);
        if (btn) {
          btn.addEventListener('click', () => {
            if (modalQuickMenu) modalQuickMenu.style.display = 'none';
            const target = document.getElementById(targetBtnId);
            if (target) target.click();
          });
        }
      };

      wireQuickBtn('btn-qm-privacy', 'btn-toggle-privacy');
      wireQuickBtn('btn-qm-theme', 'btn-open-theme-modal');
      wireQuickBtn('btn-qm-mascot', 'btn-open-mascot-modal');
      wireQuickBtn('btn-qm-brand', 'btn-edit-branding');
      wireQuickBtn('btn-qm-tab-order', 'btn-open-tab-order-modal');
      wireQuickBtn('btn-qm-sound', 'btn-toggle-sound');
      wireQuickBtn('btn-qm-crt', 'btn-toggle-crt');
      wireQuickBtn('btn-qm-backup', 'btn-open-settings-modal');

      // Close bottom sheets on tapping backdrop
      window.addEventListener('click', (e) => {
        if (e.target.classList.contains('sheet-overlay')) {
          e.target.style.display = 'none';
        }
      });
    },

    // ==========================================
    // BACK NAVIGATION ENGINE (上一頁/上一層返回系統)
    // ==========================================
    goBack: (fromPopState = false) => {
      // 1. If any modal overlay is open, close the topmost modal
      const openModals = Array.from(document.querySelectorAll('.modal-overlay')).filter(m => {
        return window.getComputedStyle(m).display !== 'none';
      });
      if (openModals.length > 0) {
        const topModal = openModals[openModals.length - 1];
        PixelAudio.playClick();
        const closeBtn = topModal.querySelector('.modal-header button, button[id*="close"], .btn-close');
        if (closeBtn) {
          closeBtn.click();
        } else {
          topModal.style.display = 'none';
        }
        return true;
      }

      // 2. If in accounts ledger drilldown view, return to accounts overview
      const ledgerView = document.getElementById('accounts-ledger-view');
      if (ledgerView && window.getComputedStyle(ledgerView).display !== 'none') {
        const btnBack = document.getElementById('btn-back-to-accounts-overview');
        if (btnBack) {
          btnBack.click();
          return true;
        }
      }

      // 3. If in transaction edit mode, cancel edit mode
      const editBanner = document.getElementById('entry-edit-banner');
      if (editBanner && window.getComputedStyle(editBanner).display !== 'none') {
        const btnCancel = document.getElementById('btn-cancel-edit');
        if (btnCancel) {
          btnCancel.click();
          return true;
        }
      }

      // 4. Tab navigation history stack
      while (navHistory.length > 0) {
        const prev = navHistory.pop();
        const prevTab = typeof prev === 'string' ? prev : (prev.tab || null);
        if (prevTab && prevTab !== activeTab) {
          UI.switchTab(prevTab, true);
          PixelAudio.playClick();
          const mascotEngine = window.ReptileMascots || window.ChameleonMascot;
          if (mascotEngine && mascotEngine.triggerAction) {
            mascotEngine.triggerAction();
          }
          return true;
        }
      }

      // 5. Fallback: navigate to previous tab in user's tab order
      const order = Store.getTabOrder();
      const currentIdx = order.indexOf(activeTab);
      const prevIdx = (currentIdx - 1 + order.length) % order.length;
      UI.switchTab(order[prevIdx], true);
      PixelAudio.playClick();
      const mascotEngine = window.ReptileMascots || window.ChameleonMascot;
      if (mascotEngine && mascotEngine.triggerAction) {
        mascotEngine.triggerAction();
      }
      return true;
    },

    getPreviousPageInfo: () => {
      // 1. Modals
      const openModals = Array.from(document.querySelectorAll('.modal-overlay')).filter(m => {
        return window.getComputedStyle(m).display !== 'none';
      });
      if (openModals.length > 0) {
        const topModal = openModals[openModals.length - 1];
        const titleEl = topModal.querySelector('.modal-title');
        let title = titleEl ? titleEl.innerText.replace(/^[^\w\u4e00-\u9fa5]+/, '').trim() : '目前視窗';
        if (title.length > 12) title = title.substring(0, 12);
        return {
          title: '關閉' + title,
          icon: '✕',
          type: 'modal'
        };
      }

      // 2. Ledger subview
      const ledgerView = document.getElementById('accounts-ledger-view');
      if (ledgerView && window.getComputedStyle(ledgerView).display !== 'none') {
        return {
          title: '會計科目總覽',
          icon: '🗂️',
          type: 'subview'
        };
      }

      // 3. Edit transaction banner
      const editBanner = document.getElementById('entry-edit-banner');
      if (editBanner && window.getComputedStyle(editBanner).display !== 'none') {
        return {
          title: '取消修改分錄',
          icon: '✕',
          type: 'edit'
        };
      }

      // 4. Tab history stack
      for (let i = navHistory.length - 1; i >= 0; i--) {
        const item = navHistory[i];
        const tab = typeof item === 'string' ? item : item.tab;
        if (tab && tab !== activeTab && TAB_DEFS[tab]) {
          return {
            title: TAB_DEFS[tab].name,
            icon: TAB_DEFS[tab].icon,
            type: 'tab'
          };
        }
      }

      // 5. Fallback: previous tab in tab order
      const order = Store.getTabOrder();
      const currentIdx = order.indexOf(activeTab);
      const prevIdx = (currentIdx - 1 + order.length) % order.length;
      const prevTabKey = order[prevIdx];
      const def = TAB_DEFS[prevTabKey] || { icon: '◀', name: '上一分頁' };
      return {
        title: def.name,
        icon: def.icon,
        type: 'tab'
      };
    },

    setupSwipeBack: () => {
      const indicator = document.getElementById('swipe-back-indicator');
      const edgeGlow = document.getElementById('swipe-back-edge-glow');
      const actionLabel = document.getElementById('swipe-action-label');
      const targetLabel = document.getElementById('swipe-target-label');

      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;
      let isTracking = false;
      let isSwipingBack = false;
      let isVerticalScroll = false;
      let currentTargetInfo = null;

      const SWIPE_THRESHOLD = 70; // px displacement to trigger back
      const MAX_START_X = Math.max(120, window.innerWidth * 0.35); // Left-side touch zone

      function resetIndicator(animated = true) {
        if (!indicator) return;
        indicator.classList.remove('swipe-ready', 'swipe-confirmed');
        if (animated) {
          indicator.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.2s ease';
        } else {
          indicator.style.transition = 'none';
        }
        indicator.style.transform = 'translateY(-50%) translateX(-120%)';
        indicator.style.opacity = '0';
        if (edgeGlow) {
          edgeGlow.style.opacity = '0';
          edgeGlow.style.width = '4px';
        }
      }

      function isHorizontallyScrollable(el) {
        let curr = el;
        while (curr && curr !== document.body && curr !== document.documentElement) {
          const style = window.getComputedStyle(curr);
          const overflowX = style.overflowX;
          if ((overflowX === 'auto' || overflowX === 'scroll') && curr.scrollWidth > curr.clientWidth) {
            return curr;
          }
          curr = curr.parentElement;
        }
        return null;
      }

      // Touch Start
      document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) {
          isTracking = false;
          return;
        }

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        touchStartTime = Date.now();
        isTracking = false;
        isSwipingBack = false;
        isVerticalScroll = false;

        // Check if starting within left zone
        if (touchStartX > MAX_START_X) {
          return;
        }

        // Check interactive inputs: if user touches an input/textarea/select, only allow pure edge swipe (< 30px)
        const target = e.target;
        const isInput = target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName);
        if (isInput && touchStartX > 30) {
          return;
        }

        // Check horizontally scrollable container
        const scrollable = isHorizontallyScrollable(target);
        if (scrollable && scrollable.scrollLeft > 8 && touchStartX > 30) {
          return;
        }

        isTracking = true;
        currentTargetInfo = UI.getPreviousPageInfo();
        if (targetLabel && currentTargetInfo) {
          targetLabel.innerText = `${currentTargetInfo.icon} ${currentTargetInfo.title}`;
        }
        if (actionLabel) {
          actionLabel.innerText = '滑動返回';
        }
        if (indicator) {
          indicator.classList.remove('swipe-ready', 'swipe-confirmed');
          indicator.style.transition = 'none';
        }
      }, { passive: true });

      // Touch Move
      document.addEventListener('touchmove', (e) => {
        if (!isTracking || isVerticalScroll || e.touches.length !== 1) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        // Direction detection
        if (!isSwipingBack) {
          if (Math.abs(deltaY) > 10 && Math.abs(deltaY) >= Math.abs(deltaX)) {
            isVerticalScroll = true;
            isTracking = false;
            resetIndicator(false);
            return;
          }

          if (deltaX < -10) {
            isTracking = false;
            resetIndicator(false);
            return;
          }

          if (deltaX > 14 && deltaX > Math.abs(deltaY) * 1.25) {
            isSwipingBack = true;
          }
        }

        if (isSwipingBack) {
          if (e.cancelable) {
            e.preventDefault();
          }

          const progress = Math.min(1, Math.max(0, deltaX / SWIPE_THRESHOLD));
          const translateX = Math.min(deltaX * 0.7 - 25, 90);

          if (indicator) {
            indicator.style.opacity = Math.min(1, 0.2 + progress * 0.8).toFixed(2);
            indicator.style.transform = `translateY(-50%) translateX(${translateX}px)`;

            if (deltaX >= SWIPE_THRESHOLD) {
              if (!indicator.classList.contains('swipe-ready')) {
                indicator.classList.add('swipe-ready');
                if (actionLabel) actionLabel.innerText = '✓ 放開即可返回';
                if (navigator.vibrate) {
                  try { navigator.vibrate(12); } catch (err) {}
                }
              }
            } else {
              if (indicator.classList.contains('swipe-ready')) {
                indicator.classList.remove('swipe-ready');
                if (actionLabel) actionLabel.innerText = '滑動返回';
              }
            }
          }

          if (edgeGlow) {
            edgeGlow.style.opacity = (progress * 0.85).toFixed(2);
            edgeGlow.style.width = `${Math.min(8, 3 + progress * 5)}px`;
          }
        }
      }, { passive: false });

      // Touch End
      document.addEventListener('touchend', (e) => {
        if (!isTracking && !isSwipingBack) return;

        if (isSwipingBack) {
          const touch = e.changedTouches[0];
          const deltaX = touch.clientX - touchStartX;
          const duration = Date.now() - touchStartTime;

          const isTriggered = deltaX >= SWIPE_THRESHOLD || (deltaX > 45 && duration < 240);

          if (isTriggered) {
            UI._lastSwipeBackTriggered = Date.now();
            if (indicator) {
              indicator.classList.add('swipe-confirmed');
              if (actionLabel) actionLabel.innerText = '正在返回...';
            }
            if (navigator.vibrate) {
              try { navigator.vibrate(25); } catch (err) {}
            }
            setTimeout(() => {
              UI.goBack();
              setTimeout(() => {
                resetIndicator(true);
              }, 120);
            }, 60);
          } else {
            resetIndicator(true);
          }
        } else {
          resetIndicator(true);
        }

        isTracking = false;
        isSwipingBack = false;
        isVerticalScroll = false;
      }, { passive: true });

      // Touch Cancel
      document.addEventListener('touchcancel', () => {
        isTracking = false;
        isSwipingBack = false;
        isVerticalScroll = false;
        resetIndicator(true);
      }, { passive: true });

      // Desktop Mouse Drag Testing Support
      let isMouseDown = false;
      document.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        if (e.clientX <= 25) {
          isMouseDown = true;
          touchStartX = e.clientX;
          touchStartY = e.clientY;
          touchStartTime = Date.now();
          isTracking = true;
          isSwipingBack = false;
          currentTargetInfo = UI.getPreviousPageInfo();
          if (targetLabel && currentTargetInfo) {
            targetLabel.innerText = `${currentTargetInfo.icon} ${currentTargetInfo.title}`;
          }
          if (actionLabel) actionLabel.innerText = '滑動返回';
          if (indicator) {
            indicator.classList.remove('swipe-ready', 'swipe-confirmed');
            indicator.style.transition = 'none';
          }
        }
      });

      document.addEventListener('mousemove', (e) => {
        if (!isMouseDown || !isTracking) return;
        const deltaX = e.clientX - touchStartX;
        const deltaY = e.clientY - touchStartY;
        if (deltaX > 10 && deltaX > Math.abs(deltaY)) {
          isSwipingBack = true;
          const progress = Math.min(1, Math.max(0, deltaX / SWIPE_THRESHOLD));
          const translateX = Math.min(deltaX * 0.7 - 25, 90);
          if (indicator) {
            indicator.style.opacity = Math.min(1, 0.2 + progress * 0.8).toFixed(2);
            indicator.style.transform = `translateY(-50%) translateX(${translateX}px)`;
            if (deltaX >= SWIPE_THRESHOLD) {
              if (!indicator.classList.contains('swipe-ready')) {
                indicator.classList.add('swipe-ready');
                if (actionLabel) actionLabel.innerText = '✓ 放開即可返回';
              }
            } else {
              indicator.classList.remove('swipe-ready');
              if (actionLabel) actionLabel.innerText = '滑動返回';
            }
          }
          if (edgeGlow) {
            edgeGlow.style.opacity = (progress * 0.85).toFixed(2);
            edgeGlow.style.width = `${Math.min(8, 3 + progress * 5)}px`;
          }
        }
      });

      document.addEventListener('mouseup', (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        if (isSwipingBack) {
          const deltaX = e.clientX - touchStartX;
          if (deltaX >= SWIPE_THRESHOLD) {
            if (indicator) indicator.classList.add('swipe-confirmed');
            setTimeout(() => {
              UI.goBack();
              setTimeout(() => resetIndicator(true), 120);
            }, 60);
          } else {
            resetIndicator(true);
          }
        } else {
          resetIndicator(true);
        }
        isTracking = false;
        isSwipingBack = false;
      });

      // Browser popstate integration for native mobile gestures
      window.addEventListener('popstate', (e) => {
        UI.goBack(true);
      });
    },

    // ==========================================
    // SWIPE TAB NAVIGATION (左右滑動切換分頁)
    // ==========================================
    setupSwipeTabNavigation: () => {
      let touchStartX = null;
      let touchStartY = null;
      let touchStartTime = 0;
      let touchTarget = null;

      document.addEventListener('touchstart', (e) => {
        if (e.touches.length !== 1) {
          touchStartX = null;
          return;
        }
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = Date.now();
        touchTarget = e.target;
      }, { passive: true });

      document.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        const deltaTime = Date.now() - touchStartTime;

        touchStartX = null;
        touchStartY = null;

        // Ignore if edge swipe back triggered recently
        if (Date.now() - (UI._lastSwipeBackTriggered || 0) < 500) {
          return;
        }

        // 1. If any modal overlay is visible, ignore
        const openModals = Array.from(document.querySelectorAll('.modal-overlay')).filter(m => {
          return window.getComputedStyle(m).display !== 'none';
        });
        if (openModals.length > 0) return;

        // 2. If pixel keypad is open, ignore
        if (UI.isKeypadOpen && UI.isKeypadOpen()) return;

        // 3. Ignore interactive controls: inputs, textareas, selects, sliders, buttons, keypads
        if (touchTarget && touchTarget.closest('input, textarea, select, button, label, .pixel-keypad-modal, .no-swipe')) {
          return;
        }

        // 4. Ignore horizontally scrollable containers (e.g. journal wide table, nav scroll bar, picker sheets)
        if (touchTarget) {
          const scrollable = touchTarget.closest('.table-responsive, .nav-tabs-scroll, .tab-picker-sheet');
          if (scrollable && scrollable.scrollWidth > scrollable.clientWidth + 5) {
            return;
          }
        }

        // 5. Swipe threshold check: horizontal displacement >= 50px, horizontal dominance, within 650ms
        const absX = Math.abs(deltaX);
        const absY = Math.abs(deltaY);

        if (absX >= 50 && absX > absY * 1.35 && deltaTime <= 650) {
          const order = Store.getTabOrder();
          const currentIdx = order.indexOf(activeTab);
          if (currentIdx === -1) return;

          if (deltaX < 0) {
            // Swipe Left -> Next Tab
            const nextIdx = (currentIdx + 1) % order.length;
            PixelAudio.playClick();
            UI.switchTab(order[nextIdx]);
            if (window.ReptileMascots && window.ReptileMascots.triggerAction) {
              window.ReptileMascots.triggerAction();
            }
          } else {
            // Swipe Right -> Prev Tab
            const prevIdx = (currentIdx - 1 + order.length) % order.length;
            PixelAudio.playClick();
            UI.switchTab(order[prevIdx], true);
            if (window.ReptileMascots && window.ReptileMascots.triggerAction) {
              window.ReptileMascots.triggerAction();
            }
          }
        }
      }, { passive: true });
    },
    // PRESET MODAL EVENTS (新增/編輯常用分錄模板 - 支援多筆借貸)
    // ==========================================
    setupPresetModalEvents: () => {
      const btnOpenAdd = document.getElementById('btn-open-add-preset-modal');
      const modal = document.getElementById('modal-edit-preset');
      const btnClose = document.getElementById('btn-close-preset-modal');
      const form = document.getElementById('form-edit-preset');
      const debitContainer = document.getElementById('preset-debit-legs-container');
      const creditContainer = document.getElementById('preset-credit-legs-container');
      const btnAddDebit = document.getElementById('btn-add-preset-debit');
      const btnAddCredit = document.getElementById('btn-add-preset-credit');

      let modalDebitLegs = [];
      let modalCreditLegs = [];

      const renderPresetLegs = () => {
        const accounts = Store.getAccounts();
        const makeOptions = (selId) => {
          return accounts.map(a => {
            const cat = AccountingConstants.CATEGORIES[a.category] || { name: '其他' };
            const isSel = a.id === selId ? 'selected' : '';
            return `<option value="${a.id}" ${isSel}>${a.name} (${cat.name})</option>`;
          }).join('');
        };

        if (debitContainer) {
          debitContainer.innerHTML = modalDebitLegs.map((leg, idx) => `
            <div class="preset-leg-row" data-side="debit" data-idx="${idx}" style="display:flex; gap:6px; align-items:center;">
              <select class="pixel-select preset-leg-account" style="flex:1; min-width:130px; font-size:12px; padding:4px 6px;">
                ${makeOptions(leg.accountId)}
              </select>
              <input type="number" min="0" step="any" class="pixel-input preset-leg-amount" placeholder="金額(選填)" value="${leg.amount !== '' && leg.amount !== undefined ? leg.amount : ''}" style="width:110px; font-size:12px; text-align:right; padding:4px 6px;">
              <button type="button" class="pixel-btn pixel-btn-danger btn-del-preset-leg" style="padding:3px 8px; font-size:11px;" title="刪除此筆">✕</button>
            </div>
          `).join('');
        }

        if (creditContainer) {
          creditContainer.innerHTML = modalCreditLegs.map((leg, idx) => `
            <div class="preset-leg-row" data-side="credit" data-idx="${idx}" style="display:flex; gap:6px; align-items:center;">
              <select class="pixel-select preset-leg-account" style="flex:1; min-width:130px; font-size:12px; padding:4px 6px;">
                ${makeOptions(leg.accountId)}
              </select>
              <input type="number" min="0" step="any" class="pixel-input preset-leg-amount" placeholder="金額(選填)" value="${leg.amount !== '' && leg.amount !== undefined ? leg.amount : ''}" style="width:110px; font-size:12px; text-align:right; padding:4px 6px;">
              <button type="button" class="pixel-btn pixel-btn-danger btn-del-preset-leg" style="padding:3px 8px; font-size:11px;" title="刪除此筆">✕</button>
            </div>
          `).join('');
        }

        const wireEvents = (container, side) => {
          if (!container) return;
          container.querySelectorAll('.preset-leg-row').forEach(row => {
            const idx = parseInt(row.dataset.idx, 10);
            const accSel = row.querySelector('.preset-leg-account');
            const amtInp = row.querySelector('.preset-leg-amount');
            const btnDel = row.querySelector('.btn-del-preset-leg');

            if (accSel) {
              accSel.addEventListener('change', (e) => {
                const list = side === 'debit' ? modalDebitLegs : modalCreditLegs;
                if (list[idx]) list[idx].accountId = e.target.value;
              });
            }

            if (amtInp) {
              amtInp.addEventListener('input', (e) => {
                const list = side === 'debit' ? modalDebitLegs : modalCreditLegs;
                if (list[idx]) list[idx].amount = e.target.value;
              });
            }

            if (btnDel) {
              btnDel.addEventListener('click', () => {
                PixelAudio.playClick();
                const list = side === 'debit' ? modalDebitLegs : modalCreditLegs;
                if (list.length <= 1) {
                  showToast('⚠️ 常用分錄模板至少需保留一筆' + (side === 'debit' ? '借方' : '貸方') + '科目！');
                  return;
                }
                list.splice(idx, 1);
                renderPresetLegs();
              });
            }
          });
        };

        wireEvents(debitContainer, 'debit');
        wireEvents(creditContainer, 'credit');
      };

      if (btnAddDebit) {
        btnAddDebit.addEventListener('click', () => {
          PixelAudio.playClick();
          const accounts = Store.getAccounts();
          const defaultDebit = accounts.find(a => a.category === 'expense') || accounts[0];
          modalDebitLegs.push({
            accountId: defaultDebit ? defaultDebit.id : (accounts[0]?.id || ''),
            amount: ''
          });
          renderPresetLegs();
        });
      }

      if (btnAddCredit) {
        btnAddCredit.addEventListener('click', () => {
          PixelAudio.playClick();
          const accounts = Store.getAccounts();
          const defaultCredit = accounts.find(a => a.category === 'asset' || a.category === 'liability') || accounts[1];
          modalCreditLegs.push({
            accountId: defaultCredit ? defaultCredit.id : (accounts[0]?.id || ''),
            amount: ''
          });
          renderPresetLegs();
        });
      }

      const openPresetModal = (preset = null) => {
        PixelAudio.playClick();
        const titleEl = document.getElementById('modal-preset-title');
        const idInput = document.getElementById('preset-edit-id');
        const iconInput = document.getElementById('preset-icon');
        const nameInput = document.getElementById('preset-name');
        const catInput = document.getElementById('preset-category');
        const descInput = document.getElementById('preset-desc');

        const accounts = Store.getAccounts();
        const defaultDebit = accounts.find(a => a.category === 'expense') || accounts[0];
        const defaultCredit = accounts.find(a => a.category === 'asset' || a.category === 'liability') || accounts[1];

        if (preset) {
          if (titleEl) titleEl.innerText = '✏️ 編輯常用分錄模板';
          if (idInput) idInput.value = preset.id;
          if (iconInput) iconInput.value = preset.reptileIcon || '🦎';
          if (nameInput) nameInput.value = preset.name || '';
          if (catInput) catInput.value = preset.category || '';
          if (descInput) descInput.value = preset.description || '';

          const debitLegs = preset.legs ? preset.legs.filter(l => l.type === 'debit') : [];
          const creditLegs = preset.legs ? preset.legs.filter(l => l.type === 'credit') : [];

          modalDebitLegs = debitLegs.length > 0
            ? debitLegs.map(l => ({ accountId: l.accountId, amount: l.amount !== undefined && l.amount !== null ? l.amount : '' }))
            : [{ accountId: defaultDebit ? defaultDebit.id : accounts[0]?.id, amount: '' }];

          modalCreditLegs = creditLegs.length > 0
            ? creditLegs.map(l => ({ accountId: l.accountId, amount: l.amount !== undefined && l.amount !== null ? l.amount : '' }))
            : [{ accountId: defaultCredit ? defaultCredit.id : accounts[1]?.id, amount: '' }];
        } else {
          if (titleEl) titleEl.innerText = '➕ 新增常用分錄模板';
          if (idInput) idInput.value = '';
          if (iconInput) iconInput.value = '🦎';
          if (nameInput) nameInput.value = '';
          if (catInput) catInput.value = '常用';
          if (descInput) descInput.value = '';

          modalDebitLegs = [{ accountId: defaultDebit ? defaultDebit.id : accounts[0]?.id, amount: '' }];
          modalCreditLegs = [{ accountId: defaultCredit ? defaultCredit.id : accounts[1]?.id, amount: '' }];
        }

        renderPresetLegs();
        if (modal) modal.style.display = 'flex';
      };

      if (btnOpenAdd) {
        btnOpenAdd.addEventListener('click', () => openPresetModal(null));
      }

      if (btnClose && modal) {
        btnClose.addEventListener('click', () => { modal.style.display = 'none'; });
      }

      if (form) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const id = document.getElementById('preset-edit-id')?.value;
          const name = document.getElementById('preset-name')?.value.trim();
          const reptileIcon = document.getElementById('preset-icon')?.value.trim() || '🦎';
          const category = document.getElementById('preset-category')?.value.trim() || '常用';
          const description = document.getElementById('preset-desc')?.value.trim() || name;

          if (!name) {
            alert('請填寫模板名稱！');
            return;
          }

          if (modalDebitLegs.length === 0 || modalCreditLegs.length === 0) {
            alert('常用分錄模板必須包含至少一筆借方與一筆貸方科目！');
            return;
          }

          const legs = [];
          modalDebitLegs.forEach(l => {
            legs.push({
              type: 'debit',
              accountId: l.accountId,
              amount: l.amount !== '' && !isNaN(l.amount) ? parseFloat(l.amount) : '',
              note: ''
            });
          });
          modalCreditLegs.forEach(l => {
            legs.push({
              type: 'credit',
              accountId: l.accountId,
              amount: l.amount !== '' && !isNaN(l.amount) ? parseFloat(l.amount) : '',
              note: ''
            });
          });

          if (id) {
            Store.updateFavorite(id, { name, reptileIcon, category, description, legs });
            showToast(`已成功修改常用分錄「${name}」！`);
          } else {
            Store.addFavorite({ name, reptileIcon, category, description, legs });
            showToast(`已成功建立常用分錄「${name}」！`);
          }

          PixelAudio.playSuccess();
          if (modal) modal.style.display = 'none';
          UI.refreshQuickFavOptions();
          if (activeTab === 'favorites') {
            UI.renderFavoritesList();
          }
        });
      }

      UI.openPresetModal = openPresetModal;
      UI.formatVoucherNo = fmtVoucherNo;
    },

    // ==========================================
    // 8-BIT RETRO PIXEL NUMERIC KEYPAD (數字鍵盤)
    // ==========================================
    keypadState: {
      isOpen: false,
      side: 'debit',
      idx: 0,
      targetInput: null,
      displayVal: '0',
      formula: '',
      isFresh: true,
      justClosedTimer: null
    },

    isKeypadOpen: () => {
      return UI.keypadState && UI.keypadState.isOpen;
    },

    setupKeypadEvents: () => {
      const modal = document.getElementById('modal-pixel-keypad');
      const btnClose = document.getElementById('btn-close-keypad');
      if (!modal) return;

      if (btnClose) {
        btnClose.addEventListener('click', () => {
          PixelAudio.playClick();
          UI.closeKeypad();
        });
      }

      // Close on clicking backdrop
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          UI.closeKeypad();
        }
      });

      // Quick Balance Button
      const btnBalance = document.getElementById('btn-keypad-balance');
      if (btnBalance) {
        btnBalance.addEventListener('click', () => {
          UI.handleKeypadAction('balance');
        });
      }

      // Quick Add Buttons (+100, +500, +1K, +10K)
      modal.querySelectorAll('.btn-keypad-add').forEach(btn => {
        btn.addEventListener('click', () => {
          PixelAudio.playClick();
          const addVal = parseFloat(btn.dataset.add) || 0;
          UI.handleKeypadAction('quickAdd', addVal);
        });
      });

      // Grid Keypad Buttons
      modal.querySelectorAll('.keypad-key').forEach(btn => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.action;
          const val = btn.dataset.val;
          if (action !== 'confirm') {
            PixelAudio.playClick();
          }
          UI.handleKeypadAction(action, val);
        });
      });

      // Physical Keyboard Listener
      document.addEventListener('keydown', (e) => {
        if (!UI.keypadState.isOpen) return;

        if (e.key >= '0' && e.key <= '9') {
          e.preventDefault();
          PixelAudio.playClick();
          UI.handleKeypadAction('num', e.key);
        } else if (e.key === '.') {
          e.preventDefault();
          PixelAudio.playClick();
          UI.handleKeypadAction('dot', '.');
        } else if (['+', '-', '*', '/'].includes(e.key)) {
          e.preventDefault();
          PixelAudio.playClick();
          UI.handleKeypadAction('op', e.key);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          UI.handleKeypadAction('confirm');
        } else if (e.key === 'Backspace') {
          e.preventDefault();
          PixelAudio.playClick();
          UI.handleKeypadAction('backspace');
        } else if (e.key === 'Escape') {
          e.preventDefault();
          UI.closeKeypad();
        } else if (e.key === '=' || e.key === ' ') {
          e.preventDefault();
          PixelAudio.playClick();
          UI.handleKeypadAction('eval');
        } else if (e.key.toLowerCase() === 'c') {
          e.preventDefault();
          PixelAudio.playClick();
          UI.handleKeypadAction('clear');
        }
      });
    },

    openKeypad: (side, idx, targetInput) => {
      const modal = document.getElementById('modal-pixel-keypad');
      if (!modal) return;

      PixelAudio.playClick();
      UI.keypadState.isOpen = true;
      UI.keypadState.side = side;
      UI.keypadState.idx = idx;
      UI.keypadState.targetInput = targetInput;

      // Blur native input to prevent mobile OS keyboard from obstructing view
      if (targetInput && typeof targetInput.blur === 'function') {
        targetInput.blur();
      }

      const leg = (side === 'debit' ? currentDebitLegs : currentCreditLegs)[idx];
      const acc = leg ? Store.getAccountById(leg.accountId) : null;
      const accName = acc ? `[${acc.code}] ${acc.name}` : '未指定科目';

      // Update Side Badge & Theme
      const sideBadge = document.getElementById('keypad-side-badge');
      const modalBox = modal.querySelector('.pixel-keypad-modal');
      if (sideBadge) {
        if (side === 'debit') {
          sideBadge.className = 'pixel-keypad-badge badge-debit';
          sideBadge.innerText = '➕ 借方 (DEBIT)';
        } else {
          sideBadge.className = 'pixel-keypad-badge badge-credit';
          sideBadge.innerText = '➖ 貸方 (CREDIT)';
        }
      }
      if (modalBox) {
        modalBox.classList.toggle('side-debit', side === 'debit');
        modalBox.classList.toggle('side-credit', side === 'credit');
      }

      // Update Account Label
      const accLabel = document.getElementById('keypad-acc-label');
      if (accLabel) accLabel.innerText = accName;

      // Setup initial amount
      const currentVal = targetInput ? (parseFloat(targetInput.value) || 0) : 0;
      UI.keypadState.displayVal = currentVal > 0 ? String(currentVal) : '0';
      UI.keypadState.formula = '';
      UI.keypadState.isFresh = true;

      // Update Auto-balance Button label
      UI.updateKeypadBalanceButton();
      UI.renderKeypadScreen();

      modal.style.display = 'flex';
    },

    closeKeypad: () => {
      const modal = document.getElementById('modal-pixel-keypad');
      if (modal) modal.style.display = 'none';
      UI.keypadState.isOpen = false;

      // Prevent immediate refocus reopening
      if (UI.keypadState.justClosedTimer) clearTimeout(UI.keypadState.justClosedTimer);
      UI.keypadState.justClosedTimer = setTimeout(() => {
        UI.keypadState.justClosedTimer = null;
      }, 350);
    },

    calculateKeypadBalanceDiff: (side, idx) => {
      const debitTotal = currentDebitLegs.reduce((sum, leg, i) => {
        if (side === 'debit' && i === idx) return sum;
        return sum + (parseFloat(leg.amount) || 0);
      }, 0);
      const creditTotal = currentCreditLegs.reduce((sum, leg, i) => {
        if (side === 'credit' && i === idx) return sum;
        return sum + (parseFloat(leg.amount) || 0);
      }, 0);

      if (side === 'debit') {
        const diff = creditTotal - debitTotal;
        return diff > 0 ? Math.round(diff * 100) / 100 : 0;
      } else {
        const diff = debitTotal - creditTotal;
        return diff > 0 ? Math.round(diff * 100) / 100 : 0;
      }
    },

    updateKeypadBalanceButton: () => {
      const btnBalance = document.getElementById('btn-keypad-balance');
      const hintEl = document.getElementById('keypad-balance-hint');
      const diff = UI.calculateKeypadBalanceDiff(UI.keypadState.side, UI.keypadState.idx);

      if (btnBalance) {
        btnBalance.innerText = '⚖️ 平衡差額';
        if (diff > 0) {
          btnBalance.title = `自動填入平衡借貸所需的差額 $${diff}`;
          btnBalance.style.opacity = '1';
        } else {
          btnBalance.title = '目前借貸已平衡或無需補足差額';
          btnBalance.style.opacity = '0.85';
        }
      }

      if (hintEl) {
        const currentDebit = currentDebitLegs.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
        const currentCredit = currentCreditLegs.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
        const curDiff = Math.abs(currentDebit - currentCredit);
        hintEl.innerText = curDiff === 0 ? '✓ 目前借貸平衡' : `未平差額：$${curDiff}`;
      }
    },

    safeEvalMath: (expr) => {
      if (!expr) return 0;
      const clean = String(expr).replace(/÷/g, '/').replace(/×/g, '*').replace(/\s+/g, '');
      if (!clean) return 0;
      if (!/^[\d\.\+\-\*\/]+$/.test(clean)) return 0;
      try {
        const res = Function(`'use strict'; return (${clean})`)();
        if (typeof res === 'number' && !isNaN(res) && isFinite(res)) {
          return Math.round(res * 100) / 100;
        }
      } catch (e) {
        // Syntax error or trailing operator
      }
      return parseFloat(clean) || 0;
    },

    renderKeypadScreen: () => {
      const displayEl = document.getElementById('keypad-display-val');
      const formulaEl = document.getElementById('keypad-formula');
      if (displayEl) {
        displayEl.innerText = UI.keypadState.displayVal || '0';
      }
      if (formulaEl) {
        formulaEl.innerHTML = UI.keypadState.formula ? UI.keypadState.formula : '&nbsp;';
      }
    },

    handleKeypadAction: (action, val) => {
      const state = UI.keypadState;

      switch (action) {
        case 'num':
          if (val === '00') {
            if (state.isFresh || state.displayVal === '0') {
              state.displayVal = '0';
            } else if (state.displayVal.length < 10) {
              state.displayVal += '00';
            }
          } else {
            if (state.isFresh || state.displayVal === '0') {
              state.displayVal = String(val);
              state.isFresh = false;
            } else if (state.displayVal.length < 12) {
              state.displayVal += String(val);
            }
          }
          break;

        case 'dot':
          if (state.isFresh) {
            state.displayVal = '0.';
            state.isFresh = false;
          } else if (!state.displayVal.includes('.')) {
            state.displayVal += '.';
          }
          break;

        case 'op': {
          const opSymbol = val === '/' ? '÷' : (val === '*' ? '×' : val);
          if (state.formula && !state.isFresh) {
            const running = UI.safeEvalMath(state.formula + state.displayVal);
            state.formula = `${running} ${opSymbol} `;
            state.displayVal = String(running);
          } else {
            state.formula = `${state.displayVal} ${opSymbol} `;
          }
          state.isFresh = true;
          break;
        }

        case 'eval':
          if (state.formula) {
            const final = UI.safeEvalMath(state.formula + state.displayVal);
            state.formula = `${state.formula} ${state.displayVal} =`;
            state.displayVal = String(final);
            state.isFresh = true;
          }
          break;

        case 'clear':
          state.displayVal = '0';
          state.formula = '';
          state.isFresh = true;
          break;

        case 'backspace':
          if (state.isFresh) {
            state.displayVal = '0';
          } else {
            state.displayVal = state.displayVal.slice(0, -1);
            if (!state.displayVal || state.displayVal === '-') {
              state.displayVal = '0';
              state.isFresh = true;
            }
          }
          break;

        case 'quickAdd': {
          const addNum = parseFloat(val) || 0;
          let base = UI.safeEvalMath(state.formula ? state.formula + state.displayVal : state.displayVal);
          base = Math.max(0, base + addNum);
          state.displayVal = String(Math.round(base * 100) / 100);
          state.formula = '';
          state.isFresh = true;
          break;
        }

        case 'balance': {
          const diff = UI.calculateKeypadBalanceDiff(state.side, state.idx);
          if (diff > 0) {
            state.displayVal = String(diff);
            state.formula = '';
            state.isFresh = true;
            PixelAudio.playCoin();
            showToast(`✨ 自動填入借貸平衡差額 $${diff}！`);
          } else {
            PixelAudio.playClick();
            showToast('目前借貸兩側已完全平衡！');
          }
          break;
        }

        case 'confirm': {
          let finalNum = UI.safeEvalMath(state.formula ? state.formula + state.displayVal : state.displayVal);
          if (finalNum < 0) finalNum = 0;

          // Update leg model
          if (state.side === 'debit') {
            currentDebitLegs[state.idx].amount = finalNum > 0 ? finalNum : '';
          } else {
            currentCreditLegs[state.idx].amount = finalNum > 0 ? finalNum : '';
          }

          // Update input field
          if (state.targetInput) {
            state.targetInput.value = finalNum > 0 ? finalNum : '';
          }

          UI.updateBalanceMetrics();

          // Check if now fully balanced to play coin sound
          const dSum = currentDebitLegs.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
          const cSum = currentCreditLegs.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0);
          if (Math.abs(dSum - cSum) < 0.0001 && dSum > 0) {
            PixelAudio.playCoin();
          } else {
            PixelAudio.playSuccess();
          }

          UI.closeKeypad();
          return;
        }
      }

      UI.renderKeypadScreen();
    }
  };
})();

