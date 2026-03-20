const { listSquareItems } = require('../../api/stuff.js');

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
    statusBarHeight: 20,
    navPaddingTop: 64,
    userInfo: null,
    banners: ['/images/home/banner1.jpg', '/images/home/banner2.jpg'],
    features: [
      { text: '逛换物广场', color: '#1989fa', symbol: '🏬', action: 'profileItems' },
      { text: '发布闲置', color: '#ff6b6b', symbol: '➕', action: 'publish' },
      { text: '我的交易', color: '#07c160', symbol: '📋', action: 'tradeList' },
      { text: '消息通知', color: '#ff976a', symbol: '🔔', action: 'notification' },
      { text: '每日签到', color: '#ff976a', symbol: '📅', action: 'loginReward' },
      { text: '拉新排行', color: '#ff6b9d', symbol: '👥', action: 'inviteRank' },
    ],
    itemTypeOptions: ITEM_TYPE_OPTIONS,
    itemTypeLabels: ITEM_TYPE_OPTIONS.map((o) => o.text),
    itemTypeIndex: 0,
    itemTypeFilter: 'all',
    tradeMethodOptions: TRADE_METHOD_OPTIONS,
    tradeMethodLabels: TRADE_METHOD_OPTIONS.map((o) => o.text),
    tradeMethodIndex: 0,
    tradeMethodFilter: 'all',
    sortOptions: SORT_OPTIONS,
    sortLabels: SORT_OPTIONS.map((o) => o.text),
    sortIndex: 0,
    sortOrder: 'newest',
    pageSize: 4,
    currentPage: 1,
    items: [],
    loading: false,
    finished: false,
  },

  _loadingReq: false,

  onLoad() {
    const sys = wx.getSystemInfoSync();
    const statusBarHeight = sys.statusBarHeight || 20;
    const navPaddingTop = statusBarHeight + 44;
    this.setData({ statusBarHeight, navPaddingTop });
    this.reloadItems();
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo: userInfo || null });
  },

  onClickRight() {
    wx.navigateTo({ url: '/pages/user/login/login' });
  },

  goToPublish() {
    wx.switchTab({ url: '/pages/stuff/publish/publish' });
  },

  goToProfile() {
    wx.switchTab({ url: '/pages/user/profile/profile' });
  },

  onSearchClick() {
    wx.navigateTo({ url: '/pages/search/search' });
  },

  onViewClick(e) {
    const id = e.detail && e.detail.id;
    if (!id) return;
    wx.navigateTo({ url: `/pages/square/item/detail/detail?id=${id}` });
  },

  onFeatureTap(e) {
    const action = e.currentTarget.dataset.action;
    switch (action) {
      case 'profileItems':
        wx.setStorageSync('profileSection', 'items');
        wx.switchTab({ url: '/pages/user/profile/profile' });
        break;
      case 'publish':
        wx.switchTab({ url: '/pages/stuff/publish/publish' });
        break;
      case 'tradeList':
        wx.switchTab({ url: '/pages/trade/list/list' });
        break;
      case 'notification':
        wx.switchTab({ url: '/pages/notification/notification' });
        break;
      case 'loginReward':
        wx.navigateTo({ url: '/pages/user/login-reward/login-reward' });
        break;
      case 'inviteRank':
        wx.navigateTo({ url: '/pages/rank/invite/invite' });
        break;
      default:
        break;
    }
  },

  onItemTypePick(e) {
    const idx = Number(e.detail.value);
    const opt = ITEM_TYPE_OPTIONS[idx];
    this.setData({ itemTypeIndex: idx, itemTypeFilter: opt.value });
    this.reloadItems();
  },

  onTradeMethodPick(e) {
    const idx = Number(e.detail.value);
    const opt = TRADE_METHOD_OPTIONS[idx];
    this.setData({ tradeMethodIndex: idx, tradeMethodFilter: opt.value });
    this.reloadItems();
  },

  onSortPick(e) {
    const idx = Number(e.detail.value);
    const opt = SORT_OPTIONS[idx];
    this.setData({ sortIndex: idx, sortOrder: opt.value });
    this.reloadItems();
  },

  reloadItems() {
    this.setData({
      items: [],
      finished: false,
      currentPage: 1,
    });
    this.fetchPage(1);
  },

  async fetchPage(pageNo) {
    if (this._loadingReq) return;
    this._loadingReq = true;
    this.setData({ loading: true });
    const { pageSize, itemTypeFilter, tradeMethodFilter, sortOrder } = this.data;
    const params = {
      pageNo,
      pageSize,
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
      const finished = chunk.length < pageSize;
      this.setData({
        items,
        currentPage: pageNo,
        finished,
      });
    } catch (_) {
      this.setData({ finished: true });
    } finally {
      this._loadingReq = false;
      this.setData({ loading: false });
    }
  },

  onReachBottom() {
    if (this.data.finished || this.data.loading) return;
    this.fetchPage(this.data.currentPage + 1);
  },
});
