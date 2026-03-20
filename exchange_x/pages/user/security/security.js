const {
  refreshUserInfo,
  setTradePassword,
  setLoginPassword
} = require("../../../api/user");

Page({
  data: {
    userInfo: null,

    maskedPhone: "未绑定",
    loginPasswordStatus: "未设置",
    tradePasswordStatus: "未设置",
    wechatText: "未绑定",
    qqText: "未绑定",
    authStatusText: "未认证",

    showPasswordDialog: false,
    passwordType: "login", // login | trade
    passwordDialogTitle: "设置登录密码",
    passwordForm: {
      password: "",
      confirmPassword: ""
    },
    isSubmitting: false
  },

  onLoad() {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.setStorageSync("loginRedirect", "/pages/user/security/security");
      wx.redirectTo({ url: "/pages/login/login" });
      return;
    }

    this.applyStatusFromStorage();
    this.refreshUserFromServer();
  },

  onShow() {
    // 页面返回后刷新一次展示信息
    this.applyStatusFromStorage();
  },

  noop() {},

  applyStatusFromStorage() {
    const loginAccount = wx.getStorageSync("loginAccount") || {};
    const phone = loginAccount.phone || "";

    const maskedPhone =
      phone && phone.length === 11
        ? phone.slice(0, 3) + "****" + phone.slice(7)
        : "未绑定";

    this.setData({
      maskedPhone,
      loginPasswordStatus: loginAccount.loginPasswordSet ? "已设置" : "未设置",
      tradePasswordStatus: loginAccount.tradePasswordSet ? "已设置" : "未设置"
    });
  },

  async refreshUserFromServer() {
    try {
      wx.showLoading({ title: "加载中...", mask: true });
      const res = await refreshUserInfo();
      if (res && res.success && res.data) {
        wx.setStorageSync("userContext", res.data);
        const app = getApp();
        if (app && app.globalData) {
          app.globalData.userInfo = res.data;
        }

        this.setData({
          userInfo: res.data,
          wechatText: res.data.wechat || "未绑定",
          qqText: res.data.qq || "未绑定",
          authStatusText:
            res.data.authStatus === "AUTHENTICATED" ? "已认证" : "未认证"
        });
      }
    } catch (e) {
      console.error("刷新用户信息失败:", e);
    } finally {
      wx.hideLoading();
    }
  },

  closePasswordDialog() {
    if (this.data.isSubmitting) return;
    this.setData({
      showPasswordDialog: false,
      passwordForm: { password: "", confirmPassword: "" }
    });
  },

  handleSetLoginPassword() {
    this.openPasswordDialog("login");
  },

  handleSetTradePassword() {
    this.openPasswordDialog("trade");
  },

  openPasswordDialog(type) {
    const title = type === "login" ? "设置登录密码" : "设置交易密码";
    this.setData({
      passwordType: type,
      passwordDialogTitle: title,
      showPasswordDialog: true,
      passwordForm: { password: "", confirmPassword: "" },
      isSubmitting: false
    });
  },

  onPasswordInput(e) {
    this.setData({
      "passwordForm.password": e.detail.value
    });
  },

  onConfirmPasswordInput(e) {
    this.setData({
      "passwordForm.confirmPassword": e.detail.value
    });
  },

  async confirmSetPassword() {
    if (this.data.isSubmitting) return;

    const { password, confirmPassword } = this.data.passwordForm || {};
    const newPasswd = (password || "").trim();
    const confirm = (confirmPassword || "").trim();

    if (!newPasswd) {
      wx.showToast({ title: "请输入密码", icon: "none" });
      return;
    }

    if (newPasswd.length < 6) {
      wx.showToast({ title: "密码长度至少6位", icon: "none" });
      return;
    }

    if (newPasswd !== confirm) {
      wx.showToast({ title: "两次输入的密码不一致", icon: "none" });
      return;
    }

    this.setData({ isSubmitting: true });

    try {
      const type = this.data.passwordType;
      wx.showLoading({ title: "提交中...", mask: true });

      let res = null;
      if (type === "login") {
        res = await setLoginPassword(newPasswd);
      } else {
        res = await setTradePassword(newPasswd);
      }

      if (res && res.success) {
        const loginAccount = wx.getStorageSync("loginAccount") || {};
        if (type === "login") {
          loginAccount.loginPasswordSet = true;
        } else {
          loginAccount.tradePasswordSet = true;
        }
        wx.setStorageSync("loginAccount", loginAccount);

        this.setData({
          showPasswordDialog: false,
          passwordForm: { password: "", confirmPassword: "" },
          loginPasswordStatus: loginAccount.loginPasswordSet ? "已设置" : "未设置",
          tradePasswordStatus: loginAccount.tradePasswordSet ? "已设置" : "未设置"
        });

        wx.showToast({
          title: type === "login" ? "登录密码设置成功" : "交易密码设置成功",
          icon: "success"
        });
      }
    } catch (err) {
      console.error("设置密码失败:", err);
      wx.showToast({
        title: (err && err.desc) || "设置密码失败，请重试",
        icon: "none"
      });
    } finally {
      wx.hideLoading();
      this.setData({ isSubmitting: false });
    }
  },

  handleDeleteAccount() {
    wx.showModal({
      title: "注销账号",
      content:
        "注销账号后，您的所有数据将被永久删除，且无法恢复。确定要注销吗？",
      confirmText: "确定",
      cancelText: "取消",
      confirmColor: "#ee0a24",
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: "注销账号功能开发中", icon: "none" });
        }
      }
    });
  }
});

