/**
 * REPTILE PIXEL ACCOUNTING (鱗帳) - DATA STORE & PERSISTENCE
 * Standard local storage persistence for standalone web application.
 */

const Store = (() => {
  const STORAGE_KEYS = {
    ACCOUNTS: 'scale_ledger_accounts_v1',
    TRANSACTIONS: 'scale_ledger_transactions_v1',
    FAVORITES: 'scale_ledger_favorites_v1',
    THEME: 'scale_ledger_theme_v1',
    CRT: 'scale_ledger_crt_v1',
    MASCOT: 'scale_ledger_mascot_v1',
    BRAND_TITLE: 'scale_ledger_brand_title_v1',
    BRAND_SUBTITLE: 'scale_ledger_brand_subtitle_v1',
    TAB_ORDER: 'scale_ledger_tab_order_v2'
  };

  const DEFAULT_TAB_ORDER = [
    'entry',
    'journal',
    'accounts',
    'balance-sheet',
    'cash-flow',
    'comparison',
    'favorites'
  ];

  // Listeners for store updates
  const listeners = [];

  function notify(eventType, payload) {
    listeners.forEach(fn => {
      try { fn(eventType, payload); } catch (e) { console.error(e); }
    });
  }

  // Initial load & seed data (with fallback migration from any temporary keys)
  function init() {
    // Accounts
    if (!localStorage.getItem(STORAGE_KEYS.ACCOUNTS)) {
      const fallbackAcc = localStorage.getItem('scale_u_usr_demo_accounts');
      if (fallbackAcc) {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, fallbackAcc);
      } else {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DefaultAccounts));
      }
    }
    // Favorites
    if (!localStorage.getItem(STORAGE_KEYS.FAVORITES)) {
      const fallbackFav = localStorage.getItem('scale_u_usr_demo_favorites');
      if (fallbackFav) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, fallbackFav);
      } else {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(DefaultFavoriteTemplates));
      }
    }
    // Transactions
    if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
      const fallbackTx = localStorage.getItem('scale_u_usr_demo_transactions');
      if (fallbackTx) {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, fallbackTx);
      } else {
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(generateSeedTransactions()));
      }
    }
    // Theme
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      const fallbackTheme = localStorage.getItem('scale_u_usr_demo_theme');
      localStorage.setItem(STORAGE_KEYS.THEME, fallbackTheme || 'obsidian-dark');
    }
    // Mascot
    if (!localStorage.getItem(STORAGE_KEYS.MASCOT)) {
      const fallbackMascot = localStorage.getItem('scale_u_usr_demo_mascot');
      localStorage.setItem(STORAGE_KEYS.MASCOT, fallbackMascot || 'bearded-dragon');
    }
    // Brand Title (預設帳簿名稱改為 ？？？)
    const storedTitle = localStorage.getItem(STORAGE_KEYS.BRAND_TITLE);
    if (!storedTitle || storedTitle === '鱗帳 REPTILE LEDGER') {
      const fallbackTitle = localStorage.getItem('scale_u_usr_demo_brand_title');
      localStorage.setItem(STORAGE_KEYS.BRAND_TITLE, (fallbackTitle && fallbackTitle !== '鱗帳 REPTILE LEDGER') ? fallbackTitle : '？？？');
    }
    // Brand Subtitle
    if (!localStorage.getItem(STORAGE_KEYS.BRAND_SUBTITLE)) {
      const fallbackSub = localStorage.getItem('scale_u_usr_demo_brand_subtitle');
      localStorage.setItem(STORAGE_KEYS.BRAND_SUBTITLE, fallbackSub || '8-BIT 複式記帳系統');
    }
    // Tab Order
    if (!localStorage.getItem(STORAGE_KEYS.TAB_ORDER)) {
      const fallbackOrder = localStorage.getItem('scale_u_usr_demo_tab_order');
      localStorage.setItem(STORAGE_KEYS.TAB_ORDER, fallbackOrder || JSON.stringify(DEFAULT_TAB_ORDER));
    }
  }

  init();

  return {
    subscribe: (callback) => {
      listeners.push(callback);
      return () => {
        const idx = listeners.indexOf(callback);
        if (idx !== -1) listeners.splice(idx, 1);
      };
    },

    // ==========================================
    // TAB ORDER CUSTOMIZATION
    // ==========================================
    getTabOrder: () => {
      try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.TAB_ORDER));
        if (Array.isArray(saved) && saved.length > 0) {
          const combined = saved.filter(id => id !== 'ledger');
          DEFAULT_TAB_ORDER.forEach(id => {
            if (!combined.includes(id)) combined.push(id);
          });
          return combined.filter(id => DEFAULT_TAB_ORDER.includes(id));
        }
      } catch (e) {}
      return [...DEFAULT_TAB_ORDER];
    },

    setTabOrder: (orderArray) => {
      if (Array.isArray(orderArray)) {
        localStorage.setItem(STORAGE_KEYS.TAB_ORDER, JSON.stringify(orderArray));
        notify('tab_order_change', orderArray);
      }
    },

    resetTabOrder: () => {
      localStorage.setItem(STORAGE_KEYS.TAB_ORDER, JSON.stringify(DEFAULT_TAB_ORDER));
      notify('tab_order_change', [...DEFAULT_TAB_ORDER]);
      return [...DEFAULT_TAB_ORDER];
    },

    // ==========================================
    // BRANDING & MASCOT CUSTOMIZATION
    // ==========================================
    getMascot: () => localStorage.getItem(STORAGE_KEYS.MASCOT) || 'bearded-dragon',
    setMascot: (mascotId) => {
      localStorage.setItem(STORAGE_KEYS.MASCOT, mascotId);
      notify('mascot_change', mascotId);
    },

    getBrandTitle: () => {
      const val = localStorage.getItem(STORAGE_KEYS.BRAND_TITLE);
      if (!val || val === '鱗帳 REPTILE LEDGER') return '？？？';
      return val;
    },
    setBrandTitle: (title) => {
      const val = title.trim() || '？？？';
      localStorage.setItem(STORAGE_KEYS.BRAND_TITLE, val);
      notify('brand_change', { title: val });
    },

    getBrandSubtitle: () => localStorage.getItem(STORAGE_KEYS.BRAND_SUBTITLE) || '8-BIT 複式記帳系統',
    setBrandSubtitle: (subtitle) => {
      const val = subtitle.trim() || '8-BIT 複式記帳系統';
      localStorage.setItem(STORAGE_KEYS.BRAND_SUBTITLE, val);
      notify('brand_change', { subtitle: val });
    },

    // ==========================================
    // THEME & DISPLAY
    // ==========================================
    getTheme: () => localStorage.getItem(STORAGE_KEYS.THEME) || 'obsidian-dark',
    setTheme: (themeName) => {
      localStorage.setItem(STORAGE_KEYS.THEME, themeName);
      document.documentElement.setAttribute('data-theme', themeName);
      notify('theme_change', themeName);
    },

    getCrtEnabled: () => localStorage.getItem(STORAGE_KEYS.CRT) === 'true',
    setCrtEnabled: (enabled) => {
      localStorage.setItem(STORAGE_KEYS.CRT, enabled);
      if (enabled) {
        document.body.classList.add('crt-enabled');
      } else {
        document.body.classList.remove('crt-enabled');
      }
      notify('crt_change', enabled);
    },

    // ==========================================
    // ACCOUNTS CRUD
    // ==========================================
    getAccounts: () => {
      try {
        const accs = JSON.parse(localStorage.getItem(STORAGE_KEYS.ACCOUNTS));
        const list = Array.isArray(accs) && accs.length > 0 ? accs : DefaultAccounts;
        return list.filter(a => a.category !== 'equity').map(a => ({
          ...a,
          excludeFromReports: Boolean(a.excludeFromReports)
        }));
      } catch (e) {
        return DefaultAccounts.filter(a => a.category !== 'equity').map(a => ({
          ...a,
          excludeFromReports: Boolean(a.excludeFromReports)
        }));
      }
    },

    getAccountById: (id) => {
      const accounts = Store.getAccounts();
      return accounts.find(a => a.id === id);
    },

    addAccount: (account) => {
      const accounts = Store.getAccounts();
      if (accounts.some(a => a.code === account.code)) {
        throw new Error(`科目代碼 ${account.code} 已存在！`);
      }
      account.id = account.id || ('acc_' + Date.now());
      account.initialBalance = Number(account.initialBalance) || 0;
      account.excludeFromReports = Boolean(account.excludeFromReports);
      accounts.push(account);
      accounts.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      notify('accounts_updated', accounts);
      return account;
    },

    updateAccount: (id, updateData) => {
      const accounts = Store.getAccounts();
      const idx = accounts.findIndex(a => a.id === id);
      if (idx === -1) throw new Error('找不到該會計科目');
      if (updateData.code && updateData.code !== accounts[idx].code) {
        if (accounts.some(a => a.code === updateData.code && a.id !== id)) {
          throw new Error(`科目代碼 ${updateData.code} 已被其他科目使用！`);
        }
      }
      if (updateData.initialBalance !== undefined) {
        updateData.initialBalance = Number(updateData.initialBalance) || 0;
      }
      if (updateData.excludeFromReports !== undefined) {
        updateData.excludeFromReports = Boolean(updateData.excludeFromReports);
      }
      if (updateData.category && typeof AccountingConstants !== 'undefined' && AccountingConstants.CATEGORIES[updateData.category]) {
        updateData.normalBalance = AccountingConstants.CATEGORIES[updateData.category].normalBalance;
      }
      accounts[idx] = { ...accounts[idx], ...updateData };

      // If category changed, synchronize child accounts
      if (updateData.category) {
        accounts.forEach(a => {
          if (a.parentId === id) {
            a.category = updateData.category;
            if (updateData.normalBalance) {
              a.normalBalance = updateData.normalBalance;
            }
          }
        });
      }

      accounts.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true, sensitivity: 'base' }));
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      notify('accounts_updated', accounts);
      return accounts[idx];
    },

    deleteAccount: (id, force = false) => {
      const accounts = Store.getAccounts();
      const acc = accounts.find(a => a.id === id);
      if (!acc) throw new Error('找不到該會計科目');

      const transactions = Store.getTransactions();
      const usedTx = transactions.filter(tx => 
        tx.legs.some(leg => leg.accountId === id)
      );

      if (usedTx.length > 0 && !force) {
        const err = new Error(`科目 [${acc.code} ${acc.name}] 已經有 ${usedTx.length} 筆交易分錄紀錄！`);
        err.isUsed = true;
        err.usedCount = usedTx.length;
        throw err;
      }

      if (force && usedTx.length > 0) {
        const usedTxIds = new Set(usedTx.map(t => t.id));
        const remainingTx = transactions.filter(t => !usedTxIds.has(t.id));
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(remainingTx));
        notify('transactions_updated', remainingTx);
      }

      try {
        const favorites = Store.getFavorites();
        let favChanged = false;
        favorites.forEach(fav => {
          if (fav.legs && fav.legs.some(l => l.accountId === id)) {
            fav.legs = fav.legs.filter(l => l.accountId !== id);
            favChanged = true;
          }
        });
        if (favChanged) {
          localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
          notify('favorites_updated', favorites);
        }
      } catch (e) {
        console.warn('Favorite templates cleanup error:', e);
      }

      const updated = accounts.filter(a => a.id !== id);
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(updated));
      notify('accounts_updated', updated);
      return true;
    },

    // ==========================================
    // TRANSACTIONS CRUD (JOURNAL ENTRIES)
    // ==========================================
    getTransactions: () => {
      try {
        const txs = JSON.parse(localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) || [];
        return txs.sort((a, b) => {
          if (a.date !== b.date) return b.date.localeCompare(a.date);
          return (b.voucherNo || '').localeCompare(a.voucherNo || '');
        });
      } catch (e) {
        return [];
      }
    },

    getTransactionById: (id) => {
      const txs = Store.getTransactions();
      return txs.find(t => t.id === id);
    },

    addTransaction: (tx) => {
      const txs = Store.getTransactions();
      if (!tx.id) tx.id = 'tx_' + Date.now();
      if (!tx.createdAt) tx.createdAt = Date.now();

      if (!tx.voucherNo) {
        const sameDayCount = txs.filter(t => t.date === tx.date).length + 1;
        tx.voucherNo = `V${String(sameDayCount).padStart(2, '0')}`;
      }

      txs.push(tx);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
      notify('transactions_updated', txs);
      return tx;
    },

    updateTransaction: (id, updateData) => {
      const txs = Store.getTransactions();
      const idx = txs.findIndex(t => t.id === id);
      if (idx === -1) throw new Error('找不到該交易分錄');
      txs[idx] = { ...txs[idx], ...updateData };
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
      notify('transactions_updated', txs);
      return txs[idx];
    },

    deleteTransaction: (id) => {
      const txs = Store.getTransactions();
      const updated = txs.filter(t => t.id !== id);
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
      notify('transactions_updated', updated);
      return true;
    },

    // ==========================================
    // FAVORITE PRESETS CRUD (常用分錄)
    // ==========================================
    getFavorites: () => {
      try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
      } catch (e) {
        return DefaultFavoriteTemplates;
      }
    },

    addFavorite: (tpl) => {
      const favs = Store.getFavorites();
      if (!tpl.id) tpl.id = 'tpl_' + Date.now();
      favs.push(tpl);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      notify('favorites_updated', favs);
      return tpl;
    },

    getFavoriteById: (id) => {
      const favs = Store.getFavorites();
      return favs.find(f => f.id === id);
    },

    updateFavorite: (id, updateData) => {
      const favs = Store.getFavorites();
      const idx = favs.findIndex(f => f.id === id);
      if (idx === -1) throw new Error('找不到該常用分錄模板');
      favs[idx] = { ...favs[idx], ...updateData };
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favs));
      notify('favorites_updated', favs);
      return favs[idx];
    },

    deleteFavorite: (id) => {
      const favs = Store.getFavorites();
      const updated = favs.filter(f => f.id !== id);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
      notify('favorites_updated', updated);
      return true;
    },

    // ==========================================
    // DATA EXPORT & IMPORT & RESET
    // ==========================================
    exportBackup: () => {
      return {
        version: '2.0',
        exportedAt: new Date().toISOString(),
        platform: 'Reptile Ledger Web Edition',
        accounts: Store.getAccounts(),
        transactions: Store.getTransactions(),
        favorites: Store.getFavorites(),
        theme: Store.getTheme()
      };
    },

    importBackup: (backupData) => {
      if (!backupData || !Array.isArray(backupData.accounts) || !Array.isArray(backupData.transactions)) {
        throw new Error('備份檔案格式不正確，缺少會計科目或交易資料！');
      }
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(backupData.accounts));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(backupData.transactions));
      if (Array.isArray(backupData.favorites)) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(backupData.favorites));
      }
      if (backupData.theme) {
        Store.setTheme(backupData.theme);
      }
      notify('all_data_reset');
      return true;
    },

    resetToDemo: () => {
      localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(DefaultAccounts));
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(generateSeedTransactions()));
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(DefaultFavoriteTemplates));
      notify('all_data_reset');
    }
  };
})();
