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

module.exports = {
  sendSms,
  loginByCode,
  loginByPassword
};

