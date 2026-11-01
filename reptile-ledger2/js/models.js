/**
 * REPTILE PIXEL ACCOUNTING (鱗帳) - ACCOUNTING MODELS & DEFAULT SEEDS
 */

const AccountingConstants = {
  CATEGORIES: {
    asset: {
      key: 'asset',
      name: '資產',
      codePrefix: '1',
      normalBalance: 'debit',
      badgeClass: 'badge-asset',
      icon: '💎'
    },
    liability: {
      key: 'liability',
      name: '負債',
      codePrefix: '2',
      normalBalance: 'credit',
      badgeClass: 'badge-liability',
      icon: '📜'
    },
    revenue: {
      key: 'revenue',
      name: '收入',
      codePrefix: '4',
      normalBalance: 'credit',
      badgeClass: 'badge-revenue',
      icon: '🪙'
    },
    expense: {
      key: 'expense',
      name: '費用',
      codePrefix: '5',
      normalBalance: 'debit',
      badgeClass: 'badge-expense',
      icon: '🔥'
    }
  }
};

const DefaultAccounts = [
  // 1. 資產 (Assets)
  { id: 'acc_1101', code: '1101', name: '現金', category: 'asset', normalBalance: 'debit', initialBalance: 12000, description: '手頭現鈔、皮夾零錢', isSystem: true, excludeFromReports: false },
  { id: 'acc_1102', code: '1102', name: '銀行活期存款', category: 'asset', normalBalance: 'debit', initialBalance: 85000, description: '主要銀行帳戶與薪轉戶', isSystem: true, excludeFromReports: false },
  { id: 'acc_1103', code: '1103', name: '數位電子支付', category: 'asset', normalBalance: 'debit', initialBalance: 0, description: 'LINE Pay, 街口, 悠遊卡儲值', isSystem: true, excludeFromReports: false },
  { id: 'acc_1104', code: '1104', name: '應收帳款', category: 'asset', normalBalance: 'debit', initialBalance: 0, description: '他人代墊欠款、待入帳款項', isSystem: false, excludeFromReports: false },
  { id: 'acc_1201', code: '1201', name: '設備與電子資產', category: 'asset', normalBalance: 'debit', initialBalance: 0, description: '筆電、手機、爬蟲溫控設備', isSystem: false, excludeFromReports: false },

  // 2. 負債 (Liabilities)
  { id: 'acc_2101', code: '2101', name: '信用卡應付款', category: 'liability', normalBalance: 'credit', initialBalance: 0, description: '信用卡已刷未繳金額', isSystem: true, excludeFromReports: false },
  { id: 'acc_2120', code: '2120', name: '應付信用卡', category: 'liability', normalBalance: 'credit', initialBalance: 0, description: '應付信用卡母科目（包含 2120-1, 2120-2 等分支）', isSystem: false, excludeFromReports: false },
  { id: 'acc_2103', code: '2103', name: '應付帳款', category: 'liability', normalBalance: 'credit', initialBalance: 0, description: '信用卡帳單結算轉入應付帳款、待扣繳卡費款項', isSystem: false, excludeFromReports: false },
  { id: 'acc_2102', code: '2102', name: '短期應付借款', category: 'liability', normalBalance: 'credit', initialBalance: 0, description: '朋友暫借款、分期付款', isSystem: false, excludeFromReports: false },

  // 3. 收入 (Revenue)
  { id: 'acc_4101', code: '4101', name: '薪資收入', category: 'revenue', normalBalance: 'credit', description: '正職薪水、獎金', isSystem: true, excludeFromReports: false },
  { id: 'acc_4102', code: '4102', name: '兼職接案收入', category: 'revenue', normalBalance: 'credit', description: '副業、外包接案酬勞', isSystem: false, excludeFromReports: false },
  { id: 'acc_4103', code: '4103', name: '投資收益與利息', category: 'revenue', normalBalance: 'credit', description: '股票股利、活存利息', isSystem: false, excludeFromReports: false },
  { id: 'acc_4104', code: '4104', name: '其他偶發收入', category: 'revenue', normalBalance: 'credit', description: '中獎發票、二手出清', isSystem: false, excludeFromReports: false },

  // 5. 費用 (Expenses)
  { id: 'acc_5101', code: '5101', name: '餐飲伙食', category: 'expense', normalBalance: 'debit', description: '早中晚餐、聚餐手搖飲', isSystem: true, excludeFromReports: false },
  { id: 'acc_5102', code: '5102', name: '交通通勤', category: 'expense', normalBalance: 'debit', description: '捷運、公車、計程車、加油', isSystem: true, excludeFromReports: false },
  { id: 'acc_5103', code: '5103', name: '居住水電瓦斯', category: 'expense', normalBalance: 'debit', description: '房租、電費、水費、網路費', isSystem: true, excludeFromReports: false },
  { id: 'acc_5104', code: '5104', name: '娛樂休閒', category: 'expense', normalBalance: 'debit', description: '電影、Steam遊戲、露營旅行', isSystem: false, excludeFromReports: false },
  { id: 'acc_5105', code: '5105', name: '醫療日用雜支', category: 'expense', normalBalance: 'debit', description: '看診醫藥、衛生紙沐浴用品', isSystem: false, excludeFromReports: false },
  { id: 'acc_5106', code: '5106', name: '學習進修書籍', category: 'expense', normalBalance: 'debit', description: '買書、線上課程', isSystem: false, excludeFromReports: false },
  { id: 'acc_5107', code: '5107', name: '手續費與稅金', category: 'expense', normalBalance: 'debit', description: '跨行轉帳費、所得稅', isSystem: false, excludeFromReports: false },
  { id: 'acc_5108', code: '5108', name: '爬蟲飼育與箱設費', category: 'expense', normalBalance: 'debit', description: '飼料蟋蟀杜比亞、UVB燈、墊材', isSystem: false, excludeFromReports: false }
];

