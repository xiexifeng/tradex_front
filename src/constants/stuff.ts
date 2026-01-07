// 定义映射类型
type ValueMap = Record<string, string>

// 物品状态映射
export const STATUS_MAP = {
  own: '拥有',
  transferring: '转让中',
  transferred: '已转让',
  transfer_applying: '申请交换中',
} as const

// 物品有效性状态映射
export const ITEM_STATUS_MAP = {
  active: '有效',
  auditing: '审核中',
  inactive: '无效'
} as const

// 交付方式映射
export const DELIVERY_METHOD_MAP = {
  SAME_CITY_BY_SELF: '同城自取',
  SAME_CITY_BY_LOGISTIC: '快递邮寄'
} as const

// 交易方式映射
export const TRADE_METHOD_MAP = {
  ITEM_TO_MONEY: '人民币',
  ITEM_TO_POINTS: '积分',
  ITEM_TO_ITEM: '以物换物'
} as const

// 交易方式映射
export const TRANSACTION_TYPE_MAP = {
  TRADE_OUTCOME: '交易支出',
  REWARD_INCOME: '奖励',
  TRADE_INCOME: '交易收入',
  REFUND_INCOME: '退款收入',
  REWARD_OUTCOME: '奖励撤回',
  REFUND_OUTCOME: '退款支出',
  OTHER: '其他'
} as const

// 物品类型选项
export const ITEM_TYPE_MAP = {
  A: '衣服',
  B: '家具',
  C: '玩具',
  D: '电子产品',
  E: '图书',
  F: '运动器材',
  G: '其他'
} as const

// 所有映射的集合
export const VALUE_MAPS = {
  status: STATUS_MAP,
  itemStatus: ITEM_STATUS_MAP,
  deliveryMethod: DELIVERY_METHOD_MAP,
  tradeMethod: TRADE_METHOD_MAP,
  transactionType: TRANSACTION_TYPE_MAP,
  itemType: ITEM_TYPE_MAP
} as const

// 通用值转义方法
export const getValueText = (value: string, type: keyof typeof VALUE_MAPS): string => {
  const map = VALUE_MAPS[type] as ValueMap
  return map?.[value] || value
}

// 选择器列定义
export const DELIVERY_COLUMNS = Object.entries(DELIVERY_METHOD_MAP).map(([value, text]) => ({
  text,
  value
}))

export const TRADE_METHOD_COLUMNS = Object.entries(TRADE_METHOD_MAP).map(([value, text]) => ({
  text,
  value
})) 

export const ITEM_TYPE_COLUMNS = Object.entries(ITEM_TYPE_MAP).map(([value, text]) => ({
  text,
  value
})) 