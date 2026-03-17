function handleTabChange(key, userInfo) {
  // 未登录，访问“我的” -> 跳转登录页
  if (key === "profile" && !userInfo) {
    wx.navigateTo({
      url: "/pages/login/login"
    });
    return;
  }

  // 中间发布按钮 -> 发布页
  if (key === "publish") {
    wx.navigateTo({
      url: "/pages/stuff/publish/publish"
    });
    return;
  }

  // 首页 tab：如果在其他页面使用 tabbar，可以视情况切回首页
  if (key === "home") {
    // 当前只有 home 页面使用 tabbar，先不强制跳转
    return;
  }

  // 预留：消息 / 交易 等后续可以补充统一跳转逻辑
  // if (key === "notification") { ... }
  // if (key === "trade") { ... }
}

module.exports = {
  handleTabChange
};