const DefaultFavoriteTemplates = [
  {
    id: 'tpl_salary',
    name: '每月薪資入帳 (複合)',
    reptileIcon: '💼',
    description: '發薪日銀行實收入帳與代扣稅費',
    category: '收入',
    legs: [
      { type: 'debit', accountId: 'acc_1102', amount: 48000, note: '銀行實收入帳' },
      { type: 'debit', accountId: 'acc_5107', amount: 2000, note: '勞健保與代扣稅' },
      { type: 'credit', accountId: 'acc_4101', amount: 50000, note: '全額應發薪資' }
    ]
  },
  {
    id: 'tpl_dining_cash',
    name: '日常現金餐費',
    reptileIcon: '🍱',
    description: '外食午晚餐現金付款',
    category: '日常',
    legs: [
      { type: 'debit', accountId: 'acc_5101', amount: 150, note: '便當套餐' },
      { type: 'credit', accountId: 'acc_1101', amount: 150, note: '現金支付' }
    ]
  },
  {
    id: 'tpl_credit_shopping',
    name: '超商超市刷卡購物 (複合)',
    reptileIcon: '💳',
    description: '同時採購食材與生活用品',
    category: '消費',
    legs: [
      { type: 'debit', accountId: 'acc_5101', amount: 450, note: '生鮮食品' },
      { type: 'debit', accountId: 'acc_5105', amount: 320, note: '日用品面紙' },
      { type: 'credit', accountId: 'acc_2101', amount: 770, note: '信用卡刷卡' }
    ]
  },
  {
    id: 'tpl_pay_credit_card',
    name: '銀行轉帳扣繳卡費',
    reptileIcon: '🏦',
    description: '每月自動扣繳信用卡應付帳款',
    category: '轉帳',
    legs: [
      { type: 'debit', accountId: 'acc_2101', amount: 15000, note: '沖銷信用卡應付款' },
      { type: 'credit', accountId: 'acc_1102', amount: 15000, note: '銀行存款扣繳' }
    ]
  },
  {
    id: 'tpl_reptile_care',
    name: '爬蟲守宮飼育補給',
    reptileIcon: '🦎',
    description: '購買守宮飼料、UVB燈管與鈣粉',
    category: '寵物',
    legs: [
      { type: 'debit', accountId: 'acc_5108', amount: 850, note: '活體飼料與營養粉' },
      { type: 'credit', accountId: 'acc_1103', amount: 850, note: '電子支付' }
    ]
  },
  {
    id: 'tpl_rent_utilities',
    name: '每月租金與水電轉帳',
    reptileIcon: '🏠',
    description: '定期租金與水電費支出',
    category: '居住',
    legs: [
      { type: 'debit', accountId: 'acc_5103', amount: 16000, note: '本月房租' },
      { type: 'debit', accountId: 'acc_5103', amount: 1200, note: '水電瓦斯公攤' },
      { type: 'credit', accountId: 'acc_1102', amount: 17200, note: '銀行網銀轉帳' }
    ]
  }
];

