const {
  refreshUserInfo,
  getPointsAccount,
  getPointsTransactions,
  getTradeScoreTransactions
} = require("../../api/user");
const { getMyItems, cancelTransferApi } = require("../../api/stuff");
const { formatTime } = require("../../utils/format");
const { getValueText } = require("../../constants/dict");
const {
  getItemStatusText,
  getTransferStatusText,
  getItemStatusTagClass,
  getTransferTagClass
} = require("../../constants/profile");

const STATUS_LIST = [
  { text: "我的物品", value: "all" },
  { text: "拥有", value: "own" },
  { text: "转让中", value: "transferring" },
  { text: "申请交换中", value: "transfer_applying" }
];

Page({
  data: {
    userInfo: null,
    blockchainUserShort: "",
    pointsAccount: { pointsBalance: 0 },
    transactions: [],
    usages: [],
    items: [],
    displayItems: [],
    statusList: STATUS_LIST,
    activeTabIndex: 0,
    activeCollapse: "",
    listLoading: false,
    listFinished: false,
    pageNo: 1,
    pageSize: 10,
    recordPageSize: 5,
    showPointsRulePopup: false,
    showCancelTransfer: false,
    cancelItemId: "",
    cancelReason: ""
  },

  onLoad() {
    const token = wx.getStorageSync("token");
    if (!token) {
      try {
        wx.setStorageSync("loginRedirect", "/pages/profile/profile");
      } catch (e) {}
      wx.redirectTo({ url: "/pages/login/login" });
      return;
    }

    const cached = wx.getStorageSync("userContext");
    if (cached) {
      this.applyUserInfo(cached);
    }

    this.bootstrap();
  },

  onShow() {
    if (!wx.getStorageSync("token")) return;
    this.refreshUserFromServer();
  },

  onPullDownRefresh() {
    this.bootstrap(true);
  },

  applyUserInfo(user) {
    const bid = user && user.blockchainId;
    const blockchainUserShort =
      bid && bid.length > 12 ? `${bid.slice(0, 12)}...` : bid || "";
    this.setData({
      userInfo: user,
      blockchainUserShort
    });
  },

  async refreshUserFromServer() {
    try {
      const res = await refreshUserInfo();
      if (res.success && res.data) {
        wx.setStorageSync("userContext", res.data);
        this.applyUserInfo(res.data);
        const app = getApp();
        if (app && app.globalData) {
          app.globalData.userInfo = res.data;
        }
      }
    } catch (e) {
      console.error("刷新用户信息失败:", e);
    }
  },

  async bootstrap(fromPullDown) {
    await Promise.all([
      this.refreshUserFromServer(),
      this.fetchPointsAccount(),
      this.fetchPointsTransactions(),
      this.fetchTradeScoreTransactions()
    ]);

    await this.loadItems(this.data.statusList[this.data.activeTabIndex].value, true);

    if (fromPullDown) {
      wx.stopPullDownRefresh();
    }
  },

  async fetchPointsAccount() {
    try {
      const res = await getPointsAccount();
      if (res.success && res.data) {
        this.setData({ pointsAccount: res.data });
      }
    } catch (e) {
      console.error("获取积分账户失败:", e);
    }
  },

  async fetchPointsTransactions() {
    try {
      const res = await getPointsTransactions({
        pageNo: 1,
        pageSize: this.data.recordPageSize
      });
      if (res.success && res.data) {
        const list = (res.data || []).map((row) =>
          Object.assign({}, row, {
            _time: formatTime(row.transactionTime),
            _typeText: getValueText(row.transactionType, "transactionType")
          })
        );
        this.setData({ usages: list });
      }
    } catch (e) {
      console.error("获取积分流水失败:", e);
    }
  },

  async fetchTradeScoreTransactions() {
    try {
      const res = await getTradeScoreTransactions({
        pageNo: 1,
        pageSize: this.data.recordPageSize
      });
      if (res.success && res.data) {
        const list = (res.data || []).map((row) =>
          Object.assign({}, row, {
            _time: formatTime(row.scoreTime)
          })
        );
        this.setData({ transactions: list });
      }
    } catch (e) {
      console.error("获取评分记录失败:", e);
    }
  },

  enrichItem(item) {
    return Object.assign({}, item, {
      _itemStatusText: getItemStatusText(item.status),
      _itemStatusClass: getItemStatusTagClass(item.status),
      _transferText: getTransferStatusText(item.transferStatus),
      _transferClass: getTransferTagClass(item.transferStatus),
      _bcShort:
        item.blockchainId && item.blockchainId.length > 10
          ? `${item.blockchainId.slice(0, 10)}...`
          : item.blockchainId || ""
    });
  },

  updateDisplayItems() {
    const status = this.data.statusList[this.data.activeTabIndex].value;
    const all = this.data.items || [];
    const filtered =
      status === "all" ? all : all.filter((i) => i.transferStatus === status);
    const displayItems = filtered.map((i) => this.enrichItem(i));
    this.setData({ displayItems });
  },

  async loadItems(status, reset) {
    if (this.data.listLoading) return;
    if (!reset && this.data.listFinished) return;

    const pn = reset ? 1 : this.data.pageNo;
    if (reset) {
      this.setData({ listFinished: false, pageNo: 1, items: [] });
    }

    this.setData({ listLoading: true });

    try {
      const res = await getMyItems({
        pageNo: pn,
        pageSize: this.data.pageSize,
        status: status === "all" ? undefined : status
      });
      if (res.success && res.data) {
        const chunk = res.data || [];
        const prev = this.data.items || [];
        const nextItems = pn === 1 ? chunk : prev.concat(chunk);
        const finished = chunk.length < this.data.pageSize;
        this.setData({
          items: nextItems,
          listFinished: finished,
          pageNo: pn + 1,
          listLoading: false
        });
        this.updateDisplayItems();
      } else {
        this.setData({ listLoading: false, listFinished: true });
      }
    } catch (e) {
      console.error("加载我的物品失败:", e);
      this.setData({ listLoading: false, listFinished: true });
    }
  },

  onTabChange(e) {
    const index = Number(e.currentTarget.dataset.index);
    const status = this.data.statusList[index].value;
    this.setData({ activeTabIndex: index }, () => {
      this.loadItems(status, true);
    });
  },

  onReachBottom() {
    const status = this.data.statusList[this.data.activeTabIndex].value;
    this.loadItems(status, false);
  },

  toggleCollapse(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({
      activeCollapse: this.data.activeCollapse === key ? "" : key
    });
  },

  showPointsRule() {
    this.setData({ showPointsRulePopup: true });
  },

  hidePointsRule() {
    this.setData({ showPointsRulePopup: false });
  },

  copyBlockchainId(e) {
    const id = e.currentTarget.dataset.id;
    if (!id) return;
    wx.setClipboardData({
      data: String(id),
      success() {
        wx.showToast({ title: "已复制", icon: "none" });
      }
    });
  },

  goSettings() {
    wx.showToast({ title: "设置页开发中", icon: "none" });
  },

  openCamera() {
    wx.showToast({ title: "扫描功能开发中", icon: "none" });
  },

  onShare() {
    wx.showToast({ title: "分享功能开发中", icon: "none" });
  },

  editProfile() {
    wx.showToast({ title: "编辑资料开发中", icon: "none" });
  },

  viewStuffDetails(e) {
    const item = e.currentTarget.dataset.item;
    if (!item || !item.id) return;
    wx.showToast({ title: "物品详情页开发中", icon: "none" });
  },

  viewOffers(e) {
    const item = e.currentTarget.dataset.item;
    if (!item || !item.id) return;
    wx.showToast({ title: "报价页开发中", icon: "none" });
  },

  showCancelDialog(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({
      showCancelTransfer: true,
      cancelItemId: id || "",
      cancelReason: ""
    });
  },

  hideCancelDialog() {
    this.setData({
      showCancelTransfer: false,
      cancelItemId: "",
      cancelReason: ""
    });
  },

  onCancelReasonInput(e) {
    this.setData({ cancelReason: e.detail.value });
  },

  async confirmCancelTransfer() {
    const reason = (this.data.cancelReason || "").trim();
    if (!reason) {
      wx.showToast({ title: "请输入取消原因", icon: "none" });
      return;
    }
    const itemId = this.data.cancelItemId;
    if (!itemId) return;

    try {
      wx.showLoading({ title: "提交中...", mask: true });
      const res = await cancelTransferApi({
        itemId,
        cancelReason: reason
      });
      if (res.success) {
        wx.showToast({ title: "取消出让成功", icon: "success" });
        this.hideCancelDialog();
        const status = this.data.statusList[this.data.activeTabIndex].value;
        await this.loadItems(status, true);
      }
    } catch (err) {
      console.error("取消出让失败:", err);
    } finally {
      wx.hideLoading();
    }
  },

  noop() {}
});
