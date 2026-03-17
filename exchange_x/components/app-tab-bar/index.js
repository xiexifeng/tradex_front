Component({
  properties: {
    active: {
      type: String,
      value: "home" // home | notification | publish | trade | profile
    },
    // 可选：自定义各 tab 对应的页面路径
    pagesMap: {
      type: Object,
      value: {
        home: "/pages/home/home",
        notification: "/pages/notification/notification",
        publish: "/pages/stuff/publish/publish",
        trade: "/pages/trade/list/list",
        profile: "/pages/profile/profile"
      }
    }
  },
  methods: {
    onTap(e) {
      const key = e.currentTarget.dataset.key;
      this.triggerEvent("change", { key });

      const pagesMap = this.data.pagesMap || {};
      const url = pagesMap[key];
      if (!url) return;

      // home 使用重启返回首页，其它页面使用 navigateTo，具体登录校验在各自页面处理
      if (key === "home") {
        wx.reLaunch({ url });
      } else {
        wx.navigateTo({ url });
      }
    }
  }
});
