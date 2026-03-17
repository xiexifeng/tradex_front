// 公共字典映射，参考 Web 端 src/constants/stuff.ts

// 物品状态映射
const STATUS_MAP = {
  own: "拥有",
  transferring: "转让中",
  transferred: "已转让",
  transfer_applying: "申请交换中"
};

// 物品有效性状态映射
const ITEM_STATUS_MAP = {
  active: "有效",
  auditing: "审核中",
  inactive: "无效"
};

// 交付方式映射
const DELIVERY_METHOD_MAP = {
  SAME_CITY_BY_SELF: "同城自取",
  SAME_CITY_BY_LOGISTIC: "快递邮寄"
};

// 交易方式映射
const TRADE_METHOD_MAP = {
  ITEM_TO_MONEY: "人民币",
  ITEM_TO_POINTS: "积分",
  ITEM_TO_ITEM: "以物换物"
};

// 交易类型映射
const TRANSACTION_TYPE_MAP = {
  TRADE_OUTCOME: "交易支出",
  REWARD_INCOME: "奖励",
  TRADE_INCOME: "交易收入",
  REFUND_INCOME: "退款收入",
  REWARD_OUTCOME: "奖励撤回",
  REFUND_OUTCOME: "退款支出",
  OTHER: "其他"
};

// 物品类型映射（如需可再按实际调整）
const ITEM_TYPE_MAP = {
  A: "衣服",
  B: "家具",
  C: "玩具",
  D: "电子产品",
  E: "图书",
  F: "运动器材",
  G: "其他"
};

const VALUE_MAPS = {
  status: STATUS_MAP,
  itemStatus: ITEM_STATUS_MAP,
  deliveryMethod: DELIVERY_METHOD_MAP,
  tradeMethod: TRADE_METHOD_MAP,
  transactionType: TRANSACTION_TYPE_MAP,
  itemType: ITEM_TYPE_MAP
};

function getValueText(value, type) {
  const map = VALUE_MAPS[type] || {};
  return map[value] || value;
}

module.exports = {
  STATUS_MAP,
  ITEM_STATUS_MAP,
  DELIVERY_METHOD_MAP,
  TRADE_METHOD_MAP,
  TRANSACTION_TYPE_MAP,
  ITEM_TYPE_MAP,
  VALUE_MAPS,
  getValueText
};

