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

module.exports = {
  sendSms,
  loginByCode,
  loginByPassword,
  refreshUserInfo,
  getPointsAccount,
  getPointsTransactions,
  getTradeScoreTransactions
};

