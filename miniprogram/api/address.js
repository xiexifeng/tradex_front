const { request } = require('../utils/request.js');

function listReceiveAddress() {
  return request({
    url: '/client/user/receive-address/list',
    method: 'GET',
  });
}

function addReceiveAddress(data) {
  return request({
    url: '/client/user/receive-address/add',
    method: 'POST',
    data,
  });
}

function updateReceiveAddress(data) {
  return request({
    url: '/client/user/receive-address/update',
    method: 'POST',
    data,
  });
}

function deleteReceiveAddress(id) {
  return request({
    url: `/client/user/receive-address/delete/${id}`,
    method: 'POST',
    data: {},
  });
}

module.exports = {
  listReceiveAddress,
  addReceiveAddress,
  updateReceiveAddress,
  deleteReceiveAddress,
};
