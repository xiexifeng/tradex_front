const { request } = require('../utils/request.js');

function listMyNotification(params) {
  return request({
    url: '/client/notification/list-mine',
    method: 'POST',
    data: params,
  });
}

function getNotificationDetail(notificationId) {
  return request({
    url: `/client/notification/read/${notificationId}`,
    method: 'GET',
    data: {},
  });
}

module.exports = {
  listMyNotification,
  getNotificationDetail,
};
