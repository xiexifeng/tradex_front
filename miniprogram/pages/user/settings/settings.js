const { clearSession } = require('../../../utils/auth.js');

Page({
  data: {},

  goSecurity() {
    wx.navigateTo({ url: '/pages/user/security/security' });
  },

  goAddress() {
    wx.navigateTo({ url: '/pages/user/address/address' });
  },

  goHelp() {
    wx.navigateTo({ url: '/pages/help/help/help' });
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/help/about-platform/about-platform' });
  },

  switchAccount() {
    wx.navigateTo({ url: '/pages/user/login/login' });
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (r) => {
        if (r.confirm) {
          clearSession();
          wx.reLaunch({ url: '/pages/user/login/login' });
        }
      },
    });
  },
});
