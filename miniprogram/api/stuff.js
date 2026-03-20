const { request } = require('../utils/request.js');
const { apiBase } = require('../config.js');

function listSquareItems(params) {
  const data = {
    pageNo: params.pageNo,
    pageSize: params.pageSize,
    sortBy: params.sortBy,
  };
  if (params.searchKey) data.searchKey = params.searchKey;
  if (params.itemType) data.itemType = params.itemType;
  if (params.tradeMethod) data.tradeMethod = params.tradeMethod;
  return request({
    url: '/client/square/list-item',
    method: 'POST',
    data,
  });
}

function getSquareItemDetail(itemId) {
  return request({
    url: `/client/square/detail-item/${itemId}`,
    method: 'POST',
    data: {},
  });
}

function socialItem(data) {
  const body = `socialType=${encodeURIComponent(data.socialType)}&socialOperate=${encodeURIComponent(data.socialOperate)}`;
  return request({
    url: `/client/square/social-item/${data.itemId}`,
    method: 'POST',
    data: body,
    header: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
}

function applySquareExchange(data) {
  return request({
    url: '/client/trade/bidding-apply',
    method: 'POST',
    data,
  });
}

function getMyCanTradeItems(params) {
  return request({
    url: '/client/item/list-my-can-trade-item',
    method: 'POST',
    data: {
      pageNo: params.pageNo,
      pageSize: params.pageSize,
      ...(params.itemTitle ? { itemTitle: params.itemTitle } : {}),
    },
  });
}

function createOrderForPay(data) {
  return request({
    url: '/client/trade/create-pay',
    method: 'POST',
    data,
  });
}

function getItemDetail(itemId) {
  return request({
    url: `/client/item/detail/${itemId}`,
    method: 'POST',
    data: {},
  });
}

function getMyItems(params) {
  const data = {
    pageNo: params.pageNo,
    pageSize: params.pageSize,
  };
  if (params.status) data.status = params.status;
  return request({
    url: '/client/item/list-mine',
    method: 'POST',
    data,
  });
}

function transferItem(data) {
  return request({
    url: '/client/item/transfer',
    method: 'POST',
    data,
  });
}

function cancelTransfer(data) {
  return request({
    url: '/client/item/cancel-transfer',
    method: 'POST',
    data,
  });
}

function publishItem(data) {
  return request({
    url: '/client/item/publish',
    method: 'POST',
    data,
  });
}

function uploadFile(filePath) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token') || '';
    wx.uploadFile({
      url: `${apiBase}/basic/oss/uploadFile`,
      filePath,
      name: 'file',
      header: token ? { Authorization: token } : {},
      success(res) {
        try {
          const body = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
          if (res.statusCode === 200 && body && body.success) {
            resolve(body);
            return;
          }
          const msg = (body && body.desc) || '上传失败';
          wx.showToast({ title: String(msg).slice(0, 20), icon: 'none' });
          reject(new Error(msg));
        } catch (e) {
          wx.showToast({ title: '上传解析失败', icon: 'none' });
          reject(e);
        }
      },
      fail(err) {
        wx.showToast({ title: '网络异常', icon: 'none' });
        reject(err);
      },
    });
  });
}

module.exports = {
  listSquareItems,
  getSquareItemDetail,
  socialItem,
  applySquareExchange,
  getMyCanTradeItems,
  createOrderForPay,
  getItemDetail,
  getMyItems,
  transferItem,
  cancelTransfer,
  publishItem,
  uploadFile,
};
