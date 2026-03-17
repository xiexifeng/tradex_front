const BASE_URL = "http://47.122.125.199/tradex";

function getToken() {
  try {
    const value = wx.getStorageSync("token");
    return value || "";
  } catch (e) {
    return "";
  }
}

function request(options) {
  return new Promise((resolve, reject) => {
    const token = getToken();
    const header = Object.assign(
      {
        "Content-Type": "application/json"
      },
      options.header || {}
    );

    if (token) {
      header.Authorization = token;
    }

    wx.request({
      url: BASE_URL + options.url,
      method: options.method || "POST",
      data: options.data || {},
      header,
      timeout: 10000,
      success(res) {
        const data = res.data || {};
        const statusCode = res.statusCode;

        // 未登录或登录过期
        if (statusCode === 401) {
          try {
            wx.removeStorageSync("token");
            wx.removeStorageSync("userContext");
            wx.removeStorageSync("loginAccount");
          } catch (e) {}

          wx.showToast({
            title: "登录已过期，请重新登录",
            icon: "none"
          });

          setTimeout(() => {
            wx.reLaunch({ url: "/pages/login/login" });
          }, 800);

          reject({ message: "unauthorized" });
          return;
        }

        if (data.success) {
          resolve(data);
        } else {
          wx.showToast({
            title: data.desc || "请求失败",
            icon: "none"
          });
          reject(data);
        }
      },
      fail(err) {
        wx.showToast({
          title: "网络异常，请稍后重试",
          icon: "none"
        });
        reject(err);
      }
    });
  });
}

module.exports = {
  request
};

