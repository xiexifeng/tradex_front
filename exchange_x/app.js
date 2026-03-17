App({
  onLaunch() {
    console.log("exchange_x 小程序启动");
    // 从本地存储恢复用户信息
    try {
      const userContext = wx.getStorageSync("userContext");
      if (userContext) {
        this.globalData.userInfo = userContext;
      }
    } catch (e) {
      console.error("恢复登录态失败:", e);
    }
  },
  globalData: {
    userInfo: null
  }
});
