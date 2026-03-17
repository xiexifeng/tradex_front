const { ITEM_TYPE_MAP } = require("../../../constants/dict");
const { uploadFileApi, publishItemApi } = require("../../../api/stuff");

Page({
  data: {
    formData: {
      name: "",
      clazz: "",
      clazzText: "",
      description: "",
      images: [],
      depreciation: 5,
      valuation: ""
    },
    showTypePicker: false,
    pickerIndex: 0,
    itemTypeOptions: []
  },

  onLoad() {
    const itemTypeOptions = Object.entries(ITEM_TYPE_MAP).map(([value, text]) => ({
      value,
      text
    }));
    this.setData({ itemTypeOptions });

    // 从本地草稿恢复数据（如果存在）
    try {
      const draft = wx.getStorageSync("publishDraft");
      if (draft && typeof draft === "object") {
        this.setData({
          formData: Object.assign({}, this.data.formData, draft)
        });
        wx.removeStorageSync("publishDraft");
      }
    } catch (e) {
      console.error("恢复发布草稿失败:", e);
    }
  },

  // 图片相关
  onChooseImage() {
    const remain = 5 - this.data.formData.images.length;
    if (remain <= 0) return;

    wx.chooseMedia({
      count: remain,
      mediaType: ["image"],
      sourceType: ["album", "camera"],
      success: (res) => {
        const files = res.tempFiles || [];
        if (!files.length) return;
        this.uploadImages(files);
      }
    });
  },

  async uploadImages(files) {
    wx.showLoading({ title: "上传中...", mask: true });
    const currentImages = this.data.formData.images.slice();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const resp = await uploadFileApi(file.tempFilePath);
        if (resp.success && resp.data) {
          currentImages.push({
            url: resp.data
          });
        }
      }

      this.setData({
        "formData.images": currentImages
      });
    } catch (e) {
      console.error("上传图片失败:", e);
    } finally {
      wx.hideLoading();
    }
  },

  onRemoveImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.formData.images.slice();
    images.splice(index, 1);
    this.setData({
      "formData.images": images
    });
  },

  // 表单输入
  onNameInput(e) {
    this.setData({
      "formData.name": e.detail.value
    });
  },

  onDescInput(e) {
    this.setData({
      "formData.description": e.detail.value
    });
  },

  onDepChange(e) {
    this.setData({
      "formData.depreciation": e.detail.value
    });
  },

  onValuationInput(e) {
    this.setData({
      "formData.valuation": e.detail.value
    });
  },

  // 类型选择
  onShowTypePicker() {
    this.setData({
      showTypePicker: true
    });
  },

  onHideTypePicker() {
    this.setData({
      showTypePicker: false
    });
  },

  onTypeChange(e) {
    const index = e.detail.value[0] || 0;
    this.setData({
      pickerIndex: index
    });
  },

  onConfirmType() {
    const { itemTypeOptions, pickerIndex } = this.data;
    const option = itemTypeOptions[pickerIndex] || {};
    this.setData({
      "formData.clazz": option.value || "",
      "formData.clazzText": option.text || "",
      showTypePicker: false
    });
  },

  // 校验
  validate() {
    const { name, clazzText, description, images, valuation } = this.data.formData;

    if (!images || !images.length) {
      wx.showToast({ title: "请至少上传一张图片", icon: "none" });
      return false;
    }
    if (!name) {
      wx.showToast({ title: "请填写物品名称", icon: "none" });
      return false;
    }
    if (!clazzText) {
      wx.showToast({ title: "请选择物品类型", icon: "none" });
      return false;
    }
    if (!description) {
      wx.showToast({ title: "请填写物品描述", icon: "none" });
      return false;
    }
    if (!valuation && valuation !== 0) {
      wx.showToast({ title: "请填写物品残余估值", icon: "none" });
      return false;
    }

    const price = parseFloat(valuation);
    if (isNaN(price) || price < 0 || price > 999999) {
      wx.showToast({ title: "估值需在 0-999999 之间", icon: "none" });
      return false;
    }
    return true;
  },

  // 提交
  async onSubmit() {
    // 未登录时先跳转登录页
    const token = wx.getStorageSync("token");
    if (!token) {
      // 缓存当前表单数据，登录后回到发布页时恢复
      try {
        wx.setStorageSync("publishDraft", this.data.formData);
        wx.setStorageSync("loginRedirect", "/pages/stuff/publish/publish");
      } catch (e) {
        console.error("保存发布草稿失败:", e);
      }

      wx.showToast({ title: "请先登录", icon: "none" });
      wx.navigateTo({
        url: "/pages/login/login"
      });
      return;
    }

    if (!this.validate()) return;

    const { formData } = this.data;
    const itemImageList = (formData.images || []).map((img) => img.url).filter(Boolean);

    const submitData = {
      itemTitle: formData.name,
      itemType: formData.clazzText,
      itemImageList,
      itemDescription: formData.description,
      depreciation: formData.depreciation,
      valuation: parseFloat(formData.valuation)
    };

    wx.showModal({
      title: "确认提交",
      content:
        "平台仅提供信息撮合服务，不参与任何交易环节。发布后，所有交易均由您与对方线下自行协商完成，平台不承担交易责任。确定要发布吗？",
      success: async (res) => {
        if (!res.confirm) return;

        try {
          wx.showLoading({ title: "发布中...", mask: true });
          const resp = await publishItemApi(submitData);
          if (resp.success) {
            wx.showToast({ title: "发布成功", icon: "success" });
            // 发布成功后清空草稿并回到首页
            try {
              wx.removeStorageSync("publishDraft");
              wx.removeStorageSync("loginRedirect");
            } catch (e) {
              console.error("清理发布草稿失败:", e);
            }
            setTimeout(() => {
              wx.reLaunch({
                url: "/pages/home/home"
              });
            }, 600);
          }
        } catch (e) {
          console.error("发布失败:", e);
          wx.showToast({ title: "发布失败，请稍后重试", icon: "none" });
        } finally {
          wx.hideLoading();
        }
      }
    });
  },

  noop() {}
});

