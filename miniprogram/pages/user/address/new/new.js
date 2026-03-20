const addressApi = require('../../../../api/address.js');

Page({
  data: {
    recipientName: '',
    phone: '',
    region: [],
    regionText: '',
    detail: '',
    isDefault: false,
  },

  onRegionChange(e) {
    const v = e.detail.value;
    const text = Array.isArray(v) ? v.join('') : '';
    this.setData({ region: v, regionText: text });
  },

  onInput(e) {
    const f = e.currentTarget.dataset.field;
    this.setData({ [f]: e.detail.value });
  },

  onDefaultChange(e) {
    this.setData({ isDefault: e.detail.value });
  },

  async save() {
    const { recipientName, phone, regionText, detail, isDefault } = this.data;
    if (!recipientName || !phone || !regionText || !detail) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }
    const province = this.data.region[0] || '';
    const city = this.data.region[1] || '';
    const district = this.data.region[2] || '';
    try {
      await addressApi.addReceiveAddress({
        recipientName,
        phone,
        province,
        city,
        district,
        address: detail,
        isDefault: !!isDefault,
      });
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 300);
    } catch (_) {
    }
  },
});
