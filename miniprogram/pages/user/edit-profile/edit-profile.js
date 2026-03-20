const userApi = require('../../../api/user.js');
const { uploadFile } = require('../../../api/stuff.js');

Page({
  data: {
    form: {
      nickname: '',
      gender: '',
      birthday: '',
      avatarUrl: '',
      address: '',
      wechat: '',
      qq: '',
      brief: '',
    },
    displayAvatar: '',
    genderLabels: ['男', '女'],
    genderValues: ['MAN', 'FEMALE'],
    genderIndex: 0,
    saving: false,
    today: '',
  },

  onLoad() {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.setData({ today });
    const userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) return;
    let genderIndex = 0;
    const gi = this.data.genderValues.indexOf(userInfo.gender || '');
    if (gi >= 0) genderIndex = gi;
    this.setData({
      form: {
        nickname: userInfo.nickname || '',
        gender: userInfo.gender || '',
        birthday: userInfo.birthday || '',
        avatarUrl: userInfo.avatarUrl || '',
        address: userInfo.address || '',
        wechat: userInfo.wechat || '',
        qq: userInfo.qq || '',
        brief: userInfo.brief || '',
      },
      displayAvatar: userInfo.avatarUrl || '',
      genderIndex,
    });
  },

  onInput(e) {
    const f = e.currentTarget.dataset.field;
    this.setData({ [`form.${f}`]: e.detail.value });
  },

  onGenderChange(e) {
    const idx = Number(e.detail.value);
    const v = this.data.genderValues[idx];
    this.setData({
      genderIndex: idx,
      'form.gender': v,
    });
  },

  onBirthChange(e) {
    this.setData({ 'form.birthday': e.detail.value });
  },

  chooseAvatar() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: async (res) => {
        const p = res.tempFiles && res.tempFiles[0] && res.tempFiles[0].tempFilePath;
        if (!p) return;
        try {
          wx.showLoading({ title: '上传中' });
          const r = await uploadFile(p);
          if (r.success && r.data) {
            this.setData({ 'form.avatarUrl': r.data, displayAvatar: r.data });
            wx.showToast({ title: '头像已更新', icon: 'success' });
          }
        } catch (_) {
        } finally {
          wx.hideLoading();
        }
      },
    });
  },

  async saveProfile() {
    const f = this.data.form;
    if (!f.nickname || !String(f.nickname).trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }
    this.setData({ saving: true });
    try {
      const res = await userApi.updateUserProfile({
        nickname: f.nickname.trim(),
        gender: f.gender || undefined,
        birthday: f.birthday || undefined,
        avatarUrl: f.avatarUrl || undefined,
        address: f.address.trim() || undefined,
        wechat: f.wechat.trim() || undefined,
        qq: f.qq.trim() || undefined,
        brief: f.brief.trim() || undefined,
      });
      if (res.success) {
        const prev = wx.getStorageSync('userInfo') || {};
        wx.setStorageSync('userInfo', {
          ...prev,
          nickname: f.nickname.trim(),
          gender: f.gender,
          birthday: f.birthday,
          avatarUrl: f.avatarUrl,
          address: f.address.trim(),
          wechat: f.wechat.trim(),
          qq: f.qq.trim(),
          brief: f.brief.trim(),
        });
        wx.showToast({ title: '保存成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 300);
      }
    } catch (_) {
    } finally {
      this.setData({ saving: false });
    }
  },
});
