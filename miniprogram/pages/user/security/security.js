const userApi = require('../../../api/user.js');

Page({
  data: {
    userInfo: null,
    loginAccount: null,
    maskedPhone: '未绑定',
    loginPasswordStatus: '未设置',
    tradePasswordStatus: '未设置',
    authStatusText: '未认证',
    showPwdSheet: false,
    pwdTitle: '设置登录密码',
    pwdType: 'login',
    password: '',
    confirmPassword: '',
    submitting: false,
  },

  onShow() {
    const userInfo = wx.getStorageSync('userInfo') || null;
    const loginAccount = wx.getStorageSync('loginAccount') || null;
    const phone = (loginAccount && loginAccount.phone) || '';
    let maskedPhone = '未绑定';
    if (phone && phone.length === 11) {
      maskedPhone = `${phone.slice(0, 3)}****${phone.slice(7)}`;
    }
    const loginPasswordStatus = loginAccount && loginAccount.loginPasswordSet ? '已设置' : '未设置';
    const tradePasswordStatus = loginAccount && loginAccount.tradePasswordSet ? '已设置' : '未设置';
    let authStatusText = '未认证';
    if (userInfo && userInfo.authStatus === 'AUTHENTICATED') authStatusText = '已认证';
    this.setData({
      userInfo,
      loginAccount,
      maskedPhone,
      loginPasswordStatus,
      tradePasswordStatus,
      authStatusText,
    });
  },

  openLoginPwd() {
    this.setData({
      showPwdSheet: true,
      pwdType: 'login',
      pwdTitle: '设置登录密码',
      password: '',
      confirmPassword: '',
    });
  },

  openTradePwd() {
    this.setData({
      showPwdSheet: true,
      pwdType: 'trade',
      pwdTitle: '设置交易密码',
      password: '',
      confirmPassword: '',
    });
  },

  closePwd() {
    this.setData({ showPwdSheet: false });
  },

  noop() {},

  onPwdInput(e) {
    this.setData({ password: e.detail.value });
  },

  onPwd2Input(e) {
    this.setData({ confirmPassword: e.detail.value });
  },

  async confirmPwd() {
    const { password, confirmPassword, pwdType, loginAccount } = this.data;
    if (!password || password.length < 6) {
      wx.showToast({ title: '密码至少6位', icon: 'none' });
      return;
    }
    if (password !== confirmPassword) {
      wx.showToast({ title: '两次密码不一致', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    try {
      if (pwdType === 'login') {
        await userApi.setLoginPassword(password);
        if (loginAccount) {
          wx.setStorageSync('loginAccount', { ...loginAccount, loginPasswordSet: true });
        }
        wx.showToast({ title: '登录密码设置成功', icon: 'success' });
      } else {
        await userApi.setTradePassword(password);
        if (loginAccount) {
          wx.setStorageSync('loginAccount', { ...loginAccount, tradePasswordSet: true });
        }
        wx.showToast({ title: '交易密码设置成功', icon: 'success' });
      }
      this.setData({ showPwdSheet: false });
      this.onShow();
    } catch (_) {
    } finally {
      this.setData({ submitting: false });
    }
  },

  deleteAccount() {
    wx.showModal({
      title: '注销账号',
      content: '注销后数据将无法恢复，确定吗？',
      confirmColor: '#ee0a24',
      success: (r) => {
        if (r.confirm) wx.showToast({ title: '功能开发中', icon: 'none' });
      },
    });
  },
});
