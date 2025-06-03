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
