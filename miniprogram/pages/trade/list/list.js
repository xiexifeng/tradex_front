const { getTradeList } = require('../../../api/trade.js');
const tradeActions = require('../../../utils/trade-actions.js');

const STATUS_LIST = [
  { text: '交易中', value: 'trading' },
  { text: '已达成', value: 'accepted' },
  { text: '已完成', value: 'completed' },
  { text: '已取消', value: 'cancelled' },
  { text: '已拒绝', value: 'rejected' },
  { text: '已退款', value: 'refunded' },
  { text: '全部', value: 'all' },
];

function getStatusText(status) {
  const map = {
    trading: '交易中',
    accepted: '已达成',
    completed: '已完成',
    cancelled: '已取消',
    rejected: '已拒绝',
    refunded: '已退款',
  };
  return map[status] || status;
}

function enrichTrade(t, userId) {
  const o = {
    ...t,
    flagLower: (t.flag || '').toLowerCase(),
    statusText: getStatusText(t.tradeStatus),
  };
  if (t.tradeMethod === 'ITEM_TO_MONEY') {
    o.priceLabel = '交易金额：¥';
    o.priceValue = t.tradePrice;
  } else if (t.tradeMethod === 'ITEM_TO_POINTS') {
    o.priceLabel = '交易积分：';
    o.priceValue = t.tradePoints;
  } else {
    o.priceLabel = '交换物：';
    o.priceValue = t.swapItemTitle || '';
  }
  if (t.tradeStatus === 'completed' && userId) {
    if (t.toUserId === userId) {
      o.rateMine = t.toScore;
      o.ratePeer = t.fromScore;
    } else if (t.fromUserId === userId) {
      o.rateMine = t.fromScore;
      o.ratePeer = t.toScore;
    }
    o.rateMineStr = o.rateMine != null ? `${o.rateMine}分` : '--';
    o.ratePeerStr = o.ratePeer != null ? `${o.ratePeer}分` : '--';
  }
  return o;
}

Page({
  data: {
    statusList: STATUS_LIST,
    activeTab: 0,
    trades: [],
    loading: false,
    finished: false,
    userInfo: null,
    userId: '',
    showPayPopup: false,
    payPoints: 0,
    currentTradeForPayId: '',
  },

  pageNo: 1,
  pageSize: 10,
  _fetching: false,
  _needInitialFetch: true,

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    const userId = userInfo && userInfo.userId ? userInfo.userId : '';
    this.setData({ userInfo, userId }, () => {
      if (this._needInitialFetch) {
        this._needInitialFetch = false;
        this.fetchTrades(true);
      }
    });
  },

  onPullDownRefresh() {
    this.fetchTrades(true).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) {
      this.fetchTrades(false);
    }
  },

  onTabTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(index) || index === this.data.activeTab) return;
    this.setData({ activeTab: index });
    this.fetchTrades(true);
  },

  findTrade(id) {
    return this.data.trades.find((t) => t.id === id);
  },

  async fetchTrades(isRefresh) {
    if (this._fetching) return Promise.resolve();
    if (!isRefresh && this.data.finished) return Promise.resolve();

    if (isRefresh) {
      this.pageNo = 1;
      this.setData({ finished: false, trades: [] });
    }

    this._fetching = true;
    this.setData({ loading: true });

    const status = STATUS_LIST[this.data.activeTab].value;
    const params = {
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      tradeMethod: 'ITEM_TO_ITEM',
    };
    if (status !== 'all') params.tradeStatus = status;

    const userId = this.data.userId;

    try {
      const res = await getTradeList(params);
      if (res.success && res.data) {
        const chunk = (res.data || []).map((t) => enrichTrade(t, userId));
        const trades = isRefresh ? chunk : this.data.trades.concat(chunk);
        const finished = res.data.length < this.pageSize;
        this.pageNo += 1;
        this.setData({ trades, finished });
      } else {
        this.setData({ finished: true });
      }
    } catch (_) {
      this.setData({ finished: true });
    } finally {
      this._fetching = false;
      this.setData({ loading: false });
    }
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.navigateTo({ url: `/pages/trade/detail/detail?id=${id}` });
  },

  acceptTrade(e) {
    const id = e.currentTarget.dataset.id;
    const trade = this.findTrade(id);
    if (!trade) return;
    tradeActions.handleAcceptTrade(trade.id, () => this.fetchTrades(true));
  },

  rejectTrade(e) {
    const id = e.currentTarget.dataset.id;
    const trade = this.findTrade(id);
    if (!trade) return;
    tradeActions.handleRejectTrade(trade.id, () => this.fetchTrades(true));
  },

  confirmTrade(e) {
    const id = e.currentTarget.dataset.id;
    const trade = this.findTrade(id);
    if (!trade) return;
    tradeActions.handleConfirmTrade(trade.id, () => this.fetchTrades(true));
  },

  cancelTrade(e) {
    const id = e.currentTarget.dataset.id;
    const trade = this.findTrade(id);
    if (!trade) return;
    tradeActions.handleCancelTrade(trade.id, () => this.fetchTrades(true));
  },

  openPayPopup(e) {
    const id = e.currentTarget.dataset.id;
    const trade = this.findTrade(id);
    if (!trade) return;
    this.setData({
      showPayPopup: true,
      payPoints: trade.tradePoints || 0,
      currentTradeForPayId: trade.id,
    });
  },

  closePayPopup() {
    this.setData({ showPayPopup: false, currentTradeForPayId: '' });
  },

  onPayPopupSubmit(e) {
    const { tradePassword } = e.detail;
    const id = this.data.currentTradeForPayId;
    const trade = this.findTrade(id);
    if (!trade) return;
    tradeActions.handleGoPayTrade(
      {
        itemId: trade.itemId,
        tradeId: trade.id,
        tradePassword,
        tradeMethod: trade.tradeMethod,
        tradePrice: trade.tradePrice,
        tradePoints: trade.tradePoints,
        paymentMethod: null,
      },
      () => {
        this.setData({ showPayPopup: false, currentTradeForPayId: '' });
        this.fetchTrades(true);
      }
    );
  },
});
