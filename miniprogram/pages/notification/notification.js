const { listMyNotification } = require('../../api/notification.js');
const { enrichNotification } = require('../../utils/notification-format.js');

const STATUS_TABS = [
  { title: '全部', value: 0 },
  { title: '未读', value: 1 },
  { title: '已读', value: 2 },
];

Page({
  data: {
    statusTabs: STATUS_TABS,
    activeTab: 0,
    notifications: [],
    loading: false,
    finished: false,
  },

  pageNo: 1,
  pageSize: 10,
  _fetching: false,

  onShow() {
    const token = wx.getStorageSync('token');
    const userInfo = wx.getStorageSync('userInfo');
    if (!token || !userInfo) {
      wx.navigateTo({ url: '/pages/user/login/login' });
      return;
    }
    this.loadNotifications(this.getCurrentStatus(), { reset: true });
  },

  onPullDownRefresh() {
    this.loadNotifications(this.getCurrentStatus(), { reset: true }).finally(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    if (!this.data.finished && !this.data.loading) {
      this.loadNotifications(this.getCurrentStatus(), { reset: false });
    }
  },

  getCurrentStatus() {
    return STATUS_TABS[this.data.activeTab].value;
  },

  onTabTap(e) {
    const index = Number(e.currentTarget.dataset.index);
    if (Number.isNaN(index) || index === this.data.activeTab) return;
    this.setData({ activeTab: index });
    this.loadNotifications(STATUS_TABS[index].value, { reset: true });
  },

  async loadNotifications(status, { reset }) {
    if (this._fetching) return Promise.resolve();
    if (!reset && this.data.finished) return Promise.resolve();

    if (reset) {
      this.pageNo = 1;
      this.setData({ finished: false, notifications: [] });
    }

    this._fetching = true;
    this.setData({ loading: true });

    const params = {
      pageNo: this.pageNo,
      pageSize: this.pageSize,
      status,
    };

    try {
      const res = await listMyNotification(params);
      if (res.success && res.data) {
        const chunk = res.data.map((n) => enrichNotification(n));
        const notifications = reset ? chunk : this.data.notifications.concat(chunk);
        let finished = false;
        if (res.data.length < this.pageSize) {
          finished = true;
        } else {
          this.pageNo += 1;
        }
        this.setData({ notifications, finished });
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

  onItemTap(e) {
    const id = e.currentTarget.dataset.id;
    const item = this.data.notifications.find((n) => n.id === id);
    if (!item) return;

    if (item.notificationType === 'AUDIT' && item.relatedContent) {
      try {
        const auditInfo = JSON.parse(item.relatedContent);
        if (auditInfo.taskId && auditInfo.itemId) {
          wx.navigateTo({
            url: `/pages/audit/audit?id=${auditInfo.taskId}&itemId=${auditInfo.itemId}`,
          });
          return;
        }
      } catch (err) {
        console.error('解析审核信息失败:', err);
      }
    }

    wx.navigateTo({ url: `/pages/notification/detail/detail?id=${item.id}` });
  },
});
