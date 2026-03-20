const { request } = require("../utils/request");

// 发送验证码
function sendSms(phone) {
  return request({
    url: "/client/auth/send-sms",
    method: "POST",
    data: `phoneNumbers=${phone}`,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

// 验证码登录 / 注册
function loginByCode(phone, code) {
  return request({
    url: "/client/auth/login-or-register",
    method: "POST",
    data: `phoneNumbers=${phone}&verifyCode=${code}`,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

// 密码登录
function loginByPassword(username, password) {
  return request({
    url: "/client/auth/login",
    method: "POST",
    data: `username=${username}&password=${password}`,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

// 刷新用户信息（GET）
function refreshUserInfo() {
  return request({
    url: "/client/user/get",
    method: "GET",
    data: {},
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 积分账户
function getPointsAccount() {
  return request({
    url: "/client/user/points-account",
    method: "GET",
    data: {},
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 积分流水
function getPointsTransactions(params) {
  return request({
    url: "/client/user/points-account/list-transaction",
    method: "POST",
    data: params,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 信用评分记录
function getTradeScoreTransactions(params) {
  return request({
    url: "/client/trade/list-mine-score",
    method: "POST",
    data: params,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 编辑用户资料
function updateUserProfile(data) {
  return request({
    url: "/client/user/update",
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 设置交易密码
function setTradePassword(newTradePasswd) {
  return request({
    url: "/client/security/set-trade-passwd",
    method: "POST",
    data: { newTradePasswd },
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 设置登录密码
function setLoginPassword(newLoginPasswd) {
  return request({
    url: "/client/security/set-login-passwd",
    method: "POST",
    data: { newLoginPasswd },
    header: {
      "Content-Type": "application/json"
    }
  });
}

module.exports = {
  sendSms,
  loginByCode,
  loginByPassword,
  refreshUserInfo,
  getPointsAccount,
  getPointsTransactions,
  getTradeScoreTransactions,
  updateUserProfile,
  setTradePassword,
  setLoginPassword
};

