const { request } = require('../utils/request.js');

function getItemDetailForAudit(taskId, itemId) {
  return request({
    url: `/client/item-audit/${taskId}/${itemId}`,
    method: 'POST',
    data: {},
  });
}

function submitAuditResult(data) {
  return request({
    url: '/client/item-audit',
    method: 'POST',
    data,
  });
}

module.exports = {
  getItemDetailForAudit,
  submitAuditResult,
};
