const TRADE_METHOD_MAP = {
  ITEM_TO_MONEY: '人民币',
  ITEM_TO_POINTS: '积分',
  ITEM_TO_ITEM: '以物换物',
};

const DELIVERY_METHOD_MAP = {
  SAME_CITY_BY_SELF: '同城自取',
  SAME_CITY_BY_LOGISTIC: '快递邮寄',
};

const STATUS_MAP = {
  own: '拥有',
  transferring: '转让中',
  transferred: '已转让',
  transfer_applying: '申请交换中',
};

const ITEM_STATUS_MAP = {
  active: '有效',
  auditing: '审核中',
  inactive: '无效',
};

const ITEM_TYPE_MAP = {
  A: '衣服',
  B: '家具',
  C: '玩具',
  D: '电子产品',
  E: '图书',
  F: '运动器材',
  G: '其他',
};

const TRANSACTION_TYPE_MAP = {
  TRADE_OUTCOME: '交易支出',
  REWARD_INCOME: '奖励',
  TRADE_INCOME: '交易收入',
  REFUND_INCOME: '退款收入',
  REWARD_OUTCOME: '奖励撤回',
  REFUND_OUTCOME: '退款支出',
  OTHER: '其他',
};

const DELIVERY_COLUMNS = Object.entries(DELIVERY_METHOD_MAP).map(([value, text]) => ({ text, value }));
const TRADE_METHOD_COLUMNS = Object.entries(TRADE_METHOD_MAP).map(([value, text]) => ({ text, value }));
const ITEM_TYPE_COLUMNS = Object.entries(ITEM_TYPE_MAP).map(([value, text]) => ({ text, value }));

function getValueText(value, type) {
  if (type === 'tradeMethod') return TRADE_METHOD_MAP[value] || value;
  if (type === 'deliveryMethod') return DELIVERY_METHOD_MAP[value] || value;
  if (type === 'status') return STATUS_MAP[value] || value;
  if (type === 'itemStatus') return ITEM_STATUS_MAP[value] || value;
  if (type === 'transactionType') return TRANSACTION_TYPE_MAP[value] || value;
  return value;
}

module.exports = {
  getValueText,
  TRADE_METHOD_MAP,
  DELIVERY_METHOD_MAP,
  STATUS_MAP,
  ITEM_STATUS_MAP,
  DELIVERY_COLUMNS,
  TRADE_METHOD_COLUMNS,
  ITEM_TYPE_COLUMNS,
  TRANSACTION_TYPE_MAP,
};
