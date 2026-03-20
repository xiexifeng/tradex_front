const { listSquareItems } = require("../../api/stuff");

Page({
  data: {
    userInfo: null,
    searchValue: "",
    banners: [
      "https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg",
      "https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg"
    ],
    features: [
      { icon: "shop-o", text: "逛换物广场", color: "#1989fa", key: "square" },
      { icon: "plus", text: "发布闲置", color: "#ff6b6b", key: "publish" },
      { icon: "records", text: "我的交易", color: "#07c160", key: "trade" },
      { icon: "bell", text: "消息通知", color: "#ff976a", key: "notification" }
    ],
    items: [],
    loading: false,
    finished: false,
    itemTypeFilter: "all",
    tradeMethodFilter: "all",
    sortOrder: "newest",
    itemTypeOptions: [
      { text: "全部类型", value: "all" },
      { text: "数码手机", value: "数码手机" },
      { text: "电脑办公", value: "电脑办公" },
      { text: "服装配饰", value: "服装配饰" },
      { text: "图书音像", value: "图书音像" },
      { text: "其他", value: "其他" }
    ],
    tradeMethodOptions: [
      { text: "全部交易", value: "all" },
      { text: "人民币", value: "ITEM_TO_MONEY" },
      { text: "积分", value: "ITEM_TO_POINTS" },
      { text: "以物换物", value: "ITEM_TO_ITEM" }
    ],
    sortOptions: [
      { text: "最新发布", value: "newest" },
      { text: "价格最低", value: "price_asc" },
      { text: "价格最高", value: "price_desc" }
    ],
    activeTab: "home",
    pageNo: 1,
    pageSize: 4
  },

  onLoad() {
    this.loadItems(true);
    this.syncUserInfo();
  },

  onShow() {
    this.syncUserInfo();
  },

  // 同步全局用户信息
  syncUserInfo() {
    try {
      const userContext = wx.getStorageSync("userContext");
      this.setData({
        userInfo: userContext || null
      });
    } catch (e) {
      console.error("读取用户信息失败:", e);
    }
  },

  // 加载物品列表
  async loadItems(reset) {
    if (this.data.loading || this.data.finished && !reset) return;

    const pageNo = reset ? 1 : this.data.pageNo + 1;
    this.setData({ loading: true });

    try {
      const res = await listSquareItems({
        pageNo,
        pageSize: this.data.pageSize,
        itemType: this.data.itemTypeFilter === "all" ? undefined : this.data.itemTypeFilter,
        tradeMethod: this.data.tradeMethodFilter === "all" ? undefined : this.data.tradeMethodFilter,
        sortBy: this.data.sortOrder
      });

      const list = res.data || [];
      const newItems = reset ? list : this.data.items.concat(list);

      this.setData({
        items: newItems,
        loading: false,
        finished: list.length < this.data.pageSize,
        pageNo
      });
    } catch (e) {
      this.setData({
        loading: false,
        finished: true
      });
    }
  },

  onReachBottom() {
    this.loadItems(false);
  },

  onClickRight() {
    wx.navigateTo({
      url: "/pages/login/login"
    });
  },

  goToPublish() {
    wx.navigateTo({
      url: "/pages/stuff/publish/publish"
    });
  },

  goToProfile() {
    // TODO: 跳转个人中心
  },

  onViewClick(e) {
    const id = e.detail;
    if (!id) return;
    wx.navigateTo({
      url: `/pages/square/item-detail/item-detail?id=${encodeURIComponent(id)}`
    });
  },

  onSearchClick() {
    // TODO: 跳转搜索页
  },

  onFeatureTap(e) {
    const key = e.currentTarget.dataset.key;
    // TODO: 按 key 跳转对应页面
    console.log("feature tap", key);
  },

  onTabChange(e) {
    const key = e.detail.key;
    this.setData({ activeTab: key });
    // 具体跳转逻辑由 app-tab-bar 内部 pagesMap + 各页面自身登录态控制
  }
});
