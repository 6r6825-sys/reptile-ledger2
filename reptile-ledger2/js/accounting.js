/**
 * REPTILE PIXEL ACCOUNTING (鱗帳) - ACCOUNTING CALCULATION ENGINE
 * Implements strict double-entry ledger math, journal formatting,
 * P&L income statements, and comparative time analysis.
 */

const AccountingEngine = (() => {

  // Helper to check if a date string 'YYYY-MM-DD' falls within [start, end]
  function isDateInRange(dateStr, startDate, endDate) {
    if (startDate && dateStr < startDate) return false;
    if (endDate && dateStr > endDate) return false;
    return true;
  }

  // Helper to compute account net activity or balance
  function computeAccountDelta(category, normalBalance, debitSum, creditSum) {
    if (normalBalance === 'debit') {
      return debitSum - creditSum;
    } else {
      return creditSum - debitSum;
    }
  }

  return {
    // ==========================================
    // 1. 日記帳 (GENERAL JOURNAL)
    // ==========================================
    getJournalEntries: (filters = {}) => {
      const { startDate, endDate, keyword, accountId } = filters;
      const allTx = Store.getTransactions();
      const accountsMap = new Map(Store.getAccounts().map(a => [a.id, a]));

      // Filter transactions
      const filtered = allTx.filter(tx => {
        if (!isDateInRange(tx.date, startDate, endDate)) return false;

        if (accountId) {
          const hasAccount = tx.legs.some(l => l.accountId === accountId);
          if (!hasAccount) return false;
        }

        if (keyword) {
          const kw = keyword.toLowerCase();
          const matchVoucher = tx.voucherNo && (
            tx.voucherNo.toLowerCase().includes(kw) ||
            tx.voucherNo.slice(-2).toLowerCase().includes(kw) ||
            ('v' + tx.voucherNo.slice(-2)).toLowerCase().includes(kw)
          );
          const matchDesc = tx.description && tx.description.toLowerCase().includes(kw);
          const matchLegAccount = tx.legs.some(l => {
            const acc = accountsMap.get(l.accountId);
            return (acc && (acc.name.toLowerCase().includes(kw) || acc.code.includes(kw))) ||
                   (l.note && l.note.toLowerCase().includes(kw));
          });
          if (!matchVoucher && !matchDesc && !matchLegAccount) return false;
        }

        return true;
      });

      // Compute statistics for the filtered journal
      let totalJournalDebit = 0;
      let totalJournalCredit = 0;

      const entries = filtered.map(tx => {
        const debitLegs = [];
        const creditLegs = [];

        tx.legs.forEach(leg => {
          const acc = accountsMap.get(leg.accountId) || { code: '????', name: '未知科目' };
          const formattedLeg = {
            accountId: leg.accountId,
            accountCode: acc.code,
            accountName: acc.name,
            accountCategory: acc.category,
            amount: leg.amount,
            note: leg.note || ''
          };

          if (leg.type === 'debit') {
            debitLegs.push(formattedLeg);
            totalJournalDebit += leg.amount;
          } else {
            creditLegs.push(formattedLeg);
            totalJournalCredit += leg.amount;
          }
        });

        return {
          id: tx.id,
          date: tx.date,
          voucherNo: tx.voucherNo,
          description: tx.description,
          debitLegs,
          creditLegs,
          totalDebit: tx.totalDebit || debitLegs.reduce((s, l) => s + l.amount, 0),
          totalCredit: tx.totalCredit || creditLegs.reduce((s, l) => s + l.amount, 0)
        };
      });

      return {
        entries,
        totalEntries: entries.length,
        totalDebit: totalJournalDebit,
        totalCredit: totalJournalCredit
      };
    },

    // ==========================================
    // 2. 分類帳 (GENERAL LEDGER / T-ACCOUNT)
    // ==========================================
    getGeneralLedger: (accountId, startDate, endDate) => {
      const account = Store.getAccountById(accountId);
      if (!account) return null;

      const allTx = Store.getTransactions();
      // Sort ascending by date for ledger calculation
      const sortedTx = [...allTx].sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.voucherNo || '').localeCompare(b.voucherNo || '');
      });

      // 1. Calculate Beginning Balance (期初餘額 before startDate + account initialBalance)
      let initialDebitSum = 0;
      let initialCreditSum = 0;
      const baseInitial = Number(account.initialBalance) || 0;

      const periodTransactions = [];

      sortedTx.forEach(tx => {
        const legsForAccount = tx.legs.filter(l => l.accountId === accountId);
        if (legsForAccount.length === 0) return;

        legsForAccount.forEach(leg => {
          if (startDate && tx.date < startDate) {
            // Prior period -> goes into initial balance
            if (leg.type === 'debit') initialDebitSum += leg.amount;
            else initialCreditSum += leg.amount;
          } else if (isDateInRange(tx.date, startDate, endDate)) {
            // In current period
            periodTransactions.push({
              txId: tx.id,
              date: tx.date,
              voucherNo: tx.voucherNo,
              description: tx.description,
              note: leg.note,
              type: leg.type,
              amount: leg.amount
            });
          }
        });
      });

      let priorDelta = 0;
      if (account.normalBalance === 'debit') {
        priorDelta = initialDebitSum - initialCreditSum;
      } else {
        priorDelta = initialCreditSum - initialDebitSum;
      }

      const initialBalance = baseInitial + priorDelta;

      // 2. Calculate running balances line-by-line
      let runningBalance = initialBalance;
      let periodTotalDebit = 0;
      let periodTotalCredit = 0;

      const ledgerLines = periodTransactions.map(item => {
        const debitAmt = item.type === 'debit' ? item.amount : 0;
        const creditAmt = item.type === 'credit' ? item.amount : 0;

        periodTotalDebit += debitAmt;
        periodTotalCredit += creditAmt;

        if (account.normalBalance === 'debit') {
          runningBalance += debitAmt - creditAmt;
        } else {
          runningBalance += creditAmt - debitAmt;
        }

        return {
          txId: item.txId,
          date: item.date,
          voucherNo: item.voucherNo,
          description: item.description,
          note: item.note,
          debit: debitAmt,
          credit: creditAmt,
          direction: runningBalance >= 0 ? (account.normalBalance === 'debit' ? '借' : '貸') : (account.normalBalance === 'debit' ? '貸' : '借'),
          balance: Math.abs(runningBalance)
        };
      });

      const endingBalance = runningBalance;

      return {
        account,
        initialBalance: Math.abs(initialBalance),
        initialDirection: initialBalance >= 0 ? (account.normalBalance === 'debit' ? '借' : '貸') : (account.normalBalance === 'debit' ? '貸' : '借'),
        lines: ledgerLines,
        periodTotalDebit,
        periodTotalCredit,
        endingBalance: Math.abs(endingBalance),
        endingDirection: endingBalance >= 0 ? (account.normalBalance === 'debit' ? '借' : '貸') : (account.normalBalance === 'debit' ? '貸' : '借')
      };
    },

    // ==========================================
    // 3. 損益表 (INCOME STATEMENT / P&L)
    // ==========================================
    getIncomeStatement: (startDate, endDate, options = {}) => {
      const includeExcluded = options && options.includeExcluded === true;
      const accounts = Store.getAccounts();
      const allTx = Store.getTransactions();

      const excludedAccounts = accounts.filter(a => (a.category === 'revenue' || a.category === 'expense') && a.excludeFromReports);
      const revenueAccounts = accounts.filter(a => a.category === 'revenue' && (includeExcluded || !a.excludeFromReports));
      const expenseAccounts = accounts.filter(a => a.category === 'expense' && (includeExcluded || !a.excludeFromReports));

      // Accumulator maps for accounts: id -> amount
      const revenueMap = new Map(revenueAccounts.map(a => [a.id, 0]));
      const expenseMap = new Map(expenseAccounts.map(a => [a.id, 0]));

      allTx.forEach(tx => {
        if (!isDateInRange(tx.date, startDate, endDate)) return;

        tx.legs.forEach(leg => {
          if (revenueMap.has(leg.accountId)) {
            // Revenue normal balance is Credit
            const curr = revenueMap.get(leg.accountId);
            if (leg.type === 'credit') {
              revenueMap.set(leg.accountId, curr + leg.amount);
            } else {
              revenueMap.set(leg.accountId, curr - leg.amount);
            }
          } else if (expenseMap.has(leg.accountId)) {
            // Expense normal balance is Debit
            const curr = expenseMap.get(leg.accountId);
            if (leg.type === 'debit') {
              expenseMap.set(leg.accountId, curr + leg.amount);
            } else {
              expenseMap.set(leg.accountId, curr - leg.amount);
            }
          }
        });
      });

      // Format Revenue breakdown
      const revenues = revenueAccounts.map(acc => ({
        id: acc.id,
        code: acc.code,
        name: acc.name,
        amount: Math.max(0, revenueMap.get(acc.id) || 0)
      })).filter(item => item.amount > 0 || true); // show all or active

      const totalRevenue = revenues.reduce((sum, item) => sum + item.amount, 0);

      // Format Expense breakdown
      const expenses = expenseAccounts.map(acc => ({
        id: acc.id,
        code: acc.code,
        name: acc.name,
        amount: Math.max(0, expenseMap.get(acc.id) || 0)
      }));

      const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);

      // Net Income = Total Revenue - Total Expense
      const netIncome = totalRevenue - totalExpense;
      const profitMargin = totalRevenue > 0 ? ((netIncome / totalRevenue) * 100).toFixed(1) : 0;

      return {
        startDate,
        endDate,
        includeExcluded,
        revenues,
        totalRevenue,
        expenses,
        totalExpense,
        netIncome,
        isProfitable: netIncome >= 0,
        profitMargin,
        excludedAccounts,
        excludedCount: excludedAccounts.length
      };
    },

    // ==========================================
    // 4. 分類帳所有科目餘額總覽 (ACCOUNTS LEDGER OVERVIEW)
    // ==========================================
    getAllAccountsLedgerSummary: (startDate, endDate) => {
      const accounts = Store.getAccounts();
      const allTx = Store.getTransactions();

      // Pre-process transactions
      const priorTx = [];
      const currentTx = [];

      allTx.forEach(tx => {
        if (startDate && tx.date < startDate) {
          priorTx.push(tx);
        } else if (isDateInRange(tx.date, startDate, endDate)) {
          currentTx.push(tx);
        }
      });

      // Calculate for each account
      const results = accounts.map(acc => {
        let initialDebit = 0;
        let initialCredit = 0;
        let periodDebit = 0;
        let periodCredit = 0;
        let periodTxCount = 0;
        const baseInitial = Number(acc.initialBalance) || 0;

        priorTx.forEach(tx => {
          tx.legs.forEach(leg => {
            if (leg.accountId === acc.id) {
              if (leg.type === 'debit') initialDebit += leg.amount;
              else initialCredit += leg.amount;
            }
          });
        });

        currentTx.forEach(tx => {
          tx.legs.forEach(leg => {
            if (leg.accountId === acc.id) {
              if (leg.type === 'debit') periodDebit += leg.amount;
              else periodCredit += leg.amount;
              periodTxCount++;
            }
          });
        });

        let priorDelta = 0;
        if (acc.normalBalance === 'debit') {
          priorDelta = initialDebit - initialCredit;
        } else {
          priorDelta = initialCredit - initialDebit;
        }

        const initialBalance = baseInitial + priorDelta;

        let endingBalanceRaw = 0;
        if (acc.normalBalance === 'debit') {
          endingBalanceRaw = initialBalance + (periodDebit - periodCredit);
        } else {
          endingBalanceRaw = initialBalance + (periodCredit - periodDebit);
        }

        const isPositive = endingBalanceRaw >= 0;
        const endingBalance = Math.abs(endingBalanceRaw);
        const endingDirection = isPositive
          ? (acc.normalBalance === 'debit' ? '借' : '貸')
          : (acc.normalBalance === 'debit' ? '貸' : '借');

        return {
          id: acc.id,
          code: acc.code,
          name: acc.name,
          category: acc.category,
          normalBalance: acc.normalBalance,
          description: acc.description,
          excludeFromReports: Boolean(acc.excludeFromReports),
          initialBalance: Math.abs(initialBalance),
          periodDebit,
          periodCredit,
          periodTxCount,
          endingBalance,
          endingDirection
        };
      });

      // Group by 4 categories (asset, liability, revenue, expense)
      const categoriesOrder = ['asset', 'liability', 'revenue', 'expense'];
      const grouped = categoriesOrder.map(catKey => {
        const catInfo = AccountingConstants.CATEGORIES[catKey];
        const accs = results.filter(r => r.category === catKey);
        const totalDebit = accs.reduce((s, a) => s + a.periodDebit, 0);
        const totalCredit = accs.reduce((s, a) => s + a.periodCredit, 0);
        const totalEnding = accs.reduce((s, a) => s + a.endingBalance, 0);

        return {
          categoryKey: catKey,
          categoryName: catInfo.name,
          categoryIcon: catInfo.icon,
          badgeClass: catInfo.badgeClass,
          accounts: accs,
          totalDebit,
          totalCredit,
          totalEnding
        };
      });

      const grandTotalDebit = results.reduce((s, a) => s + a.periodDebit, 0);
      const grandTotalCredit = results.reduce((s, a) => s + a.periodCredit, 0);

      return {
        startDate,
        endDate,
        grouped,
        allAccounts: results,
        grandTotalDebit,
        grandTotalCredit
      };
    },

    // ==========================================
    // 5. 資產負債表 (BALANCE SHEET)
    // 會計恆等式：資產 = 負債 + 權益 (+ 本期損益)
    // ==========================================
    getBalanceSheet: (asOfDate, options = {}) => {
      const includeExcluded = options && options.includeExcluded === true;
      const accounts = Store.getAccounts();
      const allTx = Store.getTransactions();

      const excludedAccounts = accounts.filter(a => (a.category === 'asset' || a.category === 'liability') && a.excludeFromReports);

      // Filter transactions up to asOfDate
      const activeTx = asOfDate ? allTx.filter(tx => tx.date <= asOfDate) : allTx;

      // Map account debit and credit sums
      const accountSums = new Map();
      accounts.forEach(a => accountSums.set(a.id, { debit: 0, credit: 0 }));

      activeTx.forEach(tx => {
        tx.legs.forEach(leg => {
          if (accountSums.has(leg.accountId)) {
            const sum = accountSums.get(leg.accountId);
            if (leg.type === 'debit') sum.debit += leg.amount;
            else sum.credit += leg.amount;
          }
        });
      });

      // 1. Assets (1xxx)
      const assetAccounts = accounts
        .filter(a => a.category === 'asset' && (includeExcluded || !a.excludeFromReports))
        .map(acc => {
          const sum = accountSums.get(acc.id) || { debit: 0, credit: 0 };
          const balance = (Number(acc.initialBalance) || 0) + (sum.debit - sum.credit);
          return {
            id: acc.id,
            code: acc.code,
            name: acc.name,
            description: acc.description,
            excludeFromReports: Boolean(acc.excludeFromReports),
            amount: Math.max(0, balance)
          };
        });
      const totalAssets = assetAccounts.reduce((s, a) => s + a.amount, 0);

      // 2. Liabilities (2xxx)
      const liabilityAccounts = accounts
        .filter(a => a.category === 'liability' && (includeExcluded || !a.excludeFromReports))
        .map(acc => {
          const sum = accountSums.get(acc.id) || { debit: 0, credit: 0 };
          const balance = (Number(acc.initialBalance) || 0) + (sum.credit - sum.debit);
          return {
            id: acc.id,
            code: acc.code,
            name: acc.name,
            description: acc.description,
            excludeFromReports: Boolean(acc.excludeFromReports),
            amount: Math.max(0, balance)
          };
        });
      const totalLiabilities = liabilityAccounts.reduce((s, a) => s + a.amount, 0);

      // Net Assets (資產 - 負債)
      const netAssets = totalAssets - totalLiabilities;

      return {
        asOfDate,
        includeExcluded,
        assetAccounts,
        totalAssets,
        liabilityAccounts,
        totalLiabilities,
        netAssets,
        excludedAccounts,
        excludedCount: excludedAccounts.length
      };
    },

    // ==========================================
    // 5.5. 資金流向表 (CASH & FUND FLOW STATEMENT)
    // 依借貸分錄自動產生，隔離內部帳戶互轉，明確區分信用卡消費與卡費扣繳
    // ==========================================
    getCashFlow: (startDate, endDate, options = {}) => {
      const includeExcluded = options && options.includeExcluded === true;
      const accounts = Store.getAccounts();
      const accountsMap = new Map(accounts.map(a => [a.id, a]));
      const allTx = Store.getTransactions();

      // Helper to identify Liquid Fund Accounts (現金、銀行存款、電子支付錢包)
      function isLiquidFund(accId) {
        const acc = accountsMap.get(accId);
        if (!acc) return false;
        if (!includeExcluded && acc.excludeFromReports) return false;
        if (acc.category !== 'asset') return false;
        const code = acc.code || '';
        const name = acc.name || '';
        return (code.startsWith('11') || name.includes('現金') || name.includes('存款') || name.includes('活存') || name.includes('支付') || name.includes('Pay') || name.includes('錢包')) &&
               !name.includes('應收') && !name.includes('代墊') && !code.startsWith('12');
      }

      // Helper to identify Credit Card Accounts (應付信用卡及其子科目分支 2120-1, 2120-2...)
      function isCreditCard(accId) {
        const acc = accountsMap.get(accId);
        if (!acc) return false;
        if (!includeExcluded && acc.excludeFromReports) return false;
        if (acc.category !== 'liability') return false;
        const code = (acc.code || '').trim();
        const name = acc.name || '';
        // 嚴格排除非信用卡之一般「應付帳款」
        if (name.includes('應付帳款') || code.startsWith('2103')) return false;

        // 包含應付信用卡及其所有子科目分支：
        // ① 代碼以 2120 或 212 開頭（如 2120, 2120-1, 2120-2, 2120-01...）
        // ② 代碼以 2101 開頭（如 2101, 2101-1, 2101-01...）
        // ③ 名稱包含「信用卡」、「卡費」、「應付信用卡」
        return code.startsWith('2120') ||
               code.startsWith('212') ||
               code.startsWith('2101') ||
               name.includes('信用卡') ||
               name.includes('卡費') ||
               name.includes('應付信用卡');
      }

      // Helper to identify Accounts Payable (應付帳款)
      function isAccountsPayable(accId) {
        const acc = accountsMap.get(accId);
        if (!acc) return false;
        if (!includeExcluded && acc.excludeFromReports) return false;
        if (acc.category !== 'liability') return false;
        if (isCreditCard(accId)) return false;
        const code = (acc.code || '').trim();
        const name = acc.name || '';
        return code.startsWith('2103') ||
               code.startsWith('2102') ||
               code.startsWith('211') ||
               name.includes('應付帳款') ||
               name.includes('應付款');
      }

      // Helper to identify Revenue Accounts (收入科目 4xxx)
      function isRevenueAccount(acc) {
        if (!acc) return false;
        const cat = acc.category || '';
        const code = String(acc.code || '').trim();
        return cat === 'revenue' || cat === 'income' || code.startsWith('4');
      }

      // Helper to identify Expense Accounts (費用科目 5xxx)
      function isExpenseAccount(acc) {
        if (!acc) return false;
        const cat = acc.category || '';
        const code = String(acc.code || '').trim();
        return cat === 'expense' || code.startsWith('5');
      }

      // Prior Liquid Funds balance calculation
      const liquidAccounts = accounts.filter(a => isLiquidFund(a.id));
      const liquidAccountIds = new Set(liquidAccounts.map(a => a.id));

      let initialLiquidFunds = 0;
      liquidAccounts.forEach(acc => {
        initialLiquidFunds += (Number(acc.initialBalance) || 0);
      });

      if (startDate) {
        allTx.forEach(tx => {
          if (tx.date < startDate) {
            tx.legs.forEach(leg => {
              if (liquidAccountIds.has(leg.accountId)) {
                if (leg.type === 'debit') initialLiquidFunds += leg.amount;
                else initialLiquidFunds -= leg.amount;
              }
            });
          }
        });
      }

      // Filter transactions within period
      const periodTx = allTx.filter(tx => isDateInRange(tx.date, startDate, endDate));
      periodTx.sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return (a.voucherNo || '').localeCompare(b.voucherNo || '');
      });

      let totalRealInflow = 0;
      let totalRealOutflow = 0;
      let totalInternalTransfers = 0;
      let totalCreditCardPurchases = 0;

      const internalTransfers = [];
      const realInflows = [];
      const realOutflows = [];
      const creditCardPurchases = [];
      const activities = [];

      const inflowCategoryMap = new Map();
      const outflowCategoryMap = new Map();

      periodTx.forEach(tx => {
        if (!includeExcluded) {
          const allExcluded = tx.legs.every(l => {
            const acc = accountsMap.get(l.accountId);
            return acc && acc.excludeFromReports;
          });
          if (allExcluded) return;
        }

        const debitLegs = tx.legs.filter(l => l.type === 'debit');
        const creditLegs = tx.legs.filter(l => l.type === 'credit');

        const fundDebits = debitLegs.filter(l => isLiquidFund(l.accountId));
        const fundCredits = creditLegs.filter(l => isLiquidFund(l.accountId));
        const cardDebits = debitLegs.filter(l => isCreditCard(l.accountId));
        const cardCredits = creditLegs.filter(l => isCreditCard(l.accountId));
        const apDebits = debitLegs.filter(l => isAccountsPayable(l.accountId));
        const apCredits = creditLegs.filter(l => isAccountsPayable(l.accountId));

        // 1. 內部資金帳戶互轉 (Internal Transfers) -> 淨額 $0，不重複計為收支，亦不列入流水帳
        if (fundDebits.length > 0 && fundCredits.length > 0) {
          fundDebits.forEach(dLeg => {
            fundCredits.forEach(cLeg => {
              const amt = Math.min(dLeg.amount, cLeg.amount);
              totalInternalTransfers += amt;
            });
          });
          return;
        }

        // 2. 信用卡轉應付帳款分錄 (Credit Card Debt to Accounts Payable Reclassification)
        // 嚴格隔離：不計入實質流出、不列入流出項目清單、不記入流水帳明細！
        const isCardToAp = (cardDebits.length > 0 && apCredits.length > 0) ||
                           (cardCredits.length > 0 && apDebits.length > 0);
        if (isCardToAp && fundDebits.length === 0 && fundCredits.length === 0) {
          return;
        }

        // 3. 銀行存款抵沖應付帳款分錄 (Bank Deposit Offsets Accounts Payable / Debt Settlement)
        // 銀行出金抵沖負債：不重複計入實質流出項目（避免與刷卡消費雙重計算），流水帳亦不記入
        const isBankOffsetAp = fundCredits.length > 0 && (apDebits.length > 0 || cardDebits.length > 0);
        if (isBankOffsetAp && fundDebits.length === 0) {
          return;
        }

        // 4. 信用卡簽帳消費 (Credit Card Purchases) -> 借：費用，貸：應付信用卡 (2120-1, 2120-2...)
        // 使用者要求：流出入項目只計入費用收入科目 其餘負債資產互沖分錄不計入
        if (cardCredits.length > 0 && fundCredits.length === 0) {
          const expenseDebits = debitLegs.filter(dLeg => isExpenseAccount(accountsMap.get(dLeg.accountId)));
          if (expenseDebits.length > 0) {
            const cardAcc = accountsMap.get(cardCredits[0].accountId) || { name: '信用卡' };
            expenseDebits.forEach(dLeg => {
              const targetAcc = accountsMap.get(dLeg.accountId) || { name: '信用卡消費' };
              const amt = dLeg.amount;
              totalCreditCardPurchases += amt;
              totalRealOutflow += amt; // 計入實質流出！

              const expName = targetAcc.name || '信用卡消費';
              outflowCategoryMap.set(expName, (outflowCategoryMap.get(expName) || 0) + amt);

              realOutflows.push({
                txId: tx.id,
                date: tx.date,
                voucherNo: tx.voucherNo,
                description: tx.description,
                fundAccountId: cardCredits[0].accountId,
                fundAccountName: cardAcc.name,
                targetAccountId: dLeg.accountId,
                targetAccountName: targetAcc.name,
                category: expName,
                amount: amt,
                isCreditCard: true,
                note: dLeg.note || tx.description || ''
              });

              activities.push({
                txId: tx.id,
                date: tx.date,
                voucherNo: tx.voucherNo,
                type: 'outflow',
                paymentType: 'credit_card',
                typeName: '信用卡',
                badgeClass: 'badge-warning',
                paymentMethod: cardAcc.name,
                item: expName,
                amount: amt,
                sign: '－',
                impact: -amt,
                description: tx.description,
                note: dLeg.note || tx.description || ''
              });
            });
          }
          return;
        }

        // 5. 實質資金流入 (Real Cash Inflows) -> 薪資、接案、投資等入帳
        // 使用者要求：流出入項目只計入費用收入科目 其餘負債資產互沖分錄不計入
        if (fundDebits.length > 0 && fundCredits.length === 0) {
          // 只計入「收入科目」，其餘資產/負債互沖（如應收帳款收回、向銀行/他人借款等）絕對不計入！
          const revenueCredits = creditLegs.filter(cLeg => isRevenueAccount(accountsMap.get(cLeg.accountId)));
          if (revenueCredits.length > 0) {
            const fundAcc = accountsMap.get(fundDebits[0].accountId) || { name: '資金帳戶' };
            revenueCredits.forEach(cLeg => {
              const srcAcc = accountsMap.get(cLeg.accountId) || { name: '收入/來源' };
              const amt = cLeg.amount;
              totalRealInflow += amt;

              const srcName = srcAcc.name || '實質收入';
              inflowCategoryMap.set(srcName, (inflowCategoryMap.get(srcName) || 0) + amt);

              realInflows.push({
                txId: tx.id,
                date: tx.date,
                voucherNo: tx.voucherNo,
                description: tx.description,
                fundAccountId: fundDebits[0].accountId,
                fundAccountName: fundAcc.name,
                sourceAccountId: cLeg.accountId,
                sourceAccountName: srcAcc.name,
                sourceCategory: srcAcc.category,
                amount: amt,
                note: cLeg.note || tx.description
              });

              activities.push({
                txId: tx.id,
                date: tx.date,
                voucherNo: tx.voucherNo,
                type: 'inflow',
                paymentType: 'liquid_fund',
                typeName: '實質流入',
                badgeClass: 'badge-credit',
                paymentMethod: fundAcc.name,
                item: srcAcc.name,
                amount: amt,
                sign: '＋',
                impact: amt,
                description: tx.description,
                note: cLeg.note || tx.description
              });
            });
          }
          return;
        }

        // 6. 實質直接資金流出 (Real Direct Outflows) -> 現金/銀行直接支付生活各項費用
        // 使用者要求：流出入項目只計入費用收入科目 其餘負債資產互沖分錄不計入
        if (fundCredits.length > 0 && fundDebits.length === 0 && !isBankOffsetAp) {
          // 只計入「費用科目」，其餘資產/負債互沖（如購買設備、借款償還、代墊款等）絕對不計入！
          const expenseDebits = debitLegs.filter(dLeg => isExpenseAccount(accountsMap.get(dLeg.accountId)));
          if (expenseDebits.length > 0) {
            const fundAcc = accountsMap.get(fundCredits[0].accountId) || { name: '資金帳戶' };
            expenseDebits.forEach(dLeg => {
              const targetAcc = accountsMap.get(dLeg.accountId) || { name: '費用/支出' };
              const amt = dLeg.amount;
              totalRealOutflow += amt;

              const targetName = targetAcc.name || '其他直接支出';
              outflowCategoryMap.set(targetName, (outflowCategoryMap.get(targetName) || 0) + amt);

              realOutflows.push({
                txId: tx.id,
                date: tx.date,
                voucherNo: tx.voucherNo,
                description: tx.description,
                fundAccountId: fundCredits[0].accountId,
                fundAccountName: fundAcc.name,
                targetAccountId: dLeg.accountId,
                targetAccountName: targetAcc.name,
                targetCategory: targetAcc.category,
                amount: amt,
                isCreditCard: false,
                note: dLeg.note || tx.description
              });

              activities.push({
                txId: tx.id,
                date: tx.date,
                voucherNo: tx.voucherNo,
                type: 'outflow',
                paymentType: 'liquid_fund',
                typeName: '現金/存款',
                badgeClass: 'badge-debit',
                paymentMethod: fundAcc.name,
                item: targetAcc.name,
                amount: amt,
                sign: '－',
                impact: -amt,
                description: tx.description,
                note: dLeg.note || tx.description
              });
            });
          }
        }
      });

      const netCashFlow = totalRealInflow - totalRealOutflow;
      const endingLiquidFunds = initialLiquidFunds + netCashFlow;

      // ==========================================
      // 7. 信用卡狀態 (CREDIT CARD STATUS)
      // 使用者要求：信用卡狀態不受日期影響，只受分錄影響！
      // ① 已出帳金額 (Billed Amount)：信用卡轉應付帳款分錄 (或直接貸記應付帳款)
      // ② 未出帳金額 (Unbilled Amount)：應付信用卡科目及其子分支總餘額
      // ③ 本期已扣繳金額 (Settled Amount)：銀行存款抵沖應付帳款或信用卡負債分錄
      // ==========================================
      let totalBilledAmount = 0;          // 已出帳金額
      let totalSettledAmount = 0;         // 本期已扣繳金額
      let unbilledCreditCardLiability = 0; // 未出帳金額

      // (A) 遍歷所有分錄 (allTx) 計算已出帳金額與已扣繳金額 (不受日期影響，只受分錄影響)
      allTx.forEach(tx => {
        if (!includeExcluded) {
          const allExcluded = tx.legs.every(l => {
            const acc = accountsMap.get(l.accountId);
            return acc && acc.excludeFromReports;
          });
          if (allExcluded) return;
        }

        const debitLegs = tx.legs.filter(l => l.type === 'debit');
        const creditLegs = tx.legs.filter(l => l.type === 'credit');

        const fundDebits = debitLegs.filter(l => isLiquidFund(l.accountId));
        const fundCredits = creditLegs.filter(l => isLiquidFund(l.accountId));
        const cardDebits = debitLegs.filter(l => isCreditCard(l.accountId));
        const cardCredits = creditLegs.filter(l => isCreditCard(l.accountId));
        const apDebits = debitLegs.filter(l => isAccountsPayable(l.accountId));
        const apCredits = creditLegs.filter(l => isAccountsPayable(l.accountId));

        // ① 已出帳金額：信用卡轉應付帳款分錄 (Credit Card -> AP) 或直接貸記應付帳款
        const isCardToAp = (cardDebits.length > 0 && apCredits.length > 0) ||
                           (cardCredits.length > 0 && apDebits.length > 0);
        if (isCardToAp && fundDebits.length === 0 && fundCredits.length === 0) {
          apCredits.forEach(cLeg => {
            totalBilledAmount += cLeg.amount;
          });
        } else if (apCredits.length > 0 && fundCredits.length === 0) {
          apCredits.forEach(cLeg => {
            totalBilledAmount += cLeg.amount;
          });
        }

        // ② 本期已扣繳金額：銀行存款抵沖應付帳款或應付信用卡分錄 (Bank -> AP / Card)
        const isBankOffsetAp = fundCredits.length > 0 && (apDebits.length > 0 || cardDebits.length > 0);
        if (isBankOffsetAp && fundDebits.length === 0) {
          const fundCreditSum = fundCredits.reduce((s, l) => s + l.amount, 0);
          const debitedLiabSum = debitLegs
            .filter(l => isAccountsPayable(l.accountId) || isCreditCard(l.accountId))
            .reduce((s, l) => s + l.amount, 0);
          totalSettledAmount += Math.min(fundCreditSum, debitedLiabSum);
        }
      });

      // (B) 計算未出帳金額：應付信用卡(包含其子科目)帳面總餘額 (不受日期影響，只受分錄影響)
      const cardAccounts = accounts.filter(a => isCreditCard(a.id));
      cardAccounts.forEach(cardAcc => {
        let bal = Number(cardAcc.initialBalance) || 0;
        allTx.forEach(tx => {
          if (!includeExcluded) {
            const allExcluded = tx.legs.every(l => {
              const acc = accountsMap.get(l.accountId);
              return acc && acc.excludeFromReports;
            });
            if (allExcluded) return;
          }
          tx.legs.forEach(leg => {
            if (leg.accountId === cardAcc.id) {
              if (leg.type === 'credit') bal += leg.amount;
              else if (leg.type === 'debit') bal -= leg.amount;
            }
          });
        });
        unbilledCreditCardLiability += Math.max(0, bal);
      });

      const inflowBreakdown = Array.from(inflowCategoryMap.entries()).map(([name, amount]) => ({
        name,
        amount,
        percentage: totalRealInflow > 0 ? ((amount / totalRealInflow) * 100).toFixed(1) : 0
      })).sort((a, b) => b.amount - a.amount);

      const outflowBreakdown = Array.from(outflowCategoryMap.entries()).map(([name, amount]) => ({
        name,
        amount,
        percentage: totalRealOutflow > 0 ? ((amount / totalRealOutflow) * 100).toFixed(1) : 0
      })).sort((a, b) => b.amount - a.amount);

      const fundAccountsOverview = liquidAccounts.map(acc => {
        let bal = Number(acc.initialBalance) || 0;
        allTx.forEach(tx => {
          if (!endDate || tx.date <= endDate) {
            tx.legs.forEach(leg => {
              if (leg.accountId === acc.id) {
                if (leg.type === 'debit') bal += leg.amount;
                else bal -= leg.amount;
              }
            });
          }
        });
        return {
          id: acc.id,
          code: acc.code,
          name: acc.name,
          balance: bal
        };
      });

      const excludedAccounts = accounts.filter(a => a.excludeFromReports);

      return {
        startDate,
        endDate,
        includeExcluded,
        kpi: {
          beginningFunds: Math.max(0, initialLiquidFunds),
          totalInflow: totalRealInflow,
          totalOutflow: totalRealOutflow,
          netFlow: netCashFlow,
          isSurplus: netCashFlow >= 0,
          endingFunds: Math.max(0, endingLiquidFunds)
        },
        inflowBreakdown,
        outflowBreakdown,
        internalTransfers: {
          list: internalTransfers,
          totalAmount: totalInternalTransfers,
          netImpact: 0
        },
        creditCardSummary: {
          billedAmount: totalBilledAmount,
          unbilledAmount: unbilledCreditCardLiability,
          settledAmount: totalSettledAmount,
          // Compatibility aliases
          accountsPayableAmount: totalBilledAmount,
          bankOffsetApAmount: totalSettledAmount,
          endingCreditCardLiability: unbilledCreditCardLiability,
          purchases: totalBilledAmount,
          payments: totalSettledAmount,
          outstandingLiability: unbilledCreditCardLiability,
          purchasesList: creditCardPurchases
        },
        fundAccounts: fundAccountsOverview,
        activities: activities.reverse(),
        excludedAccounts,
        excludedCount: excludedAccounts.length
      };
    },

    // ==========================================
    // 6. 試算表 (TRIAL BALANCE)
    // ==========================================
    getTrialBalance: (asOfDate) => {
      const accounts = Store.getAccounts();
      const allTx = Store.getTransactions();

      const accountBalances = accounts.map(acc => {
        let debitSum = 0;
        let creditSum = 0;
        const baseInitial = Number(acc.initialBalance) || 0;
        if (acc.normalBalance === 'debit') {
          debitSum += baseInitial;
        } else {
          creditSum += baseInitial;
        }

        allTx.forEach(tx => {
          if (asOfDate && tx.date > asOfDate) return;
          tx.legs.forEach(leg => {
            if (leg.accountId === acc.id) {
              if (leg.type === 'debit') debitSum += leg.amount;
              else creditSum += leg.amount;
            }
          });
        });

        const netDebit = Math.max(0, debitSum - creditSum);
        const netCredit = Math.max(0, creditSum - debitSum);

        return {
          id: acc.id,
          code: acc.code,
          name: acc.name,
          category: acc.category,
          debitSum: netDebit,
          creditSum: netCredit
        };
      });

      const totalDebit = accountBalances.reduce((s, a) => s + a.debitSum, 0);
      const totalCredit = accountBalances.reduce((s, a) => s + a.creditSum, 0);

      return {
        asOfDate,
        accounts: accountBalances,
        totalDebit,
        totalCredit,
        isBalanced: totalDebit === totalCredit
      };
    },

    // ==========================================
    // 5. 科目跨期比較分析 (COMPARATIVE TIME ANALYSIS)
    // ==========================================
    // Mode A: Multi-Month Trend Analysis (e.g. past 6 or 12 months)
    getAccountMonthlyTrend: (accountId, numMonths = 6) => {
      const account = Store.getAccountById(accountId);
      if (!account) return null;

      const allTx = Store.getTransactions();
      const now = new Date();
      const monthsData = [];

      // Generate last N months in chronological order
      for (let i = numMonths - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth();
        const monthKey = `${y}-${String(m + 1).padStart(2, '0')}`;
        const monthLabel = `${y}年${m + 1}月`;

        // Start and end date of that month
        const startDate = `${monthKey}-01`;
        const lastDay = new Date(y, m + 1, 0).getDate();
        const endDate = `${monthKey}-${String(lastDay).padStart(2, '0')}`;

        // Compute activity in this month
        let debitSum = 0;
        let creditSum = 0;
        let txCount = 0;

        allTx.forEach(tx => {
          if (tx.date >= startDate && tx.date <= endDate) {
            tx.legs.forEach(leg => {
              if (leg.accountId === accountId) {
                if (leg.type === 'debit') debitSum += leg.amount;
                else creditSum += leg.amount;
                txCount++;
              }
            });
          }
        });

        // For expenses: activity is Debit - Credit
        // For revenues: activity is Credit - Debit
        // For assets: net change = Debit - Credit
        // For liabilities: net change = Credit - Debit
        let amount = 0;
        if (account.normalBalance === 'debit') {
          amount = Math.max(0, debitSum - creditSum);
        } else {
          amount = Math.max(0, creditSum - debitSum);
        }

        monthsData.push({
          monthKey,
          label: monthLabel,
          amount,
          txCount
        });
      }

      // Calculate growth and changes
      for (let i = 0; i < monthsData.length; i++) {
        if (i === 0) {
          monthsData[i].growthPercent = 0;
          monthsData[i].diffAmount = 0;
        } else {
          const prev = monthsData[i - 1].amount;
          const curr = monthsData[i].amount;
          monthsData[i].diffAmount = curr - prev;
          monthsData[i].growthPercent = prev === 0 ? (curr > 0 ? 100 : 0) : (((curr - prev) / prev) * 100);
        }
      }

      const maxAmount = Math.max(...monthsData.map(m => m.amount), 1);
      const totalAmount = monthsData.reduce((s, m) => s + m.amount, 0);
      const avgAmount = Math.round(totalAmount / monthsData.length);

      return {
        account,
        monthsData,
        maxAmount,
        totalAmount,
        avgAmount
      };
    },

    // Mode B: Period A vs Period B Strict Comparison
    compareAccountTwoPeriods: (accountId, periodA, periodB) => {
      const account = Store.getAccountById(accountId);
      if (!account) return null;

      const allTx = Store.getTransactions();

      function getPeriodMetrics(period) {
        let debitSum = 0;
        let creditSum = 0;
        const matchingTx = [];

        allTx.forEach(tx => {
          if (isDateInRange(tx.date, period.startDate, period.endDate)) {
            const legs = tx.legs.filter(l => l.accountId === accountId);
            if (legs.length > 0) {
              legs.forEach(leg => {
                if (leg.type === 'debit') debitSum += leg.amount;
                else creditSum += leg.amount;
              });
              matchingTx.push(tx);
            }
          }
        });

        const netAmount = account.normalBalance === 'debit'
          ? Math.max(0, debitSum - creditSum)
          : Math.max(0, creditSum - debitSum);

        return {
          netAmount,
          debitSum,
          creditSum,
          count: matchingTx.length,
          transactions: matchingTx
        };
      }

      const metricsA = getPeriodMetrics(periodA);
      const metricsB = getPeriodMetrics(periodB);

      const diffAmount = metricsA.netAmount - metricsB.netAmount;
      let diffPercent = 0;
      if (metricsB.netAmount === 0) {
        diffPercent = metricsA.netAmount > 0 ? 100 : 0;
      } else {
        diffPercent = ((diffAmount / metricsB.netAmount) * 100);
      }

      return {
        account,
        periodA: { ...periodA, ...metricsA },
        periodB: { ...periodB, ...metricsB },
        diffAmount,
        diffPercent: parseFloat(diffPercent.toFixed(1)),
        isIncrease: diffAmount > 0,
        isDecrease: diffAmount < 0,
        isEqual: diffAmount === 0
      };
    },

    // Mode C: Period A vs Period B Comprehensive Income and Expense Comparative Analysis
    compareIncomeExpensePeriods: (periodA, periodB) => {
      const accounts = Store.getAccounts();
      const allTx = Store.getTransactions();

      function getAccountPeriodData(account, period) {
        let debitSum = 0;
        let creditSum = 0;
        const matchingTx = [];

        allTx.forEach(tx => {
          if (isDateInRange(tx.date, period.startDate, period.endDate)) {
            const legs = tx.legs.filter(l => l.accountId === account.id);
            if (legs.length > 0) {
              legs.forEach(leg => {
                if (leg.type === 'debit') debitSum += leg.amount;
                else creditSum += leg.amount;
                matchingTx.push({
                  date: tx.date,
                  voucherNo: tx.voucherNo,
                  description: tx.description,
                  amount: leg.amount,
                  type: leg.type,
                  note: leg.note || ''
                });
              });
            }
          }
        });

        const isRev = account.category === 'revenue' || (account.code && account.code.startsWith('4'));
        const netAmount = isRev
          ? Math.max(0, creditSum - debitSum)
          : Math.max(0, debitSum - creditSum);

        return {
          netAmount,
          transactions: matchingTx.sort((a, b) => {
            if (b.date !== a.date) return b.date.localeCompare(a.date);
            return (b.voucherNo || '').localeCompare(a.voucherNo || '');
          })
        };
      }

      const revenueAccounts = accounts.filter(a => !a.excludeFromReports && (a.category === 'revenue' || (a.code && a.code.startsWith('4'))));
      const expenseAccounts = accounts.filter(a => !a.excludeFromReports && (a.category === 'expense' || (a.code && a.code.startsWith('5'))));

      function processGroup(accList, isRevenue) {
        let totalA = 0;
        let totalB = 0;

        const items = accList.map(acc => {
          const dataA = getAccountPeriodData(acc, periodA);
          const dataB = getAccountPeriodData(acc, periodB);

          totalA += dataA.netAmount;
          totalB += dataB.netAmount;

          const diffAmount = dataA.netAmount - dataB.netAmount;
          let diffPercent = 0;
          if (dataB.netAmount === 0) {
            diffPercent = dataA.netAmount > 0 ? 100 : 0;
          } else {
            diffPercent = ((diffAmount / dataB.netAmount) * 100);
          }

          return {
            account: acc,
            amountA: dataA.netAmount,
            amountB: dataB.netAmount,
            diffAmount,
            diffPercent: parseFloat(diffPercent.toFixed(1)),
            transactionsA: dataA.transactions,
            transactionsB: dataB.transactions,
            hasActivity: dataA.netAmount > 0 || dataB.netAmount > 0 || dataA.transactions.length > 0 || dataB.transactions.length > 0
          };
        });

        items.sort((a, b) => {
          if (b.amountA !== a.amountA) return b.amountA - a.amountA;
          return (a.account.code || '').localeCompare(b.account.code || '');
        });

        const diffTotal = totalA - totalB;
        let diffTotalPercent = 0;
        if (totalB === 0) {
          diffTotalPercent = totalA > 0 ? 100 : 0;
        } else {
          diffTotalPercent = ((diffTotal / totalB) * 100);
        }

        return {
          items,
          totalA,
          totalB,
          diffTotal,
          diffTotalPercent: parseFloat(diffTotalPercent.toFixed(1))
        };
      }

      const revenues = processGroup(revenueAccounts, true);
      const expenses = processGroup(expenseAccounts, false);

      const netIncomeA = revenues.totalA - expenses.totalA;
      const netIncomeB = revenues.totalB - expenses.totalB;
      const diffNet = netIncomeA - netIncomeB;

      return {
        periodA,
        periodB,
        revenues,
        expenses,
        netIncome: {
          amountA: netIncomeA,
          amountB: netIncomeB,
          diff: diffNet
        }
      };
    }
  };
})();
