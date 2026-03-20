const { request } = require('../utils/request.js');

function getTradeList(params) {
  const data = {
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  };
  if (params.tradeStatus) data.tradeStatus = params.tradeStatus;
  if (params.tradeMethod) data.tradeMethod = params.tradeMethod;
  return request({
    url: '/client/trade/list-mine',
    method: 'POST',
    data,
  });
}

function getTradeDetail(tradeId) {
  return request({
    url: `/client/trade/detail/${tradeId}`,
    method: 'POST',
    data: {},
  });
}

function acceptBiddingApply(data) {
  return request({
    url: '/client/trade/accept-bidding-apply',
    method: 'POST',
    data,
  });
}

function rejectBiddingApply(data) {
  return request({
    url: '/client/trade/reject-bidding-apply',
    method: 'POST',
    data,
  });
}

function completeTrade(data) {
  return request({
    url: '/client/trade/completed',
    method: 'POST',
    data,
  });
}

function cancelTradeApi(data) {
  return request({
    url: '/client/trade/cancel',
    method: 'POST',
    data,
  });
}

function confirmPay(data) {
  return request({
    url: '/client/trade/confirm-pay',
    method: 'POST',
    data,
  });
}

function tradeScore(data) {
  return request({
    url: '/client/trade/score',
    method: 'POST',
    data,
  });
}

module.exports = {
  getTradeList,
  getTradeDetail,
  acceptBiddingApply,
  rejectBiddingApply,
  completeTrade,
  cancelTradeApi,
  confirmPay,
  tradeScore,
};
