/** 与 Vue `store/modules/user` 字段对齐；入参为 `request` resolve 的整包 `{ success, data }` */
function saveLoginSession(res) {
  const d = res && res.data;
  if (!d || !d.token) return;
  wx.setStorageSync('token', d.token);
  if (d.userContext) {
    wx.setStorageSync('userInfo', d.userContext);
  }
  wx.setStorageSync('loginAccount', {
    userId: d.userContext ? d.userContext.userId : '',
    phone: d.phone || '',
    client: d.client != null ? d.client : null,
    username: d.username != null ? d.username : null,
    loginPasswordSet: !!d.loginPasswordSet,
    tradePasswordSet: !!d.tradePasswordSet,
  });
}

function clearSession() {
  wx.removeStorageSync('token');
  wx.removeStorageSync('userInfo');
  wx.removeStorageSync('loginAccount');
}

module.exports = { saveLoginSession, clearSession };
