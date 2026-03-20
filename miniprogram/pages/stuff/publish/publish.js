const { uploadFile, publishItem } = require('../../../api/stuff.js');
const { ITEM_TYPE_COLUMNS } = require('../../../constants/stuff.js');

Page({
  data: {
    form: {
      name: '',
      clazz: '',
      clazzText: '',
      description: '',
      depreciation: 5,
      valuation: '10',
    },
    images: [],
    uploading: false,
    submitting: false,
    itemTypeColumns: ITEM_TYPE_COLUMNS,
    typePickIndex: 0,
  },

  onLoad() {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({ url: '/pages/user/login/login' });
      return;
    }
  },

  onNameInput(e) {
    this.setData({ 'form.name': e.detail.value });
  },

  onDescInput(e) {
    this.setData({ 'form.description': e.detail.value });
  },

  onValuationInput(e) {
    this.setData({ 'form.valuation': e.detail.value });
  },

  onDepreciationChange(e) {
    this.setData({ 'form.depreciation': Number(e.detail.value) || 5 });
  },

  onTypePick(e) {
    const idx = Number(e.detail.value);
    const row = this.data.itemTypeColumns[idx];
    if (!row) return;
    this.setData({
      'form.clazz': row.value,
      'form.clazzText': row.text,
      typePickIndex: idx,
    });
  },

  chooseImages() {
    const remain = 5 - this.data.images.length;
    if (remain <= 0) return;
    wx.chooseMedia({
      count: remain,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const files = res.tempFiles || [];
        (async () => {
          for (let i = 0; i < files.length; i += 1) {
            await this.uploadOne(files[i].tempFilePath);
          }
        })();
      },
    });
  },

  async uploadOne(tempPath) {
    this.setData({ uploading: true });
    const prev = this.data.images.slice();
    const idx = prev.length;
    prev.push({ url: '', loading: true, imgKey: `u-${Date.now()}-${idx}` });
    this.setData({ images: prev });
    try {
      const res = await uploadFile(tempPath);
      const next = this.data.images.slice();
      if (next[idx]) {
        next[idx] = { ...next[idx], url: res.data, loading: false };
        this.setData({ images: next });
      }
    } catch (_) {
      const next = this.data.images.slice();
      if (next[idx] && next[idx].loading) next.splice(idx, 1);
      this.setData({ images: next });
    } finally {
      this.setData({ uploading: false });
    }
  },

  removeImage(e) {
    const idx = Number(e.currentTarget.dataset.index);
    const images = this.data.images.slice();
    images.splice(idx, 1);
    this.setData({ images });
  },

  async onSubmit() {
    const { form, images, submitting } = this.data;
    if (submitting) return;
    if (!form.name || !form.name.trim()) {
      wx.showToast({ title: '请填写物品名称', icon: 'none' });
      return;
    }
    if (!form.clazzText) {
      wx.showToast({ title: '请选择物品类型', icon: 'none' });
      return;
    }
    if (!form.description || !form.description.trim()) {
      wx.showToast({ title: '请填写物品描述', icon: 'none' });
      return;
    }
    const valuationNum = parseFloat(form.valuation);
    if (Number.isNaN(valuationNum) || valuationNum < 0 || valuationNum > 999999) {
      wx.showToast({ title: '请填写有效估值 0–999999', icon: 'none' });
      return;
    }
    const done = images.filter((x) => x.url && !x.loading);
    if (done.length === 0) {
      wx.showToast({ title: '请至少上传一张图片', icon: 'none' });
      return;
    }
    const loading = images.some((x) => x.loading);
    if (loading) {
      wx.showToast({ title: '图片上传中，请稍候', icon: 'none' });
      return;
    }

    const ok = await new Promise((resolve) => {
      wx.showModal({
        title: '确认提交',
        content:
          '平台仅提供信息撮合服务，不参与任何交易环节。发布后，所有交易均由您与对方线下自行协商完成，平台不承担交易责任。确定要发布吗？',
        success: (r) => resolve(r.confirm),
      });
    });
    if (!ok) return;

    this.setData({ submitting: true });
    try {
      const res = await publishItem({
        itemTitle: form.name.trim(),
        itemType: form.clazzText,
        itemImageList: done.map((x) => x.url),
        itemDescription: form.description.trim(),
        depreciation: form.depreciation,
        valuation: valuationNum,
      });
      if (res.success) {
        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => wx.navigateBack({ fail: () => wx.switchTab({ url: '/pages/home/home' }) }), 400);
      }
    } catch (_) {
      wx.showModal({ title: '发布失败', content: '请稍后重试', showCancel: false });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
