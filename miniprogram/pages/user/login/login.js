const userApi = require('../../../api/user.js');
const { saveLoginSession } = require('../../../utils/auth.js');

Page({
  data: {
    tab: 0,
    passwordType: 'password',
    countdown: 0,
    passwordForm: { username: '', password: '' },
    codeForm: { phone: '', code: '' },
  },

  _timer: null,

  onUnload() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  onLoad() {},

  switchLoginTab(e) {
    const idx = Number(e.currentTarget.dataset.index);
    this.setData({ tab: idx });
  },

  togglePwd() {
    const t = this.data.passwordType === 'password' ? 'text' : 'password';
    this.setData({ passwordType: t });
  },

  onPwdAccountInput(e) {
    this.setData({ 'passwordForm.username': e.detail.value });
  },

  onPwdPassInput(e) {
    this.setData({ 'passwordForm.password': e.detail.value });
  },

  onCodePhoneInput(e) {
    this.setData({ 'codeForm.phone': e.detail.value });
  },

  onCodeInput(e) {
    this.setData({ 'codeForm.code': e.detail.value });
  },

  goRegister() {
    wx.navigateTo({ url: '/pages/user/register/register' });
  },

  goPrivacy() {
    wx.navigateTo({ url: '/pages/agreement/privacy/privacy' });
  },

  goSwap() {
    wx.navigateTo({ url: '/pages/agreement/swap/swap' });
  },

  async onSendCode() {
    const phone = this.data.codeForm.phone;
    if (!phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
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
    } catch (_) {
      /* request 已 toast */
    }
  },

  async onPasswordSubmit() {
    const { username, password } = this.data.passwordForm;
    if (!username || !password) {
      wx.showToast({ title: '请填写手机号和密码', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '登录中' });
    try {
      const res = await userApi.loginByPassword(username, password);
      if (res.success && res.data) {
        saveLoginSession(res);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => wx.switchTab({ url: '/pages/home/home' }), 300);
      }
    } catch (e) {
      wx.showToast({
        title: (e && e.message) || '登录失败',
        icon: 'none',
      });
    } finally {
      wx.hideLoading();
    }
  },

  async onCodeSubmit() {
    const { phone, code } = this.data.codeForm;
    if (!phone || !code) {
      wx.showToast({ title: '请填写手机号和验证码', icon: 'none' });
      return;
    }
    wx.showLoading({ title: '登录中' });
    try {
      const res = await userApi.loginByCode(phone, code);
      if (res.success && res.data) {
        saveLoginSession(res);
        wx.showToast({ title: '登录成功', icon: 'success' });
        setTimeout(() => wx.switchTab({ url: '/pages/home/home' }), 300);
      }
    } catch (_) {
      /* request 已 toast */
    } finally {
      wx.hideLoading();
    }
  },
});
