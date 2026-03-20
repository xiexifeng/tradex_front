const userApi = require('../../../api/user.js');

Page({
  data: {
    form: {
      phone: '',
      verfiyCode: '',
      nickName: '',
      password: '',
      confirmPassword: '',
      gender: '',
      birthday: '',
      avatarUrl: '',
      email: '',
      brief: '',
    },
    genderLabels: ['男', '女'],
    genderValues: ['1', '2'],
    genderIndex: 0,
    phoneError: '',
    countdown: 0,
    submitting: false,
    pwdHidden: true,
    pwd2Hidden: true,
    inviteUserId: '',
    inviteTime: '',
    today: '',
  },

  _timer: null,

  onUnload() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  onLoad(options) {
    const d = new Date();
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    this.setData({ today });
    if (options.inviteUserId) this.setData({ inviteUserId: options.inviteUserId });
    if (options.inviteTime) this.setData({ inviteTime: options.inviteTime });
  },

  onInput(e) {
    const f = e.currentTarget.dataset.field;
    this.setData({ [`form.${f}`]: e.detail.value });
  },

  togglePwd() {
    this.setData({ pwdHidden: !this.data.pwdHidden });
  },

  togglePwd2() {
    this.setData({ pwd2Hidden: !this.data.pwd2Hidden });
  },

  async onPhoneBlur() {
    const phone = this.data.form.phone;
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      this.setData({ phoneError: '' });
      return;
    }
    try {
      const ok = await userApi.verifyPhone(phone);
      this.setData({
        phoneError: ok === false ? '该手机号已注册，请直接登录' : '',
      });
    } catch (_) {
      this.setData({ phoneError: '' });
    }
  },

  async onSendCode() {
    const phone = this.data.form.phone;
    if (!phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }
    if (this.data.countdown > 0) return;
    try {
      await userApi.sendSms(phone);
      wx.showToast({ title: '验证码已发送', icon: 'success' });
      this.setData({ countdown: 60 });
      if (this._timer) clearInterval(this._timer);
      this._timer = setInterval(() => {
        const n = this.data.countdown - 1;
        this.setData({ countdown: n <= 0 ? 0 : n });
        if (n <= 0 && this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }
      }, 1000);
    } catch (_) {}
  },

  onGenderChange(e) {
    const idx = Number(e.detail.value);
    const v = this.data.genderValues[idx];
    this.setData({
      genderIndex: idx,
      'form.gender': v || '',
    });
  },

  onBirthdayChange(e) {
    this.setData({ 'form.birthday': e.detail.value });
  },

  goLogin() {
    wx.navigateBack({ fail: () => wx.redirectTo({ url: '/pages/user/login/login' }) });
  },

  async onSubmit() {
    const f = this.data.form;
    if (this.data.phoneError) {
      wx.showToast({ title: '请先解决手机号问题', icon: 'none' });
      return;
    }
    if (!f.phone || !/^1[3-9]\d{9}$/.test(f.phone)) {
      wx.showToast({ title: '请输入正确手机号', icon: 'none' });
      return;
    }
    if (!f.verfiyCode) {
      wx.showToast({ title: '请输入验证码', icon: 'none' });
      return;
    }
    if (!f.password || f.password.length < 6) {
      wx.showToast({ title: '密码不少于6位', icon: 'none' });
      return;
    }
    if (f.password !== f.confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }

    const payload = {
      phone: f.phone,
      verfiyCode: f.verfiyCode,
      password: f.password,
      nickName: f.nickName || undefined,
      gender: f.gender || undefined,
      birthday: f.birthday || undefined,
      avatarUrl: f.avatarUrl || undefined,
      brief: f.brief || undefined,
      email: f.email || undefined,
    };
    if (this.data.inviteUserId) {
      payload.inviteUserId = this.data.inviteUserId;
      const t = Number(this.data.inviteTime);
      if (!Number.isNaN(t)) payload.inviteTime = t;
    }

    this.setData({ submitting: true });
    try {
      const res = await userApi.register(payload);
      if (res.success) {
        wx.showToast({ title: '注册成功', icon: 'success' });
        setTimeout(() => this.goLogin(), 400);
      }
    } catch (_) {
    } finally {
      this.setData({ submitting: false });
    }
  },
});
