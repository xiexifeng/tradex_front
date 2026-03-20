const { request } = require("../utils/request");

function listSquareItems(params) {
  return request({
    url: "/client/square/list-item",
    method: "POST",
    data: params,
    header: {
      "Content-Type": "application/json"
    }
  });
}

function uploadFileApi(filePath) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync("token") || "";
    wx.uploadFile({
      url: "http://47.122.125.199/tradex/basic/oss/uploadFile",
      filePath,
      name: "file",
      header: {
        Authorization: token
      },
      success(res) {
        try {
          const data = JSON.parse(res.data || "{}");
          if (data.success) {
            resolve(data);
          } else {
            wx.showToast({
              title: data.desc || "上传失败",
              icon: "none"
            });
            reject(data);
          }
        } catch (e) {
          reject(e);
        }
      },
      fail(err) {
        wx.showToast({
          title: "上传失败，请稍后重试",
          icon: "none"
        });
        reject(err);
      }
    });
  });
}

function publishItemApi(data) {
  return request({
    url: "/client/item/publish",
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json"
    }
  });
}

function getMyItems(params) {
  return request({
    url: "/client/item/list-mine",
    method: "POST",
    data: params,
    header: {
      "Content-Type": "application/json"
    }
  });
}

function cancelTransferApi(data) {
  return request({
    url: "/client/item/cancel-transfer",
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 获取我的物品详情
function getItemDetail(itemId) {
  return request({
    url: `/client/item/detail/${itemId}`,
    method: "POST",
    data: {},
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 发起物品转让
function transferItem(data) {
  return request({
    url: "/client/item/transfer",
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 获取交易广场物品详情（游客也可访问）
function getSquareItemDetail(itemId) {
  return request({
    url: `/client/square/detail-item/${itemId}`,
    method: "POST",
    data: {},
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 获取我的可交换物品列表
function getMyCanTradeItems(params) {
  return request({
    url: "/client/item/list-my-can-trade-item",
    method: "POST",
    data: params,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 交易广场-发起交换申请
function applySquareExchange(data) {
  return request({
    url: "/client/trade/bidding-apply",
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 交易广场-创建支付单
function createOrderForPay(data) {
  return request({
    url: "/client/trade/create-pay",
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 交易广场-确认支付
function confirmPay(data) {
  return request({
    url: "/client/trade/confirm-pay",
    method: "POST",
    data,
    header: {
      "Content-Type": "application/json"
    }
  });
}

// 交易广场-标记或取消物品喜爱/查看/收藏
function socialItem(data) {

  return request({
    url: `/client/square/social-item/${data.itemId}`,
    method: "POST",
    data,
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

module.exports = {
  listSquareItems,
  uploadFileApi,
  publishItemApi,
  getMyItems,
  cancelTransferApi,
  getItemDetail,
  transferItem,
  getSquareItemDetail,
  getMyCanTradeItems,
  applySquareExchange,
  createOrderForPay,
  confirmPay,
  socialItem
};


