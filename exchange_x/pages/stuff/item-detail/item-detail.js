const { getItemDetail } = require("../../../api/stuff");
const { getValueText } = require("../../../constants/dict");
const {
  getItemStatusText,
  getTransferStatusText,
  getItemStatusTagClass,
  getTransferTagClass
} = require("../../../constants/profile");

Page({
  data: {
    itemId: "",
    itemDetail: {},

    headerTags: [],

    statusBadgeText: "",
    statusBadgeClass: "default",

    showBlockchain: false,
    showTradeSettings: false,
    showStats: false,

    tradeMethodText: "",
    deliveryMethodText: "",

    showInitiateTransfer: false,
    showCancelTransfer: false,
    showOffers: false,
    showTradeDetails: false
  },

  onLoad(options) {
    const token = wx.getStorageSync("token");
    const itemId = options && options.id ? String(options.id) : "";

    if (!itemId) {
      wx.showToast({ title: "物品ID不存在", icon: "none" });
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }

    this.setData({ itemId });

    if (!token) {
      try {
        wx.setStorageSync(
          "loginRedirect",
          `/pages/stuff/item-detail/item-detail?id=${encodeURIComponent(itemId)}`
        );
      } catch (e) {}
      wx.redirectTo({ url: "/pages/login/login" });
      return;
    }

    this.fetchDetail();
  },

  async fetchDetail() {
    const { itemId } = this.data;
    if (!itemId) return;

    try {
      wx.showLoading({ title: "加载中...", mask: true });
      const res = await getItemDetail(itemId);
      if (res && res.success && res.data) {
        this.setData({ itemDetail: res.data });
        this.buildDerived();
      } else {
        wx.showToast({ title: (res && res.desc) || "获取详情失败", icon: "none" });
      }
    } catch (e) {
      console.error("获取物品详情失败:", e);
      wx.showToast({ title: "物品已逃走", icon: "none" });
      setTimeout(() => wx.navigateBack(), 900);
    } finally {
      wx.hideLoading();
    }
  },

  buildDerived() {
    const itemDetail = this.data.itemDetail || {};

    const tags = [];
    if (itemDetail.itemType) tags.push(String(itemDetail.itemType));
    if (typeof itemDetail.depreciation === "number") tags.push(`${itemDetail.depreciation}成新`);
    if (itemDetail.deliveryMethod) {
      const deliveryText = getValueText(itemDetail.deliveryMethod, "deliveryMethod");
      if (deliveryText) tags.push(deliveryText);
    }

    const transferStatus = itemDetail.transferStatus || "";
    const status = itemDetail.status || "";

    const statusBadgeText =
      transferStatus === "own"
        ? getItemStatusText(status)
        : getTransferStatusText(transferStatus);

    const statusBadgeClass =
      transferStatus === "own"
        ? getItemStatusTagClass(status)
        : getTransferTagClass(transferStatus);

    const showBlockchain =
      !!itemDetail.blockchainId || (itemDetail.transferTimes > 0 && itemDetail.transferTimes) || !!itemDetail.lastUserId;

    const showTradeSettings =
      transferStatus === "transferring" && !!itemDetail.tradeMethod;

    const showStats =
      (itemDetail.viewCount > 0 || itemDetail.loveCount > 0 || itemDetail.collectionCount > 0) &&
      true;

    const tradeMethodText = itemDetail.tradeMethod
      ? getValueText(itemDetail.tradeMethod, "tradeMethod")
      : "";

    const deliveryMethodText = itemDetail.deliveryMethod
      ? getValueText(itemDetail.deliveryMethod, "deliveryMethod")
      : "";

    const showInitiateTransfer = transferStatus === "own" && status === "active";
    const showCancelTransfer = transferStatus === "transferring" && !!itemDetail.isCanCancel;
    const showOffers = transferStatus === "transferring";
    const showTradeDetails = transferStatus === "trading";

    this.setData({
      headerTags: tags,
      statusBadgeText,
      statusBadgeClass: statusBadgeClass || "default",
      showBlockchain,
      showTradeSettings,
      showStats,
      tradeMethodText,
      deliveryMethodText,
      showInitiateTransfer,
      showCancelTransfer,
      showOffers,
      showTradeDetails
    });
  },

  copyBlockchainId(e) {
    const blockchainId = e.currentTarget.dataset.blockchainId;
    if (!blockchainId) return;
    wx.setClipboardData({
      data: String(blockchainId),
      success: () => {
        wx.showToast({ title: "已复制", icon: "none" });
      }
    });
  },

  initiateTransfer() {
    wx.showToast({ title: "发起出让开发中", icon: "none" });
  },

  cancelTransfer() {
    wx.showToast({ title: "取消出让开发中", icon: "none" });
  },

  viewOffers() {
    wx.showToast({ title: "报价页开发中", icon: "none" });
  },

  viewTradeDetails() {
    wx.showToast({ title: "交易详情页开发中", icon: "none" });
  }
});

