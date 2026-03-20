const { getInviteRank, getLatestRank } = require('../../../api/rank.js');

function formatRankPeriod(beginTime, endTime) {
  const format = (t) => {
    const d = new Date(t);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };
  return `${format(beginTime)} 至 ${format(endTime)}`;
}

function enrichRankRow(item, index) {
  const medals = ['🥇', '🥈', '🥉'];
  let rankClass = '';
  if (index === 0) rankClass = 'rank-gold';
  else if (index === 1) rankClass = 'rank-silver';
  else if (index === 2) rankClass = 'rank-bronze';
  return {
    ...item,
    rankClass,
    rankMedal: index < 3 ? medals[index] : '',
    rankNum: index + 1,
  };
}

Page({
  data: {
    loading: false,
    finished: false,
    rankRows: [],
    showLatestRankPopup: false,
    latestRankLoading: false,
    latestRankData: null,
    latestRankPeriod: '',
    latestRankRows: [],
    showShareTips: false,
  },

  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    });
    this.loadRankList();
  },

  onShareAppMessage() {
    const userInfo = wx.getStorageSync('userInfo');
    let path = '/pages/user/register/register';
    if (userInfo && userInfo.userId) {
      path += `?inviteUserId=${userInfo.userId}&inviteTime=${Date.now()}`;
    }
    return {
      title: '拉新排行榜 - 易物平台',
      path,
    };
  },

  onShareTimeline() {
    const userInfo = wx.getStorageSync('userInfo');
    let query = '';
    if (userInfo && userInfo.userId) {
      query = `inviteUserId=${userInfo.userId}&inviteTime=${Date.now()}`;
    }
    return {
      title: '看看谁是最强拉新达人！',
      query,
    };
  },

  async loadRankList() {
    if (this.data.loading) return;
    this.setData({ loading: true });
    try {
      const res = await getInviteRank();
      if (res.success && res.data && Array.isArray(res.data) && res.data.length > 0) {
        const slice = res.data.slice(0, 10);
        const rankRows = slice.map((item, index) => enrichRankRow(item, index));
        this.setData({ rankRows, finished: true });
      } else {
        this.setData({ rankRows: [], finished: true });
      }
    } catch (_) {
      wx.showToast({ title: '加载排行榜失败', icon: 'none' });
      this.setData({ rankRows: [], finished: true });
    } finally {
      this.setData({ loading: false });
    }
  },

  onShare() {
    this.setData({ showShareTips: true });
  },

  closeShareTips() {
    this.setData({ showShareTips: false });
  },

  noop() {},

  async onViewLatestRank() {
    this.setData({
      showLatestRankPopup: true,
      latestRankData: null,
      latestRankLoading: true,
      latestRankPeriod: '',
      latestRankRows: [],
    });
    try {
      const res = await getLatestRank();
      if (res.success && res.data) {
        const d = res.data;
        const users = (d.rankUsers && d.rankUsers.length ? d.rankUsers : []).slice(0, 19);
        const latestRankRows = users.map((item, index) => enrichRankRow(
          {
            userId: item.userId || '',
            nickname: item.nickname || '',
            inviteCount: item.inviteCount,
            rank: item.rank,
          },
          index
        ));
        this.setData({
          latestRankData: d,
          latestRankPeriod: formatRankPeriod(d.beginTime, d.endTime),
          latestRankRows,
        });
      } else {
        wx.showToast({ title: (res && res.desc) || '获取上一榜单失败', icon: 'none' });
      }
    } catch (_) {
      wx.showToast({ title: '获取上一榜单失败', icon: 'none' });
    } finally {
      this.setData({ latestRankLoading: false });
    }
  },

  closeLatestPopup() {
    this.setData({ showLatestRankPopup: false });
  },
});
