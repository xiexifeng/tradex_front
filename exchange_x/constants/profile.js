// 个人中心：转让状态、物品有效状态文案（与 Web ProfileView 对齐）

const TRANSFER_STATUS_TEXT = {
  own: "拥有",
  transferring: "转让中",
  transfer_applying: "申请交换中",
  transferred: "已转让"
};

const ITEM_STATUS_TEXT = {
  active: "有效",
  auditing: "审核中",
  inactive: "无效"
};

function getTransferStatusText(status) {
  return TRANSFER_STATUS_TEXT[status] || status || "";
}

function getItemStatusText(status) {
  return ITEM_STATUS_TEXT[status] || status || "";
}

/** 物品有效状态 -> 样式类：success / warning / danger / default */
function getItemStatusTagClass(status) {
  const map = {
    active: "success",
    auditing: "warning",
    inactive: "danger"
  };
  return map[status] || "default";
}

/** 转让状态 -> 样式类 */
function getTransferTagClass(status) {
  const map = {
    own: "primary",
    transferring: "warning",
    transferred: "default",
    transfer_applying: "warning"
  };
  return map[status] || "default";
}

module.exports = {
  TRANSFER_STATUS_TEXT,
  ITEM_STATUS_TEXT,
  getTransferStatusText,
  getItemStatusText,
  getItemStatusTagClass,
  getTransferTagClass
};
