Page({
  data: {
    supportEmail: 'support@x-platform.example',
    bizEmail: 'business@x-platform.example',
  },

  copySupport() {
    wx.setClipboardData({
      data: this.data.supportEmail,
      success: () => wx.showToast({ title: '已复制', icon: 'success' }),
    });
  },

  copyBiz() {
    wx.setClipboardData({
      data: this.data.bizEmail,
      success: () => wx.showToast({ title: '已复制', icon: 'success' }),
    });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/agreement/privacy/privacy' });
  },

  goSwap() {
    wx.navigateTo({ url: '/pages/agreement/swap/swap' });
  },
});
