const { sendSms, loginByCode, loginByPassword } = require("../../api/user");

Page({
  data: {
    activeTab: "code", // password | code
    passwordType: "password",
    countdown: 0,
    passwordForm: {
      username: "",
      password: ""
    },
    codeForm: {
      phone: "",
      code: ""
    }
  },

  onTabChange(e) {
    const key = e.currentTarget.dataset.key;
    this.setData({ activeTab: key });
  },

  onPasswordUsernameInput(e) {
    this.setData({
      "passwordForm.username": e.detail.value
    });
  },

  onPasswordInput(e) {
    this.setData({
      "passwordForm.password": e.detail.value
    });
  },

  onCodePhoneInput(e) {
    this.setData({
      "codeForm.phone": e.detail.value
    });
  },

  onCodeInput(e) {
    this.setData({
      "codeForm.code": e.detail.value
    });
  },

  // 发送验证码
  async onSendCode() {
    const phone = this.data.codeForm.phone;
    if (!phone) {
      wx.showToast({ title: "请输入手机号", icon: "none" });
      return;
    }
    if (this.data.countdown) return;

    try {
      await sendSms(phone);
      wx.showToast({ title: "验证码已发送", icon: "none" });
      this.startCountdown();
    } catch (e) {
      console.error("发送验证码失败:", e);
    }
  },

  startCountdown() {
    this.setData({ countdown: 60 });
    this._timer && clearInterval(this._timer);
    this._timer = setInterval(() => {
      const value = this.data.countdown - 1;
      if (value <= 0) {
        clearInterval(this._timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: value });
      }
    }, 1000);
  },

  // 密码登录
  async onPasswordSubmit() {
    const { username, password } = this.data.passwordForm;
    if (!username || !password) {
      wx.showToast({ title: "请输入账号和密码", icon: "none" });
      return;
    }

    try {
      wx.showLoading({ title: "登录中...", mask: true });
      const res = await loginByPassword(username, password);
      this.handleLoginSuccess(res.data);
    } catch (e) {
      console.error("密码登录失败:", e);
    } finally {
      wx.hideLoading();
    }
  },

  // 验证码登录
  async onCodeSubmit() {
    const { phone, code } = this.data.codeForm;
    if (!phone || !code) {
      wx.showToast({ title: "请输入手机号和验证码", icon: "none" });
      return;
    }

    try {
      wx.showLoading({ title: "登录中...", mask: true });
      const res = await loginByCode(phone, code);
      this.handleLoginSuccess(res.data);
    } catch (e) {
      console.error("验证码登录失败:", e);
    } finally {
      wx.hideLoading();
    }
  },

  // 统一处理登录成功
  handleLoginSuccess(payload) {
    if (!payload) {
      wx.showToast({ title: "登录返回数据异常", icon: "none" });
      return;
    }

    const {
      token,
      client,
      phone,
      username,
      loginPasswordSet,
      tradePasswordSet,
      userContext
    } = payload;

    try {
      wx.setStorageSync("token", token || "");
      wx.setStorageSync("userContext", userContext || null);
      wx.setStorageSync("loginAccount", {
        userId: userContext && userContext.userId,
        phone,
        client,
        username,
        loginPasswordSet,
        tradePasswordSet
      });
    } catch (e) {
      console.error("保存登录态失败:", e);
    }

    const app = getApp();
    if (app && app.globalData) {
      app.globalData.userInfo = userContext || null;
    }

    wx.showToast({ title: "登录成功", icon: "success" });
    // 登录后跳转优先回到之前想去的页面
    let redirect = null;
    try {
      redirect = wx.getStorageSync("loginRedirect");
      if (redirect) {
        wx.removeStorageSync("loginRedirect");
      }
    } catch (e) {
      console.error("读取 loginRedirect 失败:", e);
    }

    if (redirect) {
      wx.reLaunch({ url: redirect });
    } else {
      wx.reLaunch({
        url: "/pages/home/home"
      });
    }
  },

  onUnload() {
    this._timer && clearInterval(this._timer);
  }
});

