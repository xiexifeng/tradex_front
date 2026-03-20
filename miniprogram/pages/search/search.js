const { listSquareItems } = require('../../api/stuff.js');

const HISTORY_KEY = 'searchHistory';

const ITEM_TYPE_OPTIONS = [
  { text: '全部类型', value: 'all' },
  { text: '数码手机', value: '数码手机' },
  { text: '电脑办公', value: '电脑办公' },
  { text: '服装配饰', value: '服装配饰' },
  { text: '图书音像', value: '图书音像' },
  { text: '其他', value: '其他' },
];

const TRADE_METHOD_OPTIONS = [
  { text: '全部交易', value: 'all' },
  { text: '人民币', value: 'ITEM_TO_MONEY' },
  { text: '积分', value: 'ITEM_TO_POINTS' },
  { text: '以物换物', value: 'ITEM_TO_ITEM' },
];

const SORT_OPTIONS = [
  { text: '最新发布', value: 'newest' },
  { text: '价格最低', value: 'price_asc' },
  { text: '价格最高', value: 'price_desc' },
];

Page({
  data: {
    keyword: '',
    searching: false,
    searchHistory: [],
    hotSearches: ['iPhone', 'MacBook', 'AirPods', 'iPad', 'Switch', '机械键盘', '显示器'],
    itemTypeLabels: ITEM_TYPE_OPTIONS.map((o) => o.text),
    itemTypeIndex: 0,
    itemTypeFilter: 'all',
    tradeMethodLabels: TRADE_METHOD_OPTIONS.map((o) => o.text),
    tradeMethodIndex: 0,
    tradeMethodFilter: 'all',
    sortLabels: SORT_OPTIONS.map((o) => o.text),
    sortIndex: 0,
    sortOrder: 'newest',
    items: [],
    loading: false,
    finished: false,
    currentPage: 1,
    pageSize: 10,
  },

  _loadingReq: false,

  onLoad() {
    try {
      const raw = wx.getStorageSync(HISTORY_KEY);
      const arr = typeof raw === 'string' ? JSON.parse(raw) : Array.isArray(raw) ? raw : [];
      this.setData({ searchHistory: Array.isArray(arr) ? arr.slice(0, 10) : [] });
    } catch (_) {
      this.setData({ searchHistory: [] });
    }
  },

  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  saveHistory(kw) {
    const keyword = String(kw || '').trim();
    if (!keyword) return;
    const set = new Set([keyword, ...this.data.searchHistory]);
    const next = Array.from(set).slice(0, 10);
    this.setData({ searchHistory: next });
    try {
      wx.setStorageSync(HISTORY_KEY, JSON.stringify(next));
    } catch (_) {
      /* ignore */
    }
  },

  clearHistory() {
    this.setData({ searchHistory: [] });
    try {
      wx.removeStorageSync(HISTORY_KEY);
    } catch (_) {
      /* ignore */
    }
  },

  onHistoryTap(e) {
    const kw = e.currentTarget.dataset.kw;
    if (!kw) return;
    this.setData({ keyword: kw });
    this.runSearch();
  },

  onSearchConfirm() {
    this.runSearch();
  },

  runSearch() {
    const keyword = String(this.data.keyword || '').trim();
    if (!keyword) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      return;
    }
    this.saveHistory(keyword);
    this.setData({
      searching: true,
      items: [],
      finished: false,
      currentPage: 1,
    });
    this.fetchPage(1, keyword);
  },

  onItemTypePick(e) {
    const idx = Number(e.detail.value);
    const opt = ITEM_TYPE_OPTIONS[idx];
    this.setData({ itemTypeIndex: idx, itemTypeFilter: opt.value });
    if (this.data.searching) this.runSearch();
  },

  onTradeMethodPick(e) {
    const idx = Number(e.detail.value);
    const opt = TRADE_METHOD_OPTIONS[idx];
    this.setData({ tradeMethodIndex: idx, tradeMethodFilter: opt.value });
    if (this.data.searching) this.runSearch();
  },

  onSortPick(e) {
    const idx = Number(e.detail.value);
    const opt = SORT_OPTIONS[idx];
    this.setData({ sortIndex: idx, sortOrder: opt.value });
    if (this.data.searching) this.runSearch();
  },

  async fetchPage(pageNo, keyword) {
    const kw = keyword != null ? keyword : String(this.data.keyword || '').trim();
    if (!kw || this._loadingReq) return;
    this._loadingReq = true;
    this.setData({ loading: true });
    const { pageSize, itemTypeFilter, tradeMethodFilter, sortOrder } = this.data;
    const params = {
      pageNo,
      pageSize,
      searchKey: kw,
      itemType: itemTypeFilter === 'all' ? undefined : itemTypeFilter,
      tradeMethod: tradeMethodFilter === 'all' ? undefined : tradeMethodFilter,
      sortBy: sortOrder,
    };
    try {
      const res = await listSquareItems(params);
      if (!res.success) {
        this.setData({ finished: true });
        return;
      }
      const chunk = res.data || [];
      const prev = pageNo === 1 ? [] : this.data.items;
      const items = prev.concat(chunk);
      this.setData({
        items,
        currentPage: pageNo,
        finished: chunk.length < pageSize,
      });
    } catch (_) {
      this.setData({ finished: true });
    } finally {
      this._loadingReq = false;
      this.setData({ loading: false });
    }
  },

  onReachBottom() {
    if (!this.data.searching || this.data.finished || this.data.loading) return;
    const kw = String(this.data.keyword || '').trim();
    if (!kw) return;
    this.fetchPage(this.data.currentPage + 1, kw);
  },

  onCardTap(e) {
    const id = e.detail && e.detail.id;
    if (id) wx.navigateTo({ url: `/pages/square/item/detail/detail?id=${id}` });
  },

  goBack() {
    wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/home/home' }) });
  },
});
