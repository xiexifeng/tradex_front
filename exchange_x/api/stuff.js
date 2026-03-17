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

module.exports = {
  listSquareItems,
  uploadFileApi,
  publishItemApi
};


