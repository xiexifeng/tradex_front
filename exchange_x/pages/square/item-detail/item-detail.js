const {
  getSquareItemDetail,
  socialItem
} = require("../../../api/stuff");

const { getValueText } = require("../../../constants/dict");

Page({
  data: {
    itemId: "",
    itemDetail: {},
    headerTags: [],

    isLiked: false,
    isCollected: false,
    isSelf: false,

    tradeMethodText: "",
    deliveryMethodText: "",
    tradeScoreText: "登录后可查看",

    bottomActionText: "申请交易"
  },

  onLoad(options) {
    const token = wx.getStorageSync("token");
    const loginAccount = wx.getStorageSync("loginAccount") || {};
    const currentUserId = loginAccount.userId || "";

    const itemId = options && options.id ? String(options.id) : "";
    if (!itemId) {
      wx.showToast({ title: "物品ID不存在", icon: "none" });
      setTimeout(() => wx.navigateBack(), 600);
      return;
    }

    this.setData({
      itemId,
      isSelf: currentUserId && this.data.itemDetail && this.data.itemDetail.userId === currentUserId
    });

    this.refreshUserInfo(currentUserId, token);
    this.fetchDetail(itemId);
  },

  onShow() {
    // 切换登录态回来看，更新底部按钮可用性
    const loginAccount = wx.getStorageSync("loginAccount") || {};
    const currentUserId = loginAccount.userId || "";
    if (currentUserId && this.data.itemDetail && this.data.itemDetail.userId) {
      this.setData({ isSelf: String(this.data.itemDetail.userId) === String(currentUserId) });
    }
  },

  noop() {},

  refreshUserInfo(currentUserId, token) {
    // 预先计算底部禁用状态
    if (currentUserId && this.data.itemDetail && this.data.itemDetail.userId) {
      this.setData({ isSelf: String(this.data.itemDetail.userId) === String(currentUserId) });
    } else {
      this.setData({ isSelf: false });
    }
    // token 不直接影响 UI；但用于 tradeScore 的文案
    if (token && this.data.itemDetail && this.data.itemDetail.userExt) {
      const score = this.data.itemDetail.userExt.tradeScore;
      this.setData({ tradeScoreText: score === -999 ? "登录后可查看" : `${score}分` });
    }
  },

  async fetchDetail(itemId) {
    try {
      wx.showLoading({ title: "加载中...", mask: true });
      const res = await getSquareItemDetail(itemId);
      if (res && res.success && res.data) {
        const detail = res.data;
        const isLiked = !!detail.isLiked;
        const isCollected = !!detail.isCollected;
        const loginAccount = wx.getStorageSync("loginAccount") || {};
        const currentUserId = loginAccount.userId || "";
        const isSelf = currentUserId && String(detail.userId) === String(currentUserId);

        const headerTags = [];
        if (detail.itemType) headerTags.push(String(detail.itemType));
        if (typeof detail.depreciation === "number") headerTags.push(`${detail.depreciation}成新`);
        if (detail.deliveryMethod) {
          const deliveryText = getValueText(detail.deliveryMethod, "deliveryMethod");
          if (deliveryText) headerTags.push(deliveryText);
        }

        const tradeMethodText = detail.tradeMethod
          ? getValueText(detail.tradeMethod, "tradeMethod")
          : "";
        const deliveryMethodText = detail.deliveryMethod
          ? getValueText(detail.deliveryMethod, "deliveryMethod")
          : "";

        const tradeScore = detail.userExt && detail.userExt.tradeScore;
        const tradeScoreText = tradeScore === -999 ? "登录后可查看" : `${tradeScore || 0}分`;

        const bottomActionText =
          detail.tradeMethod === "ITEM_TO_POINTS" ? "立即购买" : "申请交易";

        this.setData({
          itemDetail: detail,
          isLiked,
          isCollected,
          isSelf,
          headerTags,
          tradeMethodText,
          deliveryMethodText,
          tradeScoreText,
          bottomActionText
        });

        // 仅在已登录时记录浏览
        const token = wx.getStorageSync("token");
        if (token) {
          this.tryAddViewRecord(detail.id);
        }
      } else {
        wx.showToast({ title: (res && res.desc) || "获取详情失败", icon: "none" });
      }
    } catch (e) {
      console.error("获取广场物品详情失败:", e);
      wx.showToast({ title: "获取详情失败", icon: "none" });
    } finally {
      wx.hideLoading();
    }
  },

  async tryAddViewRecord(itemId) {
    try {
      await socialItem({
        itemId,
        socialType: "VIEW",
        socialOperate: "ADD"
      });
      // viewCount 在后端不一定立即返回；这里做轻量乐观更新
      const cur = Number(this.data.itemDetail.viewCount || 0);
      this.setData({ "itemDetail.viewCount": cur + 1 });
    } catch (e) {
      console.error("添加浏览记录失败:", e);
    }
  },

  requireLoginAndRedirect(itemId) {
    const redirect = `/pages/square/item-detail/item-detail?id=${encodeURIComponent(itemId)}`;
    try {
      wx.setStorageSync("loginRedirect", redirect);
    } catch (e) {}
    wx.navigateTo({ url: "/pages/login/login" });
  },

  copySellerBlockchainId(e) {
    const blockchainId = e.currentTarget.dataset.blockchainId;
    if (!blockchainId) return;
    wx.setClipboardData({
      data: String(blockchainId),
      success: () => wx.showToast({ title: "已复制", icon: "none" })
    });
  },

  contactSeller() {
    const phone = (this.data.itemDetail.contactInfo && this.data.itemDetail.contactInfo.phone) || "";
    if (!phone) {
      wx.showToast({ title: "暂无联系方式", icon: "none" });
      return;
    }
    wx.showToast({ title: `联系方式：${phone}`, icon: "none" });
  },

  async toggleLike() {
    const token = wx.getStorageSync("token");
    const loginAccount = wx.getStorageSync("loginAccount") || {};
    if (!token || !loginAccount.userId) {
      this.requireLoginAndRedirect(this.data.itemId);
      return;
    }

    const itemId = this.data.itemDetail.id;
    if (!itemId) return;

    const operate = this.data.isLiked ? "CANCEL" : "ADD";
    try {
      wx.showLoading({ title: "处理中...", mask: true });
      const res = await socialItem({
        itemId,
        socialType: "LOVE",
        socialOperate: operate
      });
      if (res && res.success) {
        const nextLiked = !this.data.isLiked;
        const loveCount = Number(this.data.itemDetail.loveCount || 0) + (nextLiked ? 1 : -1);
        this.setData({
          isLiked: nextLiked,
          "itemDetail.loveCount": Math.max(0, loveCount)
        });
        wx.showToast({ title: nextLiked ? "已点赞" : "已取消点赞", icon: "none" });
      }
    } catch (e) {
      console.error("点赞失败:", e);
      wx.showToast({ title: "操作失败", icon: "none" });
    } finally {
      wx.hideLoading();
    }
  },

  async toggleCollect() {
    const token = wx.getStorageSync("token");
    const loginAccount = wx.getStorageSync("loginAccount") || {};
    if (!token || !loginAccount.userId) {
      this.requireLoginAndRedirect(this.data.itemId);
      return;
    }

    const itemId = this.data.itemDetail.id;
    if (!itemId) return;

    const operate = this.data.isCollected ? "CANCEL" : "ADD";
    try {
      wx.showLoading({ title: "处理中...", mask: true });
      const res = await socialItem({
        itemId,
        socialType: "COLLECTION",
        socialOperate: operate
      });
      if (res && res.success) {
        const nextCollected = !this.data.isCollected;
        const collectionCount =
          Number(this.data.itemDetail.collectionCount || 0) + (nextCollected ? 1 : -1);
        this.setData({
          isCollected: nextCollected,
          "itemDetail.collectionCount": Math.max(0, collectionCount)
        });
        wx.showToast({ title: nextCollected ? "已收藏" : "已取消收藏", icon: "none" });
      }
    } catch (e) {
      console.error("收藏失败:", e);
      wx.showToast({ title: "操作失败", icon: "none" });
    } finally {
      wx.hideLoading();
    }
  },

  handleBuyOrExchange() {
    if (this.data.isSelf) return;
    const token = wx.getStorageSync("token");
    const loginAccount = wx.getStorageSync("loginAccount") || {};
    if (!token || !loginAccount.userId) {
      this.requireLoginAndRedirect(this.data.itemId);
      return;
    }

    wx.showToast({ title: "购买/交易申请开发中", icon: "none" });
  }
});

