const { updateUserProfile, refreshUserInfo } = require("../../../api/user");

Page({
  data: {
    saving: false,

    // 表单
    form: {
      nickname: "",
      gender: "",
      birthday: "",
      avatarUrl: "",
      address: "",
      wechat: "",
      qq: "",
      brief: ""
    },

    // picker
    genderOptions: [
      { text: "男", value: "MAN" },
      { text: "女", value: "FEMALE" }
    ],
    genderTexts: ["男", "女"],
    genderIndex: 0,
    genderTextDisplay: "男",

    minDate: "1900-01-01",
    maxDate: "",
    birthdayValue: ""
  },

  onLoad() {
    const today = this.getTodayString();
    this.setData({
      maxDate: today,
      birthdayValue: today
    });

    // 先恢复草稿（如果存在）
    let draft = null;
    try {
      draft = wx.getStorageSync("editProfileDraft");
    } catch (e) {}

    if (draft && typeof draft === "object") {
      this.setData({
        form: Object.assign({}, this.data.form, draft)
      });
      wx.removeStorageSync("editProfileDraft");
      wx.removeStorageSync("loginRedirect"); // 用户已回到页面，清理
    } else {
      // 从用户信息初始化
      try {
        const userContext = wx.getStorageSync("userContext");
        if (userContext) {
          this.setData({
            form: {
              ...this.data.form,
              nickname: userContext.nickname || "",
              gender: userContext.gender || "",
              birthday: userContext.birthday || "",
              avatarUrl: userContext.avatarUrl || "",
              address: userContext.address || "",
              wechat: userContext.wechat || "",
              qq: userContext.qq || "",
              brief: userContext.brief || ""
            },
            birthdayValue: userContext.birthday || today
          });
        }
      } catch (e) {}
    }

    // 初始化 genderIndex & display
    this.syncGenderFromForm();

    // token 校验
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.setStorageSync("loginRedirect", "/pages/user/edit-profile/edit-profile");
      wx.navigateTo({ url: "/pages/login/login" });
    }
  },

  onShow() {
    // 返回登录页后可能再次触发，这里不强行覆盖草稿
    const token = wx.getStorageSync("token");
    if (!token) return;
  },

  getTodayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  },

  syncGenderFromForm() {
    const gender = this.data.form.gender;
    const idx = this.data.genderOptions.findIndex((o) => o.value === gender);
    const safeIdx = idx >= 0 ? idx : 0;
    this.setData({
      genderIndex: safeIdx,
      genderTextDisplay: this.data.genderOptions[safeIdx].text
    });
  },

  cacheDraftAndGoLogin() {
    try {
      wx.setStorageSync("editProfileDraft", this.data.form);
      wx.setStorageSync("loginRedirect", "/pages/user/edit-profile/edit-profile");
    } catch (e) {}

    wx.showToast({ title: "请先登录", icon: "none" });
    wx.navigateTo({ url: "/pages/login/login" });
  },

  onRequireLogin() {
    this.cacheDraftAndGoLogin();
  },

  onAvatarChanged(e) {
    const url = e.detail && e.detail.avatarUrl;
    this.setData({
      "form.avatarUrl": url || ""
    });
  },

  onAvatarTap() {
    // 头像上传点击由组件处理，这里留空防止误触
  },

  noop() {},

  onClickLeft() {
    wx.navigateBack();
  },

  onNicknameInput(e) {
    this.setData({ "form.nickname": e.detail.value });
  },

  onGenderChange(e) {
    const idx = Number(e.detail.value);
    const opt = this.data.genderOptions[idx];
    if (!opt) return;
    this.setData({
      "form.gender": opt.value,
      genderIndex: idx,
      genderTextDisplay: opt.text
    });
  },

  onBirthdayChange(e) {
    const val = e.detail.value; // YYYY-MM-DD
    this.setData({
      "form.birthday": val,
      birthdayValue: val
    });
  },

  onAddressInput(e) {
    this.setData({ "form.address": e.detail.value });
  },

  onWechatInput(e) {
    this.setData({ "form.wechat": e.detail.value });
  },

  onQqInput(e) {
    this.setData({ "form.qq": e.detail.value });
  },

  onBriefInput(e) {
    this.setData({ "form.brief": e.detail.value });
  },

  async saveProfile() {
    const token = wx.getStorageSync("token");
    if (!token) {
      this.cacheDraftAndGoLogin();
      return;
    }

    const nickname = (this.data.form.nickname || "").trim();
    if (!nickname) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }

    this.setData({ saving: true });

    const form = this.data.form;
    const payload = {
      nickname,
      gender: form.gender || undefined,
      birthday: form.birthday || undefined,
      avatarUrl: form.avatarUrl || undefined,
      address: (form.address || "").trim() || undefined,
      wechat: (form.wechat || "").trim() || undefined,
      qq: (form.qq || "").trim() || undefined,
      brief: (form.brief || "").trim() || undefined
    };

    try {
      wx.showLoading({ title: "保存中...", mask: true });
      const res = await updateUserProfile(payload);

      if (res && res.success) {
        wx.showToast({ title: "保存成功", icon: "success" });
        wx.removeStorageSync("editProfileDraft");

        // 拉取最新用户信息，供 profile 页展示
        try {
          const refresh = await refreshUserInfo();
          if (refresh && refresh.success && refresh.data) {
            wx.setStorageSync("userContext", refresh.data);
            const app = getApp();
            if (app && app.globalData) {
              app.globalData.userInfo = refresh.data;
            }
          }
        } catch (e) {
          console.error("刷新用户信息失败:", e);
        }

        setTimeout(() => {
          wx.navigateBack();
        }, 600);
      } else {
        wx.showToast({ title: (res && res.desc) || "保存失败", icon: "none" });
      }
    } catch (e) {
      console.error("保存失败:", e);
      wx.showToast({ title: "保存失败", icon: "none" });
    } finally {
      wx.hideLoading();
      this.setData({ saving: false });
    }
  }
});

