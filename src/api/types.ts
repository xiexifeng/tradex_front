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
