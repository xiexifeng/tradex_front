const addressApi = require('../../../../api/address.js');

Page({
  data: {
    id: '',
    recipientName: '',
    phone: '',
    region: [],
    regionText: '',
    detail: '',
    isDefault: false,
  },

  onLoad(options) {
    if (!options.id) return;
    const region = [options.province || '', options.city || '', options.district || ''].filter(Boolean);
    const regionText = region.join('');
    this.setData({
      id: options.id,
      recipientName: options.recipientName ? decodeURIComponent(options.recipientName) : '',
      phone: options.phone ? decodeURIComponent(options.phone) : '',
      region: region.length === 3 ? region : [],
      regionText,
      detail: options.address ? decodeURIComponent(options.address) : '',
      isDefault: options.isDefault === '1' || options.isDefault === 'true',
    });
  },

  onRegionChange(e) {
    const v = e.detail.value;
    this.setData({
      region: v,
      regionText: Array.isArray(v) ? v.join('') : '',
    });
  },

  onInput(e) {
    const f = e.currentTarget.dataset.field;
    this.setData({ [f]: e.detail.value });
  },

  onDefaultChange(e) {
    this.setData({ isDefault: e.detail.value });
  },

  async save() {
    const { id, recipientName, phone, region, detail, isDefault } = this.data;
    if (!recipientName || !phone || !detail || !region || region.length < 3) {
      wx.showToast({ title: '请填写完整并选择省市区', icon: 'none' });
      return;
    }
    try {
      await addressApi.updateReceiveAddress({
        id,
        recipientName,
        phone,
        province: region[0],
        city: region[1],
        district: region[2],
        address: detail,
        isDefault: !!isDefault,
      });
      wx.showToast({ title: '保存成功', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 300);
    } catch (_) {
    }
  },

  async remove() {
    const { id } = this.data;
    if (!id) return;
    const ok = await new Promise((resolve) => {
      wx.showModal({
        title: '删除地址',
        content: '确定删除该地址？',
        success: (r) => resolve(r.confirm),
      });
    });
    if (!ok) return;
    try {
      await addressApi.deleteReceiveAddress(id);
      wx.showToast({ title: '已删除', icon: 'success' });
      setTimeout(() => wx.navigateBack(), 300);
    } catch (_) {
    }
  },
});
