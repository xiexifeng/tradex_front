const { request } = require('../utils/request.js');

function getInviteRank() {
  return request({
    url: '/client/rank/invite-list',
    method: 'GET',
    data: {},
  });
}

function getLatestRank() {
  return request({
    url: '/client/rank/latest-rank',
    method: 'GET',
    data: {},
  });
}

module.exports = {
  getInviteRank,
  getLatestRank,
};
