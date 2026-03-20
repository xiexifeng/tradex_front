const userApi = require('../../../api/user.js');

function toYyyymmdd(v) {
  if (v == null || v === '') return '';
  const s = String(v).trim();
  const cleaned = s.replace(/-/g, '').replace(/\//g, '');
  if (/^\d{8}$/.test(cleaned)) return cleaned;
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function normalizeRewardItem(raw) {
  const loginDateRaw = raw.loginDate != null ? raw.loginDate : raw.login_date;
  const loginDate = toYyyymmdd(loginDateRaw != null ? loginDateRaw : '');
  const rsRaw = raw.rewardStatus != null ? raw.rewardStatus : raw.reward_status;
  const rewardStatus = Number(rsRaw != null ? rsRaw : -1);
  const rpRaw = raw.rewardPoint != null ? raw.rewardPoint : raw.reward_point;
  const rewardPoint = Number(rpRaw != null ? rpRaw : 0);
  return {
    loginDate,
    rewardStatus: Number.isNaN(rewardStatus) ? -1 : rewardStatus,
    rewardPoint: Number.isNaN(rewardPoint) ? 0 : rewardPoint,
  };
}

Page({
  data: {
    weekdays: ['日', '一', '二', '三', '四', '五', '六'],
    monthTitle: '',
    calendarCells: [],
    rewardList: [],
    dailyTasks: [],
    taskLoading: false,
    listLoading: false,
    showRules: false,
    showTaskRules: false,
  },

  onLoad() {
    const d = new Date();
    this.setData({
      monthTitle: `${d.getFullYear()}年${d.getMonth() + 1}月`,
    });
    this.rebuildCalendar();
  },

  onShow() {
    const u = wx.getStorageSync('userInfo');
    const account = wx.getStorageSync('loginAccount') || {};
    const userId = (u && u.userId) || account.userId;
    if (!userId) {
      wx.navigateTo({ url: '/pages/user/login/login' });
      return;
    }
    this._userId = userId;
    const d = new Date();
    this.setData({
      monthTitle: `${d.getFullYear()}年${d.getMonth() + 1}月`,
    });
    this.rebuildCalendar();
    this.fetchList();
    this.fetchTasks();
  },

  rebuildCalendar() {
    const list = this.data.rewardList || [];
    const dayMap = {};
    list.forEach((item) => {
      if (item.loginDate) dayMap[item.loginDate] = item;
    });
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth() + 1;
    const first = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);
    const firstWeekday = first.getDay();
    const totalDays = last.getDate();
    const todayStr = `${year}${String(month).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const hasUserId = !!this._userId;
    const cells = [];
    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ empty: true, cellKey: `pad-${i}`, statusClass: '' });
    }
    for (let day = 1; day <= totalDays; day += 1) {
      const dateStr = `${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`;
      const item = dayMap[dateStr];
      const isToday = dateStr === todayStr;
      const rawStatus = item != null ? item.rewardStatus : isToday && hasUserId ? 0 : -1;
      const status = Number(rawStatus);
      const rewardPoint = item != null ? Number(item.rewardPoint) : isToday && hasUserId ? 1 : 0;
      const st = Number.isNaN(status) ? -1 : status;
      const statusKey = st === -1 ? 'm1' : String(st);
      cells.push({
        cellKey: dateStr,
        day,
        dateStr,
        status: st,
        statusKey,
        statusClass: `st${statusKey}`,
        rewardPoint: Number.isNaN(rewardPoint) ? 0 : rewardPoint,
      });
    }
    this.setData({ calendarCells: cells });
  },

  async fetchList() {
    if (!this._userId) return;
    this.setData({ listLoading: true });
    try {
      const res = await userApi.getLoginRewardMonthList(this._userId);
      let arr = [];
      if (res.success && res.data != null) {
        const data = res.data;
        const raw = Array.isArray(data.items) ? data.items : [];
        arr = raw.map((row) => normalizeRewardItem(row));
      }
      this.setData({ rewardList: arr });
    } catch (_) {
      this.setData({ rewardList: [] });
    } finally {
      this.rebuildCalendar();
      this.setData({ listLoading: false });
    }
  },

  async fetchTasks() {
    if (!this._userId) return;
    this.setData({ taskLoading: true });
    try {
      const res = await userApi.getDailyTaskList(this._userId);
      const raw = res.success && Array.isArray(res.data) ? res.data : [];
      const arr = raw.map((t, idx) => ({
        ...t,
        taskRowKey: t.taskCode != null ? String(t.taskCode) : `t-${idx}`,
        pct: !t.targetNum || t.targetNum <= 0 ? 0 : Math.min(100, Math.round((Number(t.finishNum) / Number(t.targetNum)) * 100)),
      }));
      this.setData({ dailyTasks: arr });
    } catch (_) {
    } finally {
      this.setData({ taskLoading: false });
    }
  },

  onDayTap(e) {
    const ds = e.currentTarget.dataset;
    if (ds.empty) return;
    if (Number(ds.status) !== 0) return;
    const cell = {
      dateStr: ds.date,
      rewardPoint: Number(ds.point) || 0,
      status: Number(ds.status),
    };
    this.onReceive(cell);
  },

  async onReceive(cell) {
    if (!this._userId || !cell.dateStr) return;
    try {
      const res = await userApi.receiveLoginReward({
        userId: this._userId,
        loginDate: cell.dateStr,
        rewardPoint: cell.rewardPoint,
      });
      if (res.success) {
        wx.showToast({ title: '领取成功', icon: 'success' });
        const arr = this.data.rewardList.slice();
        const found = arr.find((x) => x.loginDate === cell.dateStr);
        if (found) {
          const next = arr.map((x) => (x.loginDate === cell.dateStr ? { ...x, rewardStatus: 1 } : x));
          this.setData({ rewardList: next });
        } else {
          arr.push({ loginDate: cell.dateStr, rewardPoint: cell.rewardPoint, rewardStatus: 1 });
          this.setData({ rewardList: arr });
        }
        this.rebuildCalendar();
      }
    } catch (_) {
    }
  },

  onGoTask(e) {
    const code = e.currentTarget.dataset.code;
    const task = this.data.dailyTasks.find((t) => t.taskCode === code);
    if (!task || task.taskState === 2) return;
    const type = task.taskType;
    if (type === 1 || type === 4) {
      wx.switchTab({ url: '/pages/home/home' });
    } else if (type === 2) {
      wx.switchTab({ url: '/pages/stuff/publish/publish' });
    } else if (type === 3) {
      wx.switchTab({ url: '/pages/trade/list/list' });
    }
  },

  openRules() {
    this.setData({ showRules: true });
  },

  closeRules() {
    this.setData({ showRules: false });
  },

  openTaskRules() {
    this.setData({ showTaskRules: true });
  },

  closeTaskRules() {
    this.setData({ showTaskRules: false });
  },

  noop() {},
});
