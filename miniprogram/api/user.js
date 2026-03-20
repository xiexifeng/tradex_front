const { request } = require('../utils/request.js');

function sendSms(phone) {
  return request({
    url: '/client/auth/send-sms',
    method: 'POST',
    data: `phoneNumbers=${encodeURIComponent(phone)}`,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

function loginByCode(phone, code) {
  return request({
    url: '/client/auth/login-or-register',
    method: 'POST',
    data: `phoneNumbers=${encodeURIComponent(phone)}&verifyCode=${encodeURIComponent(code)}`,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

function loginByPassword(phoneNumbers, password) {
  return request({
    url: '/client/auth/login-by-password',
    method: 'POST',
    data: `phoneNumbers=${encodeURIComponent(phoneNumbers)}&password=${encodeURIComponent(password)}`,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

function verifyPhone(phone) {
  return request({
    url: '/client/auth/verify-phone',
    method: 'POST',
    data: `phoneNo=${encodeURIComponent(phone)}`,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then((body) => body.data);
}

function register(data) {
  return request({
    url: '/client/auth/register',
    method: 'POST',
    data,
  });
}

function updateUserProfile(data) {
  return request({
    url: '/client/user/update',
    method: 'POST',
    data,
  });
}

function refreshUserInfo() {
  return request({
    url: '/client/user/get',
    method: 'GET',
  }).then((body) => body.data);
}

function setTradePassword(newTradePasswd) {
  return request({
    url: '/client/security/set-trade-passwd',
    method: 'POST',
    data: { newTradePasswd },
  });
}

function setLoginPassword(newLoginPasswd) {
  return request({
    url: '/client/security/set-login-passwd',
    method: 'POST',
    data: { newLoginPasswd },
  });
}

function getPointsAccount() {
  return request({
    url: '/client/user/points-account',
    method: 'GET',
  });
}

function getPointsTransactions(params) {
  return request({
    url: '/client/user/points-account/list-transaction',
    method: 'POST',
    data: params,
  });
}

function getTradeScoreTransactions(params) {
  return request({
    url: '/client/trade/list-mine-score',
    method: 'POST',
    data: params,
  });
}

function getLoginRewardMonthList(userId) {
  return request({
    url: `/client/user/login-reward/month-list?userId=${encodeURIComponent(userId)}`,
    method: 'GET',
  });
}

function receiveLoginReward(data) {
  return request({
    url: '/client/user/login-reward/receive',
    method: 'POST',
    data,
  });
}

function getDailyTaskList(userId) {
  return request({
    url: `/client/user/task/daily-list?userId=${encodeURIComponent(userId)}`,
    method: 'GET',
  });
}

module.exports = {
  sendSms,
  loginByCode,
  loginByPassword,
  verifyPhone,
  register,
  updateUserProfile,
  refreshUserInfo,
  setTradePassword,
  setLoginPassword,
  getPointsAccount,
  getPointsTransactions,
  getTradeScoreTransactions,
  getLoginRewardMonthList,
  receiveLoginReward,
  getDailyTaskList,
};
