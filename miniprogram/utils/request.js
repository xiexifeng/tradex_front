const { apiBase } = require('../config.js');

function request({ url, method = 'POST', data = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || '';
    wx.request({
      url: apiBase + url,
      method,
      data,
      header: {
        ...(method === 'GET' || method === 'get'
          ? {}
          : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: token } : {}),
        ...header,
      },
      success(res) {
        const body = res.data;
        if (res.statusCode === 200 && body && body.success) {
          resolve(body);
          return;
        }
        const msg = (body && body.desc) || '请求失败';
        wx.showToast({ title: String(msg).slice(0, 20), icon: 'none' });
        reject(new Error(msg));
      },
      fail(err) {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}

module.exports = { request };
