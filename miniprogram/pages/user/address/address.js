const addressApi = require('../../../api/address.js');

Page({
  data: {
    list: [],
    rawList: [],
  },

  onShow() {
    this.loadList();
  },

  async loadList() {
    try {
      const res = await addressApi.listReceiveAddress();
      const arr = (res.success && res.data) || [];
      const list = arr.map((item) => ({
        id: item.id,
        name: item.recipientName,
        tel: item.phone,
        line: `${item.province}${item.city}${item.district}${item.address}`,
        isDefault: item.isDefault,
      }));
      this.setData({ list, rawList: arr });
    } catch (_) {
      this.setData({ list: [], rawList: [] });
    }
  },

  add() {
    wx.navigateTo({ url: '/pages/user/address/new/new' });
  },

  edit(e) {
    const id = e.currentTarget.dataset.id;
    const source = this.data.rawList.find((a) => a.id === id);
    if (!source) {
      wx.navigateTo({ url: `/pages/user/address/edit/edit?id=${id}` });
      return;
    }
    const q = [
      `id=${encodeURIComponent(source.id)}`,
      `recipientName=${encodeURIComponent(source.recipientName || '')}`,
      `phone=${encodeURIComponent(source.phone || '')}`,
      `province=${encodeURIComponent(source.province || '')}`,
      `city=${encodeURIComponent(source.city || '')}`,
      `district=${encodeURIComponent(source.district || '')}`,
      `address=${encodeURIComponent(source.address || '')}`,
      `isDefault=${source.isDefault ? '1' : '0'}`,
    ].join('&');
    wx.navigateTo({ url: `/pages/user/address/edit/edit?${q}` });
  },
});
