// 定义映射类型
type ValueMap = Record<string, string>

// 物品状态映射
export const STATUS_MAP = {
  own: '拥有',
  transferring: '转让中',
  transferred: '已转让'
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

// 所有映射的集合
export const VALUE_MAPS = {
  status: STATUS_MAP,
  itemStatus: ITEM_STATUS_MAP,
  deliveryMethod: DELIVERY_METHOD_MAP,
  tradeMethod: TRADE_METHOD_MAP
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