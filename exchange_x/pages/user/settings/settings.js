Page({
  data: {},

  onLoad() {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.setStorageSync("loginRedirect", "/pages/user/settings/settings");
      wx.redirectTo({ url: "/pages/login/login" });
      return;
    }
  },

  goToSecurity() {
    wx.navigateTo({
      url: "/pages/user/security/security"
    });
  },

  goToAddress() {
    wx.showToast({ title: "收货地址开发中", icon: "none" });
  },

  goToHelp() {
    wx.showToast({ title: "帮助与客服开发中", icon: "none" });
  },

  goToAbout() {
    wx.showToast({ title: "关于X平台开发中", icon: "none" });
  },

  clearLogin() {
    try {
      wx.removeStorageSync("token");
      wx.removeStorageSync("userContext");
      wx.removeStorageSync("loginAccount");
    } catch (e) {}
  },

  switchAccount() {
    this.clearLogin();
    wx.reLaunch({ url: "/pages/login/login" });
  },

  logout() {
    wx.showModal({
      title: "退出登录",
      content: "确定要退出登录吗？",
      confirmText: "退出",
      cancelText: "取消",
      success: (res) => {
        if (res.confirm) {
          this.clearLogin();
          wx.reLaunch({ url: "/pages/login/login" });
        }
      }
    });
  }
});

