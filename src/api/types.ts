// 通用API响应
export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  desc: string;
  data: T;
}

// 用户信息类型
export interface LoginAccount {
  userId: string;
  phone: string;
  client: string | null;
  username: string | null;
  loginPasswordSet: boolean;
  tradePasswordSet: boolean;
}

// 用户信息类型
export interface UserInfo {
  userId: string;
  nickname: string;
  realName: string | null;
  gender: string | null;
  birthday: string | null;
  avatarUrl: string | null;
  address: string | null;
  wechat: string | null;
  qq: string | null;
  brief: string | null;
  authStatus: string | null;
  blockchainId: string | null;
  tradeScore: number | null;
  followers: number | null;
  likes: number | null;
  collects: number | null;
  ipAddress: string | null;

}

// 收货地址
export interface ReceiveAddress {
  id: string;
  userId: string;
  recipientName: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  client: string | null;
  phone: string;
  username: string;
  loginPasswordSet: boolean;
  tradePasswordSet: boolean;
  userContext: UserInfo;
}

// 基础物品接口
export interface Item {
  id: string;
  userId: string;
  itemTitle: string;
  itemType: string;
  itemDescription: string;
  firstImage: string;
  itemImageList: string[];
  depreciation: number;
  status: string;
  transferStatus: string;
  transferTimes: number;
  lastUserId: string;
  blockchainId: string;
  isCanCancel: boolean;
}

// 物品详情接口，继承自Item
export interface ItemDetail extends Item {
  loveCount: number;
  collectionCount: number;
  viewCount: number;
  tradeMethod: string;
  transferPrice: number;
  transferPoints: number;
  expectItem: string;
  contactInfo: {
    linkman?: string | undefined;
    phone?: string | undefined;
    address?: string | undefined;  
  };
  deliveryMethod: string;
}

export interface ListSquareItemsParams {
  pageNo: number;
  pageSize: number;
  searchKey?: string;
  itemType?: string;
  tradeMethod?: string;
  sortBy?: string;
}

export interface ListSquareItemsResponse {
  id: string;
  userId: string;
  userAvatar: string;
  userNickname: string;
  itemTitle: string;
  itemType: string;
  itemDescription: string;
  firstImage: string;
  depreciation: number;
  transferTimes: number;
  lastUserId: string;
  blockchainId: string;
  loveCount: number;
  collectionCount: number;
  viewCount: number;
  tradeMethod: string;
  transferPrice: number | null;
  transferPoints: number | null;
  expectItem: string | null;
  publishTime: number;
}

// 交易广场物品详情接口
export interface SquareItemDetail {
  id: string;
  userId: string;
  userAvatar: string;
  userNickname: string;
  itemTitle: string;
  itemType: string;
  itemDescription: string;
  firstImage: string;
  depreciation: number;
  transferTimes: number;
  lastUserId: string;
  blockchainId: string;
  loveCount: number;
  collectionCount: number;
  viewCount: number;
  tradeMethod: string;
  transferPrice: number;
  transferPoints: number;
  expectItem: string;
  publishTime: number;
  itemImageList: string[];
  userExt: {
    blockchainId: string;
    tradeScore: number;
  };
  contactInfo: {
    linkman: string;
    phone: string;
    address: string;
  };
  exchangeApplyCount: number;
  deliveryMethod: string;
  isLiked: boolean;
  isCollected: boolean;
}

// 交易管理-查询接口返回的单条数据类型
export interface TradeListItem {
  id: string;
  itemId: string;
  itemTitle: string;
  firstImage: string;
  fromUserId: string;
  toUserId: string;
  tradeMethod: string;
  tradeStatus: string;
  paymentStatus: number;
  tradePrice: number | null;
  tradePoints: number | null;
  swapItemId?: string;
  swapItemTitle?: string;
  contactInfo: string;
  logisticsFrom?: string;
  logisticsTo?: string;
  fromScore?: number;
  toScore?: number;
  finishTradeTime?: string;
  createTime: number;
  flag: string;
}

// 可交换物品接口
export interface MyCanTradeItem {
  id: string;
  userId: string;
  itemTitle: string;
  itemType: string;
  firstImage: string;
}

// 待支付的交易订单接口
export interface TradeOrderForPay {
  tradeId: string;
  itemId: string;
  tradeMethod: string;
  tradePrice: number|null;
  tradePoints: number|null;
  paymentMethod: string|null;
}

export interface TradeDetail {
  id: string;
  itemId: string;
  itemTitle: string;
  firstImage: string;
  fromUserId: string;
  toUserId: string;
  tradeMethod: string;
  tradeStatus: string;
  paymentStatus: number;
  tradePrice: number | null;
  tradePoints: number | null;
  swapItemId?: string;
  swapItemTitle?: string;
  swapItemFirstImage?: string;
  contactInfo: string;
  logisticsFrom?: string | null;
  logisticsTo?: string | null;
  fromScore?: number | null;
  toScore?: number | null;
  finishTradeTime?: string | null;
  createTime: number;
  flag: string;
  payment?: {
    paymentMethod: string;
    paymentNo: string;
    amount: number;
  };
}

// 积分账户信息
export interface PointsAccount {
  id: string;
  userId: string;
  pointsBalance: number;
  frozenPoints: number;
}

// 积分交易记录
export interface PointsTransaction {
  id: string;
  bizNo: string;
  pointsChange: number;
  transactionType: string;
  transactionDescription: string;
  transactionTime: number;
}

// 积分交易记录
export interface TradeScoreTransaction {
  tradeId: string;
  userId: string;
  tradeScore: number;
  tradeRemark: string;
  scoreTime: number;
}

// 消息记录
export interface Notification {
  id: string;
  userId: string;
  notificationType: string;
  relatedId: string;
  title: string;
  content: string;
  status: number;
  createTime: number;
  relatedContent?: string; // 关联内容，用于审核任务等
  isDone: boolean;
}

// 我的物品详情接口
export interface AuditItemDetailCO {
  id: string;
  userId: string;
  itemTitle: string;
  itemType: string;
  itemTypeName: string;
  itemDescription: string;
  firstImage: string;
  itemImageList: string[];
  depreciation: number;
  valuation: number;
  status: string;
  lastUserId: string;
  blockchainId: string;
  publishTime: number;
  nickname: string;
  avatarUrl: string;
  auditResult: string;
  auditRemark?: string;
}

// 审核结果提交请求
export interface SubmitAuditResultReq {
  relatedId: string;
  taskId: string;
  result: boolean;
  auditRemark?: string;
}

// 每日登录奖励 - 单日记录
// rewardStatus: -1 未登录 0 已登录未领取 1 已领取 2 已过期
export interface LoginRewardDayItem {
  loginDate: string; // yyyymmdd
  rewardPoint: number;
  rewardStatus: number;
}

// 每日登录奖励 - 当月列表接口返回（含 items 数组）
export interface LoginRewardMonthResult {
  allLoginReward?: number;
  continuousLoginReward?: number;
  dailyLoginReward?: number;
  items: LoginRewardDayItem[];
}

// 每日任务 - taskType: 1-点赞 2-发布物品 3-评价 4-分享; taskState: 1-进行中 2-已完成 3-过期; isReceived: 0-未领取 1-已领取
export interface DailyTaskItem {
  taskCode: string;
  taskName: string;
  taskDesc: string;
  taskType: number;
  targetNum: number;
  finishNum: number;
  taskState: number;
  rewardPoint: number;
  isReceived: number;
}