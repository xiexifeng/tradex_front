// 通用响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  code: string;
  desc: string;
  data: T;
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
}

// 登录响应类型
export interface LoginResponse {
  token: string;
  client: any;
  phone: string;
  username: string;
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
  contactInfo: string;
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