const { uploadFileApi } = require("../../api/stuff");

Component({
  properties: {
    avatarUrl: {
      type: String,
      value: ""
    },
    // 可选：头像尺寸（单位 rpx）
    sizeRpx: {
      type: Number,
      value: 96
    }
  },
  data: {},
  methods: {
    async chooseAndUpload() {
      const token = wx.getStorageSync("token");
      if (!token) {
        this.triggerEvent("requireLogin");
        return;
      }

      wx.chooseMedia({
        count: 1,
        mediaType: ["image"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          const file = (res.tempFiles || [])[0];
          if (!file || !file.tempFilePath) return;

          try {
            wx.showLoading({ title: "上传中...", mask: true });
            const resp = await uploadFileApi(file.tempFilePath);
            if (resp && resp.success && resp.data) {
              this.triggerEvent("change", { avatarUrl: resp.data });
              wx.showToast({ title: "头像上传成功", icon: "success" });
            }
          } catch (e) {
            console.error("头像上传失败:", e);
          } finally {
            wx.hideLoading();
          }
        }
      });
    }
  }
});

