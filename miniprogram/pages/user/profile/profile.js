const userApi = require('../../../api/user.js');
const { getMyItems, cancelTransfer } = require('../../../api/stuff.js');
const { getValueText } = require('../../../constants/stuff.js');

function formatTs(ts) {
  if (ts == null) return '-';
  const date = new Date(Number(ts));
  if (Number.isNaN(date.getTime())) return '-';
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function mapItems(arr) {
  return (arr || []).map((i) => ({
    ...i,
    bcShort:
      i.blockchainId && String(i.blockchainId).length > 10
        ? `${String(i.blockchainId).slice(0, 10)}...`
        : i.blockchainId || '',
    itemStatusText: getValueText(i.status, 'itemStatus'),
    transferText: getValueText(i.transferStatus, 'status'),
  }));
}

Page({
  data: {
    userInfo: null,
    userBcShort: '',
    pointsBalance: 0,
    transactions: [],
    usages: [],
    scoreOpen: false,
    pointsOpen: false,
    pointsRuleOpen: false,
    statusList: [
      { text: '我的物品', value: 'all' },
      { text: '拥有', value: 'own' },
      { text: '转让中', value: 'transferring' },
      { text: '申请交换中', value: 'transfer_applying' },
    ],
    tabIndex: 0,
    currentStatus: 'all',
    items: [],
    pageNo: 1,
    itemsLoading: false,
    itemsFinished: false,
    showCancelSheet: false,
    cancelReason: '',
    cancelItemId: '',
  },

  onShow() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/user/login/login' });
      return;
    }
    const userInfo = wx.getStorageSync('userInfo');
    let userBcShort = '';
    if (userInfo && userInfo.blockchainId) {
      const b = String(userInfo.blockchainId);
      userBcShort = b.length > 12 ? `${b.slice(0, 12)}...` : b;
    }
    this.setData({ userInfo: userInfo || null, userBcShort });
    this.refreshSideData();
    userApi
      .refreshUserInfo()
      .then((u) => {
        if (u) {
          wx.setStorageSync('userInfo', u);
          let bs = '';
          if (u.blockchainId) {
            const b = String(u.blockchainId);
            bs = b.length > 12 ? `${b.slice(0, 12)}...` : b;
          }
          this.setData({ userInfo: u, userBcShort: bs });
        }
      })
      .catch(() => {});

    this.loadItemsPage(true);
  },

  onPullDownRefresh() {
    this.refreshSideData();
    this.setData({ pageNo: 1, itemsFinished: false, items: [], itemsLoading: false });
    this.loadItemsPage(true).finally(() => wx.stopPullDownRefresh());
  },

  onReachBottom() {
    this.loadItemsPage(false);
  },

  async refreshSideData() {
    try {
      const [pa, pt, st] = await Promise.all([
        userApi.getPointsAccount(),
        userApi.getPointsTransactions({ pageNo: 1, pageSize: 20 }),
        userApi.getTradeScoreTransactions({ pageNo: 1, pageSize: 20 }),
      ]);
      const usages = (pt.success && pt.data) || [];
      const transactions = (st.success && st.data) || [];
      const pointsBalance = pa.success && pa.data ? pa.data.pointsBalance || 0 : 0;
      this.setData({
        pointsBalance,
        usages: usages.map((u) => ({
          ...u,
          timeStr: formatTs(u.transactionTime),
          typeText: getValueText(u.transactionType, 'transactionType'),
        })),
        transactions: transactions.map((t) => ({
          ...t,
          timeStr: formatTs(t.scoreTime),
        })),
      });
    } catch (_) {
      /* ignore */
    }
  },

  async loadItemsPage(reset) {
    if (this.data.itemsLoading) return;
    if (!reset && this.data.itemsFinished) return;
    const pageNo = reset ? 1 : this.data.pageNo;
    if (reset) {
      this.setData({ itemsLoading: true, itemsFinished: false, pageNo: 1, items: [] });
    } else {
      this.setData({ itemsLoading: true });
    }
    const status = this.data.currentStatus;
    try {
      const res = await getMyItems({
        pageNo,
        pageSize: 10,
        status: status === 'all' ? undefined : status,
      });
      if (res.success && Array.isArray(res.data)) {
        const chunk = mapItems(res.data);
        const items = pageNo === 1 ? chunk : this.data.items.concat(chunk);
        this.setData({
          items,
          itemsFinished: chunk.length < 10,
          pageNo: pageNo + 1,
        });
      } else {
        this.setData({ itemsFinished: true });
      }
    } catch (_) {
      this.setData({ itemsFinished: true });
    } finally {
      this.setData({ itemsLoading: false });
    }
  },

  onTabTap(e) {
    const idx = Number(e.currentTarget.dataset.i);
    const st = this.data.statusList[idx];
    if (!st) return;
    this.setData({
      tabIndex: idx,
      currentStatus: st.value,
      pageNo: 1,
      items: [],
      itemsFinished: false,
      itemsLoading: false,
    });
    this.loadItemsPage(true);
  },

  toggleScore() {
    this.setData({ scoreOpen: !this.data.scoreOpen });
  },

  togglePoints() {
    this.setData({ pointsOpen: !this.data.pointsOpen });
  },

  showPointsRule() {
    this.setData({ pointsRuleOpen: true });
  },

  closePointsRule() {
    this.setData({ pointsRuleOpen: false });
  },

  noop() {},

  goSettings() {
    wx.navigateTo({ url: '/pages/user/settings/settings' });
  },

  editProfile() {
    wx.navigateTo({ url: '/pages/user/edit-profile/edit-profile' });
  },

  goLoginReward() {
    wx.navigateTo({ url: '/pages/user/login-reward/login-reward' });
  },

  copyBc(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.setClipboardData({ data: String(id), success: () => wx.showToast({ title: '已复制', icon: 'success' }) });
  },

  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: `/pages/stuff/detail/detail?id=${id}` });
  },

  viewOffers() {
    wx.showModal({
      title: '查看报价',
      content: '请在「交易」页查看相关交易。',
      confirmText: '去交易',
      success: (r) => {
        if (r.confirm) wx.switchTab({ url: '/pages/trade/list/list' });
      },
    });
  },

  openCancel(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ showCancelSheet: true, cancelReason: '', cancelItemId: id || '' });
  },

  closeCancel() {
    this.setData({ showCancelSheet: false, cancelReason: '', cancelItemId: '' });
  },

  onCancelReason(e) {
    this.setData({ cancelReason: e.detail.value });
  },

  async submitCancel() {
    const reason = (this.data.cancelReason || '').trim();
    if (!reason) {
      wx.showToast({ title: '请输入原因', icon: 'none' });
      return;
    }
    const itemId = this.data.cancelItemId;
    try {
      await cancelTransfer({ itemId, cancelReason: reason });
      wx.showToast({ title: '已取消', icon: 'success' });
      this.closeCancel();
      this.setData({ pageNo: 1, items: [], itemsFinished: false });
      this.loadItemsPage(true);
    } catch (_) {
    }
  },

  onShareAppMessage() {
    const u = this.data.userInfo;
    const uid = u && u.userId;
    const path = uid
      ? `/pages/user/register/register?inviteUserId=${uid}&inviteTime=${Date.now()}`
      : '/pages/user/register/register';
    return {
      title: `${(u && u.nickname) || '我'}邀请您加入易物平台`,
      path,
      imageUrl: (u && u.avatarUrl) || undefined,
    };
  },
});