// Helper to generate seed transactions for smooth demonstration and comparative analysis across periods
function generateSeedTransactions() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed

  // Format date helper: YYYY-MM-DD
  const fmt = (y, m, d) => {
    const mm = String(m + 1).padStart(2, '0');
    const dd = String(d).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  // We seed data across current month and the previous 2 months for immediate comparison!
  const prevMonth1 = month === 0 ? 11 : month - 1;
  const prevYear1 = month === 0 ? year - 1 : year;

  const prevMonth2 = prevMonth1 === 0 ? 11 : prevMonth1 - 1;
  const prevYear2 = prevMonth1 === 0 ? prevYear1 - 1 : prevYear1;

  return [
    // Two months ago: Capital & Setup
    {
      id: 'tx_seed_002',
      date: fmt(prevYear2, prevMonth2, 5),
      voucherNo: 'V02',
      description: '前前月薪資入帳',
      legs: [
        { type: 'debit', accountId: 'acc_1102', amount: 48000, note: '實收薪資' },
        { type: 'debit', accountId: 'acc_5107', amount: 2000, note: '健保稅費' },
        { type: 'credit', accountId: 'acc_4101', amount: 50000, note: '全額薪資' }
      ],
      totalDebit: 50000,
      totalCredit: 50000,
      createdAt: new Date(prevYear2, prevMonth2, 5).getTime()
    },
    {
      id: 'tx_seed_003',
      date: fmt(prevYear2, prevMonth2, 15),
      voucherNo: 'V03',
      description: '前前月餐飲外食費總計',
      legs: [
        { type: 'debit', accountId: 'acc_5101', amount: 8200, note: '伙食消費' },
        { type: 'credit', accountId: 'acc_1101', amount: 3200, note: '現金' },
        { type: 'credit', accountId: 'acc_2101', amount: 5000, note: '信用卡' }
      ],
      totalDebit: 8200,
      totalCredit: 8200,
      createdAt: new Date(prevYear2, prevMonth2, 15).getTime()
    },

    // Last Month
    {
      id: 'tx_seed_004',
      date: fmt(prevYear1, prevMonth1, 5),
      voucherNo: 'V04',
      description: '上月薪資入帳與績效獎金',
      legs: [
        { type: 'debit', accountId: 'acc_1102', amount: 52000, note: '實收薪資+獎金' },
        { type: 'debit', accountId: 'acc_5107', amount: 2200, note: '稅費扣款' },
        { type: 'credit', accountId: 'acc_4101', amount: 54200, note: '薪資收入' }
      ],
      totalDebit: 54200,
      totalCredit: 54200,
      createdAt: new Date(prevYear1, prevMonth1, 5).getTime()
    },
    {
      id: 'tx_seed_005',
      date: fmt(prevYear1, prevMonth1, 10),
      voucherNo: 'V05',
      description: '上月房租與公設電費扣款',
      legs: [
        { type: 'debit', accountId: 'acc_5103', amount: 16000, note: '房租' },
        { type: 'debit', accountId: 'acc_5103', amount: 1350, note: '電費' },
        { type: 'credit', accountId: 'acc_1102', amount: 17350, note: '銀行自動扣帳' }
      ],
      totalDebit: 17350,
      totalCredit: 17350,
      createdAt: new Date(prevYear1, prevMonth1, 10).getTime()
    },
    {
      id: 'tx_seed_006',
      date: fmt(prevYear1, prevMonth1, 14),
      voucherNo: 'V06',
      description: '上月餐飲聚餐與生活用品採買 (複合)',
      legs: [
        { type: 'debit', accountId: 'acc_5101', amount: 9600, note: '同事聚餐與日常便當' },
        { type: 'debit', accountId: 'acc_5105', amount: 1800, note: '超市補貨' },
        { type: 'credit', accountId: 'acc_2101', amount: 8000, note: '信用卡消費' },
        { type: 'credit', accountId: 'acc_1101', amount: 3400, note: '現金支付' }
      ],
      totalDebit: 11400,
      totalCredit: 11400,
      createdAt: new Date(prevYear1, prevMonth1, 14).getTime()
    },
    {
      id: 'tx_seed_007',
      date: fmt(prevYear1, prevMonth1, 20),
      voucherNo: 'V07',
      description: '爬蟲展採購豹紋守宮飼育箱與溫控器',
      legs: [
        { type: 'debit', accountId: 'acc_1201', amount: 3500, note: '智能爬蟲飼育箱(設備)' },
        { type: 'debit', accountId: 'acc_5108', amount: 1200, note: '飼育食材與底材(費用)' },
        { type: 'credit', accountId: 'acc_1103', amount: 4700, note: 'LINE Pay 行動支付' }
      ],
      totalDebit: 4700,
      totalCredit: 4700,
      createdAt: new Date(prevYear1, prevMonth1, 20).getTime()
    },

    // Current Month
    {
      id: 'tx_seed_008',
      date: fmt(year, month, 5),
      voucherNo: 'V08',
      description: '本月薪資入帳',
      legs: [
        { type: 'debit', accountId: 'acc_1102', amount: 48000, note: '實收薪資' },
        { type: 'debit', accountId: 'acc_5107', amount: 2000, note: '代扣款' },
        { type: 'credit', accountId: 'acc_4101', amount: 50000, note: '全額薪資' }
      ],
      totalDebit: 50000,
      totalCredit: 50000,
      createdAt: new Date(year, month, 5).getTime()
    },
    {
      id: 'tx_seed_009',
      date: fmt(year, month, 10),
      voucherNo: 'V09',
      description: '本月房租轉帳',
      legs: [
        { type: 'debit', accountId: 'acc_5103', amount: 16000, note: '房租費用' },
        { type: 'credit', accountId: 'acc_1102', amount: 16000, note: '銀行扣款' }
      ],
      totalDebit: 16000,
      totalCredit: 16000,
      createdAt: new Date(year, month, 10).getTime()
    },
    {
      id: 'tx_seed_010',
      date: fmt(year, month, 12),
      voucherNo: 'V10',
      description: '外包設計兼職酬勞入帳',
      legs: [
        { type: 'debit', accountId: 'acc_1102', amount: 15000, note: '接案酬勞' },
        { type: 'credit', accountId: 'acc_4102', amount: 15000, note: '兼職接案收入' }
      ],
      totalDebit: 15000,
      totalCredit: 15000,
      createdAt: new Date(year, month, 12).getTime()
    },
    {
      id: 'tx_seed_011',
      date: fmt(year, month, 16),
      voucherNo: 'V11',
      description: '週末朋友慶生燒肉大餐 (信用卡付清)',
      legs: [
        { type: 'debit', accountId: 'acc_5101', amount: 4200, note: '頂級燒肉' },
        { type: 'credit', accountId: 'acc_2101', amount: 4200, note: '信用卡' }
      ],
      totalDebit: 4200,
      totalCredit: 4200,
      createdAt: new Date(year, month, 16).getTime()
    },
    {
      id: 'tx_seed_012',
      date: fmt(year, month, 18),
      voucherNo: 'V12',
      description: '購買爬蟲專用鈣粉、維他命與蟋蟀',
      legs: [
        { type: 'debit', accountId: 'acc_5108', amount: 950, note: '爬蟲飼育維他命' },
        { type: 'credit', accountId: 'acc_1103', amount: 950, note: '電子支付' }
      ],
      totalDebit: 950,
      totalCredit: 950,
      createdAt: new Date(year, month, 18).getTime()
    },
    {
      id: 'tx_seed_013',
      date: fmt(year, month, 22),
      voucherNo: 'V13',
      description: '悠遊卡與電子支付儲值 (從銀行轉出)',
      legs: [
        { type: 'debit', accountId: 'acc_1103', amount: 2000, note: '儲值金增加' },
        { type: 'credit', accountId: 'acc_1102', amount: 2000, note: '銀行活存扣款' }
      ],
      totalDebit: 2000,
      totalCredit: 2000,
      createdAt: new Date(year, month, 22).getTime()
    }
  ];
}
