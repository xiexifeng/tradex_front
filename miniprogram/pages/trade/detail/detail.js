const { getTradeDetail, tradeScore } = require('../../../api/trade.js');
const tradeActions = require('../../../utils/trade-actions.js');
const { formatMs } = require('../../../utils/datetime.js');

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

Page({
  data: {
    tradeId: '',
    tradeInfo: null,
    loading: true,
    userId: '',
    createTimeStr: '',
    flowTypeText: '',
    flagLower: '',
    isSeller: false,
    needRateInput: false,
    rateValue: 5,
    showPayPopup: false,
    payPoints: 0,
  },

  onLoad(options) {
    const id = options.id;
    if (!id) {
      wx.showToast({ title: '交易ID不存在', icon: 'none' });
      this.setData({ loading: false });
      return;
    }
    this.setData({ tradeId: id });
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo');
    const userId = userInfo && userInfo.userId ? userInfo.userId : '';
    this.setData({ userId }, () => {
      if (this.data.tradeId) {
        this.loadDetail();
      }
    });
  },

  buildState(d, userId) {
    const isSeller = !!(userId && d.fromUserId === userId);
    let needRateInput = false;
    if (d.tradeStatus === 'completed' && userId) {
      if (isSeller) needRateInput = d.fromScore == null;
      else needRateInput = d.toScore == null;
    }
    const flowTypeText =
      d.tradeMethod === 'ITEM_TO_ITEM'
        ? '以物换物'
        : d.tradeMethod === 'ITEM_TO_MONEY'
          ? '线下支付'
          : '积分支付';
    return {
      tradeInfo: d,
      loading: false,
      createTimeStr: formatMs(d.createTime),
      flowTypeText,
      flagLower: (d.flag || '').toLowerCase(),
      isSeller,
      needRateInput,
      statusText: getStatusText(d.tradeStatus),
    };
  },

  async loadDetail() {
    this.setData({ loading: true });
    try {
      const res = await getTradeDetail(this.data.tradeId);
      if (res.success && res.data) {
        const next = this.buildState(res.data, this.data.userId);
        this.setData(next);
      } else {
        this.setData({ tradeInfo: null, loading: false });
      }
    } catch (_) {
      this.setData({ tradeInfo: null, loading: false });
    }
  },

  acceptTrade() {
    const t = this.data.tradeInfo;
    if (!t) return;
    tradeActions.handleAcceptTrade(t.id, () => {
      t.tradeStatus = 'accepted';
      this.setData(this.buildState(t, this.data.userId));
    });
  },

  rejectTrade() {
    const t = this.data.tradeInfo;
    if (!t) return;
    tradeActions.handleRejectTrade(t.id, () => {
      t.tradeStatus = 'rejected';
      this.setData(this.buildState(t, this.data.userId));
    });
  },

  confirmTrade() {
    const t = this.data.tradeInfo;
    if (!t) return;
    tradeActions.handleConfirmTrade(t.id, () => {
      t.tradeStatus = 'completed';
      this.setData(this.buildState(t, this.data.userId));
    });
  },

  cancelTrade() {
    const t = this.data.tradeInfo;
    if (!t) return;
    tradeActions.handleCancelTrade(t.id, () => {
      t.tradeStatus = 'cancelled';
      this.setData(this.buildState(t, this.data.userId));
    });
  },

  openPayPopup() {
    const t = this.data.tradeInfo;
    if (!t) return;
    this.setData({
      showPayPopup: true,
      payPoints: t.tradePoints || 0,
    });
  },

  closePayPopup() {
    this.setData({ showPayPopup: false });
  },

  onPayPopupSubmit(e) {
    const { tradePassword } = e.detail;
    const t = this.data.tradeInfo;
    if (!t) return;
    tradeActions.handleGoPayTrade(
      {
        itemId: t.itemId,
        tradeId: t.id,
        tradePassword,
        tradeMethod: t.tradeMethod,
        tradePrice: t.tradePrice,
        tradePoints: t.tradePoints,
        paymentMethod: null,
      },
      () => {
        t.tradeStatus = 'accepted';
        this.setData({
          showPayPopup: false,
          ...this.buildState(t, this.data.userId),
        });
      }
    );
  },

  async onRateChange(e) {
    const score = Number(e.detail.value);
    const t = this.data.tradeInfo;
    if (!t || !score) return;
    try {
      const res = await tradeScore({ tradeId: t.id, tradeScore: score });
      if (res.success) {
        wx.showToast({ title: '评分成功', icon: 'success' });
        if (this.data.isSeller) t.fromScore = score;
        else t.toScore = score;
        this.setData(this.buildState(t, this.data.userId));
      }
    } catch (_) {
      // request 已 toast
    }
  },
});
