Page({
  data: {
    activeName: '1',
    supportEmail: 'support@x-platform.example',
  },

  onCollapseTap(e) {
    const name = e.currentTarget.dataset.name;
    const next = this.data.activeName === name ? '' : name;
    this.setData({ activeName: next });
  },

  onOnlineService() {
    wx.showToast({ title: '在线客服入口待接入', icon: 'none' });
  },

  onFeedback() {
    wx.showToast({ title: '反馈入口待接入', icon: 'none' });
  },

  copyEmail() {
    const text = this.data.supportEmail;
    wx.setClipboardData({
      data: text,
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
